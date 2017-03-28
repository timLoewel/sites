import Immutable from 'seamless-immutable';
import photoReducer, {addPhoto} from './photoReducer';
import { createAction, createReducer} from 'redux-act';


test('initial state', () => {
	expect(photoReducer(undefined, {type:'not handled'})).toEqual(Immutable.from({
		localPhotosByLocalObjectId: {},
		photosByObjectId:{},
	}));
});

test('add local photo', () => {
	expect(photoReducer(undefined, addPhoto({localObjectId: 'lod1', data:'data'}))).
	toEqual(Immutable.from({
		localPhotosByLocalObjectId: {lod1: {localObjectId: 'lod1', data:'data'}},
		photosByObjectId:{},
	}));
});

test('update local photo to server photo', () => {
	expect(photoReducer(
			Immutable.from({
				localPhotosByLocalObjectId: {lod1: {localObjectId: 'lod1', data:'data'}},
				photosByObjectId:{},
			})
			, addPhoto({objectId: 'id1', localObjectId: 'lod1', data:'data1'}))).
	toEqual(Immutable.from({
		localPhotosByLocalObjectId: {},
		photosByObjectId:{id1: {objectId: 'id1', localObjectId: 'lod1', data:'data1'}},
	}));
});
