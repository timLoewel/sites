/**
 * Created by tim on 15/03/17.
 */
import { createAction, createReducer } from 'redux-act';
import {OrderedMap} from 'immutable';
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
      if (!payload.objectId) { // the photo was stored on the server, the localObjectId is obsolete
				return {
					localPhotosByLocalObjectId: state.localPhotosByLocalObjectId.set(payload.localObjectId, payload),
					photosByObjectId: state.photosByObjectId,
				}
			}
    }
    return {
			localPhotosByLocalObjectId: state.localPhotosByLocalObjectId.delete(payload.localObjectId),
			photosByObjectId: state.photosByObjectId.set(payload.objectId, payload),
		}
	},
}, {
  localPhotosByLocalObjectId: OrderedMap(),
  photosByObjectId:OrderedMap(),
});

export default reducer;