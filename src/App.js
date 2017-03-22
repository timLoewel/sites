/**
 * @flow
 */
import React from 'react';

import {
	AppRegistry,
} from 'react-native';
import {
	Provider,
} from 'react-redux';
import {
	persistStore,
} from 'redux-persist';

import {AppWithNavigationState} from './model/ui/navigation/AppNavigator';

import configureStore from './configureStore';
import {startGPS, stopGPS} from './model/geolocation/geolocationReducer';

class ReduxExampleApp extends React.Component {
	store = configureStore();

	render() {
		return (
				<Provider store={this.store}>
					<AppWithNavigationState />
				</Provider>
		);
	}

	componentDidMount() {
		this.store.dispatch(startGPS());
	}

	componentWillUnmount() {
		this.store.dispatch(stopGPS());
	}
}

AppRegistry.registerComponent('sites', () => ReduxExampleApp);