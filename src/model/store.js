import {AsyncStorage} from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';

import {createStore, applyMiddleware, compose, Store} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';
import * as env from '../../env';

import { createEpicMiddleware } from 'redux-observable';

import reducer from './reducer';
import rootEpic from './epics';
import { createAction, createReducer } from 'redux-act';
import immutableTransform from 'redux-persist-transform-immutable';

const SCHEMA_VERSION = '0.1';
const SCHEMA_VERSION_KEY = env.APP_NAME + ':SchemaVersion'
let persistor;

export const storeInitialized = createAction('storeInitialized: store has been initialized');

export default async function configureStore(onCompletion: ()=>void): Store {
	console.log('current schema version: ', SCHEMA_VERSION);
	const schemaVersionStored = await AsyncStorage.getItem(SCHEMA_VERSION_KEY);
	console.log('schema version stored: ', schemaVersionStored);
	const enhancer = composeWithDevTools(
			applyMiddleware(
					createEpicMiddleware(rootEpic),
			)
			,autoRehydrate()// do not set config {log: true} as that clashes with redux-observable
	);

	const store = createStore(reducer, undefined, enhancer);
	persistor = persistStore(store, {storage: AsyncStorage, blacklist: ['ui', 'serverSocket', 'systemState'], transforms: [immutableTransform()]}, onCompletion);

	if (schemaVersionStored !== SCHEMA_VERSION) {
		await persistor.purge();
		AsyncStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
	}

	return store;
}

export function resetStore() {
	if (persistor){
		persistor.purge();
	}
}