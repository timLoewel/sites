/**
 * Created by tim on 16/03/17.
 */
import Immutable from 'seamless-immutable';
import { createAction, createReducer } from 'redux-act';



export const startGPS = createAction('start GPS');
export const stopGPS = createAction('stop GPS');
export const updateLocation = createAction('trigger an update of the location');

export const setCurrentLocation = createAction('Set the current GPS Longitude, Latitude');
export const setCurrentAddress= createAction('Set the address of the current location');


/**
 * payload is the type of error
 */
export const gpsError = createAction('error with GPS');
export const addressError = createAction('error while getting address for location');

/**
 * example values:
 * position: {
      heading: -1,
      speed: -1,
      accuracy: 20,
      longitude: 6.45241,
      altitude: 170.8,
      latitude: 50.7066983
    },
 address: {
      streetName: null,
      feature: null,
      locale: 'en_US',
      locality: 'Nideggen',
      position: {
        lng: 6.4843172,
        lat: 50.6922556
      },
      adminArea: 'North Rhine-Westphalia',
      streetNumber: null,
      country: 'Germany',
      countryCode: 'DE',
      postalCode: null,
      subAdminArea: 'Cologne',
      formattedAddress: '52385 Nideggen, Germany',
      subLocality: null
    }
 * @type {Reducer<S>}
 */
const reducer = createReducer({
	[setCurrentLocation]: (state, payload) => Immutable.merge(state, {position: payload.coords, gpsRunning: true, updating: false}),
	[setCurrentAddress]: (state, payload) => Immutable.merge(state, {address: payload}),
	[updateLocation]:  (state, payload) => Immutable.merge(state, {updating: true}),
	[gpsError]: (state, payload) => Immutable.merge(state, {lastGpsError: payload}),
	[addressError]: (state, payload) => Immutable.merge(state, {lastAddressError: payload}),
	[startGPS]: (state, payload) => Immutable.merge(state, {lastGpsError: null, lastAddressError:null}),
	[stopGPS]: (state, payload) => Immutable.merge(state, {lastGpsError: null, lastAddressError:null}),
}, Immutable.from({gpsRunning: false, updating: false, lastGpsError:null, lastAddressError: null, position:{longitude:0, latitude:0}, address:{}}));


export default reducer;