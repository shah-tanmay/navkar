import styled from "styled-components";
import { TitleFontSize } from "../../constants";

export const ReviewsWrapper = styled.div`
  display: flex;
  padding: 50px 0px;
  gap: 50px;

  @media screen and (max-width: 768px) {
    gap: 20px;
    padding: 20px 0px;
  }

  @media screen and (max-width: 425px) {
    text-align: center;
  }
`;

export const ReviewsInfo = styled.div`
  margin-top: 40px;
  overflow: hidden;

  @media screen and (max-width: 768px) {
    margin-top: 20px;
  }
`;

export const ReviewImageDiv = styled.div`
  width: 100%;
  max-width: 100%;
  display: grid;
  place-items: center;

  @media screen and (max-width: 425px) {
    display: none;
  }
`;

export const ReviewImage = styled.img`
  width: 100%;
  object-fit: contain;
  height: auto;
`;

export const ReviewTitle = styled.div`
  color: #794328;
  font-family: "Outfit";
  font-size: 40px;
  font-style: normal;
  font-weight: 500;
  line-height: 130%; /* 52px */
  text-transform: capitalize;

  @media screen and (max-width: 1024px) {
    font-size: ${TitleFontSize["1024"]};
  }

  @media screen and (max-width: 768px) {
    font-size: ${TitleFontSize["768"]};
  }
`;

export const ReviewInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 50%;
`;

export const ReviewControl = styled.div``;

export const ReviewNext = styled.div``;

export const ReviewPrevious = styled.div``;
