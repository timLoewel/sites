/**
 * Created by tim on 24/03/17.
 */

'use strict';

import React, {Component} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import CenterView from './CenterView';
import {connect} from 'react-redux';
import {showLoginScreen} from '../../model/profile/profileReducer';

class SignedInCheck extends Component {

	render() {
		if (this.props.isLoggedIn) {
			return (<View style={{flex: 1}}>
				{this.props.children}
			</View>)
		} else {
		return (<CenterView>
					<ActivityIndicator
							animating={true}
							size="large"
					/>
				</CenterView>
		);}
	}

	onComponentDidMount () {
		if (!this.props.isLoggedIn) {
			this.props.showLoginScreen();
		}
	}
}

const mapStateToProps = state => ({
	isLoggedIn: state.profile.isLoggedIn,
});

function bindAction(dispatch) {
	return {
		showLoginScreen: dispatch(showLoginScreen())
	};
}

export default connect(mapStateToProps, bindAction)(SignedInCheck);
