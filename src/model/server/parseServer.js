/**
 * Created by tim on 27/01/17.
 */
// import {App, User} from 'parse-lite';
//@flow

import * as env from '../../../env';
// import HttpController from 'ibeam/http-node';
import RNFetchBlob from 'react-native-fetch-blob';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import {ajaxPut, ajaxPost, ajaxGetJSON} from 'rxjs/observable/dom/AjaxObservable';
import {randomString} from '../../utils/objectId';
import type {ISessionToken, IServerClassName} from '../ModelTypes';

function getHeaders(sessionToken: ISessionToken) {
	return {
		'X-Parse-Application-Id': env.PARSE_APP_ID,
		'X-Parse-REST-API-Key': env.PARSE_REST_API_KEY,
		'Content-Type': 'application/json',
		'X-Parse-Session-Token': sessionToken
	}
}

export function save(className: IServerClassName, object: Object, sessionToken: ISessionToken) {
	console.log('saving object ', object);
	const data = {...object, createdAt: undefined, updatedAt: undefined};
	const url = env.PARSE_SERVER_HOST + 'classes/' + className;
	if (data.objectId) {
		return ajaxPut(url + '/' + data.objectId, data, getHeaders(sessionToken));
	} else {
		return ajaxPost(url, data, getHeaders(sessionToken));
	}
}

export function fetch(className: IServerClassName, query: string, sessionToken: ISessionToken) {
	const url = env.PARSE_SERVER_HOST + 'classes/' + className + '?where=' +
			encodeURIComponent(JSON.stringify(query));
	console.log(url);
	return ajaxGetJSON(url, getHeaders(sessionToken));
}


export function createShareableImageUri() {
	return env.IMAGE_BASE_ADDRESS + randomString(7);
}

export function createShareableSiteUri() {
	return env.SITE_BASE_ADDRESS + randomString(7);
}



export function uploadJpg(localFileName: string, sessionToken: ISessionToken) {
	const targetFileName = localFileName.substring(localFileName.lastIndexOf('/') + 1, localFileName.length);
	const completeUrl = env.PARSE_SERVER_HOST + 'files/' + targetFileName;
	console.log('uploading file to ' + completeUrl);
	console.log('file ' + localFileName);
	console.log('appID: ' + env.PARSE_APP_ID);
	console.log('X-Parse-REST-API-Key: ' + env.PARSE_REST_API_KEY);
	console.log('Session Token: ' + sessionToken);
	return Observable.fromPromise(
			RNFetchBlob.fetch('POST', completeUrl,
					getHeaders(sessionToken),
					RNFetchBlob.wrap(localFileName)
			));
};


