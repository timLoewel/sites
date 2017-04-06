/**
 * Created by tim on 28/03/17.
 */
import {createSelector} from 'reselect'


const getAllPhotos = (state) => {
	const allLocalPhotos = state.photo.localPhotosByLocalObjectId;
	const allServerPhotos = state.photo.photosByObjectId;
	return allLocalPhotos.concat(allServerPhotos);
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

						return photos.toArray();
		}
)