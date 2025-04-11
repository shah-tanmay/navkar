import styled from "styled-components";
import COLORS from "../../constants/color";

export const BuyNowButton = styled.button`
  width: 100%;
  font-family: "Outfit";
  margin-top: 1rem;
  padding: 14px 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${COLORS.gold};
  color: ${COLORS.secondary};
  border: 2px solid ${COLORS.gold};
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 16px rgba(84, 46, 0, 0.1);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    /* background: ${COLORS.bronze}; */
    box-shadow: 0 6px 24px rgba(84, 46, 0, 0.15);

    svg {
      transform: translateX(2px);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  svg {
    font-size: 20px;
    color: ${COLORS.secondary};
    transition: transform 0.2s ease;
  }

  @media (max-width: 768px) {
    height: 48px;
    font-size: 1rem;
    padding: 12px 20px;
  }
`;
