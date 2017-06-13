/**
 * Created by tim on 10/03/17.
 */
import {connect} from 'react-redux';

import React from 'react';
import {
	AppRegistry,
	AsyncStorage,
	Button,
	StyleSheet,
	Text,
	View,
} from 'react-native';


class SitesView extends React.Component {
	static navigationOptions = {
		tabBar: {
			label: 'Sites',
			// visible: false,
		},
	};

	render() {
		return (
				<Button
						onPress={() => this.props.navigation.navigate('SingleSite')}
						title="go to site"
				/>
		);
	}
}

const mapStateToProps = state => ({
});

function bindAction(dispatch) {
	return {
	};
}

export default connect(mapStateToProps, bindAction)(SitesView);
