/**
 * Created by tim on 29/03/17.
 *
 *
 * ViewPagerAndroid does not exist for ios,
 *
 * for initial position use contentOffset on ios
 * see
 * https://stackoverflow.com/questions/38984932/setting-an-initial-scroll-position-of-a-react-native-listview
 */

import React from 'react';
import ReactNative from 'react-native';
import getDimensions from '../../utils/dimensions';

var {
	Image,
	ViewPagerAndroid,
	TouchableOpacity,
	View,
} = ReactNative;


const {width: windowWidth, height: windowHeight} = getDimensions();

class Lightbox extends React.Component{
	constructor(props) {
		super(props);

		this.state = {
			currentlySelectedRowID : parseInt(this.props.currentlySelectedRowID),

		};
	};
	_onPageSelected = (e) => {
		this.setState({currentlySelectedRowID: e.nativeEvent.position});
	};

	_renderOneImagePage(index, image) {
		return (
				<View
						key={index}
						collapsable={false}
				>
				<TouchableOpacity
						onPress={((a) => {
							this.props.closeCallback(index)
						}).bind(this)
						}
						activeOpacity={0.9}
						style={{
							width: windowWidth,
							height: windowHeight,
						}}
				>
					<Image
							resizeMode="cover"
							style={{
								width: windowWidth,
								height: windowHeight,
								top: 0,
								left: 0,
								position: 'absolute',
							}}
							source={{uri: image.thumbnailData}}/>
					<Image
							resizeMode="cover"
							style={{
								width: windowWidth,
								height: windowHeight,
								top: 0,
								left: 0,
								position: 'absolute',
							}}
							source={{uri: image.uriPhotoLocal}}/>
				</TouchableOpacity>
				</View>
		)
	}

	_renderPages() {
		var pages = [];
		for (var i = 0; i < this.props.mediaList.length; i++) {
			const pageData = this.props.mediaList[i];
			pages.push(this._renderOneImagePage(i, pageData));
		}
			return pages;
	}

	render() {

		var {page, animationsAreEnabled} = this.state;
		return (
			<ViewPagerAndroid
					style={{position: 'absolute', top: 0, left: 0, width: windowWidth, height: windowHeight, backgroundColor: 'black', flex:1}}
					initialPage={this.state.currentlySelectedRowID }
					scrollEnabled={true}
					onPageSelected={this.onPageSelected}
					pageMargin={10}
					ref={viewPager => {	this.viewPager = viewPager;}}
		>
			{this._renderPages()}
		</ViewPagerAndroid>);
	}

}

export default Lightbox;