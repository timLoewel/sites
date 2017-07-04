/**
 * Created by tim on 16/03/17.
 */
import {createAction, createReducer} from 'redux-act';
import {OrderedMap} from 'immutable';
import {randomString} from '../../utils/objectId';
import {createShareableSiteUri} from '../server/parseServer';
import {addObject, removeObject} from '../server/serverReducer';


export const SITE = 'Site';

export const NO_SITE_LOCAL_OBJECT_ID = 'noSiteLocalObjectId';

export const NEW_SITE_OBJECT_ID = 'newSiteObjectId';

/**
 * payload: form values
 * @type {ActionCreator<P, M>}
 */
export const submitSiteForm = createAction('submitSiteForm: site was edited');

/**
 * payload: form values
 * @type {ActionCreator<P, M>}
 */
export const submitSiteFormOk = createAction('submitSiteFormOk: site edit successful');


/**
 * payload: objectId
 */
export const selectSite = createAction('selectSite: selected the site to use for the next photo');

export const editSite = createAction('editSite: select the site to edit next');

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
				noSiteObjectId: state.noSiteObjectId,
				editedSiteObjectId: state.editedSiteObjectId,
				selectedSiteObjectId: state.selectedSiteObjectId,
				localSitesByLocalObjectId: state.localSitesByLocalObjectId.set(payload.localObjectId, payload),
				sitesByObjectId: state.sitesByObjectId,
			}),
			[saveSiteJsonToServerDone]: (state, payload) => ({
				noSiteObjectId: state.noSiteObjectId,
				editedSiteObjectId: state.editedSiteObjectId,
				selectedSiteObjectId: state.selectedSiteObjectId,
				localSitesByLocalObjectId: state.localSitesByLocalObjectId.delete(payload.localObjectId),
				sitesByObjectId: state.sitesByObjectId.set(
						payload.objectId, {...state.localSitesByLocalObjectId.get(payload.localObjectId), ...payload}),
			}),
			[registerNoSite]: (state, payload) => {
				let editedSiteObjectId;
				if (state.editedSiteObjectId === NO_SITE_LOCAL_OBJECT_ID) {
					editedSiteObjectId = payload.objectId;
				} else {
					editedSiteObjectId = state.editedSiteObjectId;
				}
				let selectedSiteObjectId;
				if (state.selectedSiteObjectId === NO_SITE_LOCAL_OBJECT_ID) {
					selectedSiteObjectId = payload.objectId;
				} else {
					selectedSiteObjectId = state.selectedSiteObjectId;
				}
				return ({
					noSiteObjectId: payload.objectId,
					editedSiteObjectId: editedSiteObjectId,
					selectedSiteObjectId: selectedSiteObjectId,
					localSitesByLocalObjectId: state.localSitesByLocalObjectId.remove(NO_SITE_LOCAL_OBJECT_ID),
					sitesByObjectId: state.sitesByObjectId.set(payload.objectId, payload)
				})},
			[addObject]: (state, payload) => {
				if (payload.className === SITE) {
					return {
						noSiteObjectId: state.noSiteObjectId,
						editedSiteObjectId: state.editedSiteObjectId,
						selectedSiteObjectId: state.selectedSiteObjectId,
						localSitesByLocalObjectId: state.localSitesByLocalObjectId,
						sitesByObjectId: state.sitesByObjectId.set(payload.objectId, payload)
					};
				} else {
					return state;
				}
			},
			[removeObject]: (state, payload) => {
				if (payload.className === SITE) {
					let editedSiteObjectId;
					if (state.editedSiteObjectId === payload.objectId) {
						editedSiteObjectId = state.noSiteObjectId;
					} else {
						editedSiteObjectId = state.editedSiteObjectId;
					}
					let selectedSiteObjectId;
					if (state.selectedSiteObjectId === payload.objectId) {
						selectedSiteObjectId = state.noSiteObjectId;
					} else {
						selectedSiteObjectId = state.selectedSiteObjectId;
					}
					return {
						noSiteObjectId: state.noSiteObjectId,
						editedSiteObjectId: editedSiteObjectId,
						selectedSiteObjectId: selectedSiteObjectId,
						localSitesByLocalObjectId: state.localSitesByLocalObjectId,
						sitesByObjectId: state.sitesByObjectId.remove(payload.objectId)
					};
				} else {
					return state;
				}
			},
			[selectSite]: (state, payload) => {
				return {
					noSiteObjectId: state.noSiteObjectId,
					editedSiteObjectId: state.editedSiteObjectId,
					selectedSiteObjectId: payload,
					localSitesByLocalObjectId: state.localSitesByLocalObjectId,
					sitesByObjectId: state.sitesByObjectId
				};	
			},
			[editSite]: (state, payload) => {
				return {
					noSiteObjectId: state.noSiteObjectId,
					editedSiteObjectId: payload,
					selectedSiteObjectId: state.selectedSiteObjectId,
					localSitesByLocalObjectId: state.localSitesByLocalObjectId,
					sitesByObjectId: state.sitesByObjectId
				};
			}
		},
		{
			noSiteObjectId: NO_SITE_LOCAL_OBJECT_ID,
			editedSiteObjectId: NO_SITE_LOCAL_OBJECT_ID,
			selectedSiteObjectId: NO_SITE_LOCAL_OBJECT_ID,
			localSitesByLocalObjectId: OrderedMap().set(NO_SITE_LOCAL_OBJECT_ID, {name:'noSite', localObjectId: NO_SITE_LOCAL_OBJECT_ID}),
			sitesByObjectId: OrderedMap(),
		});

export default reducer;