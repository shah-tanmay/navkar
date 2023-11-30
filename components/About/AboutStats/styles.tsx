import styled from "styled-components";

export const AboutStatsWrapper = styled.div``;

export const Stats = styled.div`
  color: #794328;
  text-align: center;
  font-family: "Outfit";
  font-size: 48px;
  font-style: normal;
  font-weight: 600;
  line-height: 150%; /* 72px */
  text-align: left;

  @media screen and (max-width: 1024px) {
    font-size: 36px;
  }

  @media screen and (max-width: 768px) {
    font-size: 27px;
  }
`;

export const StatText = styled.div`
  color: #b09b8c;
  font-family: "Outfit";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 30px */

  @media screen and (max-width: 1024px) {
    font-size: 16px;
  }

  @media screen and (max-width: 768px) {
    font-size: 12px;
  }
`;
