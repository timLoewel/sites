/**
 * Created by tim on 16/03/17.
 */
/**
 * Created by tim on 13/03/17.
 */

import React from 'react';
import {ScrollView, TextInput, Text, View,KeyboardAvoidingView, Button} from 'react-native';
import I18n from '../../assets/translations';
import {Field, reduxForm, propTypes} from 'redux-form-actions';
import theme from '../../assets/themes/sites-theme';


function descriptionInput(props) {
	const {input, ...inputProps} = props;
	return (
			<View style={{flex:1, flexDirection:'column', justifyContent: 'flex-start', alignItems:'flex-start'}}>
				<Text style={{fontSize:theme.fontSizeBase, fontWeight:'bold'}}>{I18n.t('camera.descriptionTitle')}</Text>
				<View style={{flexDirection:'row', justifyContent:'flex-start'}}>
					<TextInput
							placeholderTextColor={theme.subtitleColor}
							style={{flex:1, backgroundColor:theme.inputBGColor, textAlign:'left', textAlignVertical: 'top'}}
							{...inputProps}
							onChangeText={input.onChange}
							onBlur={input.onBlur}
							onFocus={input.onFocus}
							value={input.value}
							placeholder={I18n.t('camera.thisIsAppendedToPhoto')}
							multiline={true}
							numberOfLines = {3}
							maxLength = {280}
							selectTextOnFocus={true}
					/>
				</View>
			</View>
	);
}


class PhotoDataInputForm extends React.Component {
	static propTypes = {
		...propTypes,
	}

	render() {
		return (

			<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch', }}>
				<Field
						name={'description'}
						component={descriptionInput}

				/>

			</View>
		);
	}
}


export default reduxForm({
	form: 'PhotoDataInputForm',
	initialValues: {

	}
})(PhotoDataInputForm);
