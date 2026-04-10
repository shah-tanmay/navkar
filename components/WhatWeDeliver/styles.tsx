import styled from "styled-components";
import COLORS from "../../constants/color";

export const WhatWeDeliverWrapper = styled.div`
  background: linear-gradient(135deg, #fdfbf7 0%, #f4e8d9 100%);
  display: flex;
  justify-content: center;
  padding: 40px 0px;
  border-bottom: 1px solid rgba(184, 159, 114, 0.1);
`;

export const WhatWeDeliverDiv = styled.div`
  display: flex;
  width: 85%;
  justify-content: space-between;
  max-width: 1400px;

  @media screen and (max-width: 1024px) {
    width: 90%;
  }

  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    width: 90%;
    gap: 25px;
    padding: 30px 0;
  }
`;
