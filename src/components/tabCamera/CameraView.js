'use strict';
import moment from 'moment';

import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components/native';
import PhotoDataInputForm from './PhotoDataInputForm';
import {getLastPhotoThumbnail} from '../../model/photo/photoReducer';

import {
	photographing,
	renderedPhotoReady,
	resetLastPhoto,
	errorOnPhoto,
	rendering
} from '../../model/ui/camera/cameraReducer';
import {updateLocation} from '../../model/geolocation/geolocationReducer';
import RenderImage from '../renderImage/RenderImage';
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
import {createShareableImageUri} from '../../server/ParseServer';
import currentSite from '../../model/site/currentSite';
import {addSite, createNewSite} from '../../model/site/siteReducer';
import {NavigationActions} from 'react-navigation';

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

	_renderShutterAndPhotosButton() {
		const buttonSize = theme.btnHeight;

		var goToAlbum;
		if (this.props.lastPhotoThumbnail) {
			goToAlbum = (
					<Image
							style={{
								width: buttonSize,
								height: buttonSize,
								borderRadius: buttonSize,
							}}
							source={{uri: this.props.lastPhotoThumbnail}}
							resizeMode="cover"
					/>
			);
		} else {
			goToAlbum = (
					<View>
						<Text style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
							<Icon name="photo" style={{fontSize: theme.fontSizeH2, color: 'white'}}/>
						</Text>
					</View>
			);
		}
		return (
				<View style={{
					flexDirection: 'row',
					alignSelf: 'stretch',
					justifyContent: 'space-between',
					height: theme.btnHeight + theme.defaultMargin * 2
				}}>
					<View style={{flex: 1, backgroundColor: 'transparent'}}/>
					<View style={{
						flex: 1,
						flexDirection: 'row',
						backgroundColor: 'transparent',
						justifyContent: 'center',
						padding: theme.defaultMargin
					}}>
						<TouchableHighlight
								style={{
									backgroundColor: theme.brandPrimary,
									borderRadius: buttonSize,
									width: buttonSize,
									height: buttonSize,
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								key="shutterButton"
								onPress={this._takePicture.bind(this)}
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
					<View style={{
						flex: 1,
						flexDirection: 'row',
						backgroundColor: 'transparent',
						justifyContent: 'flex-end',
						padding: theme.defaultMargin
					}}>
						<TouchableHighlight
								style={{
									backgroundColor: '#AAAAAA44',
									borderRadius: buttonSize,
									width: buttonSize,
									height: buttonSize,
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								key="goToPhotos"
								onPress={this._goToPhotos.bind(this)}
								activeOpacity={0.7}
								underlayColor="grey"
						>
							{goToAlbum}
						</TouchableHighlight>
					</View>
				</View>
		);
	}


	_goToPhotos() {
	this.props.gotoPhotos();
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
							{this._renderShutterAndPhotosButton()}

						</View>
						<KeyboardAvoidingView mode="height"/>
					</ScrollView>
				</View>
		);
	}

	componentDidMount() {
		this.props.updateLocation();
	}

	_getSite() {
		var site = this.props.currentSite;
		if (!site) {
			site = createNewSite(this.props.selectedLocation, this.props.systemLocation);
			this.props.addSite(site);
		}
		return site;
	}

	_takePicture() {
		this.props.setPhotographing({
			capture: this.camera.capture(),
			createdAtMillis: moment().valueOf(),
			shareableUri: createShareableImageUri(),
			description: this.props.description,
			creatorObjectId: this.props.creatorObjectId,
			creatorName: this.props.creatorName,
			selectedLocation: this.props.selectedLocation,
			systemLocation: this.props.systemLocation,
			site: this._getSite(),
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
	siteName: undefined,//state.ui.cameraReducer.siteName,
	selectedLocation: state.ui.cameraReducer.selectedLocation || state.geolocation.position,
	description: state.ui.cameraReducer.description,
	systemLocation: state.geolocation.position,
	creatorObjectId: state.profile.currentUser.parse_objectId,
	creatorName: state.profile.currentUser.name,
	photoForRendering: state.ui.cameraReducer.photosWaitingForRendering.get(0),
	currentSite: currentSite(state),
	lastPhotoThumbnail: getLastPhotoThumbnail(state),
});

function bindAction(dispatch) {
	return {
		setPhotographing: (photoTakingPromise) => dispatch(photographing(photoTakingPromise)),
		updateLocation: () => dispatch(updateLocation()),
		renderingDone: (photoData) => dispatch(renderedPhotoReady(photoData)),
		addSite: (site) => dispatch(addSite(site)),
		gotoPhotos: () => dispatch(NavigationActions.navigate({routeName:'Photos'})),
	}
}
export default connect(mapStateToProps, bindAction)(CameraView);

