import React, {Component, PropTypes} from "react";
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	Image,
	Switch,
	TextInput,
	Picker,
	Slider,
	Dimensions,
	PixelRatio,
	InteractionManager,
} from "react-native";
import {connect} from 'react-redux';
import {LineStyleIcon as Icon} from '../../assets/icons';
import theme from '../../assets/themes/sites-theme';
import I18n from '../../assets/translations';
import moment from 'moment';
import {takeSnapshot} from "react-native-view-shot";
import TimerMixin from 'react-timer-mixin';
import {
	screenshotDone,
	errorOnPhoto,
	readyForScreenshot,
	doingScreenshot,
} from '../../model/ui/camera/cameraReducer';
//uri: "https://pbs.twimg.com/media/CpRgVFjWcAAvJbb.jpg:large",

const imageStyles = {
	root: {
		backgroundColor: "ghostwhite",
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'flex-start',
		flex: 1,
		flexWrap: 'wrap',

	},
	heading: {
		backgroundColor: theme.brandPrimary,// theme.brandPrimary
	},

	image: {},
	annotations: {
		flex: 1,
		backgroundColor: 'ghostwhite',
		flexDirection: 'column',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		//
	},
	textLine: {
		textAlign: "left",
		flexWrap: "wrap",
	}
};

const RATIO = PixelRatio.get();
const FONT_SIZE_FACTOR = 30;
const DEFAULT_QUALITY = 0.8;
/**
 * put this component into a View that is outside the visible area e.g. position: absolute, top:0, left: window.width
 *
 *
 *
 */
