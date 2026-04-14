import styled, { keyframes } from "styled-components";

const scroll = keyframes`
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
`;

export const BannerWrapper = styled.div`
  background: #111;
  color: #D4AF37;
  overflow: hidden;
  position: relative;
  height: 38px;
  display: flex;
  align-items: center;
  z-index: 1001;
  border-bottom: 1px solid rgba(212, 175, 55, 0.2);

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 0;
    width: 50px;
    height: 100%;
    z-index: 2;
  }

  &::before {
    left: 0;
    background: linear-gradient(to right, #111, transparent);
  }

  &::after {
    right: 0;
    background: linear-gradient(to left, #111, transparent);
  }
`;

export const BannerContent = styled.div<{ $isScrolling: boolean }>`
  display: flex;
  white-space: nowrap;
  gap: 4rem;
  width: fit-content;
  animation: ${({ $isScrolling }) => ($isScrolling ? scroll : "none")} 30s linear infinite;
  padding-left: ${({ $isScrolling }) => ($isScrolling ? "0" : "1rem")};
  justify-content: ${({ $isScrolling }) => ($isScrolling ? "flex-start" : "center")};

  &:hover {
    animation-play-state: paused;
  }
`;

export const BannerItem = styled.div`
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;

  span {
    color: #D4AF37;
    font-weight: 700;
  }
`;
