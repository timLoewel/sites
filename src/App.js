/**
 * @flow
 */
import React from 'react';

import {
	AppRegistry,
	UIManager,
} from 'react-native';

import {
	Provider,
} from 'react-redux';
import {
	persistStore,
} from 'redux-persist';

import {AppWithNavigationState} from './components/appNavigator/AppNavigator';

import SignedInCheck from './components/basics/SignedInCheck';

import configureStore from './store';
import {startGPS, stopGPS} from './model/geolocation/geolocationReducer';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class App extends React.Component {
	store = configureStore();

	render() {
		return (
				<Provider store={this.store}>
					<SignedInCheck>
						<AppWithNavigationState />
					</SignedInCheck>
				</Provider>
		);
	}

	componentDidMount() {
//		SplashScreen.hide();

		this.store.dispatch(startGPS());

	}

	componentWillUnmount() {
		this.store.dispatch(stopGPS());
	}
}

AppRegistry.registerComponent('sites', () => App);