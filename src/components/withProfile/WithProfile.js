/**
 * Created by tim on 22/03/17.
 */
import {connect} from 'react-redux';
import showLogin from '../../utils/auth0';

import React from 'react';
import {
	AppRegistry,
	AsyncStorage,
	Button,
	StyleSheet,
	Text,
	View,
} from 'react-native';

/**
 * Wrap your view with this component, if you want the user to be logged in for using the view.
 * works with the model/profile/auth state and calls auth0 api for login / signup
 */
class WithProfile extends React.Component {

	componentWillReceiveProps(newProps) {

		if (!newProps.isLoggedIn) {
			showLogin(this.props.locale, this.props.onUserLoginSuccess, this.props.onUserLoginError);
		}
	}

	render() {
		return super.render();
	}
}
const mapStateToProps = state => ({
	isLoggedIn: state.profile.isLoggedIn,
});

function bindAction(dispatch) {
	return {
	};
}

export default connect(mapStateToProps, bindAction)(PhotosView);
