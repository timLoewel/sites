/**
 * Created by tim on 11/04/17.
 */
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/empty';


import 'rxjs/add/observable/fromEventPattern';
import {combineEpics} from 'redux-observable';
import {addNewLocalSite, saveSiteJsonToServerDone} from './siteReducer';
import {setServerReadyForRequests, subscribeToQuery} from '../server/serverSocketReducer';
import {save} from '../server/parseServer';


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


// upload the photo json to the server
const uploadNewLocalSiteJsonEpic = (action$, store) =>
		action$.ofType(addNewLocalSite.getType())
				.flatMap(addNewLocalSiteAction =>
						save(SITE_CLASS_NAME, addNewLocalSiteAction.payload, store.getState().profile.sessionToken)
								.map((saveResult) => saveSiteJsonToServerDone({...addNewLocalSiteAction.payload, ...saveResult.response}))
				).catch(error => {
			console.log('error saving the json');
			console.log(error);
			return Observable.empty();
		});


export default combineEpics(serverReadyForRequestsEpic, uploadNewLocalSiteJsonEpic);