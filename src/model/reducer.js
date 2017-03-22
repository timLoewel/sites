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

const initialAuthState = {isLoggedIn: false};


export default combineReducers({
	ui: uiReducer,
	form: formReducer,
	geolocation: geolocationReducer,
	profile: profileReducer,
	auth: (state = initialAuthState, action) => {
		if (action.type === 'Login') {
			return {...state, isLoggedIn: true};
		}
		if (action.type === 'Logout') {
			return {...state, isLoggedIn: false};
		}
		return state;
	},
});