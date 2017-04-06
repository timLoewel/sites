/**
 * Created by tim on 27/01/17.
 */
// import {App, User} from 'parse-lite';
import * as env from '../../env';
// import HttpController from 'ibeam/http-node';
import RNFetchBlob from 'react-native-fetch-blob';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/dom/ajax';
import {randomString} from '../utils/objectId';



export function save(className, object, sessionToken) {
	const headers = {
		headers: {
			'X-Parse-Application-Id': env.PARSE_APP_ID,
			'X-Parse-REST-API-Key': env.PARSE_REST_API_KEY,
			'Content-Type': 'application/json',
			'X-Parse-Session-Token': sessionToken
		},
	};
	const data = {...object, createdAt: undefined, updatedAt: undefined};
	const str = JSON.stringify(data, null, 4);

	const url = env.PARSE_SERVER_HOST + 'classes/' + className;
	if (data.objectId) {
		return Observable.ajax.ajaxPut(url + '/' + data.objectId, data, headers);
	} else {
		return Observable.ajax.ajaxPost(url, data, headers);
	}
}


export function createShareableImageUri() {
	return env.IMAGE_BASE_ADDRESS + randomString(7);
}

export function createShareableSiteUri() {
	return env.SITE_BASE_ADDRESS + randomString(7);
}


export function copyAndUploadJpg(sourceFile, targetDir, targetFileName, sessionToken) {

	const completeUrl = env.PARSE_SERVER_HOST + 'files/' + targetFileName;
	console.log('uploading file to ' + completeUrl);
	console.log('file ' + localFile);
	console.log('appID: ' + env.PARSE_APP_ID);
	console.log('X-Parse-REST-API-Key: ' + env.PARSE_REST_API_KEY);
	return Observable.fromPromise(
			RNFetchBlob.fs.mv(sourceFile, targetDir + targetFileName).then(() =>
			RNFetchBlob.fetch('POST', completeUrl,
					{
						'X-Parse-Application-Id': env.PARSE_APP_ID,
						'X-Parse-REST-API-Key': env.PARSE_REST_API_KEY,
						'Content-Type': 'image/jpeg',
						'X-Parse-Session-Token': sessionToken
					},
					RNFetchBlob.wrap(localFile)
			))
	);
};


