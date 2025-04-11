import styled, { keyframes } from "styled-components";
import { FiX, FiShoppingCart } from "react-icons/fi";
import COLORS from "../../constants/color";

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

export const CartSummaryWrapper = styled.div<{ visible: boolean }>`
  position: fixed;
  font-family: "Outfit";
  top: 100px;
  right: 2rem;
  width: 400px;
  background: rgba(255, 255, 255, 0.97);
  border-radius: 20px;
  box-shadow: 0 15px 40px ${COLORS.accent};
  backdrop-filter: blur(10px);
  z-index: 1000;
  transform: translateX(${(props) => (props.visible ? 0 : "120%")});
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  border: 1px solid ${COLORS.accent};
`;

export const CartHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 2px solid ${COLORS.accent};
  display: flex;
  align-items: center;
  gap: 1rem;
  color: ${COLORS.secondary};

  h3 {
    margin: 0;
    font-size: 1.4rem;
  }
`;

export const CartItem = styled.div`
  display: grid;
  grid-template-columns: 60px 1fr auto;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid ${COLORS.accent};

  &:last-child {
    border-bottom: none;
  }
`;

export const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
`;

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  span {
    font-size: 0.9rem;
    color: ${COLORS.slate};
  }
`;

export const CartFooter = styled.div`
  padding: 1.5rem;
  background: ${COLORS.primary};
  border-radius: 0 0 20px 20px;
`;

export const ViewCartButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: ${COLORS.oxblood};
  color: white;
  padding: 1rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.navy};
    transform: translateY(-2px);
  }
`;
