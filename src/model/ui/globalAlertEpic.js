/**
 * Created by tim on 17/03/17.
 *
 * TODO TL: replace this with a true redux solution
 */


import { createAction, createReducer } from 'redux-act';
import SnackBar from 'react-native-snackbar-dialog'
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';

/**
displays a toast
 */
export const showAlert = createAction('showAlert');

export default (action$) =>
		action$.ofType(showAlert.getType()).map(showAlert => {
			SnackBar.show(showAlert.payload, { duration: 2000});
			return Observable.empty()
		})