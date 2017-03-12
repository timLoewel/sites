import {
	NavigationActions,
	addNavigationHelpers,
	StackNavigator,
	TabNavigator,
} from 'react-navigation';
import {
	Provider,
	connect,
} from 'react-redux';

import React from 'react';
import {
	AppRegistry,
	AsyncStorage,
	Button,
	StyleSheet,
	Text,
	View,
} from 'react-native';

import CameraView from '../../../components/tabCamera/CameraView';
import PhotosView from '../../../components/tabPhotos/PhotosView';
import SitesView from '../../../components/tabSites/SitesView';
import ProfileView from '../../../components/tabProfile/ProfileView';

import CommentsView from '../../../components/comments/CommentsView';
import ContactsView from '../../../components/contacts/ContactsView';
import NewPhotoView from '../../../components/newPhoto/NewPhotoView';
import NewAlbumView from '../../../components/newAlbum/NewAlbumView';
import SelectContactView from '../../../components/selectContact/SelectContactsView';
import SelectForExportView from '../../../components/selectForExport/SelectForExportView';
import SelectLocationView from '../../../components/selectLocation/SelectLocationView';
import SelectSiteView from '../../../components/selectSite/SelectSiteView';
import SingleAlbumView from '../../../components/singleAlbum/SingleAlbumView';
import SinglePhotoView from '../../../components/singlePhoto/SinglePhotoView';
import SingleSiteView from '../../../components/singleSite/SingleSiteView';

/**
 * Created by tim on 10/03/17.
 */


const Screen = (title, next) => {
	if (!next) {
		next = 'Camera'
	}
	const result = () => (
			<View style={styles.container}>
				<Text style={styles.welcome}>
					{title}
				</Text>
				<Button
						onPress={() => this.props.navigation.navigate('Notifications')}
						title={next}
				/>
			</View>
	);
	result.navigationOptions = {
		title: title,
	};
	return result;
}

export const MainTabsScreen = TabNavigator({
	Camera: {screen: CameraView,},
	Photos: {screen: PhotosView,},
	Sites: { screen: SitesView,},
	Profile: {
		screen: ProfileView,
	},
}, {
	tabBarOptions: {
		activeTintColor: '#e91e63',
		tabBarPosition: 'top',
		swipeEnabled: true,
		animationEnabled: true,
		lazyLoad: false,
		initialRouteName: 'Camera',
		order: ['Camera', 'Photos', 'Sites', 'Profile']
	},

});


// the stack is the main navigation
export const AppNavigator = StackNavigator({
			MainTabs: {
				screen: MainTabsScreen,
				navigationOptions: {
					header: {
						visible: false,
					}
				},
			},
			Login: {screen: Screen('Login')},
			SingleSite: {
				screen: SingleSiteView,
				path: 'site/:name',
				navigationOptions: {
					cardStack: {
						gesturesEnabled: true
					}
				}
			},
			SingleAlbum: {
				screen: SingleAlbumView,
				path: 'album/:name',
				navigationOptions: {
					cardStack: {
						gesturesEnabled: true
					}
				}
			},
			SinglePhoto: {
				screen: SinglePhotoView,
				path: 'photo/:name',
				navigationOptions: {
					cardStack: {
						gesturesEnabled: true
					}
				}
			},
			NewPhoto: {screen: NewPhotoView},
			NewAlbum: {screen: NewAlbumView},
			SelectForExport: {screen: SelectForExportView},
			Comments: {screen: CommentsView},
			SelectContact: {screen: SelectContactView},
			SelectSite: {screen: SelectSiteView},
			SelectLocation: {screen: SelectLocationView},
			Contacts: {screen: ContactsView,navigationOptions: {
				cardStack: {
					gesturesEnabled: true
				}
			}},
		}
);


const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF',
	},
	welcome: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
	},
	instructions: {
		textAlign: 'center',
		color: '#333333',
		marginBottom: 5,
	},
});

export const AppWithNavigationState = connect(state => ({
	nav: state.ui.navigation,
}))(({dispatch, nav}) => (
		<AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })}/>
));