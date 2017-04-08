/**
 * Created by tim on 04/04/17.
 */
import {createSelector} from 'reselect';
import haversineDistance from 'geodetic-haversine-distance';
import {NOSITE} from './siteReducer';

const MIN_DIST_METERS_FOR_CURRENT_SITE = 100;

const getAllSites = (state) => {
	const allLocalSites = state.site.localSitesByLocalObjectId;
	const allServerSites = state.site.sitesByObjectId;
	return allLocalSites.concat(allServerSites);
}

const getVisibilityFilter = (state) => {
	return state.geolocation.position;
}

export default createSelector(
		[getVisibilityFilter, getAllSites],
		(currentPosition, sites) => {
			const minDistSite = sites.minBy(site => {
				const dist = haversineDistance(site.selectedLocation, currentPosition);
				return dist;
			});
			if (minDistSite && haversineDistance(
							minDistSite.selectedLocation.latitude, minDistSite.selectedLocation.longitude,
							currentPosition.latitude, currentPosition.longitude) < MIN_DIST_METERS_FOR_CURRENT_SITE) {
				return minDistSite;
			} else {
				return NOSITE;
			}
		}
);