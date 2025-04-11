// import COLORS from "../../constants/color";
// import { ButtonWrapper } from "../Button/styles";
// import styled from "styled-components";

// export const AddToCartButton = styled(ButtonWrapper)`
//   &&& {
//     width: 100%;
//     margin-top: 1rem;
//     padding: 12px 20px !important;
//     height: 50px;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//     gap: 10px;
//     background: ${COLORS.secondary};
//     border: 2px solid ${COLORS.primary};
//     border-radius: 12px;
//     transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
//     box-shadow: 0 4px 12px ${COLORS.accent};
//     position: relative; // Add this
//     z-index: 4; // Increase z-index

//     &:hover {
//       background: ${COLORS.secondary};
//       color: ${COLORS.primary};
//       border-color: ${COLORS.secondary};
//       transform: translateY(-2px);
//       box-shadow: 0 6px 16px ${COLORS.accent};
//     }

//     svg {
//       font-size: 20px;
//       transition: transform 0.2s ease;
//     }

//     @media (max-width: 768px) {
//       padding: 10px 16px !important;
//       height: 45px;
//       font-size: 16px;

//       svg {
//         font-size: 18px;
//       }
//     }
//   }
// `;

import styled, { keyframes } from "styled-components";
import COLORS from "../../constants/color";

const bounce = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.5); }
  70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const AddToCartButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  margin-top: 1rem;
  padding: 14px 24px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: ${COLORS.secondary};
  color: ${COLORS.primary};
  border: 2px solid ${COLORS.primary};
  border-radius: 12px;
  font-weight: 700;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px ${COLORS.accent};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  svg {
    font-size: 20px;
    transition: transform 0.2s ease;
  }

  @media (max-width: 768px) {
    height: 48px;
    font-size: 1rem;
    padding: 12px 20px;
  }
`;

export const QuantityControls = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  width: 100%;
  margin-top: 1rem;
  height: 56px;
  background: ${COLORS.secondary};
  border: 2px solid ${COLORS.primary};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px ${COLORS.accent};

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    color: ${COLORS.primary};
    transition: all 0.2s ease;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background: rgba(0, 0, 0, 0.05);
    }

    svg {
      font-size: 14px;
    }
  }

  @media (max-width: 768px) {
    height: 48px;
  }
`;

export const QuantityBadge = styled.div<{ $pulse: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.2rem;
  background: ${(props) => (props.$pulse ? COLORS.accent : "transparent")};
  color: ${(props) => (props.$pulse ? COLORS.secondary : COLORS.primary)};
  animation: ${(props) => (props.$pulse ? pulse : "none")} 1s ease;
  transition: all 0.3s ease;
`;

export const Loader = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: ${COLORS.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

export const ErrorBubble = styled.div`
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%);
  background: ${COLORS.oxblood};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: ${bounce} 0.5s ease;
`;
