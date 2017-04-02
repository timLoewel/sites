/**
 * Created by tim on 02/01/17.
 */

import { createAction, createReducer } from 'redux-act';
import SeamlessImmutable from 'seamless-immutable';
import {List } from 'immutable'

/**
 * a photo goes through these states
 * @type {{CREATED: string, JSON_UPLOADED: string, UPLOADING_IMAGE: string, ON_SERVER: string}}
 */
export const PHOTO_STATE = {
	CREATED: 'created',
	JSON_UPLOADED: 'jsonUploaded',
	UPLOADING_IMAGE: 'uploadingImage',
	ON_SERVER: 'onServer',
};

/**
 * call when a photo was done, or when the camera view is entered
 */
export const resetLastPhoto = createAction('reset the data of the last photo shot');

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
 * @returns {{type: string, payload: {uri: string, photoHeight: number, photoWidth: number, orientation: number, createdAt}}}
 */
export const setRawPhotoLocalData = createAction('set the data of the photo just shot');

export const renderingDone = createAction('rendering done.');

export const enqueuePhotoForRendering = createAction('add the photo to the queue, so that it gets rendered');
/**
  * payload: {address:{formattedAddress}, location: {latitude, longitude}}
 * @type {ActionCreator<P, M>}
 */
export const setPhotoLocation = createAction('set the address the photo was shot at');

export const setPhotoDescription = createAction('set the photo description');

/**
 * sets the information rendered into the photo
 */
/**
 * the payload should be a promise, as created by react-native-camera.capture
 * do not put the promise into the state. this is purely for
 * the camera epic setRawPhotoLocalData to be triggered when the photo is ready
 * 		photoPromise: Promise
 *
 */
export const photographing = createAction('taking a photo');

export const rendering = createAction('rendering the photo');

/**
 * payload is the type of error
 */
export const errorOnPhoto = createAction('error while taking a photo');

/**
 * the payload should be the result of the react-native-camera.capture
 */
export const photoReady = createAction('photo ready');

const reducer = createReducer({
	[renderingDone]: (state, payload) => 	({
		isRendering: false,
		photosWaitingForRendering: state.photosWaitingForRendering.shift(),//remove from front
		selectedLocation: state.selectedLocation,
		description: state.photoDescription}),
	[enqueuePhotoForRendering]: (state, payload) =>	({
		isRendering: state.isRendering,
		photosWaitingForRendering: state.photosWaitingForRendering.push(payload),//add to end
		selectedLocation: state.selectedLocation,
		description: state.photoDescription}),
	[setPhotoLocation]:(state, payload) => 	({
		isRendering: state.isRendering,
		photosWaitingForRendering: state.photosWaitingForRendering,
		selectedLocation: payload,
		description: state.photoDescription}),
	[setPhotoDescription]:(state, payload) => ({
		isRendering: state.isRendering,
		photosWaitingForRendering: state.photosWaitingForRendering,
		selectedLocation: state.selectedLocation,
		description: payload}),
	[rendering]: (state, payload) => ({
		isRendering: true,
		photosWaitingForRendering: state.photosWaitingForRendering,
		selectedLocation: state.selectedLocation,
		description:state.description,
	}),},
		{
			isRendering: false,
			photosWaitingForRendering: List(),//fifo
			selectedLocation:  {address:{formattedAddress: ''}},
			description: '',
	}
);


export default reducer;