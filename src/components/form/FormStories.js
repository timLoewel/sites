import React from 'react';
import {storiesOf, action, linkTo} from '@kadira/react-native-storybook';

import CenterView from '../basics/CenterView';

import FormTextInput from './FormTextInput';

storiesOf('Form', module)
		.addDecorator(getStory => (
				<CenterView >{getStory()}</CenterView>
		))
		.add('initial', () => (
				<FormTextInput placeholder="Placeholder" title="MyFormInput" input={{onChange : ()=>1}}/>
		));
