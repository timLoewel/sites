import {AsyncStorage} from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';

import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';

import { createEpicMiddleware } from 'redux-observable';
import { reduxFormMiddleware } from 'redux-form-actions';


import reducer from './model/reducer';
import rootEpic from './model/epics';
import { createAction, createReducer } from 'redux-act';


let persistor;

export const storeInitialized = createAction('store has been initialized');

export default function configureStore(onCompletion: ()=>void): any {

	const enhancer = composeWithDevTools(
			applyMiddleware(reduxFormMiddleware, createEpicMiddleware(rootEpic)),
			autoRehydrate()
	);

	const store = createStore(reducer, enhancer);
	persistor = persistStore(store, {storage: AsyncStorage}, onCompletion);

	//TODO TL remove this line,
	persistor.purge();
	// persistor.rehydrate();
	store.dispatch(storeInitialized());
	return store;
}

export function resetStore() {
	if (persistor){
		persistor.purge();
	}
}