import styled from "styled-components";
import COLORS from "../../../constants/color";
import Image from "next/image";

export const CarouselImage = styled(Image)`
  border-radius: 24px;
  box-shadow: 0 20px 50px rgba(84, 46, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  
  @media screen and (max-width: 768px) {
    border-radius: 16px;
  }
`;

export const CarouselImageDiv = styled.div`
  display: flex;
  justify-content: center;
  padding: 40px 10px;
  position: relative;
  height: 550px;
  width: 100%;
  
  @media screen and (max-width: 768px) {
    height: 350px;
  }

  @media screen and (max-width: 425px) {
    height: 250px;
  }

  .selected & {
     div:first-child {
       transform: scale(1.05);
       box-shadow: 0 30px 60px rgba(84, 46, 0, 0.15);
       z-index: 2;
     }
  }
`;

export const CarouselWrapper = styled.div`
  width: 90%;
  max-width: 1200px;
  background: transparent;
  position: relative;
  overflow: visible;
  padding: 1rem 0;
  
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${COLORS.gold}, transparent);
    opacity: 0.5;
  }
`;
