/**
 * Created by tim on 13/03/17.
 */

import React from 'react';
import {ScrollView, Text, View, Button} from 'react-native';
import I18n from '../../assets/translations';
import {Field, reduxForm, propTypes} from 'redux-form-actions';
import FormTextInput from '../form/FormTextInput';

const formStates = ['asyncValidating', 'dirty', 'pristine', 'valid', 'invalid', 'submitting',
	'submitSucceeded', 'submitFailed'];

class ProfileForm extends React.Component {
	static propTypes = {
		...propTypes,
	}

	render() {
		return (
				<View>
					<Field
							name={'firstName'}
							title = {I18n.t('profile.firstNameTitle')}
							placeholder={I18n.t('profile.firstNamePlaceholder')}
							component={FormTextInput}
					/>
					<Field
							name={'lastName'}
							title = {I18n.t('profile.lastNameTitle')}
							placeholder={I18n.t('profile.lastNamePlaceholder')}
							component={FormTextInput}
					/>
					<Field
							name={'email'}
							title = {I18n.t('profile.emailTitle')}
							placeholder={I18n.t('profile.emailPlaceholder')}
							component={FormTextInput}
					/>

					<Button title={I18n.t('profile.saveButtonTitle')} onPress={this.props.handleSubmit}/>
					<Button title={I18n.t('profile.cancelButtonTitle')} onPress={this.props.reset}/>
				</View>
		);
	}
}


export default reduxForm({
	form: 'ProfileForm',
	initialValues: {

	}
})(ProfileForm);


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