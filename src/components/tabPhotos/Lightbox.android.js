/**
 * Created by tim on 29/03/17.
 *
 *
 * ViewPagerAndroid does not exist for ios,
 *
 * for initial position use contentOffset on ios
 * see
 * https://stackoverflow.com/questions/38984932/setting-an-initial-scroll-position-of-a-react-native-listview
 *
 *
 * maybe replace the ViewPagerAndroid with https://github.com/leecade/react-native-swiper
 */

import React from 'react';
import ReactNative from 'react-native';
import getDimensions from '../../utils/dimensions';
import {LineStyleIcon as Icon} from '../../assets/icons';
import theme from '../../assets/themes/sites-theme';
import Share, {ShareSheet, Button} from 'react-native-share';
import I18n from '../../assets/translations';

let {
	Image,
	ViewPagerAndroid,
	TouchableOpacity,
	TouchableHighlight,
	View, Text
} = ReactNative;


const {width: windowWidth, height: windowHeight} = getDimensions();

class Lightbox extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentlySelectedRowID: parseInt(this.props.currentlySelectedRowID),
		};
	};

	_onPageSelected = (e) => {
		this.setState({currentlySelectedRowID: e.nativeEvent.position});
		this.props.changePhotoRowIDCallback(e.nativeEvent.position);
	};

	_share(uri, imageShareableUri) {
		Share.open({
			// url: uri, either uri or message and type
			// type: 'image/jpeg'
			subject: I18n.t('share.subject', {shareableUri: imageShareableUri}),
			title: I18n.t('share.subject', {shareableUri: imageShareableUri}),
			message:I18n.t('share.message', {shareableUri: imageShareableUri}),

			// no message, otherwise the file is not transferred any more
		}).catch((err) => {
			err && console.log(err);
		});
	};

	_renderShareButton(fileUrl, shareableUri) {
		return (
				<View style={{
					flex: 1,
					top: 0,
					left: 0,
					width: windowWidth,
					height: windowHeight,
					position: 'absolute',
					flexDirection: 'column',
					alignItems: 'flex-end',
					justifyContent: 'flex-end',
				}}
				>
					<TouchableHighlight
							style={{
								width: theme.footerHeight - 5,
								height: theme.footerHeight - 5,
								flexDirection: 'column',
								justifyContent: 'center',
								alignItems: 'center',
								padding: theme.contentPadding,
							}}
							key="shareButton"
							onPress={() => this._share(fileUrl, shareableUri)}
							activeOpacity={0.5}
							underlayColor="transparent"
					>
						<View>
							<Text style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
								<Icon name="share" style={{fontSize: theme.fontSizeH2, color: 'white'}}/>
							</Text>
						</View>
					</TouchableHighlight>
				</View>
		);
	}

	_renderOneImagePage(index, image) {
		const fileUri = 'file://' + image.uriPhotoLocal;
		const shareableUri = image.shareableUri;
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
								resizeMode="contain"
								style={{
									width: windowWidth,
									height: windowHeight,
									top: 0,
									left: 0,
									position: 'absolute',
								}}
								source={{uri: image.thumbnailData}}/>
						<Image
								resizeMode="contain"
								style={{
									width: windowWidth,
									height: windowHeight,
									top: 0,
									left: 0,
									position: 'absolute',
								}}
								source={{uri: fileUri}}/>
					</TouchableOpacity>
					{this._renderShareButton(fileUri, shareableUri)}
				</View>
		)
	}

	_renderPages() {

		let pages = [];
		for (let i = 0; i < this.props.mediaList.length; i++) {
			const pageData = this.props.mediaList[i];
			pages.push(this._renderOneImagePage(i, pageData));
		}
		return pages;
	}

	render() {

		let {page, animationsAreEnabled} = this.state;
		return (
				<ViewPagerAndroid
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: windowWidth,
							height: windowHeight,
							backgroundColor: 'black',
							flex: 1
						}}
						initialPage={this.state.currentlySelectedRowID }
						scrollEnabled={true}
						onPageSelected={this._onPageSelected.bind(this)}
						pageMargin={10}
						ref={viewPager => {
							this.viewPager = viewPager;
						}}
				>
					{this._renderPages()}
				</ViewPagerAndroid>);
	}

}

export default Lightbox;