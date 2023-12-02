import styled from "styled-components";
import { TextFontSize, TitleFontSize } from "../../constants";
import Image from "next/image";

export const AboutContainer = styled.div`
  display: flex;
  padding: 40px 0px;
  gap: 70px;
  align-items: stretch;

  @media screen and (max-width: 768px) {
    display: grid;
    place-items: center;
    text-align: center;
    gap: 20px;
  }
`;

export const AboutImageDiv = styled.div`
  min-width: 45%;
  max-width: 45%;

  @media screen and (max-width: 768px) {
    min-width: 80%;
  }
`;

export const AboutImage = styled(Image)`
  border-radius: 10px;
  max-width: 100%;
`;

export const AboutText = styled.div`
  color: #794328;
  font-family: "Saira";
  font-size: 20px;
  font-style: normal;
  font-weight: 400;
  line-height: 170%; /* 34px */

  @media screen and (max-width: 1024px) {
    font-size: ${TextFontSize["1024"]};
  }

  @media screen and (max-width: 768px) {
    font-size: ${TextFontSize["768"]};
  }
`;

export const AboutInfoSecondDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 30px;
  flex: 1;
  margin-bottom: 10px;

  @media screen and (max-width: 768px) {
    margin-top: 15px;
  }
`;

export const AboutTitle = styled.div`
  color: #794328;
  font-family: "Outfit";
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 130%;
  text-transform: capitalize;

  @media screen and (max-width: 1024px) {
    font-size: ${TitleFontSize["1024"]};
  }

  @media screen and (max-width: 768px) {
    font-size: ${TitleFontSize["768"]};
  }
`;

export const AboutInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

export const AboutHighLighted = styled.span`
  color: #ba8160;
`;

export const AboutStatsDiv = styled.div`
  display: flex;
  justify-content: space-between;
`;
