/**
 * Created by tim on 04/04/17.
 */
import {createSelector} from 'reselect';
import haversineDistance from 'geodetic-haversine-distance';
import {NULL_LOCATION} from '../systemState/geolocationReducer';

const MIN_DIST_METERS_FOR_CURRENT_SITE = 500;

const getAllSites = (state) => {
	const allLocalSites = state.site.localSitesByLocalObjectId;
	const allServerSites = state.site.sitesByObjectId;
	return {sites: allLocalSites.concat(allServerSites), noSite: state.site.noSite};
};

const getVisibilityFilter = (state) => {
	return state.geolocation.location;
};

export default createSelector(
		[getVisibilityFilter, getAllSites],
		(currentPosition, sites) => {
			if (currentPosition === NULL_LOCATION) {
				return sites.noSite;
			}
			// get the closest site
			const minDistSite = sites.sites.minBy(site => {
				return haversineDistance(site.selectedLocation, currentPosition);
			});

			if (minDistSite && haversineDistance(minDistSite.selectedLocation, currentPosition)
					< MIN_DIST_METERS_FOR_CURRENT_SITE) {
				return minDistSite;
			} else {
				return sites.noSite;
			}
		}
);