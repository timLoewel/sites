/**
 * Created by tim on 28/03/17.
 */
import cameraReducer, {setAnnotatedPhotoData} from './cameraReducer';
import Immutable from 'seamless-immutable';

test('initial state', () => {
	expect(cameraReducer(undefined, {type:'not handled'})).toEqual(
			Immutable.from( {
						localPhotoData:undefined,
						location: {
							address:{
								formattedAddress: ''
							}
						},
					photoDescription: ''
			})
	);
});

test('setAnnotatedPhotoData', () => {
	expect(cameraReducer(Immutable.from( {
		localPhotoData:{
			changedValue: 0,
			nestedLevelValue: 0,
		},
		topLevelValue: 0,
		}), setAnnotatedPhotoData({changedValue:1, newNestedValue:2}))).toEqual(
			Immutable.from( {
				localPhotoData:{
					changedValue:1,
					nestedLevelValue: 0,
					newNestedValue:2,
				},
				topLevelValue: 0,
			})
			);
});