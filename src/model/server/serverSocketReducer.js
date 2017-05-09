/**
 * the server socket, this should not be serialized into local stoage by redux-persist
 * Created by tim on 02/05/17.
 */
import {createAction, createReducer} from 'redux-act';

export const setServerConnection = createAction('setServerConnection: Set WebSocket to the server');
export const resetServerConnection = createAction('resetServerConnection: Reset the WebSocket to the server');
export const setServerReadyForRequests = createAction('setServerReadyForRequests: Server is ready for requests via websocket');
/**
 * the payload is a query, as used by parsejs
 * {
      "className": "Player",
      "where": {"name": "test"},
      "fields": ["name"] // Optional
  }
 *
 * https://github.com/parse-community/parse-server/wiki/Parse-LiveQuery-Protocol-Specification#connect-message
 *
 * http://docs.back4app.com/docs/android/live-query/
 *
 *
 *
 * @type {ActionCreator<P, M>}
 */
export const subscribeToQuery = createAction('subscribeToQuery: subscribe to query');
export const subscribedToQuery = createAction('subscribedToQuery: subscription acknowledged by server.');
export const undefinedMessageFromServer = createAction('undefinedMessageFromServer');

/**
 *
 * @type {ActionCreator<P, M>}
 */
export const errorInSubscription = createAction('errorInSubscription: could not subscribe to query');

const reducer = createReducer({
			// [setServerConnection]: (state, payload) => ({
			// 	serverWebSocket: payload,
			// 	serverReadyForRequests: false,
			// }),
			[resetServerConnection]: (state, payload) => ({
				serverWebSocket: null,
				serverReadyForRequests: false,
			}),
			[setServerReadyForRequests]: (state, payload) => ({
				serverWebSocket: state.serverWebSocket,
				serverReadyForRequests: true,
			})
		}, {
			serverWebSocket: null,
			serverReadyForRequests: false,
		}
);


export default reducer;