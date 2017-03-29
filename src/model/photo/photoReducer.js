/**
 * Created by tim on 15/03/17.
 */
import { createAction, createReducer } from 'redux-act';
import Immutable from 'seamless-immutable';
/**
 * photo:{thumbnailData, photoUri, description, creatorObjectId, creatorName, selectedLocation, systemLocation, siteObjectId	}
 *
 * objectId:string, createdAt:Date, updatedAt:Date, uri:string,
 siteObjectId: string, formattedAddress: string, creatorObjectId: string, creatorName:string, description: string, shortDescription: string
 * @type {ActionCreator<P, M>}
 */
export const addPhoto = createAction('add a photo to the local database');


// use https://github.com/mikolalysenko/functional-red-black-tree  for the data? sorted and immutable..
const reducer = createReducer({
  [addPhoto]: (state, payload) => {
    if (payload.localObjectId) {
      if (payload.objectId) { // the photo was stored on the server, the localObjectId is obsolete
				return Immutable.merge(state, {
						localPhotosByLocalObjectId:  {[payload.localObjectId]: undefined},
						photosByObjectId: {[payload.objectId]: payload},
					}, {deep: true});
			} else {
				return Immutable.merge(state, {localPhotosByLocalObjectId: {[payload.localObjectId]: payload}},  {deep: true});
			}
    } else {
			return Immutable.merge(state, {photosByObjectId: {[payload.objectId]: payload}}, {deep: true});
		}
	},

}, Immutable.from({
  localPhotosByLocalObjectId: {},
  photosByObjectId:{},
}));

export default reducer;