/**
 * Created by tim on 10/03/17.
 */
import { connect } from "react-redux";
import { ScrollView, Text, View } from "react-native";
import I18n from "../../assets/translations";
import { Field, reduxForm } from "redux-form";
import FormTextInput from "../form/FormTextInput";

import React from "react";

class SingleSiteView extends React.Component {
  static navigationOptions = {
    tabBarLabel: "Single Site"
  };

  render() {
    return <Text>aa</Text>;
  }
}

const mapStateToProps = state => ({});

function bindAction(dispatch) {
  return {};
}

export default connect(mapStateToProps, bindAction)(SingleSiteView);
