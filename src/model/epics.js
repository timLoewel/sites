/**
 * Created by tim on 14/03/17.
 */
import {combineEpics} from 'redux-observable';
import profileEpic from './profile/profileEpic';
import geolocationEpic from './geolocation/geolocationEpic';
import uiEpic from './ui/uiEpics';

export default combineEpics(
		profileEpic,
		geolocationEpic,
		uiEpic,
);