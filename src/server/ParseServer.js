/**
 * Created by tim on 27/01/17.
 */
// import {App, User} from 'parse-lite';
import * as env from '../../env';
// import HttpController from 'ibeam/http-node';
import axios from 'axios';
import RNFetchBlob from 'react-native-fetch-blob'

// export const app = 	new App({
// 	host: env.PARSE_SERVER_HOST,
// 	applicationId: env.PARSE_APP_ID,
// 	// httpController: HttpController,
// });

export function logOut(sessionToken) {
		//
		// User.logOut(app, sessionToken);
}

export function save(className, object, sessionToken) {
	const params = {
		headers: {
			'X-Parse-Application-Id': env.PARSE_APP_ID,
			'X-Parse-REST-API-Key': env.PARSE_REST_API_KEY,
			'Content-Type': 'application/json',
			'X-Parse-Session-Token': sessionToken
		},
	};
	const data = {...object, createdAt: undefined, updatedAt: undefined};
	const str = JSON.stringify(data, null, 4);

	if (data.objectId) {
		console.log('putting object '+ str);
		return axios.put(env.PARSE_SERVER_HOST+'classes/'+className+'/'+data.objectId, data, params);
	} else {
		console.log('uploading object '+ str);
		return axios.post(env.PARSE_SERVER_HOST+'classes/'+className, data, params)
	}
}


export function createShareableUri(objectId: string) {
	return env.IMAGE_BASE_ADDRESS + objectId;
}


// export async function uploadJpg(localFile, targetFileName, sessionToken) {
// 	const completeUrl = env.PARSE_SERVER_HOST + 'files/'+targetFileName;
// 	console.log('uploading file to '+ completeUrl)
// 	console.log('file '+ localFile);
// 	return axios.post(completeUrl, localFile, {
// 				headers: {
// 					'X-Parse-Application-Id': env.PARSE_APP_ID,
// 					'X-Parse-REST-API-Key': env.PARSE_REST_API_KEY,
// 					'Content-Type': 'image/jpeg',
// 					'X-Parse-Session-Token': sessionToken
// 					}
// 			});

export function uploadJpg(localFile, targetFileName, sessionToken) {
	const completeUrl = env.PARSE_SERVER_HOST + 'files/'+targetFileName;
	console.log('uploading file to '+ completeUrl)
	console.log('file '+ localFile);
	console.log('appID: '+ env.PARSE_APP_ID);
	console.log('X-Parse-REST-API-Key: ' + env.PARSE_REST_API_KEY);
	return RNFetchBlob.fetch('POST', completeUrl, {
		'X-Parse-Application-Id': env.PARSE_APP_ID,
		'X-Parse-REST-API-Key': env.PARSE_REST_API_KEY,
		'Content-Type': 'image/jpeg',
		'X-Parse-Session-Token': sessionToken
}, RNFetchBlob.wrap(localFile)).uploadProgress({ interval : 15 },(written, total) => {
		console.log('uploaded ' + written + ' / ' + total)
	});
};