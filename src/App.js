/**
 * @flow
 */
import React from 'react';

import {
	AppRegistry,
	UIManager,
	View,
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
import getDimensions from './utils/dimensions';
import RenderImage from './components/renderImage/RenderImage';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
const {width: windowWidth, height: windowHeight} = getDimensions();

class App extends React.Component {
	store = configureStore();

	render() {
		return (
				<Provider store={this.store}>
					<SignedInCheck>
						<AppWithNavigationState />
						<View style={{position: 'absolute', top: windowHeight + 10, left: 0}}>
							<RenderImage/>
						</View>
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