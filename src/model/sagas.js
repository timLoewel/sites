/**
 * Created by tim on 10/07/17.
 */
import { userLoginSuccess, userLoginFailed } from "./profile/profileReducer";
import { storeInitialized } from "./store";

import * as env from "../../env";
import Auth0Lock from "react-native-lock";
import { call, put, takeLatest, select } from "redux-saga/effects";

const clientId = env.AUTH0_CLIENT_ID;
const domain = env.AUTH0_DOMAIN;

if (!(clientId && domain)) {
  throw `Authentication not enabled: Auth0 configuration not provided clientId${clientId} domain ${domain}`;
}

const lock = new Auth0Lock({
  clientId,
  domain,
  useBrowser: true
});

createLoginPromise = options =>
  new Promise((resolve, reject) => {
    lock.show(options, (error, profile, token) => {
      if (error) {
        console.error("login error", error);
        reject({ error });
      } else {
        // Authentication worked!
        resolve({ profile, token });
      }
    });
  });

function* showLogin() {
  const { isLoggedIn, locale } = yield select(state => ({
    isLoggedIn: state.profile.isLoggedIn,
    locale: state.profile.currentUser.locale
  }));
  if (isLoggedIn) {
    return;
  }

  const options = {
    closable: true,
    language: locale,
    autofocus: true
  };
  const result = yield call(createLoginPromise, options);
  yield put(result.error ? userLoginFailed(result) : userLoginSuccess(result));
}

function* mySaga() {
  yield takeLatest(storeInitialized.getType(), showLogin);
}

export default mySaga;
