/**
 * Created by tim on 10/04/17.
 */
import {Observable} from 'rxjs/Observable';
import {NetInfo} from 'react-native';
import 'rxjs/add/observable/empty';


import 'rxjs/add/observable/fromEventPattern';
import {combineEpics} from 'redux-observable';
import {storeInitialized} from '../store';

import {setConnected, setDisconnected, startNetworkMonitor} from './systemStateReducer';

const onStoreInitializedEpic = (action$, store) =>
		action$.ofType(storeInitialized.getType()).map(action =>
				startNetworkMonitor());


/**
 * returns an observable for the netinfo
 */
const getConnectionChangeEventHandler = () => Observable.fromEventPattern(
		handler => {
			NetInfo.addEventListener('change', handler);
		},
		handler => {
			NetInfo.removeEventListener('change', handler);
		});
NetInfo.isConnected.fetch().then(connected => {
	console.log(connected);
});
NetInfo.fetch().then(connected => {
	console.log(connected);
});

function getConnectionActionFromNetworkState(networkState) {
	const isConnected = !networkState.toLowerCase().includes('none');
	const hasWifi = networkState.toLowerCase().includes('wifi');
	if (isConnected) {
		return setConnected({
			isConnected: isConnected,
			hasWifi: hasWifi
		});
	} else {
		return setDisconnected();
	}
}

//get initial network state
const initialNetworkstateEpic = (action$) =>
		action$.ofType(startNetworkMonitor.getType())
				.flatMap(action =>
								Observable.fromPromise(NetInfo.fetch()))
								.map(networkState => getConnectionActionFromNetworkState(networkState))
				.catch(error => Observable.of(updateNetworkState({hasInternet: false, hasWifi: false})));


// monitor network state changes
const monitorNetworkstateEpic = (action$) =>
		action$.ofType(startNetworkMonitor.getType())
				.flatMap(action =>
						getConnectionChangeEventHandler().do(s => {
							console.log(s)
						})
								.map(networkState => {
									getConnectionActionFromNetworkState(networkState)
								}).catch(error => setDisconnected({hasInternet: false, hasWifi: false}))
				);

export default combineEpics(onStoreInitializedEpic, initialNetworkstateEpic, monitorNetworkstateEpic);