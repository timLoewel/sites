import React, { Component, PropTypes } from "react";
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
} from "react-native";
import {LineStyleIcon as Icon} from '../assets/icons';
import theme from '../assets/themes/sites-theme';
import I18n from '../assets/translations';
import moment from 'moment';

import { takeSnapshot } from "react-native-view-shot";

//uri: "https://pbs.twimg.com/media/CpRgVFjWcAAvJbb.jpg:large",

const imageStyles = {
	root: {
		backgroundColor: "ghostwhite",
		flexDirection: 'column',
		alignItems: 'stretch',
		justifyContent: 'flex-start',
		position:'absolute',
		left: 0,
		top: 0,
		flex:1,
	},
	heading: {
		backgroundColor: theme.brandPrimary,// theme.brandPrimary
	},
	imageUrl: {
		textAlign: 'left',
	},
	image: {

	},
	annotations: {
		flex:1,
		backgroundColor: 'ghostwhite',
		flexDirection: 'column',
		alignItems: 'stretch',
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
export default class RenderImage extends Component {
	 static propTypes = {
		// the image that should be rendered
		photoData: PropTypes.shape({
			uri: PropTypes.string,
			height: PropTypes.number,
			width: PropTypes.number,
			orientation: PropTypes.number,
			createdAt: PropTypes.object,
			// where the image can be retrieved. this is stamped into the image
			shareableUri: PropTypes.string,
		}),
		photoDescription: PropTypes.string,
		creatorName: PropTypes.string,
		siteName: PropTypes.string,
		selectedLocation: PropTypes.object,
		systemLocation: PropTypes.object,
		onPhotoReady: PropTypes.func,
		onError: PropTypes.func,
	};


	constructor(props) {
		super(props);

		this.ratio = PixelRatio.get();
		this.imageLayoutWidth = props.photoData.width / this.ratio;
		this.imageLayoutHeight = props.photoData.height / this.ratio;

		// 30 is a constant chosen for readability of the rendered photos
		this.fontSize = this.imageLayoutWidth/30;
	}

	/**
	 * call this inside callWhenReady callback
	 * @param targetWidth
	 * @param quality
	 */
	snapPhoto(renderedImageHeight, renderedImageWidth, targetWidth, quality, resultType) {
		 const q = quality || 0.8;
			const r = resultType || 'file';
		 const width = Math.min(
				 (targetWidth?targetWidth/this.ratio:undefined) || renderedImageWidth,
				 renderedImageWidth);
		 const height = renderedImageHeight * (width/renderedImageWidth);
		 return takeSnapshot(this.refs.root,
				 {
					 format: 'jpg',
					 height:height,
					 width:width,
					 quality: q,
					 result: r,
				 });
	}

	snapThumbnail(renderedImageHeight, renderedImageWidth) {
		return this.snapPhoto(renderedImageHeight, renderedImageWidth, 200, 0.3, 'data-uri');
	}

	componentDidUpdate() {
		console.log('componentDidUpdate');
	}

	shouldComponentUpdate(nextProps, nextState) {
		console.log('shouldComponentUpdate ' + this.props);
		console.log(this.props);
		console.log(nextProps);
		console.log('............');

		return this.props.photoData.createdAtMillis != nextProps.photoData.createdAtMillis;
	}

	doSnapshots(renderedImageHeight, renderedImageWidth) {
		this.snapThumbnail(renderedImageHeight, renderedImageWidth).then(thumbnailData => {
			return this.snapPhoto(renderedImageHeight, renderedImageWidth).then(uri => {
				if (this.props.onPhotoReady) {
					console.log('doSnapshot calling photo ready callback');
					this.props.onPhotoReady(thumbnailData, uri);
				}
			});
		}).catch(error => {
			console.log('error on rendering snapshots.');
			return this.props.onError && this.props.onError(error);
		});
	}

	storeMeasurements(event) {
		var {x, y, width, height} = event.nativeEvent.layout;
		console.log('total layout measurements h x w: ' + height + ' x ' + width);
		this.doSnapshots(height, width);
	}

	getLongitudeLatitude(textStyle) {
		if (this.props.selectedLocation && this.props.selectedLocation.longitude) {
			return (<Text style={textStyle}>
				latitude: {this.props.positionLatitude}, longitude: {this.props.positionLongitude}, accuracy: {this.props.positionAccuracy}m
			</Text>);
		} else {
			return (<Text style={textStyle}>
				{I18n.t('photoRenderer.locationUnknown')}
			</Text>);
		}
	}
	getCreatedAtString() {
		return moment(this.props.photoData.createdAtMillis).format('Y MMM d HH:mm');
	}
	render () {
		console.log('RenderImage.render()');

		const fontSizeImportant = this.fontSize;
		const fontSizeUnimportant = this.fontSize * 0.8;

		const lineHeightImportant = Math.ceil(fontSizeImportant * 1.8);
		const lineHeightUnimportant = Math.ceil(fontSizeUnimportant * 1.5);
		const textPadding = Math.ceil(this.fontSize);
		const textStyleUnimportant = {fontSize: fontSizeUnimportant, lineHeight: lineHeightUnimportant, color: 'grey'};
		const textStyleImportant = {fontSize: fontSizeImportant, lineHeight: lineHeightImportant, color: 'black'};
		const annotationEntry = {flexDirection:'row', flex: 1, paddingBottom: Math.ceil(fontSizeImportant)};


		return (
				<View ref="root"  style={[{width:this.imageLayoutWidth, flex:1, flexDirection:'column' }, imageStyles.root]}
							onLayout={this.storeMeasurements.bind(this)}  collapsable={false}>
					<View style={[imageStyles.heading, {padding: textPadding, height: this.fontSize * 3}]} collapsable={false}>
						<Text style={[textStyleUnimportant, {color: 'black'}]}>
							<Text  style={textStyleUnimportant}>
								<Icon name="camera" style={{fontSize: this.fontSize, color: 'black'}}/>
							</Text> <Text style={[imageStyles.imageUrl, textStyleUnimportant]}>{this.props.photoData.shareableUri}</Text>
						</Text>
					</View>

					<Image
							style={[imageStyles.image,{width: this.imageLayoutWidth, height:this.imageLayoutHeight}]}
							source={{uri: 'file://' + this.props.photoData.uri}}
							resizeMode="contain"
					/>
					<View style={[imageStyles.annotations, {padding: textPadding}]} collapsable={false}>
						<View style={annotationEntry} collapsable={false}>
							<Text style={textStyleImportant}>
								{this.getCreatedAtString()}
							</Text>
						</View>
						<View style={[annotationEntry,{justifyContent: 'flex-start', alignItems: 'center'}]} collapsable={false}>
							<Image
									style={{
											height: fontSizeImportant,
											width: fontSizeImportant,
											resizeMode: 'contain'
										}}
									source={require('../assets/icons/map-site-marker.png')}/>
							<Text style={[textStyleImportant,{flex:1}]}>
								{this.props.siteName}
							</Text>
						</View>
						<View style={[annotationEntry,{flexDirection: 'column'}]} collapsable={false}>
							<Text style={textStyleUnimportant}>
								{this.props.selectedLocation.formattedAddress}
							</Text>
							{this.getLongitudeLatitude(textStyleUnimportant)}
						</View>
						<View style={annotationEntry} collapsable={false}>
							<Text style={textStyleImportant}>
								{this.props.photoDescription}
							</Text>
						</View>
						<View style={annotationEntry} collapsable={false}>
							<Text style={textStyleUnimportant}>
								{this.props.creatorName}
							</Text>
						</View>

					</View>
				</View>);
	}
}