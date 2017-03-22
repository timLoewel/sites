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


class CommentsView extends React.Component {
	static navigationOptions = {
		tabBar: {
			label: 'Comments',
			// visible: false,
		},
	}

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
		setCurrentPhoto: (photoUri, photoWidth, photoHeight, orientation) =>
				dispatch(setNewRawPhotoLocalData({uri: photoUri, photoWidth: photoWidth, photoHeight: photoHeight, orientation:orientation})),
	};
}

export default connect(mapStateToProps, bindAction)(CommentsView);
