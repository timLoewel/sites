'use strict';
import React from 'react';
import ReactNative from 'react-native';
import {newObjectId} from '../../utils/objectId';
import getDimensions from '../../utils/dimensions';
import LightBox from './Lightbox.android';

let {
	Image,
	ListView,
	TouchableOpacity,
	View,
	RefreshControl,
	LayoutAnimation,
} = ReactNative;
const THUMBNAIL_MARGIN = 5;
const allVisiblePhotos = [];
const {width: windowWidth, height: windowHeight} = getDimensions();

for (let i = 20; i < 200; ++i) {
	allVisiblePhotos.push({
		localObjectId: newObjectId(),
		thumbnailData: 'https://unsplash.it/40/60?image=' + i,
		uriPhotoLocal: 'https://unsplash.it/1500/2500?image=' + i,
		shareableUri: 'obob.work/' + i,
		description: 'text ' + i,
		creatorObjectId: 'asfd',
		creatorName: 'tim',
		selectedLocation: {longitude: 33.0 + 0.1 * i, latitude: 22.0 + 0.1 * i},
		systemLocation: {longitude: 33.0 + 0.11 * i, latitude: 22.0 + 0.12 * i},
	})
}


class PhotoAlbum extends React.Component {

	constructor(props) {
		super(props);
		const listViewDataSource = new ListView.DataSource({rowHasChanged: (p1, p2) => p1.objectId === p2.objectId});

		let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
		this.state = {
			listViewDataSource: listViewDataSource,
			showSinglePhotoRowID: undefined,
			refreshing: false,
			thumbnailsPerRow: 2,
		};
		this._pressData = ({}: { [key: number]: boolean })
	};


	componentWillMount() {
		this._pressData = {};
	};

	_onRefresh() {
		this.setState({refreshing: true});
		// this.props.fetchData().then(() => {
		// 	this.setState({refreshing: false});
		// });
		this.setState({refreshing: false});

	}

	_getThumbnailSize() {
		return (windowWidth / this.state.thumbnailsPerRow) - (3 * THUMBNAIL_MARGIN)
	}

	_changePhotoRowIDCallback(selectedPhotoRowID) {
		if (this.state.showSinglePhotoRowID != selectedPhotoRowID) {
			let imgNum = selectedPhotoRowID - this.state.thumbnailsPerRow;
			if (imgNum < 1) {
				imgNum = 0;
			}
			const pixelPerRow = this._getThumbnailSize() + 2 * THUMBNAIL_MARGIN;
			this.listView.scrollTo({x: 0, y: Math.floor(imgNum / this.state.thumbnailsPerRow) * pixelPerRow, animated: false})
		}
	}

	_closeLightboxCallback(selectedPhotoRowID) {
		this.setState({showSinglePhotoRowID: undefined});
	}

	_renderLightbox() {
		if (this.state.showSinglePhotoRowID) {
			return <LightBox
					mediaList={this.props.allVisiblePhotos}
					currentlySelectedRowID = {this.state.showSinglePhotoRowID}
					changePhotoRowIDCallback = {this._changePhotoRowIDCallback.bind(this)}
					closeCallback={this._closeLightboxCallback.bind(this)}/>
		} else {
			return undefined;
		}
	}

	render() {
		const listData = this.state.listViewDataSource.cloneWithRows(this.props.allVisiblePhotos);

		return (
				<View>
					<ListView
							ref={component => this.listView = component}
							enableEmptySections={true}
							contentContainerStyle={{
								justifyContent: 'center',
								flexDirection: 'row',
								flexWrap: 'wrap',
								alignItems: 'flex-start'

							}}
							style={{position: 'absolute', top: 0, left: 0, width: windowWidth, height: windowHeight}}
							dataSource={listData}
							renderRow={this._renderRow.bind(this)}
							refreshControl={
								<RefreshControl
										refreshing={this.state.refreshing}
										onRefresh={this._onRefresh.bind(this)}
										tintColor="#ff0000"
										title="Loading..."
										titleColor="#00ff00"
										colors={['#ff00aaaa', '#00ffbbaa', '#0000ffaa']}
										progressBackgroundColor="#ffff00cc"
										enabled
								/>
							}
					/>
					{this._renderLightbox()}
				</View>
		);
	}

	_onPressImage(rowID) {
		return () => {
			this.setState({showSinglePhotoRowID: rowID})
		}
	}

	_renderRow(rowData: object, sectionID: number, rowID: number) {
		const imageSize = this._getThumbnailSize()
		return (
				<TouchableOpacity
						key={rowID}
						onPress={this._onPressImage(rowID).bind(this)}
						activeOpacity={0.7}

				>
					<View style={ {
						justifyContent: 'center',
						margin: THUMBNAIL_MARGIN,
						width: imageSize,
						height: imageSize,
						backgroundColor: '#F6F6F6',
						alignItems: 'center',
						borderWidth: 0,
						borderRadius: 0,
						borderColor: '#CCC'
					}}>
						<Image
								resizeMode="cover"
								style={{
									width: imageSize,
									height: imageSize,
									top: 0,
									left: 0,
									position: 'absolute',
								}}
								source={{uri: rowData.thumbnailData}}/>
						<Image
								resizeMode="cover"
								style={{
									width: imageSize,
									height: imageSize,
									top: 0,
									left: 0,
									position: 'absolute',
								}}
								source={{uri: 'file://' + rowData.uriPhotoLocal}}/>
					</View>
				</TouchableOpacity>
		);
	}

};

export default PhotoAlbum;