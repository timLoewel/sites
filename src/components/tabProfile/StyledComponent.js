/**
 * Created by tim on 14/03/17.
 */
import styled from 'styled-components/native';
import React from 'react';
import FormFieldTitle from '../form/FormFieldTitle';

import StyledView from './StyledView';

const StyledText = styled.Text`
  color: palevioletred;
`;

export default class StyledComponent extends React.Component {
	render() {
		return (
				<StyledView>
					<FormFieldTitle>{this.props.title}</FormFieldTitle>
					<StyledText>Hello World!</StyledText>

				</StyledView>
		)
	}
}