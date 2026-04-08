import styled from "styled-components";

export const HeroWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 80px 0px;
  background: linear-gradient(135deg, #111111 0%, #1a1a1a 100%);
  color: #ffffff;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: radial-gradient(circle at 50% 0%, rgba(212, 175, 55, 0.15), transparent 60%);
    pointer-events: none;
  }
`;
