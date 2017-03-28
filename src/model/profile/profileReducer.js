/**
 * Created by tim on 22/11/16.
 */
import Immutable from 'seamless-immutable';
import ReactNativeI18n from 'react-native-i18n'
import type {Action} from '../types';
// import {USER_LOGIN_SUCCESS} from './auth';
import I18n from '../../assets/translations';
import { createAction, createReducer } from 'redux-act';

export const submitProfileForm = createAction('Submit Profile Form');

export const submitProfileOk = createAction('Submit Profile OK');

export const submitProfileFailed = createAction('Submit Profile FAILED');

export const showLoginScreen = createAction('show the login screen');
/**
 * the payload is the user profile, as returned from the server
 * @type {ActionCreator<P, M>}
 */
export const userLoginSuccess = createAction('user logged in successfully');

export const userLoginFailed = createAction('user login failed');

export const userLogout = createAction('user logged out');

const initialUser = {locale: ReactNativeI18n.locale,};

const reducer = createReducer(
		{
			[userLoginSuccess]: (state, payload) => Immutable.merge(state, {
				isLoggedIn: true,
				currentUser: payload.profile,
				auth0Token: payload.token,
				sessionToken: payload.profile.parse_session_token,
			}),
			[userLogout]: (state, payload) => Immutable.merge(state, {
				isLoggedIn: false,
				currentUser: initialUser,
				auth0Token:null,
				sessionToken:null,
			}),
		},
		Immutable.from({isLoggedIn: false, currentUser:initialUser, auth0Token: null, sessionToken:null}));

export default reducer;