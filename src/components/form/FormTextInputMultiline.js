/**
 * Created by tim on 13/03/17.
 */
import React from 'react';
import {TextInput, View, Text} from 'react-native';
import FormFieldTitle from './FormFieldTitle';
import theme from '../../assets/themes/sites-theme';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';

/**
 * to be wrapped with redux-form Field component
 */
export default function FormTextInput(props) {
	const {input, ...inputProps} = props;
	return (
			<View>
				<FormFieldTitle>{props.title}</FormFieldTitle>
				<AutoGrowingTextInput
						{...inputProps}
						onChangeText={input.onChange}
						onBlur={input.onBlur}
						onFocus={input.onFocus}
						value={input.value}
						placeholder={props.placeholder}
						initialHeight={40}
						maxHeight={600}
						minHeight={theme.inputHeightBase}
						animation={{animated: true, duration: 200}}
						{/*onHeightChanged={this.descriptionFieldHeightChange.bind(this)}*/}
						{/*onFocus={this.onDescriptionFocusChange(true).bind(this)}*/}
						{/*onBlur={this.onDescriptionFocusChange(false).bind(this)}*/}
						{/*onSubmitEditing={this.updateDescription.bind(this)}*/}
				/>

				<TextInput
						{...inputProps}

				/>
			</View>
	);
}