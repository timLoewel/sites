/**
 * Created by tim on 15/03/17.
 */
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