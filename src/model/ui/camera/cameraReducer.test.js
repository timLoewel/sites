/**
 * Created by tim on 28/03/17.
 */
import cameraReducer, {enqueuePhotoForRendering} from './cameraReducer';
import SeamlessImmutable from 'seamless-immutable';
import {Stack  } from 'immutable'

test('seamless stack', () => {
	expect(Stack().push({val:3})).toEqual(
			SeamlessImmutable.asMutable(SeamlessImmutable.from(Stack()), {deep: true}).push({val:3}));
});

test('initial state', () => {
	expect(cameraReducer(undefined, {type:'not handled'})).toEqual(
			SeamlessImmutable.from( {
				photosWaitingForRendering:Stack(),
						location: {
							address:{
								formattedAddress: ''
							}
						},
					photoDescription: ''
			})
	);
});

test('photosWaitingForRendering', () => {
	expect(cameraReducer(SeamlessImmutable.from( {
		photosWaitingForRendering:Stack().push({value:1}),
		topLevelValue: 0,
		}), enqueuePhotoForRendering({newValue:2}))).toEqual(
			SeamlessImmutable.from( {
						photosWaitingForRendering:Stack().push({value:1})
								.push({newValue:2}),
				topLevelValue: 0,
			})
			);
});