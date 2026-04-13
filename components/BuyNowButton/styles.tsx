import styled from "styled-components";
import COLORS from "../../constants/color";

export const BuyNowButton = styled.button`
  width: 100%;
  font-family: "Outfit";
  margin-top: 1rem;
  padding: 0 20px;
  height: 44px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${COLORS.gold};
  color: ${COLORS.secondary};
  border: 1px solid ${COLORS.gold};
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  box-shadow: 0 4px 12px rgba(84, 46, 0, 0.1);

  &:hover:not(:disabled) {
    transform: translateY(-1.5px);
    box-shadow: 0 6px 16px rgba(84, 46, 0, 0.15);

    svg {
      transform: translateX(2px);
    }
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  svg {
    font-size: 18px;
    color: ${COLORS.secondary};
    transition: transform 0.2s ease;
  }

  @media (max-width: 768px) {
    height: 42px;
    font-size: 0.9rem;
    padding: 0 16px;
  }
`;
