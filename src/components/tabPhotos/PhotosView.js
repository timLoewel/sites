/**
 * Created by tim on 10/03/17.
 */
import { connect } from "react-redux";
import React from "react";
import {
  AppRegistry,
  AsyncStorage,
  Button,
  StyleSheet,
  Text,
  View
} from "react-native";

import { getVisiblePhotos } from "./PhotosFilter";
import PhotoAlbum from "./PhotoAlbum";

class PhotosView extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Photos"
  };

  render() {
    return <PhotoAlbum allVisiblePhotos={this.props.photos} />;
  }
}

let styles = StyleSheet.create({
  scrollView: { backgroundColor: "#6A85B1", height: 300 },
  horizontalScrollView: { height: 120 },
  containerPage: {
    height: 50,
    width: 50,
    backgroundColor: "#527FE4",
    padding: 5
  },
  text: { fontSize: 20, color: "#888888", left: 80, top: 20, height: 40 },
  button: {
    margin: 7,
    padding: 5,
    alignItems: "center",
    backgroundColor: "#eaeaea",
    borderRadius: 3
  },
  buttonContents: { flexDirection: "row", width: 64, height: 64 },
  img: { width: 64, height: 64 }
});

const mapStateToProps = state => ({
  photos: getVisiblePhotos(state)
});

function bindAction(dispatch) {
  return {};
}

export default connect(mapStateToProps, bindAction)(PhotosView);
