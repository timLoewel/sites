import {AsyncStorage} from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';

import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';

import { createEpicMiddleware } from 'redux-observable';
import { reduxFormMiddleware } from 'redux-form-actions';


import reducer from './reducer';
import rootEpic from './epics';
import { createAction, createReducer } from 'redux-act';
import immutableTransform from 'redux-persist-transform-immutable';


let persistor;

export const storeInitialized = createAction('storeInitialized: store has been initialized');

export default function configureStore(onCompletion: ()=>void): any {

	const enhancer = composeWithDevTools(
			applyMiddleware(
					reduxFormMiddleware,
					createEpicMiddleware(rootEpic),
			)
			,autoRehydrate()// do not set config {log: true} as that clashes with redux-observable
	);

	const store = createStore(reducer, undefined, enhancer);
	persistor = persistStore(store, {storage: AsyncStorage, blacklist: ['ui', 'serverSocket', 'systemState'], transforms: [immutableTransform()]}, onCompletion);

	//TODO TL remove this line,
	// persistor.purge();
	persistor.rehydrate();
	return store;
}

export function resetStore() {
	if (persistor){
		persistor.purge();
	}
}