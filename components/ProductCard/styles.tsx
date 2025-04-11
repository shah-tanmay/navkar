import Image from "next/image";
import { MdPalette } from "react-icons/md";
import styled, { keyframes } from "styled-components";
import COLORS from "../../constants/color";

// Animation keyframes
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

export const ProductCardImageDiv = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  background: white;
  padding: 1rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px ${COLORS.accent};
  transition: transform 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// Add new styled component
export const ProductTag = styled.div<{ variant?: string }>`
  position: absolute;
  top: 15px;
  right: -38px;
  padding: 6px 40px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  color: ${COLORS.primary};
  transform: rotate(45deg);
  pointer-events: none;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  // Color variants
  ${({ variant }) => {
    switch (variant) {
      case "premium":
        return `
          background: ${COLORS.gold};
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        `;
      case "limited":
        return `
          background: ${COLORS.slate};
          font-style: italic;
        `;
      case "sale":
        return `
          background: ${COLORS.oxblood};
          letter-spacing: 1px;
        `;
      case "eco":
        return `
          background: ${COLORS.navy};
          font-weight: 500;
        `;
      default: // new arrival
        return `
          background: ${COLORS.secondary};
          font-weight: 700;
        `;
    }
  }}
`;

export const ProductCardImage = styled(Image)`
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  filter: drop-shadow(0 4px 8px ${COLORS.accent});
`;

export const ProductInfoDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 0.5rem;
  position: relative;
  z-index: 2;
`;

export const ProductPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  position: relative;
  padding-bottom: 4px;

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: ${COLORS.secondary};
    transition: width 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }
`;

export const ProductCardWrapper = styled.div`
  width: 320px;
  background: ${COLORS.primary};
  padding: 1.5rem;
  border-radius: 24px;
  font-family: "Outfit", sans-serif;
  color: ${COLORS.secondary};
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);

    ${ProductCardImage} {
      transform: scale(1.05);
    }

    ${ProductPrice}::after {
      width: 100%;
    }
  }

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent 45%,
      ${COLORS.highlight} 50%,
      transparent 55%
    );
    animation: ${float} 6s infinite linear;
    pointer-events: none;
    opacity: 0.2;
  }
`;

export const ProductName = styled.div`
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.25px;
  position: relative;
  padding-left: 1.5rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 8px;
    height: 8px;
    background: ${COLORS.secondary};
    border-radius: 50%;
  }
`;

export const TypeSelectorContainer = styled.div<{ $count: number }>`
  display: flex;
  gap: 0.75rem;
  padding: 0 1rem;
  margin: 1.25rem 0;
  position: relative;
  overflow-x: ${({ $count }) => ($count > 2 ? "auto" : "visible")};
  scrollbar-width: none;
  justify-content: ${({ $count }) =>
    $count <= 2 ? "space-between" : "flex-start"};
  mask-image: ${({ $count }) =>
    $count > 2
      ? `linear-gradient(
          to right, 
          transparent 0%, 
          ${COLORS.primary} 10%, 
          ${COLORS.primary} 90%, 
          transparent 100%
        )`
      : "none"};

  &::-webkit-scrollbar {
    display: none;
  }

  &::after {
    content: ${({ $count }) => ($count > 2 ? "'↔'" : "''")};
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${COLORS.secondary};
    opacity: 0.4;
    font-size: 1.2rem;
    pointer-events: none;
  }
`;

export const TypeLabel = styled.span<{ $isSelected: boolean }>`
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.25px;
  color: ${({ $isSelected }) =>
    $isSelected ? COLORS.primary : COLORS.secondary};
  position: relative;
  z-index: 1;
`;

export const TypePrice = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${COLORS.gold};
  position: relative;
  padding-left: 0.75rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 60%;
    width: 1px;
    background: ${COLORS.accent};
  }
`;

export const ScrollButton = styled.button<{
  $direction: "left" | "right";
  $visible: boolean;
}>`
  position: absolute;
  ${({ $direction }) =>
    $direction === "left" ? "left: -4px;" : "right: -4px;"}
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${COLORS.primary};
  border: 1px solid ${COLORS.gold};
  box-shadow: 0 4px 12px rgba(84, 46, 0, 0.15);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${COLORS.gold};
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 16px rgba(84, 46, 0, 0.25);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }
`;

// CHEVRON ICON
export const ChevronIcon = styled.div<{ $direction: "left" | "right" }>`
  width: 16px;
  height: 16px;
  border: 2px solid ${COLORS.secondary};
  border-width: 2px 2px 0 0;
  transform: rotate(
    ${({ $direction }) => ($direction === "left" ? "-135deg" : "45deg")}
  );
  margin: ${({ $direction }) =>
    $direction === "left" ? "0 2px 0 0" : "0 0 0 2px"};
`;

// TYPE PILL CONTAINER
export const TypePillContainer = styled.div<{ $count: number }>`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  padding: ${({ $count }) => ($count > 2 ? "0 24px" : "0")};
  flex: 1;

  &::-webkit-scrollbar {
    display: none;
  }
