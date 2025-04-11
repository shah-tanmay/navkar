import styled, { keyframes } from "styled-components";
import COLORS from "../../constants/color";

const sphereRotate = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  50% { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
`;

const pulse = keyframes`
  0% { opacity: 1; transform: scale(0.8); }
  100% { opacity: 0; transform: scale(1.8); }
`;

const particleFloat = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

export const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${COLORS.accent};
  backdrop-filter: blur(4px);
  z-index: 9999;
`;

export const ChocolateSphere = styled.div`
  width: 80px;
  height: 80px;
  background: ${COLORS.secondary};
  border-radius: 50%;
  position: relative;
  animation: ${sphereRotate} 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  box-shadow: 0 8px 24px ${COLORS.accent};
`;

export const PulseRing = styled.div<{ $delay: number }>`
  position: absolute;
  width: 120%;
  height: 120%;
  border: 2px solid ${COLORS.secondary};
  border-radius: 50%;
  animation: ${pulse} 2s ease-out infinite;
  animation-delay: ${(props) => props.$delay * 0.5}s;
  top: -10%;
  left: -10%;
`;

export const AccentParticle = styled.div<{
  $color: string;
  $position: "top" | "bottom" | "left" | "right";
}>`
  width: 16px;
  height: 16px;
  background: ${(props) => props.$color};
  border-radius: 50%;
  position: absolute;
  ${(props) => {
    const positionMap = {
      top: { top: "0%", transform: "translateX(-50%)" },
      bottom: { bottom: "0%", transform: "translateX(-50%)" },
      left: { left: "0%", transform: "translateY(-50%)" },
      right: { right: "0%", transform: "translateY(-50%)" },
    };
    return positionMap[props.$position];
  }};
  animation: ${particleFloat} 1.5s ease-in-out infinite;
`;

export const PremiumGlow = styled.div<{ $color: string }>`
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(${(props) => props.$color} 0%, transparent 70%);
  filter: blur(40px);
  opacity: 0.4;
`;


