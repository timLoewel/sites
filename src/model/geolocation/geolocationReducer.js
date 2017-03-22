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


const reducer = createReducer({
	[setCurrentLocation]: (state, payload) => Immutable.merge(state, {location: payload.coords, gpsRunning: true, updating: false}),
	[setCurrentAddress]: (state, payload) => Immutable.merge(state, payload),
	[updateLocation]:  (state, payload) => Immutable.merge(state, {updating: true}),
	[gpsError]: (state, payload) => Immutable.merge(state, {lastGpsError: payload}),
	[addressError]: (state, payload) => Immutable.merge(state, {lastAddressError: payload}),
	[startGPS]: (state, payload) => Immutable.merge(state, {lastGpsError: null, lastAddressError:null}),
	[stopGPS]: (state, payload) => Immutable.merge(state, {lastGpsError: null, lastAddressError:null}),
}, Immutable.from({gpsRunning: false, updating: false, lastGpsError:null, lastAddressError: null, location:{}}));

export default reducer;