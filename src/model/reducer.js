import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form-actions';

import {
	NavigationActions,
	addNavigationHelpers,
	StackNavigator,
} from 'react-navigation';
import uiReducer from './ui/uiReducer';
import profileReducer from './profile/profileReducer';
import geolocationReducer from './geolocation/geolocationReducer';
import photoReducer from './photo/photoReducer';

const initialAuthState = {isLoggedIn: false};


export default combineReducers({
	ui: uiReducer,
	form: formReducer,
	geolocation: geolocationReducer,
	profile: profileReducer,
	photo: photoReducer,
});