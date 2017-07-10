/**
 * Created by tim on 04/04/17.
 */

import {createSelector} from 'reselect';
import haversineDistance from 'geodetic-haversine-distance';
import {NULL_LOCATION} from '../systemState/geolocationReducer';

const MIN_DIST_METERS_FOR_CLOSE_SITE = 500;

const MIN_DIST_METERS_FOR_CURRENT_SITE = 500;

const getAllSites = (state) => {
	const allLocalSites = state.site.localSitesByLocalObjectId;
	const allServerSites = state.site.sitesByObjectId;
	const allSites = allLocalSites.concat(allServerSites);
	return {
		allSites: allSites,
	};
};


const getVisibilityFilter = (state) => {
	return {
		location: state.geolocation.location,
		selectedSiteObjectId: state.site.selectedSiteObjectId,
		noSiteObjectId: state.site.noSiteObjectId
	};
};

export const selectCloseSites = createSelector(
		[getVisibilityFilter, getAllSites],
		(filter, sites) => {
			if (filter.location === NULL_LOCATION) {
				//TODO return the users most used sites?
				return {};
			}
			return sites.allSites.takeWhile(site => {
				return haversineDistance(site.selectedLocation, filter.location) < MIN_DIST_METERS_FOR_CLOSE_SITE;
			});
		}
);


export const getNoSiteSite = (state) => (state.site.sitesByObjectId.get(state.site.noSiteObjectId)
																			|| state.site.localSitesByLocalObjectId.get(state.site.noSiteObjectId) );

export const getSelectedSite = (state) => (state.site.sitesByObjectId.get(state.site.selectedSiteObjectId)
																				|| state.site.localSitesByLocalObjectId.get(state.site.selectedSiteObjectId) );


export const selectCurrentSite = createSelector(
		[getVisibilityFilter, getAllSites],
		(filter, sites) => {
			const noSite = sites.allSites.get(filter.noSiteObjectId);

			if (filter.selectedSiteObjectId &&
					!(		filter.selectedSiteObjectId === noSite.objectId
						|| 	filter.selectedSiteObjectId === noSite.localObjectId)
			) { // if a site was selected and it is not the noSite site
				const selectedSite = sites.allSites.get(filter.selectedSiteObjectId);
				if (selectedSite && haversineDistance(selectedSite.selectedLocation, filter.location)
						< MIN_DIST_METERS_FOR_CURRENT_SITE) {
					return selectedSite;
				}
			}

			// no current site selected
			if (filter.location === NULL_LOCATION) {
				// no location known. we can not propose valid site
				return noSite;
			}

			// get the closest site
			const minDistSite = sites.allSites.minBy(site => {
				return haversineDistance(site.selectedLocation, filter.location);
			});

			if (minDistSite && haversineDistance(minDistSite.selectedLocation, currentPosition)
					< MIN_DIST_METERS_FOR_CURRENT_SITE) {
				return minDistSite;
			} else {
				return noSite;
			}
		}
);

export const selectNoSite = (state) => {
	getAllSites(state)
}