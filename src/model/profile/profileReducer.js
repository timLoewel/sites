/**
 * Created by tim on 22/11/16.
 */
import Immutable from 'immutable';
import ReactNativeI18n from 'react-native-i18n'
import type {Action} from '../types';
import {USER_LOGIN_SUCCESS} from './auth';
import I18n from '../../assets/translations';

//
// export const Photo = Immutable.Record(
// 		{
// 			objectId: String | null,
// 			createdAt: String | null,
// 			updatedAt: String | null,
//
// 			originalObjectId: null, // if this photos is a updated version of an existing photos, this is the original
// 			uri: String | null, // first approximation for testing, later this could point to the image location in the cloud?
// 			data: null, // base64 encoded binary
// 			signature: String, // the fingerprint of the original picture and the metadata
// 			siteObjectId: String, //what albums does this photo belong to?
// 			formattedAddress: String,
// 			// location: {
// 			// 	longitude: number | null,
// 			// 	latitude: number | null,
// 			// 	altitude: number | null,
// 			// 	accuracy: number | null,
// 			// 	address: {
// 			// 		formattedAddress: string, // the full address
// 			// 		streetnumber: string | null,
// 			// 		streetName: string | null,
// 			// 		postalCode: string | null,
// 			// 		locality: string | null, // city name
// 			// 		country: string,
// 			// 		countryCode: string
// 			// 	}
// 			// },
// 			creatorName: String,
// 			creatorObjectId: String,
// 			tags: Immutable.Set(),
// 			description: String,
// 			shortDescription:String
// 		}
// );
//
// export const ADD_PHOTO = 'photos.ADD_PHOTO';
//
// export function addPhoto(objectId:string, createdAt:Date, updatedAt:Date, uri:string, data: string,
// 												 siteObjectId: string, formattedAddress: string, creatorObjectId: string, creatorName:string,
// 												 description: string, shortDescription: string): Action {
// 	return {
// 		type: ADD_PHOTO,
// 		payload: {
// 			objectId: objectId,
// 			createdAt: createdAt,
// 			updatedAt: updatedAt,
// 			uri: uri,
// 			data: data,
// 			siteObjectId: siteObjectId,
// 			formattedAddress: formattedAddress,
// 			creatorObjectId: creatorObjectId,
// 			creatorName: creatorName,
// 			description: description,
// 			shortDescription: shortDescription
// 		},
// 	};
// }

export const SET_USER_NAME = 'profile.SET_USER_NAME';
export const SET_USER_EMAIL = 'profile.SET_USER_EMAIL';
export const SET_USER_OBJECT_ID = 'profile.SET_USER_OBJECT_ID';
export const SET_USER_AVATAR = 'profile.SET_USER_AVATAR';
export const ADD_USER_PROFESSION = 'profile.ADD_USER_PROFESSION';
export const UPDATE_USER_PROFESSION = 'profile.UPDATE_USER_PROFESSION';
export const REMOVE_USER_PROFESSION = 'profile.REMOVE_USER_PROFESSION';
export const ADD_USER_ORG = 'profile.ADD_USER_ORG';
export const UPDATE_USER_ORG = 'profile.UPDATE_USER_ORG';
export const REMOVE_USER_ORG = 'profile.REMOVE_USER_ORG';

export function validateUserName(name) {
	if (name == undefined || name == '') {
		return {isValid: false, validationMessage: I18n.t('profile.userNameValidationErrorMissing')};
	}
	var numParts = 0;
	const parts = name.split(' ');
	for (i = 0; i < parts.length; i++) {
		if (parts[i].length > 1) {
			++numParts;
		}
	}
	if (numParts < 2) {
		return {isValid: false, validationMessage: I18n.t('profile.userNameValidationErrorShort')};
	} else {
		return {isValid: true, validationMessage: ''}
	}
}

export function setUserName(userName: string): Action {
	return {
		type: SET_USER_NAME,
		payload: userName,
	};
}

export function setUserEmail(userEmail: string): Action {
	return {
		type: SET_USER_EMAIL,
		payload: userEmail,
	};
}

export function setUserObjectId(objectId: string): Action {
	return {
		type: SET_USER_OBJECT_ID,
		payload: objectId,
	};
}
export function setUserAvatar(avatar: string): Action {
	return {
		type: SET_USER_AVATAR,
		payload: avatar,
	};
}
const deviceLocale = ReactNativeI18n.locale;

const initialState = Immutable.Map(
		{
			userObjectId: String,
			isSyncedToServer: Boolean,
			authToken: null,
			name: '',
			email: '',
			locale: deviceLocale,
			avatar: null,
		});

const actionsMap = {};
actionsMap[SET_USER_NAME] = (state, action) => {
	return state.set('name', action.payload);
};
actionsMap[SET_USER_EMAIL] = (state, action) => {
	return state.set('email', action.payload);
};
actionsMap[SET_USER_AVATAR] = (state, action) => {
	return state.set('avatar', action.payload);
};
actionsMap[SET_USER_OBJECT_ID] = (state, action) => {
	return state.set('userObjectId', action.payload);
};

actionsMap[USER_LOGIN_SUCCESS] = (state, action) => {
	return state.set('userObjectId', action.payload.profile.parse_objectId)
			.set('name', action.payload.profile.name)
			.set('email', action.payload.profile.email)
			.set('name', action.payload.profile.name);
};


export default (state = initialState, action) => {
	const reduceFn = actionsMap[action.type];
	if (!reduceFn) return state;
	return reduceFn(state, action);
};
