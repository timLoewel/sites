/**
 * Created by tim on 02/05/17.
 */
// @flow
import { createAction, createReducer } from 'redux-act';
import haversineDistance from 'geodetic-haversine-distance';




export type Address = {
	position: {// this is the position, the address is assigned to. not the location of the user
		longitude:number,
		latitude:number,
	},
	formattedAddress: string, // the full address
	streetNumber: ?string,
	streetName: ?string,
	postalCode: ?string,
	locality: ?string, // city name
	country: string,
	countryCode: string,
	adminArea: ?string,
	subAdminArea: ?string,
	subLocality: ?string
}

/**
 * location that can be searched in parseJs queries
 */
export type SearchablePosition = {
	longitude: number,
	latitude: number,
	__type: 'GeoPoint',
}

/**
 * a location
 */
export type Location = {
	longitude: number,
	latitude: number,
	accuracy: number,
	altitude: number,
	address: ?Address
}

export const setCurrentLocation = createAction('setCurrentLocation: Set the current GPS Longitude, Latitude');
export const setCurrentAddress= createAction('setCurrentAddress: Set the address of the current location');

/**
 * payload is the type of error
 */
export const gpsError = createAction('gpsError: error with GPS');
export const addressError = createAction('addressError: error while getting address for location');

const nullAddress = {
	formattedAddress:'',
			country: 'Deutschland',
		position: {
			longitude: 0,
			latitude:0,
		},
		countryCode:'DE'//TODO get this from the locale of the user
};

export const nullLocation ={
	longitude:0,
	latitude:0,
	accuracy:0,
	altitude:0,
	address: nullAddress,
};

/**
 * when a new position is registered by gps, this check, whether the old address is still usable,
 * or if is invalid. The new position will be used for an address update regardless of the result
 * of this function.
 * @param oldAddress
 * @param newPosition
 * @returns {*}
 */
const MAX_DIST_SAME_ADDRESS = 1000;
function computePreliminaryAddress(oldAddress, newPosition) {
	const dist = haversineDistance(oldAddress.position, newPosition);
	if (dist > MAX_DIST_SAME_ADDRESS) {
		return oldAddress;
	} else {
		return nullAddress;
	}
}

const reducer = createReducer({
	[setCurrentLocation]: (state, payload) =>
			({
				longitude: payload.coords.longitude,
				latitude:	payload.coords.latitude,
				accuracy: payload.coords.accuracy,
				altitude: payload.coords.altitude,
				address: computePreliminaryAddress(state.location.address, payload.coords),
			}),
	[setCurrentAddress]: (state, payload) => (
			{		...state,
					location:{
						...state.location,
						address: {
							position: {
								longitude: payload.position.lng,
								latitude: payload.position.lat,
							},
							formattedAddress: payload.formattedAddress,
							streetNumber: payload.streetNumber,
							streetName: payload.streetName,
							postalCode: payload.postalCode,
							locality: payload.locality, // city name
							country: payload.country,
							countryCode: payload.countryCode,
							adminArea: payload.adminArea,
							subAdminArea: payload.subAdminArea,
							subLocality: payload.subLocality
						}
					}
			}),
	[gpsError]: (state, payload) => ({...state, lastGpsError: payload}),
	[addressError]: (state, payload) => ({...state, lastAddressError: payload}),
}, {
			location: nullLocation,
			lastGpsError:null,
			lastAddressError: null,
		}
);


export default reducer;