import styled from "styled-components";
import { mediumFontSize } from "../styles";

export default () => (
  <Logo>
    inter<Span>face</Span>rs
  </Logo>
);

const Logo = styled.div`
  height: inherit;
  color: white;
  font-size: ${mediumFontSize};
  padding: 2rem;
  width: 30%;
  display: flex;
  align-items: center;
`;

const Span = styled.span`

`;