import React from 'react';
import {storiesOf, action, linkTo} from '@kadira/react-native-storybook';

import CenterView from './CenterView';
import RoundThumbnail from './RoundThumbnail';
const profileImage = require('../../assets/images/avatar2016.jpg');

storiesOf('Basics', module)
		.addDecorator(getStory => (
				<CenterView >{getStory()}</CenterView>
		))
		.add('thumbnail', () => (
				<RoundThumbnail size={100} source={profileImage}/>
		));
