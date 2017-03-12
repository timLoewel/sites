/**
 * Created by tim on 02/01/17.
 */

// import {validateUserName} from '../profile/profileReducer';

import Immutable from 'seamless-immutable';


export const SET_CREATOR_NAME = 'newPhotoViewReducer.SET_CREATOR_NAME';
export const SET_PHOTO_DESCRIPTION = 'newPhotoViewReducer.SET_PHOTO_DESCRIPTION';
export const SET_NEW_RAW_PHOTO_LOCAL_DATA = 'newPhotoViewReducer.SET_NEW_RAW_PHOTO_LOCAL_DATA';
export const SET_SERVER_PHOTO_DATA = 'newPhotoViewReducer.SET_SERVER_PHOTO_DATA';
export const RESET_PHOTO_DATA = 'newPhotoViewReducer.RESET_PHOTO_DATA';
export const SET_SITE_FILTER = 'newPhotoViewReducer.SET_SITE_FILTER';

export function setCreatorName(filter: string): Action {
	return {
		type: SET_CREATOR_NAME,
		payload: filter,
	};
}

/**
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
export function setNewRawPhotoLocalData(photoData: {uri: string, photoWidth: number, photoHeight: number, orientation: number}): Action {
	return {
		type: SET_NEW_RAW_PHOTO_LOCAL_DATA,
		payload: photoData,
	};
}

export function setServerPhotoData(photoObjectId, shareableUri, createdAt) {
	return {
		type: SET_SERVER_PHOTO_DATA,
		payload: {
			photoObjectId: photoObjectId,
			shareableUri: shareableUri,
			createdAt: createdAt
		},
	}
}

export function resetPhotoData() {
	return {
		type: RESET_PHOTO_DATA,
	}
}

export function setSitesFilter(text: string): Action {
	return {
		type: SET_SITE_FILTER,
		payload: text,
	};
}

const initialState = Immutable.from(
		{
			shareableUri: undefined,
			newRawPhotoLocalUri: undefined,
			photoWidth: undefined,
			photoHeight: undefined,
			orientation: undefined,
			photoObjectId: undefined,
			serverPhotoCreatedAt: undefined,

			creatorName: undefined,
			creatorNameValid: undefined,
			creatorNameValidationMessage: undefined,

			siteName: undefined,
			siteNameValid: undefined,
			siteNameValidationMessage: '',
			sitesFilter: '',
			tags: {},
			photoDescription: ''
		}
);

const actionsMap = {};

actionsMap[SET_CREATOR_NAME] = (state, action) => {
	var result = Immutable.set(state, 'creatorName', action.payload);
	// const {isValid, validationMessage} = validateUserName(action.payload);
	return Immutable.merge(state, {
		// creatorNameValid: isValid,
		// creatorNameValidationMessage: validationMessage,
		creatorName: action.payload}
		);
}

actionsMap[SET_SITE_FILTER] = (state, action) => Immutable.set(state, 'sitesFilter', action.payload);
actionsMap[SET_PHOTO_DESCRIPTION] = (state, action) => Immutable.set(state, 'photoDescription', action.payload);
actionsMap[SET_NEW_RAW_PHOTO_LOCAL_DATA] = (state, action) =>
		Immutable.merge(state, {
			newRawPhotoLocalUri: action.payload.uri,
			photoWidth: action.payload.photoWidth,
			photoHeight: action.payload.photoHeight,
			photoOrientation: action.payload.orientation
		});

actionsMap[SET_SERVER_PHOTO_DATA] = (state, action) =>
		Immutable.merge(state, {
			shareableUri: action.payload.shareableUri,
			serverPhotoCreatedAt: action.payload.createdAt,
			photoObjectId: action.payload.photoObjectId
		});

actionsMap[RESET_PHOTO_DATA] = (state, action) =>
		Immutable.merge(state, {
				shareableUri: null,
				serverPhotoCreatedAt: null,
				photoObjectId: null,
				newRawPhotoLocalUri: null,
				photoOrientation: null
		});

export default (state = initialState, action) => {
	const reduceFn = actionsMap[action.type];
	if (!reduceFn) return state;
	return reduceFn(state, action);
};