'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import PhotoDataInputForm from './PhotoDataInputForm';
import {photographing} from '../../model/ui/camera/cameraReducer';
import {updateLocation} from '../../model/geolocation/geolocationReducer';

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
							borderRadius: theme.footerHeight- 5,
							width: theme.footerHeight - 5,
							height: theme.footerHeight - 5,
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							}}
							key="shutterButton"
							onPress={this.takePicture.bind(this)}
							activeOpacity={0.1}
							underlayColor="red"
					>
						<View>
							<Text style={{flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
								<Icon name="camera" style={{fontSize: theme.fontSizeH1, color: 'black'}}/>
							</Text>
						</View>
					</TouchableHighlight>
				</View>
		);
	}

	getFormattedAddress = () => {
		return (this.props.currentLocation && this.props.currentLocation.formattedAddress) || '-';
	}

	renderPhotoRenderer() {
		if (!this.props.shareableUri || !this.props.localPhotoUri) {
			return;
		}
		const longitude = this.props.location && this.props.location.longitude || '';
		const latitude = this.props.location && this.props.location.latitude || '';
		console.log('rendering image. ' + this.props.localPhotoUri);			//windowWidth + 1
		return (
				<View style={{position: 'absolute',top: 0, left: 100 }}>
					<RenderImage
							ref="renderImage"
							allDataComplete={true}
							sourceImageUri={this.props.localPhotoUri}
							shareableUri={this.props.shareableUri}
							creationDateString={this.props.serverPhotoCreationDate}
							creatorName={this.props.creatorName}
							siteName={this.props.siteName}
							addressOneLine={this.getFormattedAddress()}
							locationLongitude={longitude}
							locationLatitude={latitude}
							photoHeight={this.props.photoHeight}
							photoWidth={this.props.photoWidth}
							photoOrientation={this.props.photoOrientation}
							callWhenReady={(renderImage) => {
											renderImage.snapIt().then(result => {
												ToastAndroid.show(I18n.t('camera.messagePhotoTaken'), ToastAndroid.SHORT);
												console.log('rendered snapshot from original ' +
													this.props.localPhotoUri + ' to result ' + result);
												this.props.uploadPhotoAndUpdate(this.props.photoObjectId, result);
											}).catch(err => {
												console.log('ERROR could not render snapshot');
												console.log(err)
											});
										}
									}
					/>
				</View>);

	}


	render() {

		return (
				<View style={{flex:1}}>
					{this.renderPhotoRenderer}
					<ScrollView
							style={{flex:1}}
							keyboardDismissMode="interactive"
							keyboardShouldPersistTaps="handled"
					>
						<View
								style={{flex:1, height: windowHeight, flexDirection: 'column', justifyContent: 'space-between', alignItems: 'stretch', }}>
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
				</View>
		);
	}

	componentDidMount() {
		this.props.updateLocation();
	}

	takePicture() {
		this.props.setPhotographing(this.camera.capture());
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
	// currentLocation: state.ui.geoLocationReducer.get('position'),
	siteName: 'site',//state.site.currentSiteName,
	location: {longitude: 13.4261454, latitude: 52.5075419},//state.geolocation.location,
	creatorName: 'creator full name',//state.profile.fullName,
	localPhotoUri: state.ui.cameraReducer.localPhotoData.uri,
	photoHeight: state.ui.cameraReducer.localPhotoData.photoHeight,
	photoWidth: state.ui.cameraReducer.localPhotoData.photoWidth,
	photoOrientation: state.ui.cameraReducer.localPhotoData.orientation,
	photoObjectId: state.ui.cameraReducer.localPhotoData.photoObjectId,
	shareableUri: state.ui.cameraReducer.serverPhotoData.shareableUri,
	serverPhotoCreationDate: state.ui.cameraReducer.serverPhotoData.creationDate,
});

function bindAction(dispatch) {
	return {
		setPhotographing: (photoTakingPromise) => dispatch(photographing(photoTakingPromise)),
		updateLocation: () => dispatch(updateLocation())
	}
}
export default connect(mapStateToProps, bindAction)(CameraView);