const RenderImage = React.createClass({
	mixins: [TimerMixin],

	propTypes: {
		// the image that should be rendered
		photoForRendering: PropTypes.shape({
			uri: PropTypes.string,
			height: PropTypes.number,
			width: PropTypes.number,
			orientation: PropTypes.number,
			createdAtMillis: PropTypes.number,
			// where the image can be retrieved. this is stamped into the image
			shareableUri: PropTypes.string,
			description: PropTypes.string,
			creatorObjectId: PropTypes.string,
			creatorName: PropTypes.string,
			site: PropTypes.object,
			selectedLocation: PropTypes.object,
			systemLocation: PropTypes.object,
		}),

	},
	_getStateForPhoto(photo) {
		if (photo) {
			const imageLayoutWidth = photo.width / RATIO;
			const imageLayoutHeight = photo.height / RATIO;

			// 30 is a constant chosen for readability of the rendered photos
			const fontSize = imageLayoutWidth / FONT_SIZE_FACTOR;
			return {
				imageLayoutWidth: imageLayoutWidth,
				imageLayoutHeight: imageLayoutHeight,
				fontSize: fontSize,
			}
		} else {
			return {};
		}

	},

	getInitialState: function () {
		if (!this.props.photoForRendering) {
			return {};
		}
		return this._getStateForPhoto(this.props.photoForRendering);
	},

	/**
	 *
	 * @param screenshotDimensions height, width
	 * @param targetWidth how wide should the photo be
	 * @param quality
	 * @param resultType     ,

	 * @returns {Promise.<string>}
	 */
	snapPhoto: function(screenshotDimensions, targetWidth:number, quality: number, resultType?: "file" | "base64" | "data-uri") {
		const q = quality || DEFAULT_QUALITY; //default 0.8
		const r = resultType || 'file';//default file
		const t = targetWidth || undefined;//default target is 1:1 the imageWidth
		const width = t?Math.min(t, screenshotDimensions.width): undefined;
		const height = t?screenshotDimensions.height * (width / screenshotDimensions.width):undefined;

		return takeSnapshot(this.refs.root,
				{
					format: 'jpg',
					height: height,
					width: width,
					quality: q,
					result: r,
				});
	},

	snapThumbnail: function(screenshotDimensions) {
		return this.snapPhoto(screenshotDimensions, 200, 0.3, 'data-uri');
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		const hadPhoto = this.props.photoForRendering !== undefined;
		const willHavePhoto = nextProps.photoForRendering !== undefined;
		const existenceChanged = (hadPhoto || willHavePhoto) && !(hadPhoto && willHavePhoto);  // xor
		const photosAreDifferent = existenceChanged || (hadPhoto && willHavePhoto && (this.props.photoForRendering.createdAtMillis !==
				nextProps.photoForRendering.createdAtMillis));
		// wait with the update, until the snapshot is done.
		return photosAreDifferent && !nextProps.isDoingScreenshot;
	},

	componentWillReceiveProps(nextProps) {
		const hadPhoto = this.props.photoForRendering !== undefined;
		const willHavePhoto = nextProps.photoForRendering !== undefined;
		const existenceChanged = (hadPhoto || willHavePhoto) && !(hadPhoto && willHavePhoto);  // xor
		const photosAreDifferent = existenceChanged || (hadPhoto && willHavePhoto &&
				this.props.photoForRendering.uriOriginalPhoto !== nextProps.photoForRendering.uriOriginalPhoto);

		if (photosAreDifferent && !nextProps.isDoingScreenshot) {
			// start new render for new snapshot
			this.setState(this._getStateForPhoto(nextProps.photoForRendering));
		} else {
			if (hadPhoto && nextProps.isReadyForScreenshot) {
				this._doScreenshot(nextProps.screenshotDimensions);
			}
		}

	},

	_doScreenshot: function(screenshotDimensions) {
		this.props.setDoingScreenshot();
		// the view is rendered and the photo ready callback is triggered while the image is still fading in.
		// the timeout is there to make sure, the image has completely appeared. the time was determined by trial and error.
		this.setTimeout(() => {
				this.snapThumbnail(screenshotDimensions).then(thumbnailData => {
				return this.snapPhoto(screenshotDimensions).then(uriPhotoLocal => {
					// both snapshots done
					const photoData = {...this.props.photoForRendering, thumbnailData, uriPhotoLocal};
					this.props.setScreenshotDone(photoData);
				});
			}).catch(error => {
				this.setState({snapping: false});
				this.props.errorOnPhoto(error);
			});
		}, 100);
	},


	_storeMeasurements: function(event) {
		let {x, y, width, height} = event.nativeEvent.layout;
		this.props.setReadyForScreenshot({height, width});
	},

	//
	// componentDitUpdate: function() {
	// 	this.doSnapshots(this.renderedImageHeight, this.renderedImageWidth);
	// }
	_getLongitudeLatitude: function(textStyle) {
		if (this.props.photoForRendering.selectedLocation && this.props.photoForRendering.selectedLocation.longitude) {
			return (<Text style={textStyle}>
				latitude: {this.props.photoForRendering.selectedLocation.latitude},
				longitude: {this.props.photoForRendering.selectedLocation.longitude},
				accuracy: {this.props.photoForRendering.selectedLocation.accuracy}
			</Text>);
		} else {
			return (<Text style={textStyle}>
				{I18n.t('renderImage.gpsLocationUnknown')}
			</Text>);
		}
	},

	_getCreatedAtString: function() {
		return moment(this.props.photoForRendering.createdAtMillis).format('Y MMM d HH:mm');
	},

	_getAddressString() {
		return ((this.props.photoForRendering.selectedLocation || {}).address || {}).formattedAddress ||
				I18n.t('renderImage.addressUnknown');
	},

	_onLoad() {
		console.log('image onLoad called');
	},

	render: function() {
		if (!this.props.photoForRendering) {
			return null;
		}
		const fontSizeImportant = this.state.fontSize;
		const fontSizeUnimportant = this.state.fontSize * 0.8;

		const lineHeightImportant = Math.ceil(fontSizeImportant * 1.8);
		const lineHeightUnimportant = Math.ceil(fontSizeUnimportant * 1.5);
		const textPadding = Math.ceil(this.fontSize);
		const textStyleUnimportant = {fontSize: fontSizeUnimportant, lineHeight: lineHeightUnimportant, color: 'grey'};
		const textStyleImportant = {fontSize: fontSizeImportant, lineHeight: lineHeightImportant, color: 'black'};
		const annotationEntry = {flexDirection: 'row', flex: 1, paddingBottom: Math.ceil(fontSizeImportant)};

		// const comment = `width: ${this.props.photoForRendering.width} height: ${this.props.photoForRendering.height}
		// orient: ${this.props.photoForRendering.orientation}`;
		return (
				<View ref="root" style={[{width: this.state.imageLayoutWidth, flex: 1, flexDirection: 'column'}, imageStyles.root]}
							onLayout={this._storeMeasurements} collapsable={false}>
					<View style={{backgroundColor: theme.brandPrimary, padding: textPadding, height: this.fontSize * 3}} collapsable={false}>
						<Text style={[textStyleUnimportant, {color: 'black'}]}>
							<Text style={textStyleUnimportant}>
								<Icon name="camera" style={{fontSize: this.fontSize, color: 'black'}}/>
							</Text> <Text
								style={{textAlign:'left', color: 'black', fontSize: fontSizeUnimportant}}>{this.props.photoForRendering.shareableUri}</Text>
						</Text>
					</View>

					<Image
							fadeDuration={0}
							style={[imageStyles.image, {width: this.state.imageLayoutWidth, height: this.state.imageLayoutHeight}]}
							source={{uri: 'file://' + this.props.photoForRendering.uriOriginalPhoto}}
							resizeMode="contain"
							onLoad={this._onLoad}
					/>
					<View style={[imageStyles.annotations, {padding: textPadding}]} collapsable={false}>
						<View style={annotationEntry} collapsable={false}>
							<Text style={textStyleImportant}>
								{this._getCreatedAtString()} {this.props.photoForRendering.creatorName}
							</Text>
						</View>
						<View style={[annotationEntry, {justifyContent: 'flex-start', alignItems: 'center', }]} collapsable={false}>
							<Image
									fadeDuration={0}
									style={{
										height: fontSizeImportant,
										width: fontSizeImportant,
										resizeMode: 'contain'
									}}
									source={require('../../assets/icons/map-site-marker.png')}/>
							<Text style={[textStyleImportant, {flex: 1}]}>
								{I18n.t('renderImage.site',{siteName: this.props.photoForRendering.site.name, sitePublicUrl: this.props.photoForRendering.site.url})}
							</Text>
						</View>
						<View style={[annotationEntry, {flexDirection: 'column'}]} collapsable={false}>
							<Text style={textStyleUnimportant}>
								{this._getAddressString()}
							</Text>
							{this._getLongitudeLatitude(textStyleUnimportant)}
						</View>
						<View style={annotationEntry} collapsable={false}>
							<Text style={textStyleImportant}>
								{this.props.photoForRendering.description}
							</Text>
						</View>
					</View>
				</View>);
	},
});

const mapStateToProps = state => ({
	photoForRendering: state.ui.cameraReducer.photosWaitingForRendering[0],
	isDoingScreenshot: state.ui.cameraReducer.isDoingScreenshot,
	isReadyForScreenshot: state.ui.cameraReducer.isReadyForScreenshot,
	screenshotDimensions: state.ui.cameraReducer.screenshotDimensions,
});

function bindAction(dispatch) {
	return {
		setReadyForScreenshot: (screenshotDimensions) => dispatch(readyForScreenshot(screenshotDimensions)),
		setDoingScreenshot: () => dispatch(doingScreenshot()),
		setScreenshotDone: (photoData) => dispatch(screenshotDone(photoData)),
		errorOnPhoto: (error) => dispatch(errorOnPhoto({source: 'RenderImage', error})),
	}
}

export default connect(mapStateToProps, bindAction)(RenderImage);

