import styled from "styled-components";

const primary = "#542e00";
const accent = "#b89f72";

export const PaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: #fcf8f3;
  border-radius: 12px;
`;

export const SecurityNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${primary};
  font-size: 0.9rem;
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

export const PayButton = styled(PrimaryButton)`
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  width: 100%;
  max-width: 300px;
`;

const ErrorMessage = styled.div`
  background: #ffe3e3;
  color: #c53030;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;
