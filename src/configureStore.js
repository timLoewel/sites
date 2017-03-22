import {AsyncStorage} from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';

import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';

import { createEpicMiddleware } from 'redux-observable';
import { reduxFormMiddleware } from 'redux-form-actions';


import reducer from './model/reducer';
import rootEpic from './model/epics';


var persistor;

export default function configureStore(onCompletion: ()=>void): any {

	const enhancer = composeWithDevTools(
			applyMiddleware(reduxFormMiddleware, createEpicMiddleware(rootEpic)),
			autoRehydrate()
	);

	const store = createStore(reducer, enhancer);
	persistor = persistStore(store, {storage: AsyncStorage}, onCompletion);

	//TODO TL remove
	persistor.purge();
	return store;
}

export function resetStore() {
	if (persistor){
		persistor.purge();
	}
}