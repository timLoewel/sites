/**
 * Created by tim on 18/04/17.
 */
import { Observable } from "rxjs/Observable";
import { combineEpics } from "redux-observable";
import { setConnected } from "../systemState/systemStateReducer";
import { userLoginSuccess } from "../profile/profileReducer";

import {
  WebSocketSubject,
  WebSocketSubjectConfig
} from "rxjs/observable/dom/WebSocketSubject";
import { Subject } from "rxjs/Subject";
import { createAction } from "redux-act";
import {
  setServerReadyForRequests,
  resetServerConnection,
  setServerConnection,
  subscribeToQuery,
  subscribedToQuery,
  undefinedMessageFromServer
} from "./serverSocketReducer";

import * as env from "../../../env";

// const openConnectionEpic = (action$, store) =>
// 		action$.ofType(setConnected.getType())
// 				.flatMap(setConnectedAction => {
// 					return Rx.Observable.webSocket('ws://localhost:53311');
//
// 				});

// the websocket is stored in a global variable instead of the state, as the internals of the websocket are changing
// independent of the actions and could be disturbing redux (TODO check if the ws could be stored in the serverSocketReducer)
const wsSContainer = {};

function sendConnectMessage(v, sessionToken) {
  v.target.send(`{
			"op": "connect",
			"restAPIKey": "${env.PARSE_REST_API_KEY}",
			"applicationId": "${env.PARSE_APP_ID}",
			"sessionToken":"${sessionToken}"
			}`);
}

function openConnection(sessionToken) {
  const openObserver: NextObserver<Event> = {
    next: v => sendConnectMessage(v, sessionToken)
  };
  const closeObserver: NextObserver<CloseEvent> = {
    next: () => console.log("disconnected")
  };
  const url = env.PARSE_SERVER_WS_HOST;
  wsSContainer.wwS = WebSocketSubject.create({
    url,
    openObserver,
    closeObserver
  });
}

const mapServerMessage = serverMsg => {
  console.log("server message: ", serverMsg);
  if (serverMsg.op) {
    switch (serverMsg.op) {
      case "connected":
        return setServerReadyForRequests();

      case "create":
      case "enter":
      case "update":
        return updateObject(serverMsg.object);
      case "leave":
      case "delete":
        return removeObject(serverMsg.object);
      case "subscribed":
        return subscribedToQuery(serverMsg.requestId);
    }
  }
  return undefinedMessageFromServer(serverMsg);
};

// Observable.create(observer =>
// 		BackgroundGeolocation.getCurrentPosition({
// 			timeout: 1000,
// 			samples: 3,
// 			desiredAccuracy: 0,
// 			maximumAge: 0,
// 			persist: false
// 		}, location => observer.next(location), error => observer.error(error))
// );
//
// function openConnection(sessionToken) {
// 	wsS.next(`{
// 			"op": "connect",
// 			"restAPIKey": "${env.PARSE_REST_API_KEY}",
// 			"applicationId": "${env.PARSE_APP_ID}",
// 			"sessionToken":"${sessionToken}"
// 			}`); // send init message
// }
const testAction = createAction("test");

const openConnectionEpic = (action$, store) =>
  action$
    .filter(action => {
      return (
        (action.type === setConnected.getType() ||
          action.type === userLoginSuccess.getType()) &&
        store.getState().profile.sessionToken &&
        store.getState().systemState.isConnected
      );
    })
    .map(a => {
      openConnection(store.getState().profile.sessionToken);
      return setServerConnection();
    })
    .takeUntil(action$.ofType(resetServerConnection.getType()));

const subscribeToClassEpic = (action$, store) =>
  action$
    .ofType(subscribeToQuery.getType())
    .do(q => {
      console.log("subscribing to query ", q.payload);
    })
    .flatMap(subscribeToQueryAction => {
      const requestId = store
        .getState()
        .server.requestIds.get(subscribeToQueryAction.payload);
      const queryString = subscribeToQueryAction.payload;
      const message = `{
									"op": "subscribe",
									"requestId": ${requestId},
									"query": ${queryString},
									"sessionToken": "${store.getState().profile.sessionToken}"
								}`;
      wsSContainer.wwS.next(message);
      return Observable.empty();
    });

const dispatchChangesFromServerEpic = (action$, store) =>
  action$
    .ofType(setServerConnection.getType())
    .flatMap(setServerConnectionAction => {
      console.log("dispatchChangesFromServerEpic started");
      // setServerConnectionAction.payload.map(mapServerMessage).do((msg) => {console.log('message from server: ', msg)}).subscribe((a) => {
      // 	console.log('subscription in server connection epic: ', a);
      // });
      // the payload of the setServerConnection action is the websocket subject.
      // we then map the server messages to actions
      // return setServerConnectionAction.payload
      // .do((msg) => {console.log('message from server: ', msg)})
      // .map(mapServerMessage)
      const ticks = Observable.interval(1000)
        .map(x => testAction(x + " ticks"))
        .take(25);
      const tacks = Observable.interval(2000)
        .map(x => testAction(x + " tacks"))
        .take(12);

      return Observable.create(function(observer) {
        wsSContainer.wwS.map(mapServerMessage).subscribe(msg => {
          observer.next(msg);
        });
      });
    })
    .catch(err => resetServerConnection())
    .takeUntil(action$.ofType(resetServerConnection.getType()));

// const source = Observable.timer(1000, 2000);
// //output: 0,1,2,3,4,5......
// const subscribe = source.subscribe(val => console.log(val));
//
// do(() => {
// 	const openObserver: NextObserver<Event> = {next: () => console.log('connected')};
// 	const closeObserver: NextObserver<CloseEvent> = {next: () => console.log('disconnected')};
// 	const url = 'wss://echo.websocket.org';
// 	const wsS = WebSocketSubject.create({url, openObserver, closeObserver});
// 	const totem = wsS.subscribe({
// 		next: x => console.log(x),
// 		error: x => console.log(x),
// 		complete: () => console.log('done')
// 	});
//
// 	wsS.next('{"hallo":"du"}');
//
// }).map(() =>).catch(error => userLoginFailed({error: error}));
//
//
// const ws = new WebSocket('wss://obobserver.back4app.io');
// // const ws = new WebSocket('wss://echo.websocket.org');
//
// ws.onmessage = (event) => {
// 	console.log('SUCCESS Message from server', event.data);
// };
// ws.onerror = (e) => {  // an error occurred
// 	console.log('ERROR ws error: ', e.message);
// };
//
// ws.onclose = (e) => {  // connection closed
// 	console.log('CLOSE ws.close', e.code, e.reason);
// };
//
// ws.onopen = () => {  // connection opened
// 	console.log('ws connection open');
// 	ws.send(`{
// 			"op": "connect",
// 			"restAPIKey": "Ymil5UqTAt59MBTpEicklWuEIGuYnsZf2ocHwkeS",
// 			"masterKey": "eOqzUQPj5lW1jh7Kww8sr1ZVfxmrs3wbC6kBMRjB",
// 			"applicationId": "RZxPuQJo7SlrnTdSJTzw9bhLn1spbX6KXK8pFHP3"
// 			}`); // send a message
// };
//
// subscribeToClassEpic, dispatchChangesFromServerEpic
export default combineEpics(
  openConnectionEpic,
  dispatchChangesFromServerEpic,
  subscribeToClassEpic
);
