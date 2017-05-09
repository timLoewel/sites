/**
 * Created by tim on 16/03/17.
 */
import {createAction, createReducer} from 'redux-act';
import {OrderedMap} from 'immutable';
import {randomString} from '../../utils/objectId';
import {createShareableSiteUri} from '../server/parseServer';
import {addObject, removeObject} from '../server/serverReducer';


export const SITE = 'Site';
/**
 * payload: objectId
 */
export const setSite = createAction('setSite: set the site');


/**
 * called, when a new site was added locally
 * @param site
 * @returns {{type: *, payload: {objectId: string, createdAt: string, updatedAt: string, location: {}, name: string, color: string, creatorObjectId: string, creatorName: string, description: string}}}
 */
export const addNewLocalSite = createAction('addNewLocalSite: create a site in the client');

/**
 * save to server successfull
 */
export const saveSiteJsonToServerDone = createAction('saveSiteJsonToServerDone: saved site to server');
/**
 *
 */
export const registerNoSite = createAction('registerNoSite: Register the users "noSite"-site ');

/**
 * creates a new site object, at the site of the current systemState.
 * does not add the site to the state
 */
export const createNewSite = (selectedLocation, systemLocation, creatorId) => {
	const localObjectId = randomString(4);
	return {
		localObjectId: localObjectId,
		name: localObjectId,
		searchablePosition: {
			"__type": 'GeoPoint',
			longitude: selectedLocation.longitude,
			latitude: selectedLocation.latitude,
		},
		selectedLocation,
		systemLocation,
		creator: {
			"__type": "Pointer",
			"className": "_User",
			"objectId": creatorId
		},
		publicUrl: createShareableSiteUri()
	};
};


const reducer = createReducer({
			[addNewLocalSite]: (state, payload) => ({
				noSite: state.noSite,
				localSitesByLocalObjectId: state.localSitesByLocalObjectId.set(payload.localObjectId, payload),
				sitesByObjectId: state.sitesByObjectId,
			}),
			[saveSiteJsonToServerDone]: (state, payload) => ({
				noSite: state.noSite,
				localSitesByLocalObjectId: state.localSitesByLocalObjectId.delete(payload.localObjectId),
				sitesByObjectId: state.sitesByObjectId.set(
						payload.objectId, {...state.localSitesByLocalObjectId.get(payload.localObjectId), ...payload}),
			}),
			[registerNoSite]: (state, payload) => ({...state,
				noSite: payload
			}),
			[addObject]: (state, payload) => {
				if (payload.className === SITE) {
					return {
						noSite: state.noSite,
						localSitesByLocalObjectId: state.localSitesByLocalObjectId,
						sitesByObjectId: state.sitesByObjectId.set(payload.objectId, payload)
					};
				} else {
					return state;
				}
			},
			[removeObject]: (state, payload) => {
				if (payload.className === SITE) {
					return {
						noSite: state.noSite,
						localSitesByLocalObjectId: state.localSitesByLocalObjectId,
						sitesByObjectId: state.sitesByObjectId.remove(payload.objectId)
					};
				} else {
					return state;
				}
			},
		},
		{
			noSite: {},
			localSitesByLocalObjectId: OrderedMap(),
			sitesByObjectId: OrderedMap(),
		});

export default reducer;