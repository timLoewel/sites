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

import configureStore from './model/store';
import {stopGPS} from './model/systemState/systemStateReducer';
import getDimensions from './utils/dimensions';
import RenderImage from './components/renderImage/RenderImage';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
const {width: windowWidth, height: windowHeight} = getDimensions();

class App extends React.Component {
	store = configureStore(() => console.log('configureStore.onComplete()'));

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
	}

	componentWillUnmount() {
		this.store.dispatch(stopGPS());
	}
}

AppRegistry.registerComponent('sites', () => App);