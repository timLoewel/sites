/**
 * Created by tim on 13/06/17.
 */
import React from 'react';
import {View, Text, ScrollView,} from 'react-native';
import {storiesOf, action, linkTo} from '@storybook/react-native';
import { createStore} from 'redux';
import { Provider } from 'react-redux';
import CameraView from './CameraViewRaw';
import {NULL_LOCATION} from '../../model/systemState/geolocationReducer';
/*
 const mapStateToProps = state => ({
 siteName: undefined,//state.ui.cameraReducer.siteName,
 selectedLocation: state.ui.cameraReducer.selectedLocation || state.geolocation.location,
 description: state.ui.cameraReducer.description,
 systemLocation: state.geolocation.location,
 creatorObjectId: state.profile.objectId,
 creatorName: state.profile.currentUser.name,
 photoForRendering: state.ui.cameraReducer.photosWaitingForRendering.get(0),
 currentSite: currentSite(state),
 lastPhotoThumbnail: getLastPhotoThumbnail(state),
 });

 function bindAction(dispatch) {
 return {
 setPhotographing: (photoData) => dispatch(photographing(photoData)),
 renderingDone: (photoData) => dispatch(renderedPhotoReady(photoData)),
 addNewLocalSite: (site) => dispatch(addNewLocalSite(site)),
 gotoPhotos: () => dispatch(NavigationActions.navigate({routeName: 'Photos'})),
 }
 }
 */

const rootReducer = state => state || {};

const store = createStore( rootReducer);

storiesOf('CameraView', module)

		.add('long description', () => (
		<CameraView
				selectedLocation={{longitude: 22, latitude: 12, accuracy:1, address:{formattedAddress:'somewhere selected Strasse 22, 123 Obersland'}}}
				description="some description"
				systemLocation={{longitude: 22, latitude: 11, accuracy:1, address:{formattedAddress:'system location is here'}}}
				creatorObjectId="creatorObjectId"
				creatorName= "creator Name"
				currentSite= {{
					localObjectId: 'localObjectId',
					name: "site Name",
					searchablePosition: {
						"__type": "",
						longitude: 44,
						latitude: 23
					}
				}}
				creator = {{objectId: 'asdf', name: 'name Creator'}}
				publicUrl = "http://publicurl.com"
				lastPhotoThumbnail = {{undefined}}
				setPhotographing={(params) => console.log('setPhotographing', params)}
				renderingDone={(params) => console.log('renderingDone', params)}
				addNewLocalSite={(params) => console.log('addNewLocalSite', params)}
				gotoPhotos={(params) => console.log('gotoPhotos', params)}

		/>
));