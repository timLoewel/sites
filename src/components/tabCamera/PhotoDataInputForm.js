/**
 * Created by tim on 16/03/17.
 */
/**
 * Created by tim on 13/03/17.
 */

import React from 'react';
import {connect} from 'react-redux';

import {ScrollView, TextInput, Text, View, KeyboardAvoidingView, Button} from 'react-native';
import I18n from '../../assets/translations';
import theme from '../../assets/themes/sites-theme';
import {setPhotoLocation, setPhotoDescription} from '../../model/ui/camera/cameraReducer';


class PhotoDataInputForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			collapsed : true,
		}
	}

	collapse() {
		this.setState({collapsed: true});
	}
	expand() {
		this.setState({collapsed: false});
	}
	render() {
		const fontSize = this.state.collapsed ? theme.fontSizeSmall : theme.inputFontSize;
		return (
				<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'stretch',}}>
					<View style={{flex: 1, flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start'}}>
						<Text style={{fontSize: theme.fontSizeBase, fontWeight: 'bold'}}>{I18n.t('camera.descriptionTitle')}</Text>
						<View style={{flexDirection: 'row', justifyContent: 'flex-start'}}>
							<TextInput
									placeholderTextColor={theme.subtitleColor}
									style={{flex: 1, fontSize: fontSize, backgroundColor: theme.inputBGColor, textAlign: 'left', textAlignVertical: 'top'}}
									onChangeText={this.props.setPhotoDescription}
									onBlur={this.collapse.bind(this)}
									onFocus={this.expand.bind(this)}
									value={this.props.photoDescription}
									placeholder={I18n.t('camera.thisIsAppendedToPhoto')}
									multiline={!this.state.collapsed}
									numberOfLines={10}
									maxLength={280}
									selectTextOnFocus={true}
							/>
						</View>
					</View>

				</View>
		);
	}
}
const mapStateToProps = state => ({
	// currentLocation: state.ui.geoLocationReducer.get('position'),
	location: state.ui.cameraReducer.location,
	photoDescription: state.ui.cameraReducer.photoDescription,
});

function bindAction(dispatch) {
	return {
		//newLocation: { formattedAddress, location: { latitude, longitude } }
		setPhotoLocation: (newLocation) => dispatch(setPhotoLocation(newLocation)),
		setPhotoDescription: (description) => dispatch(setPhotoDescription(description))
	}
}
export default connect(mapStateToProps, bindAction)(PhotoDataInputForm);
