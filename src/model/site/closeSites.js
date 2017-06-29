/**
 * Created by tim on 23/06/17.
 */
import {createSelector} from 'reselect';
import haversineDistance from 'geodetic-haversine-distance';
import {NULL_LOCATION} from '../systemState/geolocationReducer';

const MIN_DIST_METERS_FOR_CLOSE_SITE = 500;

const getAllSites = (state) => {
	const allLocalSites = state.site.localSitesByLocalObjectId;
	const allServerSites = state.site.sitesByObjectId;
	return allLocalSites.concat(allServerSites);
};

const getVisibilityFilter = (state) => {
	return state.geolocation.location;
};

export default createSelector(
		[getVisibilityFilter, getAllSites],
		(currentPosition, sites) => {
			if (currentPosition === NULL_LOCATION) {
				//TODO return the users most used sites.
				return {};
			}
			return sites.takeWhile(site => {
				return haversineDistance(site.selectedLocation, currentPosition) < MIN_DIST_METERS_FOR_CLOSE_SITE;
			});
		}
);