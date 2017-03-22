/**
 * Created by tim on 13/03/17.
 */
import React from 'react';
import {TextInput, View, Text} from 'react-native';
import FormFieldTitle from './FormFieldTitle';
import theme from '../../assets/themes/sites-theme';

/**
 * to be wrapped with redux-form Field component
 */
export default function FormTextInput(props) {
	const {input, ...inputProps} = props;
	return (
			<View style={[{flex:1, flexDirection:props.inlineLabel?'row':'column', justifyContent: 'flex-start', alignItems:props.inlineLabel?'center':'flex-start' }, props.containerStyle]}>
				<FormFieldTitle>{props.title}</FormFieldTitle>
				<View style={{flexDirection:'row', justifyContent:'flex-start'}}>
				{props.buttonBefore}
				<TextInput
						placeholderTextColor={theme.subtitleColor}
						style={[{flex:1, backgroundColor:theme.inputBGColor}, props.inputStyle]}
						{...inputProps}
						onChangeText={input.onChange}
						onBlur={input.onBlur}
						onFocus={input.onFocus}
						value={input.value}
						placeholder={props.placeholder}
				/>
				{props.buttonAfter}
				</View>
			</View>
	);
}