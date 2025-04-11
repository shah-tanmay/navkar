import styled from "styled-components";

const primary = "#542e00";
const accent = "#b89f72";
const background = "#f9f1e7";

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
`;

export const CheckoutSteps = styled.div`
  display: flex;
  gap: 2rem;
  position: relative;
`;

export const Step = styled.div<{ active?: boolean }>`
  color: ${(props) => (props.active ? primary : accent)};
  font-weight: ${(props) => (props.active ? 600 : 400)};
  position: relative;
  padding-right: 2rem;
  cursor: pointer;

  &:not(:last-child)::after {
    content: "›";
    position: absolute;
    right: 0;
    color: ${accent};
  }
`;

export const Back = styled.div``;

export const BackButton = styled(PrimaryButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  gap: 10px;
  align-self: center;
  background: transparent;
  color: ${primary};
  border: 2px solid ${accent};

  &:hover {
    background: #fcf8f3;
  }
`;
