import React from 'react';
import {storiesOf, action, linkTo} from '@storybook/react-native';

import CenterView from '../basics/CenterView';

import FormTextInput from './FormTextInput';

storiesOf('Form', module)
		.addDecorator(getStory => (
				<CenterView >{getStory()}</CenterView>
		))
		.add('initial', () => (
				<FormTextInput placeholder="Placeholder" title="MyFormInput" input={{onChange : ()=>1}}/>
		));
