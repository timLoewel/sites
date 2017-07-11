/**
 * Created by tim on 22/11/16.
 */
import ReactNativeI18n from "react-native-i18n";
import type { Action } from "../types";

// import {USER_LOGIN_SUCCESS} from './auth';
import I18n from "../../assets/translations";
import { createAction, createReducer } from "redux-act";

export const submitProfileForm = createAction(
  "submitProfileForm: Submit Profile Form"
);

export const submitProfileOk = createAction(
  "submitProfileOk: Submit Profile OK"
);

export const submitProfileFailed = createAction(
  "submitProfileFailed: Submit Profile FAILED"
);

export const showLoginScreen = createAction(
  "showLoginScreen: show the login screen"
);
/**
 * the payload is the user profile, as returned from the server
 * @type {ActionCreator<P, M>}
 */
export const userLoginSuccess = createAction(
  "userLoginSuccess: user logged in successfully"
);

export const userLoginFailed = createAction(
  "userLoginFailed: user login failed"
);

export const userLogout = createAction("userLogout: user logged out");

const initialUser = { locale: ReactNativeI18n.locale };

const reducer = createReducer(
  {
    [userLoginSuccess]: (state, payload) => ({
      ...state,
      isLoggedIn: true,
      currentUser: payload.profile,
      auth0Token: payload.token,
      sessionToken: ((payload.profile || {}).userMetadata || {}).sessionToken,
      objectId: ((payload.profile || {}).userMetadata || {}).objectId
    }),
    [userLogout]: (state, payload) => ({
      ...state,
      isLoggedIn: false,
      currentUser: initialUser,
      auth0Token: null,
      sessionToken: null,
      objectId: null
    })
  },
  {
    isLoggedIn: false,
    currentUser: initialUser,
    auth0Token: null,
    sessionToken: null,
    objectId: null
  }
);

export default reducer;