`;

// TYPE PILLS
export const TypePill = styled.div<{ $isSelected: boolean; $count: number }>`
  flex: ${({ $count }) => ($count <= 2 ? 1 : "0 0 auto")};
  padding: 12px ${({ $count }) => ($count <= 2 ? "0" : "24px")};
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.25px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-align: center;
  min-width: ${({ $count }) => ($count <= 2 ? "auto" : "120px")};

  /* BACKGROUND GRADIENT MAGIC */
  background: ${({ $isSelected }) =>
    $isSelected
      ? `
    linear-gradient(
      135deg,
      ${COLORS.gold} 0%,
      ${COLORS.bronze} 100%
    )`
      : `rgba(184, 159, 114, 0.1)`};

  border: 1.5px solid
    ${({ $isSelected }) => ($isSelected ? COLORS.gold : "rgba(84, 46, 0, 0.1)")};

  /* BORDER ANIMATION */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 999px;
    padding: 1.5px;
    background: linear-gradient(
      135deg,
      rgba(184, 159, 114, 0.4) 0%,
      rgba(84, 46, 0, 0.1) 100%
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    transition: all 0.4s ease;
  }

  /* TEXT COLORS */
  color: ${({ $isSelected }) =>
    $isSelected ? COLORS.primary : COLORS.secondary};
  text-shadow: ${({ $isSelected }) =>
    $isSelected ? `0 1px 2px rgba(84, 46, 0, 0.2)` : "none"};

  /* HOVER EFFECTS */
  &:hover {
    transform: ${({ $count }) => ($count > 2 ? "translateY(-1px)" : "none")};
    box-shadow: ${({ $isSelected }) =>
      !$isSelected ? `0 4px 16px rgba(84, 46, 0, 0.08)` : "none"};
  }

  /* ACTIVE STATE */
  &:active {
    transform: scale(0.98);
  }
`;

export const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
  align-self: center;
  padding: 0 1rem;
  height: fit-content;
`;

export const TypePantheon = styled.div`
  text-align: center;
  margin: 1.5rem 0;
  padding: 0 1rem;
  position: relative;
`;

export const TypeOracle = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${COLORS.gold};
  letter-spacing: 0.75px;
  position: relative;
  display: inline-block;
  padding: 0 0.5rem;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 50%;
    width: 0;
    height: 1px;
    background: ${COLORS.gold};
    transition: width 0.4s ease;
  }

  &:hover::after {
    width: 100%;
    left: 0;
  }
`;

export const TypeDivider = styled.span`
  display: inline-block;
  width: 1px;
  height: 1rem;
  background: rgba(184, 159, 114, 0.3);
  margin: 0 0.75rem;
  transform: rotate(15deg);
`;

export const PriceDisplay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  margin: auto;
  font-weight: 600;
  color: ${COLORS.secondary};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, ${COLORS.gold} 0%, transparent 100%);
  }
`;

export const AddtoCartWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  /* background-color: red; */
`;

export const SovereignText = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${COLORS.secondary};
  position: relative;
  z-index: 1;
  transition: transform 0.4s ease;
  margin-left: 0.5rem;
`;

export const SovereignHover = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0;
  width: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  span {
    font-size: 0.9rem;
    color: ${COLORS.gold};
    white-space: nowrap;
    letter-spacing: 0.5px;
  }
`;

// CHROMATIC MASTERPIECE ICONS
export const ChromaIcon = styled.div`
  width: 1.8rem;
  height: 1.8rem;
  background: linear-gradient(
    45deg,
    ${COLORS.gold} 25%,
    ${COLORS.oxblood} 50%,
    ${COLORS.navy} 75%
  );
  border-radius: 50%;
  position: relative;
  z-index: 1;
  border: 1.5px solid ${COLORS.primary};
`;

const CrownIcon = styled.div`
  width: 1rem;
  height: 1rem;
  background: ${COLORS.gold};
  clip-path: polygon(
    50% 0%,
    63% 38%,
    100% 38%,
    69% 61%,
    82% 100%,
    50% 75%,
    18% 100%,
    31% 61%,
    0% 38%,
    37% 38%
  );
`;

export const SovereignBadge = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 3rem;
  background: ${COLORS.primary};
  border-radius: 2rem;
  padding: 0 1rem;
  box-shadow: 0 4px 20px rgba(84, 46, 0, 0.08);
  border: 1px solid rgba(184, 159, 114, 0.3);
  cursor: default;
  overflow: hidden;
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      145deg,
      rgba(184, 159, 114, 0.1) 0%,
      rgba(249, 241, 231, 0.4) 100%
    );
    backdrop-filter: blur(6px);
  }

  &:hover {
    padding-right: 1.5rem;

    ${SovereignHover} {
      opacity: 1;
      width: 7.5rem;
    }

    ${SovereignText} {
      transform: translateX(-8px);
    }
  }
`;

export const BeastBadge = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  background: ${COLORS.primary};
  padding: 0.5rem 1rem;
  border-radius: 1rem;
  border: 1px solid ${COLORS.gold};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BeastLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${COLORS.secondary};
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export const BeastSwatches = styled.div`
  display: flex;
  gap: 0.35rem;
`;

export const BeastSwatch = styled.div<{ $color: string }>`
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 1.5px solid ${COLORS.primary};
`;

export const BeastCount = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${COLORS.gold};
  margin-left: 0.25rem;
`;
