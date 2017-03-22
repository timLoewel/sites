import React, { Component } from "react";
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
}
/**
 * put this component into a View that is outside the visible area e.g. position: absolute, top:0, left: window.width
 */
export default class RenderImage extends Component {
	propTypes: {
		// as long as this is false nothing is rendered
		allDataComplete: React.PropTypes.bool,
		// the image that should be rendered
		sourceImageUri: React.PropTypes.string,
		// where the image will get rendered to. this is stamped into the image
		shareableUri: React.PropTypes.string,
		creationDateString: React.PropTypes.string,
		creatorName: React.propTypes.string,
		creatorCompany: React.propTypes.string,
		siteName: React.propTypes.string,
		addressOneLine: React.propTypes.string,
		locationLongitude: React.propTypes.number,
		locationLatitude: React.propTypes.number,
		description: React.propTypes.string,
		photoWidth: React.propTypes.number,
		photoHeight: React.propTypes.number,
		photoOrientation: React.propTypes.number,
		callWhenReady: React.propTypes.func,
	}

	constructor(props) {
		super(props);

		const ratio = PixelRatio.get();
		const imageLayoutWidth = props.photoWidth / ratio;
		const imageLayoutHeight = props.photoHeight / ratio;

		// 30 is a constant chosen for readability of the rendered photos
		const fontSize = imageLayoutWidth/30;

		this.state = {
			ratio: ratio,
			imageLayoutWidth: imageLayoutWidth,
			imageLayoutHeight: imageLayoutHeight,
			fontSize: fontSize,
			renderedImageWidth: 0,
			renderedImageHeight: 0,
		}
	}

	/**
	 * call this inside callWhenReady callback
	 * @param targetWidth
	 * @param quality
	 */
	 snapIt(targetWidth, quality) {
		 const q = quality || 0.8;
		 const width = Math.min(
				 (targetWidth?targetWidth/this.state.ratio:undefined) || this.state.renderedImageWidth,
				 this.state.renderedImageWidth);
		 const height = this.state.renderedImageHeight * (width/this.state.renderedImageWidth);
		 return takeSnapshot(this.refs.root,
				 {
					 format: 'jpg',
					 width:width,
					 height:height,
					 quality: q,
					 result: 'file',
				 });
	}

	isReadyForSnapshot() {
		return (
				this.state.imageLayoutWidth > 0
		&& this.props.allDataComplete
		&& this.state.renderedImageHeight > 0
		&& this.state.renderedImageWidth > 0);
	}



	componentDidUpdate() {
		if (this.isReadyForSnapshot() && this.props.callWhenReady) {
			console.log('componentDidUpdate readyForSnapshot');
			this.props.callWhenReady(this);
		}
	}

	storeMeasurements(event) {
		var {x, y, width, height} = event.nativeEvent.layout;
		console.log('total layout measurements h x w: ' + height + ' x ' + width);
		this.setState({renderedImageHeight: height , renderedImageWidth: width });
	}

	getLongitudeLatitude() {
		if (this.props.locationLatitude && this.props.locationLongitude) {
			return (<Text style={textStyleUnimportant}>
				latitude: {this.props.locationLatitude}, longitude: {this.props.locationLongitude}
			</Text>);
		}
	}

