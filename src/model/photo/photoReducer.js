/**
 * Created by tim on 15/03/17.
 */
// @flow
import { createAction, createReducer } from "redux-act";
import { OrderedMap } from "immutable";
import { addObject, removeObject } from "../server/serverReducer";

const PHOTO = "Photo";

/**
 * photo:{thumbnailData, photoUri, description, creatorObjectId, creatorName, selectedLocation, systemLocation, siteObjectId	}
 *
 * objectId:string, createdAt:Date, updatedAt:Date, uri:string,
 siteObjectId: string, formattedAddress: string, creatorObjectId: string, creatorName:string, description: string, shortDescription: string
 * @type {ActionCreator<P, M>}
 */
export const addLocalPhoto = createAction(
  "addLocalPhoto: (PHOTO) add photo to the local database"
);

export const savePhotoFileToServer = createAction(
  "savePhotoFileToServer: (PHOTO) store local file in cloud."
);

export const savePhotoJsonToServer = createAction(
  "savePhotoJsonToServer: (PHOTO) store local photo in cloud."
);

export const savePhotoFileToServerDone = createAction(
  "savePhotoFileToServerDone: (PHOTO) photo file was stored in cloud. Update the photo in the local database."
);

export const savePhotoJsonToServerDone = createAction(
  "savePhotoJsonToServerDone: (PHOTO) photo json was stored in cloud. Update the photo in the local database."
);

/**
 * retrieve the local uri / thumbnail of the last photo in the repo, or undefined if none
 */
export function getLastPhotoThumbnail(state: any) {
  if (!state.photo.localPhotosByLocalObjectId.isEmpty()) {
    return state.photo.localPhotosByLocalObjectId.last().thumbnailData;
  }
  if (!state.photo.photosByObjectId.isEmpty()) {
    return state.photo.photosByObjectId.last().thumbnailData;
  }
  return undefined;
}

// use https://github.com/mikolalysenko/functional-red-black-tree  for the data? sorted and immutable..
const reducer = createReducer(
  {
    [addLocalPhoto]: (state, payload) => ({
      localPhotosByLocalObjectId: state.localPhotosByLocalObjectId.set(
        payload.localObjectId,
        payload
      ),
      photosByObjectId: state.photosByObjectId
    }),
    [savePhotoFileToServerDone]: (state, payload) => ({
      localPhotosByLocalObjectId: state.localPhotosByLocalObjectId.update(
        payload.localObjectId,
        oldValue => ({ ...oldValue, ...payload })
      ),
      photosByObjectId: state.photosByObjectId
    }),
    [savePhotoJsonToServerDone]: (state, payload) => ({
      localPhotosByLocalObjectId: state.localPhotosByLocalObjectId.delete(
        payload.localObjectId
      ),
      photosByObjectId: state.photosByObjectId.set(payload.objectId, {
        ...state.localPhotosByLocalObjectId.get(payload.localObjectId),
        ...payload
      })
    }),
    [addObject]: (state, payload) => {
      if (payload.className === PHOTO) {
        return {
          localPhotosByLocalObjectId: state.localPhotosByLocalObjectId,
          photosByObjectId: state.photosByObjectId.set(
            payload.objectId,
            payload
          )
        };
      } else {
        return state;
      }
    },
    [removeObject]: (state, payload) => {
      if (payload.className === PHOTO) {
        return {
          localPhotosByLocalObjectId: state.localPhotosByLocalObjectId,
          photosByObjectId: state.photosByObjectId.remove(payload.objectId)
        };
      } else {
        return state;
      }
    }
  },
  {
    localPhotosByLocalObjectId: OrderedMap(),
    photosByObjectId: OrderedMap()
  }
);

export default reducer;
