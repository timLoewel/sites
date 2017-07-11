/**
 * Created by tim on 16/03/17.
 */
"use strict";
import React, { Component } from "react";
import { connect } from "react-redux";
import Exif from "react-native-exif";
import styled from "styled-components/native";

import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  View,
  Text,
  Image
} from "react-native";
import Camera from "react-native-camera";
import theme from "../../assets/themes/sites-theme";

export default () =>
  <TouchableHighlight
    style={{
      backgroundColor: "transparent",
      borderRadius: 50,
      marginBottom: 20
    }}
    key="shutterButton"
    onPress={this._takePicture.bind(this)}
    activeOpacity={0.1}
    underlayColor="#11111166"
  >
    <View
      style={{
        backgroundColor: "transparent",
        height: 52,
        width: 52,
        borderRadius: 52,
        borderWidth: 4,
        borderColor: "#aaaaaa88"
      }}
    >
      <View
        style={{
          position: "absolute",
          backgroundColor: "transparent",
          height: 50,
          width: 50,
          left: -3,
          top: -3,
          borderRadius: 50,
          borderWidth: 2,
          borderColor: "#e0e0e0ff"
        }}
      />
    </View>
  </TouchableHighlight>;
