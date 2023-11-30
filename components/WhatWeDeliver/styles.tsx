import styled from "styled-components";

export const WhatWeDeliverWrapper = styled.div`
  background-color: #fcf8f3;
  display: flex;
  justify-content: center;
  padding: 15px 0px;
`;

export const WhatWeDeliverDiv = styled.div`
  display: flex;
  width: 85%;
  justify-content: space-between;
  max-width: 1400px;

  @media screen and (max-width: 1024px) {
    width: 90%;
  }

  @media screen and (max-width: 425px) {
    flex-wrap: wrap;
    justify-content: center;
    place-items: center;
    align-items: center;
    width: 100%;
    padding: 0px 30px;
  }
`;
