import styled, { keyframes } from "styled-components";

export const GalleryCarouselWrapper = styled.div``;

const slideIn = keyframes`
    0% { transform: translateX(-100%); }
    100% { transform: translateX(0); }
`;

const slideOut = keyframes`
    0% { transform: translateX(0); }
    100% { transform: translateX(100%); }
`;

export const GalleryImageOne = styled.img`
  width: 372px;
  height: 486px;
  flex-shrink: 0;
`;

export const GallerySlideShowWrapper = styled.div`
  display: flex;
  overflow: hidden;
  gap: 24px;
  position: relative;

  @media screen and (max-width: 768px) {
    max-height: 80%;
    gap: 15px;
  }
`;

export const SlideShowButton = styled.div`
  position: absolute;
  right: 45%;
  bottom: 30%;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border-radius: 100%;
  background: white;
  fill: #fff;
  filter: drop-shadow(0px 4px 14px rgba(0, 0, 0, 0.16));
  cursor: pointer;
`;

export const NextImage = styled.img``;
