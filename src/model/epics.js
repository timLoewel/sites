/**
 * Created by tim on 14/03/17.
 */
import {Observable} from 'rxjs';
import {combineEpics} from 'redux-observable';
import profileEpic from './profile/profileEpic';
import geolocationEpic from './systemState/geolocationEpic';
import uiEpic from './ui/uiEpics';
import photoEpic from './photo/photoEpic';
import siteEpic from './site/siteEpic';
import networkStateEpic from './systemState/networkStateEpic';
import debugEpic from './systemState/debugEpic';
import serverEpic from './server/serverEpic';
import {storeInitialized} from './store';
import {REHYDRATE} from 'redux-persist/constants'
import {startGPS, startNetworkMonitor} from './systemState/systemStateReducer';


const storeInitializedEpic = (action$, store) =>
		action$.ofType(REHYDRATE).map(action =>
				storeInitialized());


export default combineEpics(
		storeInitializedEpic,
		profileEpic,
		geolocationEpic,
		networkStateEpic,
		uiEpic,
		photoEpic,
		siteEpic,
		debugEpic,
		serverEpic
);