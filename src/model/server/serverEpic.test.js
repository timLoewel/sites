/**
 * Created by tim on 18/04/17.
 */
import {WebSocketSubject, WebSocketSubjectConfig} from 'rxjs/observable/dom/WebSocketSubject';
import {Observable} from 'rxjs/Observable';

import WebSocket from 'react-native/Libraries/WebSocket/WebSocket';

test('open websocket pure', done => {
	console.log('running test of ws');


	// const socket = WebSocket('wss://obobserver.back4app.io');
	const ws = new WebSocket('wss://echo.websocket.org');
	ws.onmessage = (event) => {
		console.log('Message from server', event.data);
		done();
	};
	ws.onerror = (e) => {  // an error occurred
		console.log(e.message);
		fail();
		done();
	};

	ws.onclose = (e) => {  // connection closed
		console.log(e.code, e.reason);
		done();
	};
	console.log('waiting for connection');
	ws.onopen = () => {  // connection opened
		console.log('connection open');
		ws.send('something'); // send a message
	};


	// socket.send(`{
	// 		"op": "connect",
	// 		"restAPIKey": "Ymil5UqTAt59MBTpEicklWuEIGuYnsZf2ocHwkeS",
	// 		"masterKey": "eOqzUQPj5lW1jh7Kww8sr1ZVfxmrs3wbC6kBMRjB"
	// 		}`)
});

// test('open websocket rxjs', done => {
// 	const socket = WebSocketSubject.create({url: 'wss://obobserver.back4app.io', WebSocketCtor: WebSocket});
// 	socket.subscribe(
// 			function (x) {
// 				console.log('next ' + x);
// 				expect(JSON.parse(x)).toEqual({op: 'connected'});
// 				done();
// 			},
// 			function (e) {
// 				fail(e);
// 				done();
// 			},
// 			function () { console.log('onCompleted'); });
//
// 	socket.next(`{
// 			"op": "connect",
// 			"restAPIKey": "Ymil5UqTAt59MBTpEicklWuEIGuYnsZf2ocHwkeS",
// 			"masterKey": "eOqzUQPj5lW1jh7Kww8sr1ZVfxmrs3wbC6kBMRjB"
// 			}`);
// });