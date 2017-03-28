'use strict';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import PhotoDataInputForm from './PhotoDataInputForm';
import {
	photographing,
	setAnnotatedPhotoData,
	resetLastPhoto,
 	errorOnPhoto
} from '../../model/ui/camera/cameraReducer';
import {updateLocation} from '../../model/geolocation/geolocationReducer';
import RenderImage from '../../utils/sitesPhotoRenderer';
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
								borderRadius: theme.footerHeight - 5,
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
							<Text style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
								<Icon name="camera" style={{fontSize: theme.fontSizeH2, color: 'black'}}/>
							</Text>
						</View>
					</TouchableHighlight>
				</View>
		);
	}

	onPhotoReady(thumbnailData, photoUri) {
		this.props.setAnnotatedPhotoData({createdAtMillis:this.props.localPhotoData.createdAtMillis, thumbnailData: thumbnailData, uri: photoUri});
	}

	renderPhotoRenderer() {
		if (!this.props.localPhotoData) {
			return;
		}
		return (
				<View style={{position: 'absolute', top: windowHeight + 10, left: 0}}>
					<RenderImage
							ref="renderImage"
							photoData={this.props.localPhotoData}
							photoDescription={this.props.photoDescription}
							creatorName={this.props.creatorName}
							siteName={this.props.siteName}
							systemlocation={this.props.systemLocation}
							selectedLocation={this.props.selectedLocation}
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
		this.props.resetLastPhoto();
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
	siteName: undefined,//state.ui.cameraReducer.siteName,
	selectedLocation: state.ui.cameraReducer.location,
	photoDescription: state.ui.cameraReducer.photoDescription,
	systemLocation: state.geolocation,
	creatorName: state.profile.currentUser.name,
	localPhotoData: state.ui.cameraReducer.localPhotoData,
});

function bindAction(dispatch) {
	return {
		setPhotographing: (photoTakingPromise) => dispatch(photographing(photoTakingPromise)),
		updateLocation: () => dispatch(updateLocation()),
		resetLastPhoto: () => dispatch(resetLastPhoto()),
		setAnnotatedPhotoData: (data:{thumbnailData:undefined, uri:undefined, createdAt:undefined}) => dispatch(setAnnotatedPhotoData(data)),
		errorOnPhoto: (error) => dispatch(errorOnPhoto({source: 'cameraView', error})),
	}
}
export default connect(mapStateToProps, bindAction)(CameraView);

