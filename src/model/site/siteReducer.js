/**
 * Created by tim on 16/03/17.
 */
import { createAction, createReducer } from 'redux-act';
import Immutable from 'seamless-immutable';


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


const reducer = createReducer({
	[setSite]: (state, payload) => Immutable.merge(state, {currentSiteObjectId: payload}),
	[addSite]: (state, payload) => Immutable.setIn(state, ['sitesById', payload.objectId], payload),
}, Immutable.from({currentSiteObjectId: null, sitesById: {}}));

export default reducer;