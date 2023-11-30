import styled, { keyframes } from "styled-components";
import { TextFontSize } from "../../../constants";

const slideIn = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
`;

const slideOut = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(100%); }
`;

export const ReviewsDetails = styled.div<{ isSlideIn?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;
  transition: transform 0.5s ease-in-out;
  animation: ${({ isSlideIn }) => (isSlideIn ? slideIn : slideOut)} 0.5s
    ease-in-out;

  @media screen and (max-width: 768px) {
    gap: 10px;
  }
`;

export const ReviwerDetails = styled.div`
  display: flex;
  gap: 20px;

  @media screen and (max-width: 768px) {
    gap: 15px;
  }

  @media screen and (max-width: 425px) {
    display: flex;
    justify-content: center;
    text-align: left !important;
  }
`;

export const ReviewerName = styled.div`
  color: #794328;
  font-family: "Outfit";
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 100%; /* 20px */
`;

export const ReviewerDesignation = styled.div`
  color: #794328;
  font-family: "Outfit";
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 100%; /* 14px */
  opacity: 0.5;
  margin-top: 10px;
`;

export const Review = styled.div`
  color: #794328;
  font-family: "Outfit";
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

export const ReviewerInfo = styled.div``;

export const ReviewrInfoWrapper = styled.div`
  display: grid;
  place-items: center;
`;

export const ReviewerImage = styled.img`
  width: 80px;
  height: 80px;
  flex-shrink: 0;

  @media screen and (max-width: 768px) {
    width: 50px;
    height: 50px;
  }
`;
