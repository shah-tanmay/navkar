import styled from "styled-components";
import COLORS from "../../constants/color";

export const HeroWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 60px 0px;
  background: linear-gradient(135deg, #fdfbf7 0%, #f4e8d9 100%);
  color: ${COLORS.secondary};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 100% 100%, rgba(184, 159, 114, 0.15), transparent 60%);
    pointer-events: none;
  }
`;
