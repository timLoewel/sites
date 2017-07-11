/**
 * Created by tim on 14/04/17.
 */
import { getStoredState } from "redux-persist";
import { createAction } from "redux-act";
import { combineEpics } from "redux-observable";
import { Observable } from "rxjs/Observable";

export const printAsyncStorage = createAction("printState");

console.log(printAsyncStorage.getType());

const printAsyncStorageEpic = action$ =>
  action$.ofType(printAsyncStorage.getType()).do(v => {
    const state = getStoredState({});
    console.log(state);
  });

const printAllActions = action$ =>
  action$.ofType(printAsyncStorage.getType()).do(a => {
    console.log(a);
  });

// start first buffer after 5s, and every 5s after
const startInterval1 = Observable.interval(15000);

// emit value after 3s, closing corresponding buffer
const closingInterval1 = val => {
  console.log(`Value ${val} emitted, starting buffer! Closing in 3s!`);
  return Observable.interval(3000);
};

const testEpic = (action$, store) =>
  action$
    .do(b => {
      console.log(b);
    })
    .bufferToggle(startInterval1, closingInterval1)
    .do(v => {
      console.log(v);
    })
    .map(() => ({ type: "test" }));

// //emit value every second
// const sourceInterval = Observable.interval(1000).map(v=>v+'hallo');
// //start first buffer after 5s, and every 5s after
// const startInterval = Observable.interval(5000).map(v=>v+'startIntervall');;
// //emit value after 3s, closing corresponding buffer
// const closingInterval = val => {
// 	console.log(`Value ${val} emitted, starting buffer! Closing in 3s!`);
// 	return Observable.interval(3000);
// }
//
// //every 5s a new buffer will start, collecting emitted values for 3s then emitting buffered values
// const bufferToggleInterval = sourceInterval.bufferToggle(startInterval, closingInterval);
// //log to console
// //ex. emitted buffers [4,5,6]...[9,10,11]
// const subscribe = bufferToggleInterval.subscribe(val => console.log('Emitted Buffer:', val));

export default combineEpics(printAllActions);
