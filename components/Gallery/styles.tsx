import styled from "styled-components";
import { TextFontSize, TitleFontSize } from "../../constants";

export const GalleryWrapper = styled.div`
  display: flex;
  padding: 80px 0px;
  gap: 60px;
  overflow: hidden;
  align-items: center;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;

  @media screen and (max-width: 1024px) {
    gap: 40px;
    padding: 60px 20px;
  }

  @media screen and (max-width: 768px) {
    padding: 40px 15px;
    flex-direction: column;
    text-align: center;
    gap: 30px;
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
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 0 0 350px;

  @media screen and (max-width: 768px) {
    flex: 1;
    width: 100%;
  }
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
  flex: 1;
  align-items: center;

  @media screen and (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    gap: 20px;
  }
`;

import Image from "next/image";

export const GalleryStaticImage = styled(Image)`
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

  @media screen and (max-width: 768px) {
    width: 100%;
    height: auto;
    max-width: 500px;
  }
`;
