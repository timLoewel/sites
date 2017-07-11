/**
 * Created by tim on 17/03/17.
 */
//@flow
import moment from "moment";
import RNFetchBlob from "react-native-fetch-blob";
import { Observable } from "rxjs/Observable";

const IMAGE_FILE_SUFFIX = ".jpg";
const PHOTO_CLASS = "Photo";

const PHOTOPATH = RNFetchBlob.fs.dirs.DocumentDir + "/";

function checkFile(
  photoPath: string,
  fileName: string,
  photoNumberPrefix: number
) {
  const resultFileName =
    fileName +
    "_" +
    (photoNumberPrefix < 10 ? "0" : "") +
    (photoNumberPrefix < 100 ? "0" : "") +
    photoNumberPrefix;
  return RNFetchBlob.fs
    .exists(photoPath + resultFileName + IMAGE_FILE_SUFFIX)
    .then(exists => {
      if (exists) {
        return checkFile(photoPath, fileName, photoNumberPrefix + 1);
      } else {
        return photoPath + resultFileName + IMAGE_FILE_SUFFIX;
      }
    })
    .catch(err => {
      console.log("could not create unique filename " + err);
    });
}

// returns a promise, that will resolve into a unique filename
export function createUniqueLocalPhotoFilename(photoTakenAtMillis: number) {
  const fileName =
    "obob_work_" + moment(photoTakenAtMillis).format("Y_MMM_d_HH_mm_ss");
  let i = 0;
  let resultFileName = fileName + "00";
  // console.log('1' + fs.MainBundlePath);
  // console.log('2' + fs.DocumentDirectoryPath);
  // console.log('3' + fs.LibraryDirectoryPath);
  // console.log('4' + fs.PicturesDirectoryPath);
  // console.log('5' + fs.ExternalDirectoryPath);
  // console.log('6' + fs);
  return Observable.fromPromise(checkFile(PHOTOPATH, fileName, 0));
}
