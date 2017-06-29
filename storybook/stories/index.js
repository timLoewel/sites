import React from 'react';
import { Text } from 'react-native';
import { storiesOf, action, linkTo } from '@storybook/react-native';

import Button from './Button';
import CenterView from './CenterView';
import Welcome from './Welcome';

/// import stories
import './SampleStories';
import '../../src/components/tabProfile/ProfileStories';
import '../../src/components/form/FormStories';
import '../../src/components/basics/BasicComponentStories';
import '../../src/components/renderImage/RenderImageStories';
import '../../src/components/tabCamera/CameraViewStories';

storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));

storiesOf('Button', module)
  .addDecorator(getStory => (
    <CenterView>{getStory()}</CenterView>
  ))
  .add('with text', () => (
    <Button onPress={action('clicked-text')}>
      <Text>Hello Button</Text>
    </Button>
  ))
  .add('with some emoji', () => (
    <Button onPress={action('clicked-emoji')}>
      <Text>😀 😎 👍 💯</Text>
    </Button>
  ));
