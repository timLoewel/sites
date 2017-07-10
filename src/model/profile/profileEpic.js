/**
 * Created by tim on 14/03/17.
 */
import {userLoginSuccess, userLoginFailed} from './profileReducer';
import {storeInitialized} from '../store';

import {Observable} from 'rxjs';
import * as env from '../../../env';
import Auth0Lock from 'react-native-lock';
import {combineEpics} from 'redux-observable';

const clientId = env.AUTH0_CLIENT_ID;
const domain = env.AUTH0_DOMAIN;

if (!(clientId && domain)) {
	throw 'Authentication not enabled: Auth0 configuration not provided clientId'+ clientId + ' domain '+ domain;
};

const lock = new Auth0Lock({
	clientId,
	domain,
	useBrowser: true,
});

function showLogin(locale) {
	const options = {
		closable: true,
		language: locale,
		autofocus: true,
	};
	return Observable.create(observer => {
		lock.show(options, (error, profile, token) => {
			if (error) {
				observer.error(error);
				return;
			}
			// Authentication worked!
			observer.next({profile: profile, token: token});
			observer.complete();

		});
	})
}

const showLoginEpic = (action$, store) =>
		action$.ofType(storeInitialized.getType())
				.filter(storeInitializedAction => !store.getState().profile.isLoggedIn)
				.do(() => {
					console.log('store initialized, showing login.');
				})
				.flatMap(() => showLogin(store.getState().profile.currentUser.locale)
						.map(result => userLoginSuccess(result))
						.catch(error => userLoginFailed({error: error})));

export default combineEpics();