import styled from "styled-components";
import COLORS from "../../constants/color";

export const LoginContainer = styled.div`
  display: flex;
  height: 100vh;
  font-family: "Outfit";
  background-color: ${COLORS.primary};
  position: relative;
  padding: 2rem;
  box-sizing: border-box;
  overflow: hidden;
`;

export const LoginCard = styled.div`
  position: relative;
  z-index: 1;
  background: ${COLORS.primary};
  border: 1px solid ${COLORS.gold};
  border-radius: 12px;
  padding: 3rem;
  max-width: 480px;
  width: 100%;
  margin: auto;
  box-shadow: 0 8px 32px ${COLORS.accent};

  @media (max-width: 768px) {
    padding: 2rem;
  }
`;

export const BrandContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid ${COLORS.gold};
`;

export const BrandText = styled.div`
  font-size: 2rem;
  color: ${COLORS.secondary};

  span {
    color: ${COLORS.gold};
  }
`;

export const LogoImage = styled.img`
  image-rendering: auto;
  width: 206.14px;
  height: 44.22px;
`;

export const Title = styled.h1`
  color: ${COLORS.secondary};
  font-size: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
  font-weight: 500;
`;

export const Subtitle = styled.p`
  color: ${COLORS.slate};
  text-align: center;
  margin-bottom: 2.5rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

export const FooterLinks = styled.div`
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;

  a {
    color: ${COLORS.slate};
    text-decoration: none;
    font-size: 0.875rem;
    transition: color 0.3s ease;

    &:hover {
      color: ${COLORS.bronze};
    }
  }
`;

export const GoogleSVG = styled.svg`
  width: 20px;
  height: 20px;
`;

export const GoogleButton = styled.button<{ $loading?: boolean }>`
  width: 100%;
  padding: 1rem;
  background: ${({ $loading }) => ($loading ? COLORS.gold : COLORS.secondary)};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $loading }) => ($loading ? "0" : "1rem")};
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    background: ${({ $loading }) => !$loading && COLORS.gold};
    transform: ${({ $loading }) => !$loading && "translateY(-2px)"};
  }

  &:disabled {
    background: ${COLORS.secondary};
    opacity: 0.8;
    cursor: not-allowed;
  }
`;

export const ButtonContent = styled.div<{ $visible: boolean }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  display: flex;
  align-items: center;
  gap: 1rem;
`;
