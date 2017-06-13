/**
 * @flow
 */
import React from 'react';

import {
	AppRegistry,
	UIManager,
	View,
	ActivityIndicator
} from 'react-native';

import {
	Provider,
} from 'react-redux';
import {
	persistStore,
} from 'redux-persist';

import {AppWithNavigationState} from './components/appNavigator/AppNavigator';
import CenterView from './components/basics/CenterView';

import SignedInCheck from './components/basics/SignedInCheck';

import configureStore from './model/store';
import {stopGPS} from './model/systemState/systemStateReducer';
import getDimensions from './utils/dimensions';
import RenderImage from './components/renderImage/RenderImage';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
const {width: windowWidth, height: windowHeight} = getDimensions();

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			store : undefined,
		}
		configureStore(() => console.log('configureStore.onComplete()'))
				.then(store => {
						this.setState({store: store});
						console.log('set store in app state');
					})
				.catch(error => {
					console.log('error on configuring the store', error);
				});
	}


	render() {
		if (!this.state.store) {
			return (
					<CenterView>
						<ActivityIndicator
								animating={true}
								size="large"
						/>
				</CenterView>
			)
		}
		return (
				<Provider store={this.state.store}>
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