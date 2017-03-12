import {logOut as parseLogout} from '../../utils/ParseServer';

// Actions
export const USER_LOGIN_SUCCESS = 'auth.USER_LOGIN_SUCCESS';
const USER_LOGOUT = 'auth.USER_LOGOUT';

const USER_LOGIN_ERROR = 'auth.USER_LOGIN_ERROR';
const READY_FOR_LOGIN = 'auth.READY_FOR_LOGIN';

export function onUserLoginSuccess(profile, sessionToken) {
	return {
		type: USER_LOGIN_SUCCESS,
		payload: {
			profile: profile,
			token: sessionToken
		}
	};
}

export function onUserLoginError(error) {
		return {
		type: USER_LOGIN_ERROR,
		payload: error,
		error: true
	};
}

/**
 * is the stored state recovered from disk and the codepush pudate done, so that now the user can login?
 * @returns {{type: string}}
 */
export function setReadyForLogin() {
	return {
		type: READY_FOR_LOGIN,
	}
}

export function logOut() {
	return function(dispatch, getState) {
		const sessionToken = getState().auth.get('sessionToken');
		parseLogout(sessionToken);
		dispatch({type: USER_LOGOUT})
	};
}

// Initial state
const initialState = Map({
	isReadyForLogin: false,
	isLoggedIn: false,
	currentUser: null,
	sessionToken: null,
	number: 0,
	lastError: '',
});

const actionsMap = {};
actionsMap[USER_LOGIN_SUCCESS] = (state, action) => {
	return state
			.set('isLoggedIn', true)
			.set('currentUser', action.payload.profile)
			.set('auth0Token', action.payload.token)
			.set('sessionToken', action.payload.profile.get('parse_session_token'));
};

actionsMap[READY_FOR_LOGIN] = (state, action) => {
	return state
			.set('isReadyForLogin', true)
};

actionsMap[USER_LOGIN_ERROR] = (state, action) => {
	return initialState.set('lastError', action.payload);
};

actionsMap[USER_LOGOUT] = (state, action) => {
	return state
			.set('isLoggedIn', false)
			.set('currentUser', null)
			.set('sessionToken', null);
};
actionsMap["inc"] = (state, action) => {
	return state.set('number', state.get('number')+1);
};

export default (state = initialState, action) => {
	const reduceFn = actionsMap[action.type];
	if (!reduceFn) return state;
	return reduceFn(state, action);
};