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
    overflow-x: auto;
    padding: 0 0.5rem;
    -webkit-overflow-scrolling: touch;
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
    min-width: 120px;
  }
`;

export const StepIndicator = styled.div`
  position: relative;
  width: 32px;
  height: 32px;
  margin: 0 auto 1rem;
  transition: all 0.3s ease;
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

  ${({ $isFirst }) => $isFirst && `display: none;`}
`;

export const StepInfo = styled.div`
  text-align: center;
  padding: 0 0.5rem;
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
`;

export const ProductCard = styled.div`
  background: ${COLORS.primary};
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
  max-width: 300px;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-bottom: 2px solid ${COLORS.gold};
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
