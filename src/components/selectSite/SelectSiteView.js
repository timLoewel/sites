/**
 * Created by tim on 10/03/17.
 */
import {connect} from 'react-redux';

import React from 'react';
import {
	AppRegistry,
	AsyncStorage,
	StyleSheet,
	Text,
	View,
	FlatList,
} from 'react-native';
import Button from 'react-native-button';
import closeSites from '../../model/site/closeSites';
import I18n from '../../assets/translations';
import {NavigationActions} from 'react-navigation';
import {setSite, noSite} from '../../model/site/siteReducer';


class SelectSiteView extends React.Component {
	static navigationOptions = {
		tabBarLabel: 'SelectSite',
	};

	_noSiteSelected() {
		this.props.selectNoSite();
		this.props.back();
	}

	_createNewSite() {
		this.props.gotoCreateNewSite()
	}

	render() {
		return (
				<View style={{flex: 1, flexDirection: 'column'}}>
					<TextInput style={{flex: 1, flexDirection: 'column'}}/>
					<View style={{flex: 1, flexDirection: 'row'}}>
						<Button
								containerStyle={{
									padding: 10,
									height: 45,
									overflow: 'hidden',
									borderRadius: 4,
									backgroundColor: 'white'
								}}
								style={{fontSize: 20, color: 'red'}}
								title={I18n.t("selectSite.noSite")}
								onPress={this._noSiteSelected.bind(this)}/>
						<Button
								containerStyle={{
									padding: 10,
									height: 45,
									overflow: 'hidden',
									borderRadius: 4,
									backgroundColor: 'white'
								}}
								style={{fontSize: 20, color: 'green'}}
								title={I18n.t("selectSite.createNew")}
								onPress={this._createNewSite.bind(this)}
						/>
					</View>
					<View
							style={{flex: 10, alignSelf: 'stretch'}}
					>

					</View>
				</View>);
	}
}

const mapStateToProps = state => ({
		noSite: state.site.noSite,
		closeSites: closeSites(state),
});

function bindAction(dispatch, ownProps) {
	console.log('bind action selectSiteView');
	console.log(ownProps);
	return {
		gotoCreateNewSite: () => dispatch(NavigationActions.navigate({routeName: 'CreateNewSite'})),
		selectNoSite: () => dispatch(setSite(ownProps.noSite)),
		goBack: () => dispatch(NavigationActions.back())
	};
}

export default connect(mapStateToProps, bindAction)(SelectSiteView);
