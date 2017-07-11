/**
 * Created by tim on 16/03/17.
 */
// @flow
import { createAction, createReducer } from "redux-act";

export const startGPS = createAction("startGPS");
export const stopGPS = createAction("stopGPS");
export const updateLocation = createAction(
  "updateLocation: trigger an update of the location"
);

export const setCurrentLocation = createAction(
  "setCurrentLocation: Set the current GPS Longitude, Latitude"
);
export const setCurrentAddress = createAction(
  "setCurrentAddress: Set the address of the current location"
);

/**
 * payload: {isConnected: bool, hasWifi: bool}
 * @type {ActionCreator<P, M>}
 */
export const setConnected = createAction(
  "setConnected: Data connection established"
);

export const setDisconnected = createAction(
  "setDisconnected: No data connection"
);

export const startNetworkMonitor = createAction(
  "startNetworkMonitor: start checking for network state"
);

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

const reducer = createReducer(
  {
    [updateLocation]: (state, payload) => ({ ...state, updating: true }),
    [setConnected]: (state, payload) => ({ ...state, ...payload }),
    [setDisconnected]: (state, payload) => ({
      ...state,
      isConnected: false,
      hasWifi: false
    })
  },
  {
    gpsRunning: false,
    isConnected: false,
    hasWifi: false,
    updating: false
  }
);

export default reducer;
