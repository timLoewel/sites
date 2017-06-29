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


class SingleSiteView extends React.Component {
	static navigationOptions = {
		tabBarLabel: 'Single Site'
	};

	render() {
		return (
				<Button
						onPress={() => this.props.navigation.navigate('NewPhoto')}
						title="take Photo"
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

export default connect(mapStateToProps, bindAction)(SingleSiteView);
