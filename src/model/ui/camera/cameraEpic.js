/**
 * Created by tim on 16/03/17.
 */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {combineEpics} from 'redux-observable';
import Exif from 'react-native-exif';
import {enqueuePhotoForRendering, photographing, errorOnPhoto} from './cameraReducer';
import {showAlert} from '../globalAlertEpic';
import I18n from '../../../assets/translations';
import {addPhoto} from '../../photo/photoReducer';
import {newObjectId} from '../../../utils/objectId';
import RNFetchBlob from 'react-native-fetch-blob';
import {resetLastPhoto, renderingDone} from './cameraReducer';
import {createUniqueLocalPhotoFilename} from './photoFile';

const PHOTO = 'photo';


// wait for photo, get exif, dispatch setRawPhotoLocalData
const photographingEpic = (action$) =>
		action$.ofType(photographing.getType()).do((v) => {
			console.log('photographing Epic');
		})
				.flatMap(photographingAction =>
						Observable.fromPromise(photographingAction.payload.capture).do((v) => {
							console.log('photoPromise done');
						}).flatMap(photo =>
								Observable.fromPromise(Exif.getExif(photo.path)).do((v) => {
									console.log('exif promise');
								}).flatMap(exif =>
										Observable.of(
												enqueuePhotoForRendering({
													uriOriginalPhoto: exif.originalUri,
													height: exif.ImageHeight,
													width: exif.ImageWidth,
													orientation: exif.Orientation,
													createdAtMillis: photographingAction.payload.createdAtMillis,//moment().valueOf(),
													shareableUri: photographingAction.payload.shareableUri,
													description: photographingAction.payload.description,
													siteObjectId: photographingAction.payload.siteObjectId,
													siteName: photographingAction.payload.siteName,
													creatorObjectId: photographingAction.payload.creatorObjectId,//store.getState().profile.currentUser.parse_objectId,
													creatorName: photographingAction.payload.creatorName,//store.getState().profile.currentUser.name,
													selectedLocation: photographingAction.payload.selectedLocation,//store.getState().ui.cameraReducer.selectedLocation,
													systemLocation: photographingAction.payload.systemLocation,// action.payload.store.getState().geolocation.position
												})
										)
								)
						).catch(error => {
							console.log(photographingAction.payload.createdAtMillis +' error in photographing epic');
							console.log(error);
							return Observable.from([errorOnPhoto({
								epic: 'photographingEpic',
								error
							}), showAlert(I18n.t('camera.photoCouldNotBeTaken'))])
						}).do(() => {console.log('photographing epic done')})
				);


// the annotated photo was rendered and is copied to the right place and afterwards the photo is added to the local db
const initPhotoLocal = (action$, store) =>
		action$.ofType(renderingDone.getType()).do((renderingDoneAction) => {
			RNFetchBlob.fs.unlink(renderingDoneAction.payload.uriOriginalPhoto).catch((err) => console.log(err));
		})
				.flatMap(renderingDoneAction => createUniqueLocalPhotoFilename(renderingDoneAction.payload.createdAtMillis)
						.flatMap((newFilePath) =>
								Observable.fromPromise(RNFetchBlob.fs.mv(renderingDoneAction.payload.uriPhotoLocal.replace('file://', ''), newFilePath))
										.flatMap(() => Observable.of(addPhoto({
													localObjectId: newObjectId(),
													thumbnailData: renderingDoneAction.payload.thumbnailData,
													uriPhotoLocal: newFilePath,
													shareableUri: renderingDoneAction.payload.shareableUri,
													description: renderingDoneAction.payload.photoDescription,
													siteObjectId: renderingDoneAction.payload.siteObjectId,
													siteName: renderingDoneAction.payload.siteName,
													creatorObjectId: renderingDoneAction.payload.creatorObjectId,//store.getState().profile.currentUser.parse_objectId,
													creatorName: renderingDoneAction.payload.creatorName,//store.getState().profile.currentUser.name,
													selectedLocation: renderingDoneAction.payload.selectedLocation,//store.getState().ui.cameraReducer.selectedLocation,
													systemLocation: renderingDoneAction.payload.systemLocation,// action.payload.store.getState().geolocation.position,
													// siteObjectId
												}))
										)
						).catch(error => {
							console.log('error moving the image file');
							console.log(error);
							return errorOnPhoto({epic: 'initLocalPhotoEpic', error});
						}).do(() => {console.log(renderingDoneAction.payload.createdAtMillis + ' RenderingDone epic done')})
				);

//
// const sendLocalPhotoToServer = (action$, state) =>
// 		action$.ofType(addPhoto.getType()).filter(v => state.profile.sessionToken && v.payload.objectId === undefined)
// 				.map(
// 		Observable.fromPromise(action.payload).flatMap(photo =>
// 				Observable.fromPromise(Exif.getExif(photo.path)).flatMap(exif =>
// 						Observable.of(
// 								setRawPhotoLocalData({
// 									uri: exif.originalUri,
// 									photoHeight: exif.ImageHeight,
// 									photoWidth: exif.ImageWidth,
// 									orientation: exif.Orientation
// 								})
// 						)
// 				)
// 		).catch(error => Observable.from([errorOnPhoto(error),showAlert(I18n.t('camera.photoCouldNotBeTaken'))]))
// );

// const IMAGE_FILE_SUFFIX = '.jpg';
// const PHOTO_CLASS = 'Photo';
//
// function addNewLocalPhoto(action, state) {
// 	return;
// 	return addPhoto(initialPhotoEntry)
// 	const sessionToken = state.profile.sessionToken;
//
// 	console.log('addLocalPhoto 1');
// 	return save(PHOTO_CLASS, initialPhotoEntry, sessionToken);
// }
//
// function updateLocalPhoto(resultFromServer) {
// 	console.log('addLocalPhoto 2 ');
// 	const str = JSON.stringify(resultFromServer, null, 4);
//
// 	const shareableUri = createShareableUri(resultFromServer.data.objectId);
// 	const updatedPhotoJson = {
// 		objectId: resultFromServer.data.objectId,
// 		createdAt: new Date(resultFromServer.data.createdAt),
// 		shareableUri: shareableUri,
// 		state: PHOTO_STATE.JSON_UPLOADED
// 	};
// 	console.log('addLocalPhoto 3');
// 	return setServerPhotoData(updatedPhotoJson.objectId, shareableUri, updatedPhotoJson.createdAt);
// 	console.log('addLocalPhoto 4');
// 	dispatch(addPhoto(updatedPhotoJson));
// 	console.log('addLocalPhoto 5');
//
// }
// ).
// catch((err) => {
// 	const str = JSON.stringify(err, null, 4);
// 	console.log('error during photo json upload: \n' + str);
// 	console.log('error during photo json upload: \n' + err);
// });
// }
// }


export default combineEpics(photographingEpic, initPhotoLocal);