/**
 * Created by tim on 15/03/17.
 */
// @flow
import { Observable } from "rxjs/Observable";
import { combineEpics } from "redux-observable";
import {
  addLocalPhoto,
  savePhotoFileToServer,
  savePhotoFileToServerDone,
  savePhotoJsonToServerDone
} from "./photoReducer";
import { save, uploadJpg } from "../server/parseServer";
import { uploadLocalData } from "../server/serverReducer";
import {
  setServerReadyForRequests,
  subscribeToQuery
} from "../server/serverSocketReducer";
import { ServerClassNames } from "../ModelTypes";

const serverReadyForRequestsEpic = (action$, store) =>
  action$
    .ofType(setServerReadyForRequests.getType())
    .do(r => {
      console.log("initialzing photo query");
    })
    .map(() =>
      subscribeToQuery(`{
	"className": "${ServerClassNames.Photo}",
	"where": {
		"creator": {
			"__type": "Pointer",
			"className": "User",
			"objectId": "${store.getState().profile.objectId}"
		}
	}
}`)
    );

// upload the photo to the cloud
const batchUploadAllPendingEpic = (action$, store) =>
  action$
    .ofType(uploadLocalData.getType())
    .filter(() => store.getState().systemState.isConnected)
    .flatMap(uploadLocalDataAction =>
      Observable.from(
        store.getState().photo.localPhotosByLocalObjectId.toArray()
      ).map(localPhoto => savePhotoFileToServer(localPhoto))
    )
    .catch(error => {
      console.log("error triggering upload all local photos.");
      console.log(error);
      return Observable.empty();
    });

// when one new photo was added, trigger the upload to the cloud.
const saveNewFilesToServerEpic = (action$, store) =>
  action$
    .ofType(addLocalPhoto.getType())
    .map(addLocalPhotoAction =>
      savePhotoFileToServer(addLocalPhotoAction.payload)
    );

// upload one photo to the cloud
const uploadNewLocalPhotoFileEpic = (action$, store) =>
  action$
    .ofType(savePhotoFileToServer.getType())
    .filter(() => store.getState().systemState.isConnected)
    .flatMap(savePhotoFileToServerAction =>
      uploadJpg(
        savePhotoFileToServerAction.payload.uriPhotoLocal,
        store.getState().profile.sessionToken
      ).map(uploadResult =>
        savePhotoFileToServerDone({
          ...savePhotoFileToServerAction.payload,
          uriPhotoServer: JSON.parse(uploadResult.data).url
        })
      )
    )
    .catch(error => {
      console.log("error moving the image file");
      console.log(error);
      return Observable.empty();
    });

// upload the photo json to the server
const uploadNewLocalPhotoJsonEpic = (action$, store) =>
  action$
    .ofType(savePhotoFileToServerDone.getType())
    .flatMap(savePhotoFileToServerDoneAction =>
      save(
        ServerClassNames.Photo,
        savePhotoFileToServerDoneAction.payload,
        store.getState().profile.sessionToken
      )
        .do(saveResult => {
          console.log(saveResult);
        })
        .map(saveResult =>
          savePhotoJsonToServerDone({
            ...savePhotoFileToServerDoneAction.payload,
            ...saveResult.response
          })
        )
    )
    .catch(error => {
      console.log("error saving the json");
      console.log(error);
      return Observable.empty();
    });

export default combineEpics(
  serverReadyForRequestsEpic,
  batchUploadAllPendingEpic,
  saveNewFilesToServerEpic,
  uploadNewLocalPhotoFileEpic,
  uploadNewLocalPhotoJsonEpic
);
