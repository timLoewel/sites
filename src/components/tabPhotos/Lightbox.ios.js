/**
 * Created by tim on 29/03/17.
 *
 *
 * This is not currently tested / not working at all...
 * ViewPagerAndroid does not exist for ios,
 *
 * for initial position use contentOffset on ios
 * see
 * https://stackoverflow.com/questions/38984932/setting-an-initial-scroll-position-of-a-react-native-listview
 */

import React from "react";
import ReactNative from "react-native";
import getDimensions from "../../utils/dimensions";

let { Image, ListView, TouchableOpacity, View } = ReactNative;

const { width: windowWidth, height: windowHeight } = getDimensions();

class Lightbox extends React.Component {
  constructor(props) {
    super(props);

    const listViewDataSource = new ListView.DataSource({
      rowHasChanged: (p1, p2) => p1.objectId === p2.objectId
    });

    let ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      listViewDataSource: listViewDataSource
    };
    this._pressData = ({}: { [key: number]: boolean });
  }

  render() {
    const listData = this.state.listViewDataSource.cloneWithRows(
      this.props.mediaList
    );

    return (
      <ListView
        ref={component => (this._root = component)}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: windowWidth,
          height: windowHeight,
          backgroundColor: "black"
        }}
        dataSource={listData}
        renderRow={this._renderRow.bind(this)}
        pagingEnabled={true}
        horizontal={true}
        contentOffset={this.props.currentlySelected}
        showsHorizontalScrollIndicator={false}
      />
    );
  }

  _renderRow(rowData: object, sectionID: number, rowID: number) {
    return (
      <TouchableOpacity
        onPress={(a => {
          this.props.closeCallback();
        }).bind(this)}
        activeOpacity={0.9}
        style={{
          width: windowWidth,
          height: windowHeight
        }}
      >
        <Image
          resizeMode="cover"
          style={{
            width: windowWidth,
            height: windowHeight,
            top: 0,
            left: 0,
            position: "absolute"
          }}
          source={{ uri: rowData.thumbnailData }}
        />
        <Image
          resizeMode="cover"
          style={{
            width: windowWidth,
            height: windowHeight,
            top: 0,
            left: 0,
            position: "absolute"
          }}
          source={{ uri: rowData.uriPhotoLocal }}
        />
      </TouchableOpacity>
    );
  }
}

export default Lightbox;
