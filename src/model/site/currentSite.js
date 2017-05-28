/**
 * Created by tim on 04/04/17.
 */
import {createSelector} from 'reselect';
import haversineDistance from 'geodetic-haversine-distance';

const MIN_DIST_METERS_FOR_CURRENT_SITE = 500;

const getAllSites = (state) => {
	const allLocalSites = state.site.localSitesByLocalObjectId;
	const allServerSites = state.site.sitesByObjectId;
	return {sites: allLocalSites.concat(allServerSites), noSite: state.site.noSite};
};

const getVisibilityFilter = (state) => {
	return state.systemState.position;
};

export default createSelector(
		[getVisibilityFilter, getAllSites],
		(currentPosition, sites) => {
			// get the closest site
			const minDistSite = sites.sites.minBy(site => {
				return haversineDistance(site.selectedLocation, currentPosition);

			});

			if (minDistSite && haversineDistance(
							minDistSite.selectedLocation.latitude, minDistSite.selectedLocation.longitude,
							currentPosition.latitude, currentPosition.longitude) < MIN_DIST_METERS_FOR_CURRENT_SITE) {
				return minDistSite;
			} else {
				return sites.noSite;
			}
		}
);