	render () {

		const fontSizeImportant = this.state.fontSize;
		const fontSizeUnimportant = this.state.fontSize * 0.8;

		const lineHeightImportant = Math.ceil(fontSizeImportant * 1.8);
		const lineHeightUnimportant = Math.ceil(fontSizeUnimportant * 1.5);
		const textPadding = Math.ceil(this.state.fontSize);
		const textStyleUnimportant = {fontSize: fontSizeUnimportant, lineHeight: lineHeightUnimportant, color: 'grey'};
		const textStyleImportant = {fontSize: fontSizeImportant, lineHeight: lineHeightImportant, color: 'black'};
		const annotationEntry = {flexDirection:'row', flex: 1, paddingBottom: Math.ceil(fontSizeImportant)};
		const imageLayoutHeight = this.state.imageLayoutHeight;
		const imageLayoutWidth = this.state.imageLayoutWidth;

		// return	(
		// 		<View ref="root"  style={[{width:this.state.imageLayoutWidth, flex:1, flexDirection:'column' }, imageStyles.root]}>
		// 	<View style={[imageStyles.heading, {padding: textPadding, height: this.state.fontSize * 3}]}>
		// 		<Text style={[textStyleUnimportant, {color: 'black'}]}>
		// 			<Text  style={textStyleUnimportant}>
		// 				<Icon name="camera" style={{fontSize: this.state.fontSize, color: 'black'}}/>
		// 			</Text> <Text style={[imageStyles.imageUrl, textStyleUnimportant]}> {this.props.shareableUri}</Text>
		// 		</Text>
		// 	</View>
		//
		// 	<View ref="c1"
		// 				style={{width:this.state.imageLayoutWidth, height: 100, backgroundColor: 'blue', borderWidth:10, borderColor: 'orange' }}>
		// 	</View>
		// 	<Image source={{uri: this.props.sourceImageUri}} style={{height:imageLayoutHeight, width:imageLayoutWidth}} resizeMode="contain"/>
		//
		// 	<View ref="c2"
		// 				style={{width:this.state.imageLayoutWidth, height: 100, backgroundColor: 'red', borderWidth: 10, borderColor: 'pink' }}>
		// 	</View>
		// 	<Image source={{uri: this.props.sourceImageUri}} style={{width: this.state.imageLayoutWidth, height:this.state.imageLayoutHeight}} resizeMode="contain"/>
		//
		// </View>);
		return (
				<View ref="root"  style={[{width:this.state.imageLayoutWidth, flex:1, flexDirection:'column' }, imageStyles.root]}
							onLayout={this.storeMeasurements.bind(this)}  >
					<View style={[imageStyles.heading, {padding: textPadding, height: this.state.fontSize * 3}]}>
						<Text style={[textStyleUnimportant, {color: 'black'}]}>
							<Text  style={textStyleUnimportant}>
								<Icon name="camera" style={{fontSize: this.state.fontSize, color: 'black'}}/>
							</Text> <Text style={[imageStyles.imageUrl, textStyleUnimportant]}>{this.props.shareableUri}</Text>
						</Text>
					</View>

					<Image
							style={[imageStyles.image,{width: this.state.imageLayoutWidth, height:this.state.imageLayoutHeight}]}
							source={{uri: this.props.sourceImageUri}}
							resizeMode="contain"
					/>
					<View style={[imageStyles.annotations, {padding: textPadding}]}>
						<View style={annotationEntry}>
							<Text style={textStyleImportant}>
								{this.props.creationDateString}
							</Text>
						</View>
						<View style={annotationEntry}>
							<Image
									style={{
											height: fontSizeImportant,
											width: fontSizeImportant,
											resizeMode: 'contain'
										}}
									source={require('../../assets/icons/map-site-marker.png')}/>
							<Text style={textStyleImportant}>
								{this.props.siteName}
							</Text>
						</View>
						<View style={[annotationEntry,{flexDirection: 'column'}]}>
							<Text style={textStyleUnimportant}>
								{this.props.addressOneLine}
							</Text>
							{this.getLongitudeLatitude()}
						</View>
						<View style={annotationEntry}>
							<Text style={textStyleImportant}>
								{this.props.description}
							</Text>
						</View>
						<View style={annotationEntry}>
							<Text style={textStyleUnimportant}>
								{this.props.creatorName}
							</Text>
						</View>
						<View style={annotationEntry}>
							<Text style={textStyleUnimportant}>
								{this.props.creatorCompany}
							</Text>
						</View>
					</View>
				</View>);
	}
}