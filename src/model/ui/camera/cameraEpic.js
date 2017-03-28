/**
 * Created by tim on 16/03/17.
 */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {combineEpics} from 'redux-observable';
import Exif from 'react-native-exif';
import {setRawPhotoLocalData, photographing, errorOnPhoto, PHOTO_STATE} from './cameraReducer';
import {showAlert} from '../globalAlertEpic';
import I18n from '../../../assets/translations';
import {addPhoto} from '../../photo/photoReducer';
import {createShareableUri} from '../../../server/ParseServer';
import {newObjectId} from '../../../utils/objectId';
import moment from 'moment';
import RNFetchBlob from 'react-native-fetch-blob';
import {resetLastPhoto, setAnnotatedPhotoData} from './cameraReducer';
import {createUniqueLocalPhotoFilename} from './photoFile';

const PHOTO = 'photo';


// wait for photo, get exif, dispatch setRawPhotoLocalData
const photographingEpic = (action$) =>
		action$.ofType(photographing.getType()).do((v) => {
			console.log('photographing Epic');
			console.log(v);
		})
				.flatMap(action =>
						Observable.fromPromise(action.payload).do((v) => {
							console.log('photoPromise done');
							console.log(v);
						}).flatMap(photo =>
								Observable.fromPromise(Exif.getExif(photo.path)).do((v) => {
									console.log('exif promise');
									console.log(v);
								}).flatMap(exif =>
										Observable.of(
												setRawPhotoLocalData({
													uri: exif.originalUri,
													height: exif.ImageHeight,
													width: exif.ImageWidth,
													orientation: exif.Orientation,
													createdAtMillis: moment().valueOf(),
													shareableUri: createShareableUri(),
												})
										)
								)
						).catch(error => {
							console.log('error in photographing epic');
							console.log(error);
							return Observable.from([errorOnPhoto({
								epic: 'photographingEpic',
								error
							}), showAlert(I18n.t('camera.photoCouldNotBeTaken'))])
						})
				);


// the annotated photo was rendered and is copied to the right place and afterwards the photo is added to the local db
const initPhotoLocal = (action$, store) =>
		action$.ofType(setAnnotatedPhotoData.getType()).do((v) => {
			console.log('setAnnotatedPhotoData Epic');
			console.log(v);
		})
				.flatMap(action => createUniqueLocalPhotoFilename(action.payload.createdAtMillis)
						.flatMap((newFilPath) =>
								Observable.fromPromise(RNFetchBlob.fs.mv(action.payload.uri.replace('file://', ''), newFilPath))
										.flatMap(() => Observable.from([addPhoto({
													localObjectId: newObjectId(),
													thumbnailData: action.payload.thumbnailData,
													uriPhotoLocal: newFilPath,
													shareableUri: store.getState().ui.cameraReducer.localPhotoData.shareableUri,
													description: store.getState().ui.cameraReducer.photoDescription,
													creatorObjectId: store.getState().profile.currentUser.parse_objectId,
													creatorName: store.getState().profile.currentUser.name,
													selectedLocation: store.getState().ui.cameraReducer.selectedLocation,
													systemLocation: store.getState().geolocation.position,
													// siteObjectId
												}), resetLastPhoto()])
										)
						).catch(error => {
							console.log('error moving the image file');
							console.log(error);
							return errorOnPhoto({epic: 'initLocalPhotoEpic', error});
						})
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