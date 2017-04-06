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
import {LineStyleIcon as Icon} from '../../assets/icons';
import theme from '../../assets/themes/sites-theme';
import I18n from '../../assets/translations';
import moment from 'moment';
import delayPromise from '../../utils/delayPromise';
import {takeSnapshot} from "react-native-view-shot";
import TimerMixin from 'react-timer-mixin';

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


/**
 * put this component into a View that is outside the visible area e.g. position: absolute, top:0, left: window.width
 */
export default RenderImage = React.createClass({
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
		onSnapReady: PropTypes.func,
		onError: PropTypes.func,
	},

	getInitialState: function () {
		const ratio = PixelRatio.get();
		const imageLayoutWidth = this.props.photoForRendering.width / ratio;
		const imageLayoutHeight = this.props.photoForRendering.height / ratio;

		// 30 is a constant chosen for readability of the rendered photos
		const fontSize = imageLayoutWidth / 30;
		return {
			imageLayoutWidth: imageLayoutWidth,
			imageLayoutHeight: imageLayoutHeight,
			ratio: ratio,
			fontSize: fontSize,
			isImageReadyForRender: false, // the image was loaded
			snapping: false, // semaphore, so that we do not snap the same image twice, if a render happens during snapping
		}
	},

	/**
	 *
	 * @param renderedImageHeight
	 * @param renderedImageWidth
	 * @param targetWidth
	 * @param quality
	 * @param resultType
	 * @returns {Promise.<string>}
	 */
	snapPhoto: function(renderedImageHeight, renderedImageWidth, targetWidth, quality, resultType) {
		const q = quality || 0.8; //default 0.8
		const r = resultType || 'file';//default file
		const t = targetWidth || renderedImageWidth;//default target is 1:1 the imageWidth
		const width = Math.min(t, renderedImageWidth);
		const height = renderedImageHeight * (width / renderedImageWidth);

		return takeSnapshot(this.refs.root,
				{
					format: 'jpg',
					height: height,
					width: width,
					quality: q,
					result: r,
				});
	},

	snapThumbnail: function(renderedImageHeight, renderedImageWidth) {
		return this.snapPhoto(renderedImageHeight, renderedImageWidth, 200, 0.3, 'data-uri');
	},

	shouldComponentUpdate: function(nextProps, nextState) {

		if (this.props.photoForRendering.createdAtMillis !== nextProps.photoForRendering.createdAtMillis && !nextState.snapping) {
				return true;
		} else {
			if (!nextState.snapping) {
				this._trySnap(nextState);
			}
			return false;
		}
	},

	doSnapshots: function(renderedImageHeight, renderedImageWidth) {
		// the view is rendered and the photo ready callback is triggered while the image is still fading in.
		// the timeout is there to make sure, the image has completely appeared. the time was determined by trial and error.
		this.setTimeout(() => {
			// we are snapping, do not go in here again.
				this.setState({snapping: true});
				this.snapThumbnail(renderedImageHeight, renderedImageWidth).then(thumbnailData => {
				return this.snapPhoto(renderedImageHeight, renderedImageWidth).then(uriPhotoLocal => {
					// both snapshots done
					this.setState({snapping: false, isImageReadyForRender: false});
					if (this.props.onSnapReady) {
						const photoData = {...this.props.photoForRendering, thumbnailData, uriPhotoLocal};
						this.props.onSnapReady(photoData);
					}
				});
			}).catch(error => {
				this.setState({snapping: false, isImageReadyForRender: false});
				return this.props.onError && this.props.onError(error);
			});
		}, 700);
	},


	_trySnap: function(state){
		if (this.props.onSnapReady
				&& state.renderedImageHeight
				&& state.renderedImageWidth
				&& state.isImageReadyForRender
				&& !state.snapping) {
			// HACK! the state will be handed back
			// 	state.snapping = true;
			this.doSnapshots(state.renderedImageHeight, state.renderedImageWidth);
		}
		else {
		}
	},

	_storeMeasurements: function(event) {
		let {x, y, width, height} = event.nativeEvent.layout;
		this.setState({renderedImageHeight: height, renderedImageWidth: width, isImageReadyForRender: true});
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
				I18n.t('renderImage.addressUnknown');;
	},

	render: function() {
		const fontSizeImportant = this.state.fontSize;
		const fontSizeUnimportant = this.state.fontSize * 0.8;

		const lineHeightImportant = Math.ceil(fontSizeImportant * 1.8);
		const lineHeightUnimportant = Math.ceil(fontSizeUnimportant * 1.5);
		const textPadding = Math.ceil(this.fontSize);
		const textStyleUnimportant = {fontSize: fontSizeUnimportant, lineHeight: lineHeightUnimportant, color: 'grey'};
		const textStyleImportant = {fontSize: fontSizeImportant, lineHeight: lineHeightImportant, color: 'black'};
		const annotationEntry = {flexDirection: 'row', flex: 1, paddingBottom: Math.ceil(fontSizeImportant)};

		const comment = `width: ${this.props.photoForRendering.width} height: ${this.props.photoForRendering.height} 
		orient: ${this.props.photoForRendering.orientation}`;
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
							style={[imageStyles.image, {width: this.state.imageLayoutWidth, height: this.state.imageLayoutHeight}]}
							source={{uri: 'file://' + this.props.photoForRendering.uriOriginalPhoto}}
							resizeMode="contain"
					/>
					<View style={[imageStyles.annotations, {padding: textPadding}]} collapsable={false}>
						<View style={annotationEntry} collapsable={false}>
							<Text style={textStyleImportant}>
								{this._getCreatedAtString()} {this.props.photoForRendering.creatorName}
							</Text>
						</View>
						<View style={[annotationEntry, {justifyContent: 'flex-start', alignItems: 'center', }]} collapsable={false}>
							<Image
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
	}
});