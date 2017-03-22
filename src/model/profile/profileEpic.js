/**
 * Created by tim on 14/03/17.
 */
import {SUBMIT_PROFILE_FORM, submitProfileOk, submitProfileFailed} from './profileReducer';
import { Observable } from 'rxjs';


// export default (action$) =>
// 		action$.ofType(SUBMIT_PROFILE_FORM)
// 				.mergeMap(() =>
// 						Observable.from(SC.connect())
// 								.map(setSession)
// 				);

export default action$ => {
	return action$
			.ofType(SUBMIT_PROFILE_FORM)
			.map(action => submitProfileOk());
};