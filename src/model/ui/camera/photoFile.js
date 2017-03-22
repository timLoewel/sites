/**
 * Created by tim on 17/03/17.
 */
import moment from 'moment';
import RNFetchBlob from 'react-native-fetch-blob';

const IMAGE_FILE_SUFFIX = '.jpg';
const PHOTO_CLASS = 'Photo';

function checkFile(photoPath, fileName, i) {
	const resultFileName = fileName + '_' + (i < 10 ? '0' : '') + (i < 100 ? '0' : '') + i;
	console.log('testing filename ' + photoPath + resultFileName + IMAGE_FILE_SUFFIX);

	return RNFetchBlob.fs.exists(photoPath + resultFileName + IMAGE_FILE_SUFFIX)
			.then((exists) => {
				if (exists) {
					return checkFile(photoPath, fileName, i + 1);
				} else {
					return {photoPath: photoPath, uniquePhotoName: resultFileName + IMAGE_FILE_SUFFIX};
				}
			}).catch((err) => {
		console.log('could not create unique filename ' + err);
	});
}

// creates a unique name
export function createUniqueLocalPhotoFilename(photoTakenAt) {
	const fileName = 'sites_work_' + moment(photoTakenAt).format('Y_MMM_d_HH_mm_ss')
	var i = 0;
	var resultFileName = fileName + '00';
	// console.log('1' + fs.MainBundlePath);
	// console.log('2' + fs.DocumentDirectoryPath);
	// console.log('3' + fs.LibraryDirectoryPath);
	// console.log('4' + fs.PicturesDirectoryPath);
	// console.log('5' + fs.ExternalDirectoryPath);
	// console.log('6' + fs);
	const photoPath = RNFetchBlob.fs.dirs.DocumentDirectoryPath + '/';
	return checkFile(photoPath, fileName, 0);
}