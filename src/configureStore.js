import {AsyncStorage} from 'react-native';
import { composeWithDevTools } from 'redux-devtools-extension';

import {createStore, applyMiddleware, compose} from 'redux';
import {persistStore, autoRehydrate} from 'redux-persist';
import reducer from './model/reducer';

var persistor;

console.log('configureStore');
export default function configureStore(onCompletion: ()=>void): any {
	const enhancer = composeWithDevTools(
			// applyMiddleware(thunk),
			autoRehydrate()
	);

	const store = createStore(reducer, enhancer);
	persistor = persistStore(store, {storage: AsyncStorage}, onCompletion);

	persistor.purge();
	return store;
}

export function resetStore() {
	if (persistor){
		persistor.purge();
	}
}