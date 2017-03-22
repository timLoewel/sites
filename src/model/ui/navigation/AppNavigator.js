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



export const MainTabsScreen = TabNavigator({
	Camera: {screen: CameraView,},
	Photos: {screen: PhotosView,},
	// Sites: { screen: SitesView,},
	// Profile: {
	// 	screen: ProfileView,
	// },
}, {
	tabBarOptions: {
		visible:false,
		activeTintColor: '#e91e63',
		tabBarPosition: 'top',
		swipeEnabled: true,
		animationEnabled: true,
		lazyLoad: false,
		initialRouteName: 'Camera',
		order: ['Camera', 'Photos'],// 'Sites', 'Profile']
		style: {height:0}
	},

});


// the stack is the main navigation
export const AppNavigator = StackNavigator({
	// Login: {screen: Screen('Login')},
			MainTabs: {
						screen: MainTabsScreen,
						navigationOptions: {
							header: {
								visible: false,
							}
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
			// SelectSite: {screen: SelectSiteView},
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