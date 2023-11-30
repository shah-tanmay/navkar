import styled from "styled-components";

export const CarouselImage = styled.img`
  max-width: 934px;
  height: 553px;

  @media screen and (max-width: 425px) {
    height: 200px;
  }
`;

export const CarouselImageDiv = styled.div`
  display: flex;
  justify-content: center;
  margin: 0px 20px;
`;

export const CarouselWrapper = styled.div`
  display: flex;
  justify-content: center;
  background: linear-gradient(90deg, #f9f1e7 70%, #fcf8f3 30%);
  max-width: 1400px;
  width: 85%;
`;
