/**
 * Created by tim on 28/03/17.
 */
/**
 * Created by tim on 02/12/16.
 */
import {createSelector} from 'reselect'

let transformForAlbumView = function (result, photos ) {
	Object.keys(photos).forEach((photoObjectId) => {
		photo = photos[photoObjectId];
		result.push(
				{
					objectId: photo.objectId,
					localObjectId: photo.localObjectId,
					// thumb: photo.thumbnailData, // thumbnail version of the photo to be displayed in grid view. actual photo is used if thumb is not provided
					photo: 'file://'+photo.uriPhotoLocal, // a remote photo or local media url
					caption: photo.description, // photo caption to be displayed
					selected: false, // set the photo selected initially(default is false)
				});
	});
};

const getAllPhotos = (state) => {
	const allLocalPhotos = state.photo.localPhotosByLocalObjectId;
	const allServerPhotos = state.photo.photosByObjectId;
	result = [];
	transformForAlbumView(result, allLocalPhotos.asMutable());
	transformForAlbumView(result, allServerPhotos.asMutable());
	return result;
}

const getVisibilityFilter = (state) => {
	return {
		filterType: 0,
	}
}

export const getVisiblePhotos = createSelector(
		[getVisibilityFilter, getAllPhotos],
		(visibilityFilter, photos) => {
		 				// return taskCards.filter(card => card.siteObjectId == visibilityFilter.siteObjectId)
						return photos;
		}
)