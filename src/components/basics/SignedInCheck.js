/**
 * Created by tim on 24/03/17.
 */

import React, { Component } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import CenterView from "./CenterView";
import { connect } from "react-redux";

class SignedInCheck extends Component {
  render() {
    if (this.props.isLoggedIn) {
      return (
        <View style={{ flex: 1 }}>
          {this.props.children}
        </View>
      );
    }
    return (
      <CenterView>
        <ActivityIndicator animating size="large" />
      </CenterView>
    );
  }
}

const mapStateToProps = state => ({
  isLoggedIn: state.profile.isLoggedIn
});

function bindAction(dispatch) {
  return {};
}

export default connect(mapStateToProps, bindAction)(SignedInCheck);
