// Styles.tsx
import styled, { keyframes } from "styled-components";
import COLORS from "../../../constants/color";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const liftUp = keyframes`
  from { transform: translateY(0); }
  to { transform: translateY(-3px); }
`;

const slideDown = keyframes`
  from { transform: translateY(-30px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

export const Container = styled.div`
  padding: 2rem;
  font-family: "Outfit";
  min-height: 100vh;
  background: ${COLORS.primary};
  animation: ${fadeIn} 0.6s ease-out;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const OrderCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 32px ${COLORS.accent};
  overflow: hidden;
  max-width: 1200px;
  margin: 0 auto;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const OrderHeader = styled.div`
  padding: 2.5rem;
  background: ${COLORS.secondary};
  color: white;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem 2rem;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -20px;
    left: 0;
    right: 0;
    height: 40px;
    background: ${COLORS.highlight};
    transform: rotate(-2deg);
  }
`;

export const OrderNumber = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  letter-spacing: -0.5px;
  word-break: break-all;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    letter-spacing: 0;
  }
`;

export const CustomerName = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
`;

export const DeliveryAddress = styled.p`
  margin-top: 1rem;
  opacity: 0.8;
  font-style: italic;
`;

export const OrderSection = styled.section`
  padding: 2.5rem;
  border-bottom: 1px solid ${COLORS.accent};

  &:last-child {
    border-bottom: 0;
  }

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${COLORS.secondary};
  margin-bottom: 2rem;
  position: relative;
  padding-left: 1rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 80%;
    width: 4px;
    background: ${COLORS.gold};
  }
`;

export const ItemsList = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
`;

export const Item = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${COLORS.primary};
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.highlight};
    animation: ${liftUp} 0.3s ease forwards;
  }
`;

export const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid ${COLORS.gold};
`;

export const ItemDetails = styled.div`
  flex: 1;
`;

export const ItemName = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 0.25rem;
  color: ${COLORS.secondary};
`;

export const ItemMeta = styled.p`
  font-size: 0.9rem;
  color: ${COLORS.slate};
`;

export const TrackingTimeline = styled.div`
  position: relative;
  padding-left: 30px;
  margin-left: 15px;
`;

export const StatusItem = styled.div<{ $isActive: boolean }>`
  position: relative;
  padding: 1.5rem 0;
  display: flex;
  gap: 1.5rem;

  &::before {
    content: "";
    position: absolute;
    left: -34px;
    top: 24px;
    height: calc(100% + 20px);
    width: 2px;
    background: ${({ $isActive }) => ($isActive ? COLORS.gold : COLORS.accent)};
  }

  &:last-child::before {
    display: none;
  }
`;

export const StatusDot = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  border: 3px solid ${COLORS.gold};
  position: absolute;
  left: -43px;
  top: 22px;
  z-index: 1;

  ${StatusItem}:hover & {
    transform: scale(1.2);
    transition: transform 0.3s ease;
  }
`;

export const StatusContent = styled.div`
  flex: 1;
`;

export const StatusTitle = styled.h3`
  font-size: 1.1rem;
  color: ${COLORS.secondary};
  margin-bottom: 0.25rem;
`;

export const StatusDate = styled.p`
  font-size: 0.9rem;
  color: ${COLORS.slate};
`;

export const StatusDescription = styled.p`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: ${COLORS.bronze};
`;

export const TimelineLine = styled.div`
  position: absolute;
  left: -34px;
  top: 40px;
  bottom: -20px;
  width: 2px;
  background: ${COLORS.accent};
`;

export const HorizontalTimeline = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  margin: 2rem 0;
  padding: 0 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0;
    padding: 0;
    margin: 1rem 0;
  }
`;

export const TimelineStep = styled.div<{
  $isCompleted: boolean;
  $isCurrent: boolean;
}>`
  flex: 1;
  position: relative;
  min-width: 140px;
  padding: 0 1rem;
  opacity: ${({ $isCompleted, $isCurrent }) =>
    $isCurrent ? 1 : $isCompleted ? 0.8 : 0.6};
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  @media (max-width: 768px) {
    min-width: unset;
    flex: none;
    padding: 0.75rem 0 0.75rem 2.5rem; /* Reduced padding to fit dot */
    border-left: 2px solid ${({ $isCompleted, $isCurrent }) =>
      $isCurrent ? COLORS.gold : $isCompleted ? COLORS.bronze : COLORS.accent};
    margin-left: 1.5rem; /* Move line further right from edge */
    position: relative;
  }
`;

export const StepIndicator = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    position: absolute;
    left: -1.05rem; /* Adjusted to center 32px dot on 2px border at left of container */
    top: 0.6rem;
    margin: 0;
  }
`;

const pulse = keyframes`
  0% { transform: scale(0.8); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
`;

export const StepDot = styled.div<{
  $isCompleted: boolean;
  $isCurrent: boolean;
}>`
  width: 100%;
  height: 100%;
  background: ${({ $isCompleted, $isCurrent }) =>
    $isCurrent ? COLORS.gold : $isCompleted ? COLORS.bronze : COLORS.accent};
  border-radius: 50%;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
`;

export const CurrentPulse = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 2px solid ${COLORS.gold};
  border-radius: 50%;
  animation: ${pulse} 1.5s infinite;
`;

export const StepConnector = styled.div<{
  $isCompleted: boolean;
  $isFirst: boolean;
}>`
  position: absolute;
  top: 12px;
  left: -50%;
  right: 50%;
  height: 2px;
  background: ${({ $isCompleted }) =>
    $isCompleted ? COLORS.bronze : COLORS.accent};
  z-index: 1;
  transition: background 0.3s ease;

  @media (max-width: 768px) {
    display: none;
  }

  ${({ $isFirst }) => $isFirst && `display: none;`}
`;

export const StepInfo = styled.div`
  text-align: center;
  padding: 0 0.5rem;

  @media (max-width: 768px) {
    text-align: left;
    padding: 0;
  }
`;

export const StepTitle = styled.div`
  font-weight: 600;
  color: ${COLORS.secondary};
  margin-bottom: 0.25rem;
  font-size: 0.9rem;

  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

export const StepDate = styled.div`
  color: ${COLORS.slate};
  font-size: 0.8rem;
  line-height: 1.3;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

export const ItemsGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ProductCard = styled.div`
  background: ${COLORS.primary};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  max-width: 300px;
  cursor: pointer;

  @media (max-width: 768px) {
    max-width: 100%;
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 2px solid ${COLORS.gold};

  @media (max-width: 768px) {
    width: 90px;
    height: 90px;
    border-bottom: none;
    border-radius: 8px;
    border: 2px solid ${COLORS.gold};
    flex-shrink: 0;
  }
`;

export const ProductDetails = styled.div`
  padding: 1.2rem;
`;

export const ProductName = styled.h3`
  font-size: 1rem;
  color: ${COLORS.secondary};
  margin-bottom: 0.5rem;
`;

export const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: ${COLORS.slate};
  font-size: 0.9rem;
`;

export const SuccessBanner = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #166534;
  animation: ${slideDown} 0.5s ease-out;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;

  .icon {
    background: #22c55e;
    color: white;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .content {
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
    }
    p {
      margin: 0.25rem 0 0;
      font-size: 0.9rem;
      opacity: 0.9;
    }
  }
`;
