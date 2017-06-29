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

import CameraView from '../tabCamera/CameraView';
import PhotosView from '../tabPhotos/PhotosView';
import SitesView from '../tabSites/SitesView';
import ProfileView from '../tabProfile/ProfileView';

import CommentsView from '../comments/CommentsView';
import ContactsView from '../contacts/ContactsView';
import NewPhotoView from '../newPhoto/NewPhotoView';
import NewAlbumView from '../newAlbum/NewAlbumView';
import SelectContactView from '../selectContact/SelectContactsView';
import SelectForExportView from '../selectForExport/SelectForExportView';
import SelectLocationView from '../selectLocation/SelectLocationView';
import SelectSiteView from '../selectSite/SelectSiteView';
import SingleAlbumView from '../singleAlbum/SingleAlbumView';
import SinglePhotoView from '../singlePhoto/SinglePhotoView';
import SingleSiteView from '../singleSite/SingleSiteView';

/**
 * Created by tim on 10/03/17.
 */



export const MainTabsScreen = TabNavigator({
	Camera: {screen: CameraView,},
	Photos: {screen: PhotosView,},
	// Sites: { screen: SitesView,},
	// Profile: {
	// 	screen: ProfileView,
	// },
}, {
	lazy: true,
	swipeEnabled: true,
	animationEnabled: true,
	initialRouteName: 'Camera',
	order: ['Camera', 'Photos'],// 'Sites', 'Profile']

	tabBarOptions: {
		activeTintColor: '#e91e63',
		tabBarPosition: 'top',
		style: {height:40}
	},

});


// the stack is the main mainNavigation
export const AppNavigator = StackNavigator({
	// Login: {screen: Screen('Login')},
			MainTabs: {
						screen: MainTabsScreen,
						navigationOptions: {
							header: null
						},
					},
			// SingleSite: {
			// 	screen: SingleSiteView,
			// 	path: 'site/:name',
			// 	navigationOptions: {
			// 		cardStack: {
			// 			gesturesEnabled: true
			// 		}
			// 	}
			// },
			// SingleAlbum: {
			// 	screen: SingleAlbumView,
			// 	path: 'album/:name',
			// 	navigationOptions: {
			// 		cardStack: {
			// 			gesturesEnabled: true
			// 		}
			// 	}
			// },
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
			// NewAlbum: {screen: NewAlbumView},
			// SelectForExport: {screen: SelectForExportView},
			// Comments: {screen: CommentsView},
			// SelectContact: {screen: SelectContactView},
			SelectSite: {screen: SelectSiteView},
			// SelectLocation: {screen: SelectLocationView},
			// Contacts: {screen: ContactsView,navigationOptions: {
			// 	cardStack: {
			// 		gesturesEnabled: true
			// 	}
			//}},
		}
);

export const AppWithNavigationState = connect(state => ({
	nav: state.ui.navigation,
}))(({dispatch, nav}) => (
		<AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })}/>
));