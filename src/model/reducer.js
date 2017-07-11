import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import uiReducer from "./ui/uiReducer";
import profileReducer from "./profile/profileReducer";
import systemStateReducer from "./systemState/systemStateReducer";
import photoReducer from "./photo/photoReducer";
import siteReducer from "./site/siteReducer";
import serverReducer from "./server/serverReducer";
import serverSocketReducer from "./server/serverSocketReducer";
import geolocationReducer from "./systemState/geolocationReducer";

const initialAuthState = { isLoggedIn: false };

export default combineReducers({
  ui: uiReducer,
  form: formReducer,
  systemState: systemStateReducer,
  geolocation: geolocationReducer,
  profile: profileReducer,
  photo: photoReducer,
  site: siteReducer,
  server: serverReducer,
  serverSocket: serverSocketReducer
});
