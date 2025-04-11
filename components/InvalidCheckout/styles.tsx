import styled from "styled-components";
import COLORS from "../../constants/color";

const mobileBreakpoint = "768px";

export const Container = styled.div`
  font-family: "Outfit", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: ${COLORS.primary};
  padding: 1rem;

  @media (min-width: ${mobileBreakpoint}) {
    padding: 2rem;
  }
`;

export const ContentArea = styled.div`
  max-width: 90%;
  width: 100%;
  padding: 1.5rem;
  background: ${COLORS.highlight};
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid ${COLORS.accent};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
  text-align: center;

  @media (min-width: ${mobileBreakpoint}) {
    max-width: 600px;
    padding: 2.5rem;
    border-radius: 1.5rem;
  }
`;

export const IconContainer = styled.div`
  display: inline-flex;
  padding: 1rem;
  border-radius: 50%;
  background: ${COLORS.primary};
  margin-bottom: 1.5rem;
  border: 2px solid ${COLORS.danger};

  @media (min-width: ${mobileBreakpoint}) {
    padding: 1.5rem;
    margin-bottom: 2rem;
  }
`;

export const Heading = styled.h1`
  font-size: 1.75rem;
  color: ${COLORS.danger};
  margin-bottom: 1rem;
  font-weight: 300;
  letter-spacing: -0.03em;

  @media (min-width: ${mobileBreakpoint}) {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }
`;

export const Title = styled.h2`
  font-size: 1.25rem;
  color: ${COLORS.oxblood};
  margin-bottom: 0.75rem;
  font-weight: 500;

  @media (min-width: ${mobileBreakpoint}) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

export const Description = styled.p`
  font-size: 1rem;
  color: ${COLORS.slate};
  line-height: 1.6;
  margin-bottom: 1.5rem;

  @media (min-width: ${mobileBreakpoint}) {
    font-size: 1.125rem;
    margin-bottom: 2rem;
  }
`;

export const HomeButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${COLORS.danger};
  color: ${COLORS.primary};
  border: none;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background-color: ${COLORS.oxblood};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  @media (min-width: ${mobileBreakpoint}) {
    padding: 1rem 2.5rem;
    font-size: 1rem;
    width: auto;
  }
`;

export const DecorativeBorder = styled.div`
  position: absolute;
  width: 150px;
  height: 150px;
  border: 2px solid ${COLORS.gold};
  opacity: 0.1;
  pointer-events: none;
  display: none;

  @media (min-width: ${mobileBreakpoint}) {
    display: block;
  }
`;
