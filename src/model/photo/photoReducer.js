/**
 * Created by tim on 15/03/17.
 */
import { createAction, createReducer } from 'redux-act';
import Immutable from 'seamless-immutable';

const reducer = createReducer({
  [setServerPhotoData]: (state, payload) => state + payload,
}, Immutable.from({}));

export default reducer;