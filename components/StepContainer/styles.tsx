import styled from "styled-components";

const primary = "#111111";
const accent = "#D4AF37";
const background = "#f9f9f9";

export const StylesStepContainer = styled.div<{ active?: boolean }>`
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

export const SectionContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    padding: 1.25rem;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${primary};
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${accent};

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
  }
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

export const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1.5rem;

  @media (max-width: 480px) {
    flex-direction: column-reverse; /* Put 'Back' at the bottom */
    gap: 1rem;
    
    > * {
      width: 100% !important;
    }
  }

  > *:only-child {
    margin-left: auto;
  }
`;

export const PrimaryButton = styled.button`
  background: ${accent};
  color: white;
  height: 44px;
  padding: 0 1.75rem;
  border: none;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #9d845a;
    transform: translateY(-1.5px);
    box-shadow: 0 4px 10px rgba(212, 175, 55, 0.15);
  }

  @media (max-width: 768px) {
    height: 42px;
    padding: 0 1.25rem;
    font-size: 0.9rem;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CheckoutHeader = styled.header`
  max-width: 1400px;
  margin: 0 auto 3rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    justify-content: center;
    margin-bottom: 2rem;
  }
`;

export const CheckoutSteps = styled.div`
  display: flex;
  gap: 3rem;
  position: relative;
  width: auto;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
    gap: 0.75rem;
  }
`;

export const Step = styled.div<{ active?: boolean }>`
  color: ${(props) => (props.active ? primary : accent)};
  font-weight: ${(props) => (props.active ? 600 : 400)};
  position: relative;
  padding-right: 3rem;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  .step-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .step-number {
    font-weight: 700;
  }

  &:not(:last-child)::after {
    content: "›";
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${accent};
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    padding-right: 1.5rem;
    font-size: 0.95rem;
    
    .step-content {
      flex-direction: column;
      align-items: center;
      gap: 0.1rem;
    }

    .step-number {
      font-size: 0.85rem;
    }

    .step-text {
      font-size: 0.65rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.02rem;
    }

    &:not(:last-child)::after {
      right: 0.4rem;
      top: 30%;
      transform: translateY(0);
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    padding-right: 1.25rem;
    
    .step-text {
      font-size: 0.6rem;
    }

    &:not(:last-child)::after {
      right: 0.3rem;
    }
  }
`;

export const Back = styled.div``;

export const BackButton = styled(PrimaryButton)`
  background: transparent;
  color: ${primary};
  border: 2px solid ${accent};
  gap: 8px;
  font-weight: 500;

  &:hover {
    background: #fcf8f3;
    border-color: ${primary};
    transform: translateY(-1.5px);
  }
`;
