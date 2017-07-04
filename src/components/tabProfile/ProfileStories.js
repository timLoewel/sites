import React from 'react';
import {Text} from 'react-native';
import {storiesOf, action, linkTo} from '@storybook/react-native';

import CenterView from '../basics/CenterView';
import {reducer as formReducer} from 'redux-form';

import ProfileForm from './ProfileForm';
import {composeWithDevTools} from 'redux-devtools-extension';

import {createStore, applyMiddleware, compose} from 'redux';

import {Provider} from 'react-redux';

const enhancer = composeWithDevTools(
		applyMiddleware()
);

const store = createStore(formReducer, enhancer);

// anyTouched: anyTouched,
// 		asyncErrors: asyncErrors,
// 		asyncValidating: getIn(formState, 'asyncValidating') || false,
// 		dirty: !pristine,
// 		error: error,
// 		initialized: initialized,
// 		invalid: !valid,
// 		pristine: pristine,
// 		registeredFields: registeredFields,
// 		submitting: submitting,
// 		submitFailed: submitFailed,
// 		submitSucceeded: submitSucceeded,
// 		syncErrors: syncErrors,
// 		syncWarnings: syncWarnings,
// 		triggerSubmit: triggerSubmit,
// 		values: values,
// 		valid: valid,
// 		validExceptSubmit: validExceptSubmit,
// 		warning: warning


storiesOf('Profile', module)
		.addDecorator(getStory => (
				<Provider store={store}>{getStory()}</Provider>
		))
		.add('initial', () => (
				<ProfileForm handleSubmit={action('clicked-initial')}/>
		))
		.add('touched', () => (
				<ProfileForm dirty={true} pristine={false} handleSubmit={action('clicked-touched')}/>
		))
		.add('with entries', () => (
				<ProfileForm handleSubmit={action('clicked-with Entries')}/>
		))
		.add('with errors', () => (
				<ProfileForm handleSubmit={action('clicked-with errors')}/>
		));
