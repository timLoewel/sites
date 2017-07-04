/**
 * Created by tim on 13/03/17.
 */

import React from 'react';
import {ScrollView, Text, View} from 'react-native';
import I18n from '../../assets/translations';
import {Field, reduxForm} from 'redux-form';
import FormTextInput from '../form/FormTextInput';
import Button from 'react-native-button';

class EditSingleSiteView extends React.Component {


	render() {
		return (
				<View>
					<Field
							name={'firstName'}
							title={I18n.t('profile.firstNameTitle')}
							placeholder={I18n.t('profile.firstNamePlaceholder')}
							component={FormTextInput}
					/>
					<Field
							name={'lastName'}
							title={I18n.t('profile.lastNameTitle')}
							placeholder={I18n.t('profile.lastNamePlaceholder')}
							component={FormTextInput}
					/>
					<Field
							name={'email'}
							title={I18n.t('profile.emailTitle')}
							placeholder={I18n.t('profile.emailPlaceholder')}
							component={FormTextInput}
					/>

					<Button 					style={{flex:1, fontSize: 20, color: theme.btnTextColor, fontSize: theme.btnTextSizeLarge, textAlign: 'center', padding:10}}
													  onPress={this.props.handleSubmit}
					>{I18n.t('profile.saveButtonTitle')}</Button>
					<Button 					style={{flex:1, fontSize: 20, color: theme.btnTextColor, fontSize: theme.btnTextSizeLarge, textAlign: 'center', padding:10}}
													 onPress={this.props.reset}
					>{I18n.t('profile.cancelButtonTitle')}</Button>
				</View>
		);
	}
}


export default reduxForm({
	form: 'editSingleSite',
	initialValues: {}
})(EditSingleSiteView);


//
//
// class FormView extends Component {
// 	render() {
// 		const { handleSubmit,reset, submitting, cancellation } = this.props
//
// 		return (
// 				<Form>
// 					<FieldsContainer>
// 						<Fieldset theme={formTheme} label={I18n.t('profile.title')}>
// 							<Input editable={this.props.editable} name="first_name" inlineLabel={false} label={I18n.t('profile.firstName')} placeholder={I18n.t('profile.firstNamePlaceholder')} />
// 							<Input editable={this.props.editable} name="last_name" label={I18n.t('profile.lastName')} placeholder={I18n.t('profile.lastNamePlaceholder')} />
// 							<Input editable={this.props.editable} name="email" label={I18n.t('profile.email')} placeholder={I18n.t('profile.emailPlaceholder')} />
// 							<Input editable={this.props.editable} name="telephone" label={I18n.t('profile.phone')} placeholder={I18n.t('profile.phonePlaceholder')} />
// 						</Fieldset>
// 						<Fieldset label={I18n.t('profile.companyTitle')} last>
// 							<Input editable={this.props.editable} theme={formTheme} name="companyName" label={I18n.t('profile.companyName')} placeholder="Hejrevej 33" />
// 						</Fieldset>
// 					</FieldsContainer>
// 					<ActionsContainer>
// 						<Button icon="md-checkmark" iconPlacement="right" onPress={handleSubmit(onSubmit)} submitting={submitting}>{I18n.t('profile.save')}</Button>
// 						<Button icon="md-checkmark" iconPlacement="right" onPress={reset(onReset)} submitting={submitting}>{I18n.t('profile.cancel')}</Button>
// 					</ActionsContainer>
// 				</Form>
// 		)
// 	}
// }