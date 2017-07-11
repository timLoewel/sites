/**
 * Created by tim on 30/03/17.
 */
export default function delayPromise(delay) {
  // return a function that accepts a single variable
  return function(data) {
    // this function returns a promise.
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // a promise that is resolved after "delay" milliseconds with the data provided
        resolve(data);
      }, delay);
    });
  };
}
