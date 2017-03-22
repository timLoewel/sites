/**
 * Created by tim on 22/11/16.
 */
import Immutable from 'seamless-immutable';
import ReactNativeI18n from 'react-native-i18n'
import type {Action} from '../types';
// import {USER_LOGIN_SUCCESS} from './auth';
import I18n from '../../assets/translations';
import { createAction, createReducer } from 'redux-act';

export const submitProfileForm = createAction('Submit Profile Form');

export const submitProfileOk = createAction('Submit Profile OK');

export const submitProfileFailed = createAction('Submit Profile FAILED');

export default (state = {}, action) => state;
