/**
 * Created by tim on 10/03/17.
 */
import {connect} from 'react-redux';
import theme from '../../assets/themes/sites-theme';

import React from 'react';
import {
	AppRegistry,
	AsyncStorage,
	StyleSheet,
	Text,
	TextInput,
	View,
	FlatList,
} from 'react-native';
import Button from 'react-native-button';
import {selectCloseSites} from '../../model/site/siteSelectors';
import I18n from '../../assets/translations';
import {NavigationActions} from 'react-navigation';
import {selectSite} from '../../model/site/siteReducer';


class SelectSiteView extends React.Component {
	static navigationOptions = {
		title: I18n.t("selectSite.title"),
	};

	_noSiteSelected() {
		this.props.selectNoSite();
		this.props.goBack();
	}

	_createNewSite() {
		this.props.gotoCreateNewSite(this.props.noSite)
	}

	render() {
		return (
				<View style={{flex: 1, flexDirection: 'column'}}>
					<TextInput style={{flex: 1, flexDirection: 'column'}}/>
					<View				 style={{flex: 1, flexDirection: 'row'}}>
						<Button
								containerStyle={{
									flex:1,
									// padding: 10,
									margin: theme.defaultMargin,
									height: theme.btnHeight,
									overflow: 'hidden',
									alignItems: 'center',
									borderRadius: theme.borderRadiusLarge,
									backgroundColor: theme.brandDanger
								}}
								style={{fontSize: theme.btnTextSizeLarge, color: theme.btnTextColor, textAlign: 'center',}}
								onPress={this._noSiteSelected.bind(this)}>
							{I18n.t("selectSite.noSite")}
						</Button>
						<Button
								containerStyle={{
									flex:1,
									margin: theme.defaultMargin,
									height: theme.btnHeight,
									overflow: 'hidden',
									borderRadius: theme.borderRadiusLarge,
									backgroundColor: theme.brandSecondary
								}}
								style={{flex:1, fontSize: 20, color: theme.btnTextColor, fontSize: theme.btnTextSizeLarge, textAlign: 'center', padding:10}}
								onPress={this._createNewSite.bind(this)}>
							{I18n.t("selectSite.createNew")}
						</Button>
					</View>
					<View
							style={{flex: 10, alignSelf: 'stretch'}}
					>

					</View>
				</View>);
	}
}

const mapStateToProps = state => ({
		noSiteObjectId: state.site.noSiteObjectId,
		closeSites: selectCloseSites(state)
});

function bindAction(dispatch, ownProps) {
	return {
		gotoCreateNewSite: () => {
			dispatch(editSite(ownProps.noSiteObjectId));
			dispatch(NavigationActions.navigate({routeName: 'EditSite'}))
		},
		selectNoSite: () => dispatch(selectSite(ownProps.noSiteObjectId)),
		goBack: () => dispatch(NavigationActions.back())
	};
}

export default connect(mapStateToProps, bindAction)(SelectSiteView);
