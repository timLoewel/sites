/**
 * Created by tim on 20/04/17.
 */
import { createAction, createReducer } from "redux-act";

import { subscribeToQuery } from "./serverSocketReducer";

/**
 * upload all local data to the server
 *
 */
export const uploadLocalData = createAction("upload local data to server");

export const addObject = createAction(
  "addObject: new or updated object from server"
);

export const removeObject = createAction(
  "removeObject: object removed by server"
);

const reducer = createReducer(
  {
    [subscribeToQuery]: (state, payload) => ({
      nextRequestId: state.nextRequestId + 1,
      requestIds: {
        ...state.requestIds,
        [payload]: state.nextRequestId
      }
    })
  },
  {
    nextRequestId: 0,
    requestIds: {}
  }
);

export default reducer;
