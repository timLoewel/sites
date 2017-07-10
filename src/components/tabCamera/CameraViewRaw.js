/**
 * Created by tim on 15/06/17.
 */
'use strict';
// @flow

import moment from 'moment';

import React, {Component} from 'react';
import UserPointer from '../../model/PointerTypes';

import {
	Dimensions,
	StyleSheet,
	TouchableHighlight,
	View,
	Text,
	Image,
	KeyboardAvoidingView,
	ToastAndroid,
	ScrollView,
	TextInput
} from 'react-native';
import Camera from 'react-native-camera';
import theme from '../../assets/themes/sites-theme';
import getDimensions from '../../utils/dimensions';
import I18n from '../../assets/translations';
import {LineStyleIcon as Icon} from '../../assets/icons';
import {createShareableImageUri} from '../../model/server/parseServer';
import {addNewLocalSite, createNewSite} from '../../model/site/siteReducer';
import {NULL_LOCATION, Location} from '../../model/systemState/geolocationReducer';
import TouchableItem from '../../../node_modules/react-navigation/lib-rn/views/TouchableItem';


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



/**
 * shows a photo viewfinder and annotation input and triggers taking the photo and rendering it together
 * with the annotations.
 *
 * Algorithm:
 *
 * takePhoto Promise
 * => put new photo in render queue in cameraState.photosWaitingForRendering
 * => render the image with the RenderImage component, which is positioned in the main App View
 * => when the image is rendered, the final size is stored in the cameraState.screenshotDimensions
 * => then two screenshots are done. one in thumbnail size, the other so that the image stays in original size
 *
 */
class CameraView extends Component {

	static navigationOptions = {
		tabBarLabel: 'Camera',
		tabBarVisible:false,
	};

	props: {
		selectedLocation: Location,
		description: string,
		onSiteLocation: string,
		systemLocation: Location,
		currentSite: {
			localObjectId: string,
			name: string,
			searchablePosition: SearchablePosition,
			selectedLocation: Location,
			systemLocation: Location,
			creator: UserPointer,
			publicUrl: string
		},
		lastPhotoThumbnail: string,

		// Actions
		setPhotographing: (any) => void,
		addNewLocalSite: (any) => void,
		gotoPhotos:(any) => void,
		gotoSelectSite:(any) => void,
		setPhotoLocation: (any) => void,
		setPhotoDescription: (string) => void,
		setOnSiteLocation: (string) => void
	};
	constructor(props) {
		super(props);
		this.state = {
			descriptionFocused : false,
		}
	}

	_onDescriptionFocus() {
		this.setState({descriptionFocused: true});
	}
	_onDescriptionBlur() {
		this.setState({descriptionFocused: false});
	}
	_renderDescriptionInput() {
		const fontSize = this.state.descriptionFocused ? theme.inputFontSize : theme.fontSizeSmall;
		return (
				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch',}}>
					<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
						<Text style={{fontSize: theme.fontSizeBase, fontWeight: 'bold'}}>{I18n.t('camera.descriptionTitle')}</Text>
						<View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
							<TextInput
									placeholderTextColor={theme.subtitleColor}
									style={{flex: 1, fontSize: fontSize, backgroundColor: theme.inputBGColor, textAlign: 'left', textAlignVertical: 'top'}}
									onChangeText={this.props.setPhotoDescription}
									onBlur={this._onDescriptionBlur.bind(this)}
									onFocus={this._onDescriptionFocus.bind(this)}
									value={this.props.description}
									placeholder={I18n.t('camera.thisIsAppendedToPhoto')}
									multiline={true}
									numberOfLines={5}
									maxLength={280}
									selectTextOnFocus={true}
									underlineColorAndroid="transparent"
							/>
						</View>
					</View>

				</View>
		);
	}
	_focusOnSiteLocation(){
		this.refs.onSiteLocation.focus();
		// console.log(this.refs);
	}

	_getSiteName() {
		if (this.props.currentSite.name === ' noSite') {
			return I18n.t('camera.noSite');
		} else {
			return this.props.currentSite.name;
		}
	}

