import styled from "styled-components";
import { FaLock, FaArrowLeft, FaChevronLeft } from "react-icons/fa";
import COLORS from "../../../constants/color";
import { motion } from "framer-motion";

// Color scheme
const primary = "#542e00";
const accent = "#b89f72";
const background = "#f9f1e7";

export const CheckoutContainer = styled.div`
  background: ${background};
  min-height: 100vh;
  padding: 2rem;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
`;

export const BrandLogo = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: ${primary};
  letter-spacing: -1px;
`;

export const MainContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  gap: 3rem;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const OrderSummary = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: fit-content;
  position: sticky;
  margin-top: 4.2rem;
  top: 2rem;

  @media (max-width: 1200px) {
    max-width: 100%;
    position: static;
  }
`;

export const SectionContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${primary};
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${accent};
`;

export const FormRow = styled.div`
  display: flex;
  gap: 1.5rem;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

export const InputGroup = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 100%;

  label {
    display: block;
    color: ${primary};
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
`;

export const Input = styled.input`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  padding: 0.8rem;
  border: 1px solid ${accent};
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${primary};
    box-shadow: 0 0 0 2px rgba(84, 46, 0, 0.1);
  }
`;

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;

  > *:only-child {
    margin-left: auto;
  }
`;

export const PrimaryButton = styled.button`
  background: ${accent};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #9d845a;
    transform: translateY(-2px);
  }
`;

export const StepContainer = styled.div<{ active?: boolean }>`
  display: ${(props) => (props.active ? "flex" : "none")};
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

export const ProductItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
`;

export const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
`;

export const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-left: 10px;

  h4 {
    color: ${primary};
    margin: 0;
  }

  p {
    color: #666;
    font-size: 0.9rem;
    margin: 0;
  }
`;

export const Price = styled.span`
  font-size: 1.1rem;
  color: ${primary};
  font-weight: 600;
  margin-left: auto;
`;

export const PriceBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 2rem 0;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${primary};
`;

export const TotalPrice = styled(PriceRow)`
  font-size: 1.2rem;
  font-weight: 600;
  padding-top: 1rem;
  border-top: 2px solid ${accent};
`;

export const BackToCartLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${primary};
  margin-top: 2rem;
  text-decoration: none;
  transition: all 0.3s ease;
  align-self: center;

  &:hover {
    color: ${accent};
    transform: translateX(-5px);
  }
`;

export const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: #fcf8f3;
  border-radius: 12px;
`;

export const PayButton = styled(PrimaryButton)`
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  width: 100%;
  max-width: 300px;
`;

export const SecurityNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${primary};
  font-size: 0.9rem;
`;

export const PaymentMethods = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;

  img {
    height: 30px;
    opacity: 0.8;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

export const EditCartLink = styled.a`
  color: ${accent};
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: ${primary};
    text-decoration: underline;
  }
`;

export const SummaryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
`;

export const ProductItemsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
  cursor: pointer;
`;

export const AddressSection = styled.div`
  position: relative;
  background: ${COLORS.primary};
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(84, 46, 0, 0.1);
`;

export const AddressFormContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(84, 46, 0, 0.08);
  border: 1px solid ${COLORS.accent};
`;

export const FloatingAddressButton = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: ${COLORS.gold};
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 24px rgba(184, 159, 114, 0.3);
  z-index: 100;

  &:hover {
    background: ${COLORS.bronze};
  }
`;

export const AddressModal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  width: 90%;
  max-width: 600px;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 24px 48px rgba(84, 46, 0, 0.2);
  z-index: 1000;
`;

export const ModalBackdrop = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 999;
`;
