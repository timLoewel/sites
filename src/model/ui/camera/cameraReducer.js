/**
 * Created by tim on 02/01/17.
 */

import { createAction, createReducer } from 'redux-act';
import Immutable from 'seamless-immutable';


/**
 * set the meta data of the photo just shot
 *
 * orientation is a number between 1 and 8.
 * 1: all good
 * 8: rotate 270 degrees
 * 3: rotate 180 degrees
 * 6: rotate 90 degrees
 *
 * 2: mirror horizontally
 * 7: rotate 270 degrees, then mirror horizontally
 * 5: rotate 90 degrees, then mirror horizontally
 * 4: mirror vertically
 * see: http://www.daveperrett.com/articles/2012/07/28/exif-orientation-handling-is-a-ghetto/
 * @param photoData
 * @returns {{type: string, payload: {uri: string, photoHeight: number, photoWidth: number, orientation: number}}}
 */
export const setRawPhotoLocalData = createAction('set the data of the photo just shot');

/**
 * the payload should be a promise, as created by react-native-camera.capture
 * do not put it into the state. this is purely for the camera epics to be triggered
 */
export const photographing = createAction('taking a photo');

/**
 * payload is the type of error
 */
export const errorOnPhoto = createAction('error while taking a photo');

/**
 * the payload should be the result of the react-native-camera.capture
 */
export const photoReady = createAction('photo ready');

/**
 * inits the json, containing the image meta data
 * photo: {siteObjectId: string, formattedPhotoAddress: string,
	creatorObjectId: string, creatorName:string, photoDescription: string}
 */
export const initPhotoLocalAndOnServer = createAction('init photo (local and on server)')

/**
 * sets the meta data as stored on the server
 * @param photoObjectId
 * @param shareableUri
 * @param createdAt
 * @returns {{type: string, payload: {photoObjectId: *, shareableUri: *, createdAt: *}}}
 */
export const setServerPhotoData = createAction('set the data as stored on the server');


const reducer = createReducer({
	[setRawPhotoLocalData]: (state, payload) => Immutable.merge(state, {localPhotoData: payload}),
	[setServerPhotoData]: (state, payload) => Immutable.merge(state, {serverPhotoData: payload}),

}, Immutable.from({localPhotoData:{}, serverPhotoData:{}}));


export default reducer;