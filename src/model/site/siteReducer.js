/**
 * Created by tim on 16/03/17.
 */
import {createAction, createReducer} from 'redux-act';
import {OrderedMap} from 'immutable';
import {randomString} from '../../utils/objectId';
import {createShareableSiteUri} from '../../server/ParseServer';

/**
 * payload: objectId
 */
export const setSite = createAction('set the site');


/**
 * called, when a new site was added on the server
 * @param site
 * @returns {{type: *, payload: {objectId: string, createdAt: string, updatedAt: string, location: {}, name: string, color: string, creatorObjectId: string, creatorName: string, description: string}}}
 */
export const addSite = createAction('add a site');

/**
 * creates a new state, at the site of the current geolocation.
 */
export const createNewSite = (selectedLocation, systemLocation) => {
	const localObjectId = randomString(4);
	return {
		localObjectId: localObjectId,
		name: localObjectId,
		selectedLocation,
		systemLocation,
		publicUrl: createShareableSiteUri()
	};
};

export const NOSITE = {locatObjectId: 'NoSite', name: 'noSite', publicUrl: undefined};

const reducer = createReducer({
	[addSite]: (state, payload) => {
		if (payload.localObjectId) {
			if (!payload.objectId) { // the photo was stored on the server, the localObjectId is obsolete
				return {
					noSite: state.noSite,
					localSitesByLocalObjectId: state.localSitesByLocalObjectId.set(payload.localObjectId, payload),
					sitesByObjectId: state.sitesByObjectId,
				}
			}
		}
		return {
			noSite: state.noSite,
			localSitesByLocalObjectId: state.localSitesByLocalObjectId.delete(payload.localObjectId),
			sitesByObjectId: state.sitesByObjectId.set(payload.objectId, payload),
		}
	},
}, {
	noSite: NOSITE,
	localSitesByLocalObjectId: OrderedMap(),
	sitesByObjectId: OrderedMap(),
});

export default reducer;