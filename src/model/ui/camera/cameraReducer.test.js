/**
 * Created by tim on 28/03/17.
 */
import cameraReducer, {enqueuePhotoForRendering} from './cameraReducer';
import {Stack , List } from 'immutable'

test('initial state', () => {
	expect(cameraReducer(undefined, {type:'not handled'})).toEqual(
			{
				isReadyForScreenshot: false, 
				screenshotDimensions: {height:0, width:0}, 
				isDoingScreenshot: false,
				photosWaitingForRendering: List(),
				selectedLocation: undefined,
				description: '',
			}
	);
});

test('photosWaitingForRendering', () => {
	expect(cameraReducer(
			{
				isReadyForScreenshot: false, 
				screenshotDimensions: {height:0, width:0}, 
				isDoingScreenshot: false,
				photosWaitingForRendering: List().push({value:1}),
				selectedLocation: undefined,
				description: '',
			}, enqueuePhotoForRendering({newValue:2}))).toEqual(
			{
				isReadyForScreenshot: false, 
				screenshotDimensions: {height:0, width:0}, 
				isDoingScreenshot: false,
				photosWaitingForRendering: List().push({value:1}).push({newValue:2}),
				selectedLocation: undefined,
				description: '',
			}
			);
});
