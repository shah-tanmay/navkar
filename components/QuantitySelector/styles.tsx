import styled from "styled-components";
import COLORS from "../../constants/color";
import { WidthType } from ".";

export const QuantityControls = styled.div<{ widthType: WidthType }>`
  display: flex;
  justify-content: ${({ widthType }) => {
    if (widthType === "full") return "space-between";
    if (widthType === "default") return "";
  }};
  gap: 0.5rem;
  background: ${COLORS.primary};
  border-radius: 8px;
  padding: 0.5rem;
  width: ${({ widthType }) => {
    if (widthType === "full") return "100%";
    if (widthType === "default") return "fit-content";
    return widthType;
  }};
  font-family: "Outfit";
  color: #542e00;

  span {
    min-width: 30px;
    text-align: center;
  }
`;

export const QuantityButton = styled.button`
  background: ${COLORS.highlight};
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;

  &:hover {
    background: ${COLORS.gold};
    color: white;
  }
`;

export const QuantityText = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 400;
  font-size: 20px;
  font-family: "Outfit";
`;
