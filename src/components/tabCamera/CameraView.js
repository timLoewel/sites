'use strict';
import moment from 'moment';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import PhotoDataInputForm from './PhotoDataInputForm';
import {
	photographing,
	renderingDone,
	resetLastPhoto,
 	errorOnPhoto,
	rendering
} from '../../model/ui/camera/cameraReducer';
import {updateLocation} from '../../model/geolocation/geolocationReducer';
import RenderImage from '../../utils/RenderImage';
import {
	AppRegistry,
	Dimensions,
	StyleSheet,
	TouchableHighlight,
	View,
	Text,
	Image,
	KeyboardAvoidingView,
	ToastAndroid,
	ScrollView
} from 'react-native';
import Camera from 'react-native-camera';
import theme from '../../assets/themes/sites-theme';
import getDimensions from '../../utils/dimensions';
import I18n from '../../assets/translations';
import {Field, propTypes} from 'redux-form-actions';
import {LineStyleIcon as Icon} from '../../assets/icons';
import Geocoder from 'react-native-geocoder';
import {createShareableUri} from '../../server/ParseServer';
import { createAction, createReducer } from 'redux-act';


const ShutterButtonView = styled.View`
  height=50;
  width=50;
  border-radius=50;
  background-color=transparent;
  border-width=15;
  border-color=white;
`;

// <TouchableHighlight
// 		style={{backgroundColor: 'transparent', }}
// 		key="shutterButton"
// 		onPress={this.takePicture.bind(this)}
// >
// 	<View>
// 		<Text style={styles.capture}>
// 			<Icon name="camera" style={{fontSize: 60, color: theme.brandPrimary}}/>
// 		</Text>
// 	</View>
// </TouchableHighlight>;

const {width: windowWidth, height: windowHeight} = getDimensions();

class CameraView extends Component {

	renderShutter() {
		return (
				<View style={{flexDirection: 'row', justifyContent: 'center', height: theme.footerHeight, paddingTop: 5}}>
					<TouchableHighlight
							style={{
								backgroundColor: theme.brandPrimary,
								borderRadius: theme.footerHeight - 5,
								width: theme.footerHeight - 5,
								height: theme.footerHeight - 5,
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
							}}
							key="shutterButton"
							onPress={this.takePicture.bind(this)}
							activeOpacity={0.7}
							underlayColor="red"
					>
						<View>
							<Text style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
								<Icon name="camera" style={{fontSize: theme.fontSizeH2, color: 'black'}}/>
							</Text>
						</View>
					</TouchableHighlight>
				</View>
		);
	}

	onPhotoReady(renderedData) {
		this.props.renderingDone(renderedData);
	}

	renderPhotoRenderer() {
		if (!this.props.photoForRendering) {
			return;
		}
		const photoRef = "renderImage" + this.props.photoForRendering.createdAtMillis;
		console.log(this.props.photoForRendering.createdAtMillis + ' showing PhotoRenderer ' + photoRef);

		return (
				<View style={{position: 'absolute', top: 10, left: 0}}>
					<RenderImage
							ref={photoRef}
							photoForRendering={this.props.photoForRendering}
							onPhotoReady={this.onPhotoReady.bind(this)}
							onError={this.props.errorOnPhoto}
					/>
				</View>);

	}


	render() {
		console.log('cameraView render');
		return (
				<View style={{flex: 1}}>
					<ScrollView
							style={{flex: 1}}
							keyboardDismissMode="interactive"
							keyboardShouldPersistTaps="handled"
					>
						<View
								style={{
									flex: 1,
									height: windowHeight,
									flexDirection: 'column',
									justifyContent: 'space-between',
									alignItems: 'stretch',
								}}>
							<View style={{flex: 5}}>
								<Camera
										ref={(cam) => {
											this.camera = cam;
										}}
										style={styles.preview}
										aspect={Camera.constants.Aspect.fit}>
								</Camera>
							</View>
							<PhotoDataInputForm/>
							{this.renderShutter()}
						</View>
						<KeyboardAvoidingView mode="height"/>
					</ScrollView>
					{this.renderPhotoRenderer()}
				</View>
		);
	}

	componentDidMount() {
		this.props.updateLocation();
	}

	takePicture() {
		this.props.setPhotographing({
			capture: this.camera.capture(),
			createdAtMillis: moment().valueOf(),
			shareableUri: createShareableUri(),
			description: this.props.description,
			creatorObjectId: this.props.creatorObjectId,
			creatorName: this.props.creatorName,
			selectedLocation: this.props.selectedLocation,
			systemLocation: this.props.systemLocation,
			siteObjectId: undefined,
			siteName: '',

		});
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	preview: {
		top: 0,
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width
	},
	capture: {
		flex: 0,
		backgroundColor: 'transparent',
		padding: 10,
		margin: 40
	}
});


const mapStateToProps = state => ({
	isRendering: state.ui.cameraReducer.isRendering,
	siteName: undefined,//state.ui.cameraReducer.siteName,
	selectedLocation: state.ui.cameraReducer.selectedLocation,
	description: state.ui.cameraReducer.description,
	systemLocation: state.geolocation.position,
	creatorObjectId: state.profile.currentUser.parse_objectId,
	creatorName: state.profile.currentUser.name,
	photoForRendering: state.ui.cameraReducer.photosWaitingForRendering.get(0),
});

function bindAction(dispatch) {
	return {
		setPhotographing: (photoTakingPromise) => dispatch(photographing(photoTakingPromise)),
		setRendering: () => dispatch(rendering()),
		updateLocation: () => dispatch(updateLocation()),
		resetLastPhoto: () => dispatch(resetLastPhoto()),
		renderingDone: (photoData) => dispatch(renderingDone(photoData)),
		errorOnPhoto: (error) => dispatch(errorOnPhoto({source: 'cameraView', error})),
	}
}
export default connect(mapStateToProps, bindAction)(CameraView);

