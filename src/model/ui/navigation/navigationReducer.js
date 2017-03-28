
import React from 'react';
import {
	AppRegistry,
	AsyncStorage,
	Button,
	StyleSheet,
	Text,
	View,
} from 'react-native';
import {
	NavigationActions,
	addNavigationHelpers,
	StackNavigator,
} from 'react-navigation';
import {
	Provider,
	connect,
} from 'react-redux';
import {
	createStore,
	combineReducers,
} from 'redux';
import {AppNavigator} from '../../../components/appNavigator/AppNavigator';

const initialAuthState = {isLoggedIn: false};

const initialNavState = AppNavigator.router.getStateForAction({ type: NavigationActions.INIT });


// const initialNavState = {
// 	index: 1,
// 	routes: [
// 		{key: 'InitA', routeName: 'MainTabs'},
// 		{key: 'InitB', routeName: 'Login'},
// 	],
// };

export default (state = initialNavState, action) => {
		if (action.type === 'Login') {
			return AppNavigator.router.getStateForAction(NavigationActions.back(), state);
		}
		if (action.type === 'Logout') {
			return AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
		}
		return AppNavigator.router.getStateForAction(action, state);
	};