	_renderShutterButtonRow(){
		const buttonSize = theme.btnHeight * 0.75;
		const shutterButtonSize = theme.btnHeight;

		let goToAlbum;
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
					<View style={{ // container of shutter button row
						flexDirection: 'row',
						alignSelf: 'stretch',
						justifyContent: 'space-between',
						height: theme.btnHeight + theme.defaultMargin * 2
					}}>
						<View style={{ // first column, locations
							flex: 3,
							backgroundColor: 'transparent',
							flexDirection: 'column',
							justifyContent: 'space-between',
							margin: theme.defaultMargin
						}}>
							<View
									style={{ // row with indoor location
										flex:1,
										backgroundColor: '#AAAAAA44',
										borderRadius: theme.fontSizeH1/4,
										flexDirection: 'row',
										justifyContent: 'flex-start',
										alignItems: 'center',
										height: theme.inputHeightSmall,
										marginBottom: 2,
										padding: 1,
									}}
									key="setIndoorLocation"
							>
								<View style={{// row with indoor location
									flex: 4,
									flexDirection: 'row',
									backgroundColor: 'transparent',
									justifyContent: 'flex-start',
									height: theme.inputHeightSmall,
									padding: 0
								}}>
									<TouchableHighlight
											style={{width:theme.fontSizeH2, height: theme.fontSizeH2}}
										onPress={this._focusOnSiteLocation.bind(this)}
									>
										<Icon name="indoor-position" style={{width:theme.fontSizeH2, fontSize: theme.fontSizeH1, color: 'white'}}/>
									</TouchableHighlight>
									<TextInput
											ref="onSiteLocation"
											placeholderTextColor={theme.subtitleColor}
											style={{
												flex:1,
												height: theme.lineHeight,
												lineHeight:theme.lineHeight,
												backgroundColor: 'transparent',
												fontSize:theme.fontSizeSmall,
												alignSelf: 'stretch',
												textAlign: 'left',
												textAlignVertical: 'center',
												marginLeft: theme.defaultMargin,
												padding: 0
											}}
											onChangeText={this.props.setOnSiteLocation}
											value={this.props.onSiteLocation}
											placeholder={I18n.t('camera.onSiteLocation')}
											multiline={false}
											numberOfLines={1}
											maxLength={280}
											selectTextOnFocus={true}
											underlineColorAndroid="transparent"
											returnKeyType="done"
									/>
								</View>

							</View>
							<TouchableHighlight
										style={{ // row with site
											flex:1,
											backgroundColor: '#AAAAAA44',
											borderRadius: theme.fontSizeH1/4,
											flexDirection: 'row',
											justifyContent: 'flex-start',
											alignItems: 'center',
											height: theme.fontSizeH1,
											marginTop: 2
										}}
										key="setSite"
										onPress={this._goToSelectSite.bind(this)}
										activeOpacity={0.7}
										underlayColor="grey"
								>
								<View style={{// row with site
									flex: 1,
									flexDirection: 'row',
									backgroundColor: 'transparent',
									justifyContent: 'flex-start',
								}}>
									<Icon name="site-marker" style={{width:theme.fontSizeH2, fontSize: theme.fontSizeH1, color: 'white'}}/>
									<Text style={{fontSize:theme.fontSizeSmall, alignSelf: 'stretch', textAlign: 'left',textAlignVertical: 'center', marginLeft: theme.defaultMargin}}>
										{this._getSiteName()}</Text>
								</View>
							</TouchableHighlight>

						</View>
						<View style={{// shutter
							flex: 1,
							flexDirection: 'row',
							backgroundColor: 'transparent',
							justifyContent: 'center',
							padding: theme.defaultMargin
						}}>
							<TouchableHighlight
									style={{
										backgroundColor: theme.brandPrimary,
										borderRadius: shutterButtonSize,
										width: shutterButtonSize,
										height: shutterButtonSize,
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
						<View style={{// go to photos
							flex: 3,
							flexDirection: 'row',
							backgroundColor: 'transparent',
							justifyContent: 'flex-end',
							alignItems: 'flex-end',
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
	_renderBottomUserInput() {
		return (
				<View	style = {{ // all Input
					flex: 2,
					flexDirection: 'column',
					justifyContent: 'space-between',
					backgroundColor: theme.inputBGColor}}
				>
					{this._renderDescriptionInput()}
					{this.state.descriptionFocused ? undefined : this._renderShutterButtonRow()}
				</View>)
	}


	_goToPhotos() {
		this.props.gotoPhotos();
	}

	_goToSelectSite() {
		this.props.gotoSelectSite();
	}

	render() {
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
							{this._renderBottomUserInput()}

						</View>
						<KeyboardAvoidingView mode="height"/>
					</ScrollView>
				</View>
		);
	}

	_getSite() {
		let site = this.props.currentSite;
		if (site.name === 'noSite' && this.props.selectedLocation !== NULL_LOCATION) {
			site = createNewSite(this.props.selectedLocation,
					this.props.systemLocation, this.props.creator.objectId);
			this.props.addNewLocalSite(site);
		}
		return site;
	}

	_takePicture() {
		this.props.setPhotographing({
			capture: this.camera.capture(),
			createdAtMillis: moment().valueOf(),
			shareableUri: createShareableImageUri(),
			description: this.props.description,
			creatorObjectId: this.props.creator.objectId,
			creatorName: this.props.creator.name,
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



export default CameraView;
