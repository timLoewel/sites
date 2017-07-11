/**
 * Created by tim on 16/03/17.
 */
//@flow
import { createAction, createReducer } from "redux-act";
import { OrderedMap } from "immutable";
import { randomString } from "../../utils/objectId";
import { createShareableSiteUri } from "../server/parseServer";
import { addObject, removeObject } from "../server/serverReducer";
import type { IObjectId, ILocation, ISite } from "../ModelTypes";

export const SITE = "Site";
/**
 * payload: objectId
 */
export const setSite = createAction("setSite: set the site");

/**
 * called, when a new site was added locally
 * @param site
 * @returns {{type: *, payload: {objectId: string, createdAt: string, updatedAt: string, location: {}, name: string, color: string, creatorObjectId: string, creatorName: string, description: string}}}
 */
export const addNewLocalSite = createAction(
  "addNewLocalSite: create a site in the client"
);

/**
 * save to server successfull
 */
export const saveSiteJsonToServerDone = createAction(
  "saveSiteJsonToServerDone: saved site to server"
);

/**
 * creates a new site object, at the site of the current systemState.
 * does not add the site to the state
 */
export const createNewSite = (
  selectedLocation: ILocation,
  systemLocation: ILocation,
  creatorId: IObjectId
): ISite => {
  const localObjectId: IObjectId = (randomString(4): IObjectId);
  return {
    localObjectId: localObjectId,
    name: localObjectId,
    searchableLocation: {
      __type: "GeoPoint",
      longitude: selectedLocation.longitude,
      latitude: selectedLocation.latitude
    },
    selectedLocation,
    systemLocation,
    creator: {
      __type: "Pointer",
      className: "_User",
      objectId: creatorId
    },
    publicUrl: createShareableSiteUri()
  };
};

const reducer = createReducer(
  {
    [addNewLocalSite]: (state, payload) => ({
      localSitesByLocalObjectId: state.localSitesByLocalObjectId.set(
        payload.localObjectId,
        payload
      ),
      sitesByObjectId: state.sitesByObjectId
    }),
    [saveSiteJsonToServerDone]: (state, payload) => ({
      localSitesByLocalObjectId: state.localSitesByLocalObjectId.delete(
        payload.localObjectId
      ),
      sitesByObjectId: state.sitesByObjectId.set(payload.objectId, {
        ...state.localSitesByLocalObjectId.get(payload.localObjectId),
        ...payload
      })
    }),
    [addObject]: (state, payload) => {
      if (payload.className === SITE) {
        return {
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
          localSitesByLocalObjectId: state.localSitesByLocalObjectId,
          sitesByObjectId: state.sitesByObjectId.remove(payload.objectId)
        };
      } else {
        return state;
      }
    }
  },
  {
    localSitesByLocalObjectId: OrderedMap(),
    sitesByObjectId: OrderedMap()
  }
);

export default reducer;
