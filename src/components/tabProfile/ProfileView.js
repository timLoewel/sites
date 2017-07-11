import React from "react";
import { ScrollView, Text, Button } from "react-native";
import { connect } from "react-redux";
import I18n from "../../assets/translations";

import ProfileForm from "./ProfileForm";
import {
  submitProfileForm,
  SUBMIT_PROFILE_OK,
  SUBMIT_PROFILE_FAILED
} from "../../model/profile/profileReducer";

const formStates = [
  "asyncValidating",
  "dirty",
  "pristine",
  "valid",
  "invalid",
  "submitting",
  "submitSucceeded",
  "submitFailed"
];

class ProfileView extends React.Component {
  render() {
    const { handleSubmit, reset, submitting, cancellation } = this.props;
    const submit = this.props.submitProfileForm;
    return (
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <ProfileForm
          onSubmit={submit}
          succeededAction={SUBMIT_PROFILE_OK}
          failedAction={SUBMIT_PROFILE_FAILED}
        />
      </ScrollView>
    );
  }
}

export default connect(state => ({}), { submitProfileForm })(ProfileView);
