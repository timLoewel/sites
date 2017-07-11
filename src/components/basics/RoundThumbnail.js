/**
 * Created by tim on 14/03/17.
 */
import styled from "styled-components/native";
import theme from "../../assets/themes/sites-theme";

const RoundThumbnail = styled.Image`
  height=${props => props.size};
  width=${props => props.size};
  border-radius=${props => props.size};
`;

export default RoundThumbnail;
