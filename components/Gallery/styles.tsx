import styled from "styled-components";
import { TextFontSize, TitleFontSize } from "../../constants";

export const GalleryWrapper = styled.div`
  display: flex;
  padding: 50px 0px;
  gap: 120px;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    padding: 0px 0px;
    gap: 50px;
  }

  @media screen and (max-width: 425px) {
    flex-direction: column;
    text-align: center;
    gap: 40px;
  }
`;

export const GalleryInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media screen and (max-width: 425px) {
    gap: 18px;
  }
`;

export const GalleryInfoWrapper = styled.div`
  display: grid;
  place-items: center;
  min-width: 27%;
`;

export const GalleryTitle = styled.div`
  color: #794328;
  font-family: "Outfit";
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%; /* 48px */

  @media screen and (max-width: 1024px) {
    font-size: ${TitleFontSize["1024"]};
  }
`;

export const GalleryText = styled.div`
  color: #794328;
  font-family: "Outfit";
  font-size: 20px;
  font-style: normal;
  font-weight: 500;
  line-height: 150%; /* 30px */
  max-width: 368px;

  @media screen and (max-width: 1024px) {
    font-size: ${TextFontSize["1024"]};
  }
`;

export const GalleryImageDiv = styled.div`
  display: flex;
  gap: 30px;

  @media screen and (max-width: 768px) {
    max-width: 100%;
    gap: 15px;
  }
`;

export const GalleryStaticImage = styled.img`
  @media screen and (max-width: 768px) {
    max-width: 40%;
  }

  @media screen and (max-width: 425px) {
    min-width: 60%;
  }
`;
