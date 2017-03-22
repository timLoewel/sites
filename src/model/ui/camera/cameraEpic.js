/**
 * Created by tim on 16/03/17.
 */
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import {combineEpics} from 'redux-observable';
import Exif from 'react-native-exif';
import {setRawPhotoLocalData, photographing, errorOnPhoto} from './cameraReducer';
import {showAlert} from '../globalAlertEpic';
import I18n from '../../../assets/translations';
import * as env from '../../env';


// wait for photo, get exif, dispatch setRawPhotoLocalData
const photographingEpic = (action$) =>
		action$.ofType(photographing.getType())
				.flatMap(action =>
						Observable.fromPromise(action.payload).flatMap(photo =>
								Observable.fromPromise(Exif.getExif(photo.path)).flatMap(exif =>
									Observable.of(
												setRawPhotoLocalData({
													uri: exif.originalUri,
													photoHeight: exif.ImageHeight,
													photoWidth: exif.ImageWidth,
													orientation: exif.Orientation
												})
									)
								)
						).catch(error => Observable.from([errorOnPhoto(error),showAlert(I18n.t('camera.photoCouldNotBeTaken'))]))
				);



// a new photo is added to the local db, and upload of the json to the server, then update the local db entry.
const initPhotoLocalAndOnServerEpic = (action$, state) =>
		action$.ofType(setRawPhotoLocalData.getType())
				.flatMap(action =>
						Observable.fromPromise(action.payload).flatMap(photo =>
								Observable.fromPromise(Exif.getExif(photo.path)).flatMap(exif =>
										Observable.of(
												setRawPhotoLocalData({
													uri: exif.originalUri,
													photoHeight: exif.ImageHeight,
													photoWidth: exif.ImageWidth,
													orientation: exif.Orientation
												})
										)
								)
						).catch(error => Observable.from([errorOnPhoto(error),showAlert(I18n.t('camera.photoCouldNotBeTaken'))]))
				);


export function addNewLocalPhoto(photo: {siteObjectId: string, formattedPhotoAddress: string,
	creatorObjectId: string, creatorName:string, photoDescription: string}) {
	return function (dispatch, getState) {
		const initialPhotoEntry = {
			...photo,
			shareableUri: '',
			uriPhotoServer: '',
			uriPhotoLocal: '',
			state: PHOTO_STATE.CREATED
		};
		const sessionToken = getState().auth.get('sessionToken');
		console.log('addLocalPhoto 1');
		return save(PHOTO_CLASS, initialPhotoEntry, sessionToken)
				.then(result => {
					console.log('addLocalPhoto 2 ');
					const str = JSON.stringify(result, null, 4);

					const shareableUri = createShareableUri(result.data.objectId);
					const updatedPhotoJson = {
						objectId: result.data.objectId,
						createdAt: new Date(result.data.createdAt),
						shareableUri: shareableUri,
						state: PHOTO_STATE.JSON_UPLOADED
					};
					console.log('addLocalPhoto 3');
					dispatch(setServerPhotoData(updatedPhotoJson.objectId, shareableUri, updatedPhotoJson.createdAt));
					console.log('addLocalPhoto 4');
					dispatch(addPhoto(updatedPhotoJson));
					console.log('addLocalPhoto 5');

				}).catch((err) => {
					const str = JSON.stringify(err, null, 4);
					console.log('error during photo json upload: \n' + str);
					console.log('error during photo json upload: \n' + err);
				});
	}
}


export default combineEpics(photographingEpic, initPhotoLocalAndOnServerEpic)