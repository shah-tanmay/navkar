import styled, { keyframes } from "styled-components";
import COLORS from "../../../constants/color";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const checkmark = keyframes`
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); opacity: 1; }
`;

export const SuccessContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fdfdfd;
  padding: 2rem;
  font-family: "Outfit", sans-serif;
`;

export const SuccessCard = styled.div`
  background: white;
  padding: 3rem;
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
  text-align: center;
  max-width: 500px;
  width: 100%;
  animation: ${fadeIn} 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);

  @media (max-width: 480px) {
    padding: 2rem 1.5rem;
  }
`;

export const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  background: #eefdf5;
  color: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  margin: 0 auto 2rem;
  animation: ${checkmark} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
`;

export const Title = styled.h1`
  font-size: 2rem;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
`;

export const OrderInfo = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 0.95rem;
    gap: 1rem;
    
    .label { color: #94a3b8; flex-shrink: 0; }
    .value { 
      color: #1e293b; 
      font-weight: 600; 
      text-align: right; 
      word-break: break-all;
    }

    @media (max-width: 400px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.25rem;
      
      .value { text-align: left; }
    }
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const PrimaryButton = styled.button`
  background: ${COLORS.secondary};
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background: ${COLORS.gold};
    transform: translateY(-2px);
  }
`;

export const SecondaryButton = styled.button`
  background: white;
  color: #64748b;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
  }
`;
