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

class ReduxExampleApp extends React.Component {
	store = configureStore();

	render() {
		return (
				<Provider store={this.store}>
					<AppWithNavigationState />
				</Provider>
		);
	}
}

AppRegistry.registerComponent('sites', () => ReduxExampleApp);