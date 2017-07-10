/**
 * Created by tim on 16/03/17.
 */
//@flow

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {combineEpics} from 'redux-observable';
import Exif from 'react-native-exif';
import {enqueuePhotoForRendering, photographing, errorOnPhoto} from './cameraReducer';
import {showAlert} from '../globalAlertEpic';
import I18n from '../../../assets/translations';
import {addLocalPhoto} from '../../photo/photoReducer';
import {newObjectId} from '../../../utils/objectId';
import RNFetchBlob from 'react-native-fetch-blob';
import {resetLastPhoto, screenshotDone} from './cameraReducer';
import {createUniqueLocalPhotoFilename} from './photoFile';

import type {IPhoto} from '../../ModelTypes';

const PHOTO = 'photo';

// wait for photo, get exif, dispatch setRawPhotoLocalData
const photographingEpic = (action$: any, store: any):any =>
		action$.ofType(photographing.getType()).do((v) => {
			console.log('photographing Epic');
		})
				.flatMap(photographingAction =>
						Observable.fromPromise(photographingAction.payload.capture).do((v) => {
							console.log('photoPromise done');
						}).flatMap(photo =>
								Observable.fromPromise(Exif.getExif(photo.path))
										.flatMap(exif => {
											const newPhoto: IPhoto = {
												//THIS IS WHERE A PHOTO GETS CREATED
												a: 33,
												uriOriginalPhoto: exif.originalUri,
												height: exif.ImageHeight,
												width: exif.ImageWidth,
												orientation: exif.Orientation,
												createdAtMillis: photographingAction.payload.createdAtMillis,//moment().valueOf(),
												shareableUri: photographingAction.payload.shareableUri,
												description: photographingAction.payload.description,
												site: photographingAction.payload.site,
												creator: {
													"__type": "Pointer",
													"className": "_User",
													objectId: photographingAction.payload.creatorObjectId,
												},
												creatorName: photographingAction.payload.creatorName,//store.getState().profile.currentUser.name,
												searchablePosition: {
													__type: 'GeoPoint',
													longitude: photographingAction.payload.selectedLocation.longitude,
													latitude: photographingAction.payload.selectedLocation.latitude
												},
												selectedLocation: {...photographingAction.payload.selectedLocation},//store.getState().ui.cameraReducer.selectedLocation,
												systemLocation: photographingAction.payload.systemLocation,// action.payload.store.getState().systemState.position
											};
											return (Observable.of(enqueuePhotoForRendering(newPhoto)):IObservable);
										})
						).catch(error => {
							console.log(photographingAction.payload.createdAtMillis + ' error in photographing epic');
							console.log(error);
							return Observable.from([errorOnPhoto({
								epic: 'photographingEpic',
								error
							}), showAlert(I18n.t('camera.photoCouldNotBeTaken'))])
						}).do(() => {
							console.log('photographing epic done')
						})
				);


// the annotated photo was rendered and is copied to the right place and afterwards the photo is added to the local db
const initPhotoLocal = (action$, store) =>
		action$.ofType(screenshotDone.getType()).do((screenshotDoneAction) => {
			RNFetchBlob.fs.unlink(screenshotDoneAction.payload.uriOriginalPhoto).catch((err) => console.log(err));
		})
				.flatMap(screenshotDoneAction => createUniqueLocalPhotoFilename(screenshotDoneAction.payload.createdAtMillis)
						.flatMap((newFilePath) =>
								Observable.fromPromise(RNFetchBlob.fs.mv(screenshotDoneAction.payload.uriPhotoLocal.replace('file://', ''), newFilePath))
										.flatMap(() => Observable.of(addLocalPhoto({
													localObjectId: newObjectId(),
													thumbnailData: screenshotDoneAction.payload.thumbnailData,
													uriPhotoLocal: newFilePath,
													shareableUri: screenshotDoneAction.payload.shareableUri,
													description: screenshotDoneAction.payload.photoDescription,
													siteObjectId: screenshotDoneAction.payload.site.objectId || screenshotDoneAction.payload.site.localObjectId,
													siteName: screenshotDoneAction.payload.site.name,
													creator: screenshotDoneAction.payload.creator,
													creatorName: screenshotDoneAction.payload.creatorName,
													searchablePosition: screenshotDoneAction.payload.searchablePosition,
													selectedLocation: screenshotDoneAction.payload.selectedLocation,
													systemLocation: screenshotDoneAction.payload.systemLocation,// action.payload.store.getState().systemState.position,
													// siteObjectId
												}))
										)
						).catch(error => {
							console.log('error moving the image file');
							console.log(error);
							return errorOnPhoto({epic: 'initLocalPhotoEpic', error});
						}).do(() => {
							console.log(screenshotDoneAction.payload.createdAtMillis + ' RenderingDone epic done')
						})
				);


export default combineEpics(photographingEpic, initPhotoLocal);