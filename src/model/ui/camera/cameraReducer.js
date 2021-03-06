/**
 * Created by tim on 02/01/17.
 */

import {createAction, createReducer} from 'redux-act';
import {List} from 'immutable';

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
export const resetLastPhoto = createAction('resetLastPhoto: reset the data of the last photo shot');

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
export const setRawPhotoLocalData = createAction('setRawPhotoLocalData: set the data of the photo just shot');

export const screenshotDone = createAction('screenshotDone: (PHOTO) screenshot done.');

export const enqueuePhotoForRendering = createAction('enqueuePhotoForRendering: (PHOTO) add the photo to the queue, so that it gets rendered');
/**
 * payload: {address:{formattedAddress}, location: {latitude, longitude}}
 * @type {ActionCreator<P, M>}
 */
export const setPhotoLocation = createAction('setPhotoLocation: set the address the photo was shot at');

export const setPhotoDescription = createAction('setPhotoDescription: set the photo description');

/**
 * sets the information rendered into the photo
 */
/**
 * the payload should be a promise, as created by react-native-camera.capture
 * do not put the promise into the state. this is purely for
 * the camera epic setRawPhotoLocalData to be triggered when the photo is ready
 *    photoPromise: Promise
 *
 */
export const photographing = createAction('photographing: taking a photo');

export const doingScreenshot = createAction('doingScreenshot: doing Screenshot');

export const readyForScreenshot = createAction('readyForScreenshot: the photo has been rendered, is ready for screenshot');

/**
 * payload is the type of error
 */
export const errorOnPhoto = createAction('errorOnPhoto: error while taking a photo');

/**
 * the payload should be the result of the react-native-camera.capture
 */
export const photoReady = createAction('photoReady: photo ready');

const reducer = createReducer({
			[screenshotDone]: (state, payload) => ({
				isReadyForScreenshot: false,
				screenshotDimensions: {height:0, width:0},
				isDoingScreenshot: false,
				photosWaitingForRendering: state.photosWaitingForRendering.shift(),//remove from front
				selectedLocation: state.selectedLocation,
				description: state.description,
			}),
			[enqueuePhotoForRendering]: (state, payload) => ({
				isReadyForScreenshot: state.isReadyForScreenshot,
				screenshotDimensions: state.screenshotDimensions,
				isDoingScreenshot: state.isDoingScreenshot,
				photosWaitingForRendering: state.photosWaitingForRendering.push(payload),//add to end
				selectedLocation: state.selectedLocation,
				description: state.description,
			}),
			[setPhotoLocation]: (state, payload) => ({
				isReadyForScreenshot: state.isReadyForScreenshot,
				screenshotDimensions: state.screenshotDimensions,
				isDoingScreenshot: state.isDoingScreenshot,
				photosWaitingForRendering: state.photosWaitingForRendering,
				selectedLocation: payload,
				description: state.description,
			}),
			[setPhotoDescription]: (state, payload) => ({
				isReadyForScreenshot: state.isReadyForScreenshot,
				screenshotDimensions: state.screenshotDimensions,
				isDoingScreenshot: state.isDoingScreenshot,
				photosWaitingForRendering: state.photosWaitingForRendering,
				selectedLocation: state.selectedLocation,
				description: payload,
			}),
			[doingScreenshot]: (state, payload) => ({
				isReadyForScreenshot: false,
				screenshotDimensions: state.screenshotDimensions,
				isDoingScreenshot: true,
				photosWaitingForRendering: state.photosWaitingForRendering,
				selectedLocation: state.selectedLocation,
				description: state.description,
			}),
			[readyForScreenshot]: (state, payload) => ({
				isReadyForScreenshot: true,
				screenshotDimensions: payload,
				isDoingScreenshot: false,
				photosWaitingForRendering: state.photosWaitingForRendering,
				selectedLocation: state.selectedLocation,
				description: state.description,
			}), 
		},
		{
			isReadyForScreenshot: false, // is RenderImage View ready to trigger the screenshot?
			screenshotDimensions: {height:0, width:0}, // the final dimensions of the view that should be screenshot
			isDoingScreenshot: false,// semaphore, so that we do not snap the same image twice, if a render happens during doingScreenshot
			photosWaitingForRendering: List(),//fifo queue, as long as there are photos in here, the RenderImage View keeps doing shots
			selectedLocation: undefined,
			description: '',
		}
);


export default reducer;