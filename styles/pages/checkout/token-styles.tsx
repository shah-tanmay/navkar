import styled from "styled-components";
import COLORS from "../../../constants/color";
import { motion, AnimatePresence } from "framer-motion";
import { FaLock, FaArrowLeft, FaChevronLeft, FaShieldAlt, FaTruck, FaClock, FaCheckCircle } from "react-icons/fa";

// Color scheme
const primary = "#111111";
const accent = "#D4AF37";
const background = "#f9f9f9";

export const CheckoutContainer = styled.div`
  background: ${background};
  min-height: 100vh;
  padding: 2rem;
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 1rem 0.75rem;
  }
`;

export const BrandLogo = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: ${primary};
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const MainContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  gap: 3rem;

  @media (max-width: 1200px) {
    flex-direction: column-reverse;
    gap: 1.5rem;
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
    position: sticky;
    top: 0;
    z-index: 100;
    margin: 0 auto 1.5rem auto;
    padding: 1.25rem;
    width: 100%;
    border-radius: 15px;
    border: 1px solid #efefef;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
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

  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

export const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
`;

export const ProductDetails = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-left: 15px;

  @media (max-width: 768px) {
    margin-left: 10px;
  }

  h4 {
    color: ${primary};
    margin: 0;
    font-size: 1rem;
  }

  p {
    color: #666;
    font-size: 0.85rem;
    margin: 0;
  }
`;

export const Price = styled.span`
  font-size: 1.1rem;
  color: ${primary};
  font-weight: 600;
  margin-left: auto;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
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
  width: 100%;
  gap: 0.5rem;
  min-width: 0;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

export const TotalPrice = styled(PriceRow)`
  font-size: 1.2rem;
  font-weight: 600;
  padding-top: 1rem;
  border-top: 2px solid ${accent};

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
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

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
`;

export const ProductItemsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
  cursor: pointer;
  gap: 0.5rem;
  width: 100%;
  min-width: 0;

  @media (max-width: 480px) {
    align-items: flex-start;
  }
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

export const CouponSection = styled.div`
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;

  h4 {
    font-size: 0.95rem;
    margin-bottom: 0.8rem;
    color: ${primary};
  }
`;

export const CouponInputWrapper = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

export const CouponInput = styled.input`
  flex: 1;
  padding: 0.6rem;
  border: 1px solid ${accent};
  border-radius: 6px;
  font-size: 0.9rem;
  text-transform: uppercase;

  &:focus {
    outline: none;
    border-color: ${primary};
  }
`;

export const ApplyButton = styled.button`
  background: ${primary};
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: ${accent};
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  @media (max-width: 400px) {
    width: 100%;
  }
`;

export const CouponMessage = styled.p<{ error?: boolean }>`
  font-size: 0.8rem;
  margin-top: 0.5rem;
  color: ${props => props.error ? "#d32f2f" : "#2e7d32"};
`;

export const AppliedCoupon = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f1f8e9;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  border: 1px dashed #2e7d32;

  div {
    display: flex;
    flex-direction: column;
  }

  span.code {
    font-weight: 600;
    color: #2e7d32;
    font-size: 0.9rem;
  }

  span.label {
    font-size: 0.75rem;
    color: #558b2f;
  }

  button {
    background: none;
    border: none;
    color: #d32f2f;
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0.2rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const SummaryToggle = styled.div`
  display: none;
  @media (max-width: 1200px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    cursor: pointer;
    
    .left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: ${accent};
      font-weight: 600;
      font-size: 0.9rem;
    }

    .right {
      font-weight: 700;
      color: ${primary};
      font-size: 1.1rem;
    }
  }
`;

export const CollapsibleContent = styled.div<{ $expanded: boolean }>`
  @media (max-width: 1200px) {
    max-height: ${props => props.$expanded ? "2000px" : "0"};
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    opacity: ${props => props.$expanded ? "1" : "0"};
    margin-top: ${props => props.$expanded ? "1.5rem" : "0"};
  }
`;

export const StepIndicator = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
  position: relative;
  padding: 0 1rem;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background: #e2e8f0;
    transform: translateY(-50%);
    z-index: 1;
  }
`;

export const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  background: ${background};
  padding: 0 0.5rem;

  .circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background: ${props => props.$active ? primary : props.$completed ? accent : 'white'};
    border: 2px solid ${props => props.$active || props.$completed ? 'transparent' : '#e2e8f0'};
    color: ${props => props.$active || props.$completed ? 'white' : '#94a3b8'};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: ${props => props.$active ? '0 0 0 4px rgba(17, 17, 17, 0.1)' : 'none'};
  }

  .label {
    font-size: 0.85rem;
    font-weight: 600;
    color: ${props => props.$active ? primary : '#64748b'};
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const TrustSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    gap: 0.5rem;
    overflow-x: auto;
    padding-bottom: 8px;
    &::-webkit-scrollbar { display: none; }
  }
`;

export const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  white-space: nowrap;

  svg {
    color: #0f172a;
    font-size: 1rem;
    flex-shrink: 0;
  }

  span {
    font-size: 0.8rem;
    font-weight: 600;
    color: #0f172a;
  }

  p {
    display: none; // Hide sub-text for the compact top bar
  }

  @media (max-width: 480px) {
    span {
      font-size: 0.7rem;
    }
    svg {
      font-size: 0.85rem;
    }
  }
`;
