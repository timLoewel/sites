/**
 * Created by tim on 16/03/17.
 */
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/empty';


import 'rxjs/add/observable/fromEventPattern';
import {combineEpics} from 'redux-observable';
import Geocoder from 'react-native-geocoder';
import BackgroundGeolocation from "react-native-background-geolocation";

import {setCurrentLocation, setCurrentAddress,startGPS, updateLocation, stopGPS, gpsError, addressError} from './geolocationReducer';

let rxjsCallbackForPingPong;


function setTimer(i) {
	setTimeout(function() {
		if (rxjsCallbackForPingPong) {
			rxjsCallbackForPingPong(i);
		}
		setTimer(i+1);
	}, 1000);
}

setTimer(0);


let watchId;
PING = 'x';
PONG = 'o';
CANCEL = 'c'
const pingEpic = action$ =>
		action$.ofType(PING).do(x=>{
									console.log('a: '+ x );
									BackgroundGeolocation.getCurrentPosition(function(location, taskId) {
										console.log('- current location: ', location);
										BackgroundGeolocation.finish(taskId);
									});
								}).map((x) => {return {type:PONG}});


/**
 * returns an observable for the BackgroundGeolocation event
 */
const getLocationEventObservable = () => Observable.fromEventPattern(
			handler => {
				BackgroundGeolocation.on('location',handler);
			},
			handler => {
				BackgroundGeolocation.un('location', handler);
			});
/**
 * returns an observable for the geolocation error event
 */
const getLocationErrorEventObservable = () => Observable.fromEventPattern(
		handler => {
			BackgroundGeolocation.on('error',handler);
		},
		handler => {
			BackgroundGeolocation.un('error', handler);
		});


/**
 * starts the background thread
 */
const startBackgroundGeolocationObservable = () => Observable.fromPromise(
		new Promise((resolve, reject) =>
				BackgroundGeolocation.start(state => resolve(state), error => reject(error))
		));

/**
 * starts the background thread
 */
const stopBackgroundGeolocationObservable = () => Observable.create(observer =>
		BackgroundGeolocation.stop(() => observer.onComplete(), error => observer.onError(error)));

function watchPosition(geolocationOptions) {
	return Rx.Observable.create(observer => {
		let watchId = window.navigator.geolocation.watchPosition(
				(loc) => observer.next(loc),
				(error) => observer.error(error),
				geolocationOptions);

		return () => {
			window.navigator.geolocation.clearWatch(watchId);
		};
	}).publish().refCount();
}
/**
 * returns an observable for the BackgroundGeolocation getCurrentPosition
 */
const getCurrentPositionObservable = () => Observable.create(observer =>
			BackgroundGeolocation.getCurrentPosition({
				timeout: 1000,
				samples: 3,
				desiredAccuracy: 0,
				maximumAge: 0,
				persist: false
			}, location => observer.next(location), error => gpsError(error))
		);



const configureBackgroundGeolocation = () => Observable.bindCallback(BackgroundGeolocation.configure)({
		// Geolocation Config
		desiredAccuracy: 0,
		stationaryRadius: 50,
		distanceFilter: 0,
		// locationUpdateInterval:5000,
		disableElasticity: false,
		// Activity Recognition
		stopTimeout: 1,
		fastestLocationUpdateInterval: 5000,
		// Application config
		debug: true, // <-- enable this hear sounds for background-geolocation life-cycle.
		logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE,
		disableStopDetection: true,// REMOVE THIS, ONLY FOR DEBUG
		stopOnTerminate: true,   // <-- Allow the background-service to continue tracking when user closes the app.
		stopTimeout: 3,
		startOnBoot: false,        // <-- Auto start tracking when device is powered-up.
		// HTTP / SQLite config
		// url: 'http://yourserver.com/locations',
		batchSync: false,       // <-- [Default: false] Set true to sync locations to server in a single HTTP request.
		autoSync: false,         // <-- [Default: true] Set true to sync each location to server as it arrives.
		// headers: {              // <-- Optional HTTP headers
		// 	"X-FOO": "bar"
		// },
		// params: {               // <-- Optional HTTP params
		// 	"auth_token": "maybe_your_server_authenticates_via_token_YES?"
		locationAuthorizationAlert: {
			titleWhenNotEnabled: "Yo, location-services not enabled",
			titleWhenOff: "Yo, location-services OFF",
			instructions: "You must enable 'Always' in location-services, buddy",
			cancelButton: "Cancel",
			settingsButton: "Settings"
		}
		// }
	});


//start gps, continually update position
const startGPSEpic = (action$) =>
		action$.ofType(startGPS.getType())
				.flatMap(action => configureBackgroundGeolocation()
						.filter(state => state.enabled)
						.flatMap(state => startBackgroundGeolocationObservable()
								.flatMap(startSuccess => getLocationEventObservable()
										.throttleTime(2000).takeUntil(action$.ofType(stopGPS.getType()))
									.flatMap(location => Observable.of(setCurrentLocation(location)))
									.catch(error => Observable.of(gpsError({error: error, epic: 'startGPS'})))
								)
						)
				);

//stop gps, update position
const stopGPSEpic = (action$) =>
		action$.ofType(stopGPS.getType())
				.flatMap(action => stopBackgroundGeolocationObservable()
						.catch(error => Observable.of(gpsError({error: error, epic: 'stopGPS'})))
				);


//start gps, update position
const printGeolocationErrorsEpic = (action$) =>
		action$.ofType(startGPS.getType())
				.flatMap(action => getLocationErrorEventObservable().takeUntil(action$.ofType(stopGPS.getType()))
						.flatMap(error => Observable.of(gpsError({error: error, epic: 'printGeolocationErrorsEpic'})))
				);


// manually trigger location update
const updateLocationEpic = (action$) =>
		action$.ofType(updateLocation.getType())
				.flatMap(action =>
						getCurrentPositionObservable()
								.map(location => setCurrentLocation(location))
								.catch(error => Observable.of(gpsError({error: error, epic: 'updateLocationEpic'})))
				)


// update address based on location
const addressEpic = (action$) =>
		action$.ofType(setCurrentLocation.getType())
				.do((v) => {console.log('before Throttle');console.log(Date());console.log(v)})
				.throttleTime(20000)
				.flatMap(action =>
						Observable.fromPromise(
									Geocoder.geocodePosition({lat: action.payload.coords.latitude, lng: action.payload.coords.longitude}))
								.map(addresses =>
									setCurrentAddress(addresses[0])
								).catch(error => Observable.of(addressError(error)))
				);


export default combineEpics(startGPSEpic, printGeolocationErrorsEpic, addressEpic, updateLocationEpic, addressEpic);