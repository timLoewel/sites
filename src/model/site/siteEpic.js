/**
 * Created by tim on 11/04/17.
 */
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/empty';

import 'rxjs/add/observable/fromEventPattern';
import {combineEpics} from 'redux-observable';
import {fetch} from '../server/parseServer';
import {SITE, NO_SITE_LOCAL_OBJECT_ID, registerNoSite, addNewLocalSite, saveSiteJsonToServerDone} from './siteReducer';
import {userLoginSuccess} from '../profile/profileReducer';
import {setServerReadyForRequests, subscribeToQuery} from '../server/serverSocketReducer';


const serverReadyForRequestsEpic = (action$, store) =>
		action$.ofType(setServerReadyForRequests.getType())
				.do(r => {
					console.log('initialzing site query');
				})
				.map(() => subscribeToQuery(
`{
	"className": "${SITE}",
	"where": {
		"creator": {
			"__type": "Pointer",
			"className": "User",
			"objectId": "${store.getState().profile.objectId}"
		}
	}
}`));

// get the noSite site
const getInitialSitesEpic = (action$, store) =>
		action$.ofType(userLoginSuccess.getType())
				.flatMap(userLoginSuccessAction =>
						fetch(SITE, {
							'localObjectId': NO_SITE_LOCAL_OBJECT_ID,
							'creator': {
								'__type': 'Pointer',
								'className': '_User',
								'objectId': store.getState().profile.objectId,
							}
						}, store.getState().profile.sessionToken)
								.map(result => {
									console.log('no site: ', result);
									return registerNoSite(result.results[0] || {})
								}

								)
								.catch(error => Observable.empty())
				);

// upload the photo json to the server
const uploadNewLocalSiteJsonEpic = (action$, store) =>
		action$.ofType(addNewLocalSite.getType())
				.flatMap(addNewLocalSiteAction =>
						save(SITE, addNewLocalSiteAction.payload, store.getState().profile.sessionToken)
								.map((saveResult) => saveSiteJsonToServerDone({...savePhotoFileToServerDoneAction.payload, ...saveResult.response}))
				).catch(error => {
			console.log('error saving the json');
			console.log(error);
			return Observable.empty();
		});


export default combineEpics(serverReadyForRequestsEpic, getInitialSitesEpic, uploadNewLocalSiteJsonEpic);