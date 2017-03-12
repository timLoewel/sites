import {combineReducers} from 'redux';
// import cardNavigation from './navigation/cardNavigationReducer';
// import workbench from './workbench';
// import tasksViewReducer from './tasksViewReducer';
// import newPhotoViewReducer from './newPhotoViewReducer';
// import geoLocationReducer from './geoLocationReducer';
// import allSitesViewReducer from './allSitesViewReducer';
import navigation from './navigation/navigationReducer';

export default combineReducers({
	navigation,
});
