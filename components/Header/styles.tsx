import styled from "styled-components";
import COLORS from "../../constants/color";

export const HeaderWrapper = styled.div`
  width: 100%;
  height: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background: linear-gradient(90deg, #f9f1e7 70%, #fcf8f3 30%);
  display: flex;
  justify-content: space-between;
  padding: 10px 40px;

  @media screen and (max-width: 425px) {
    padding: 10px 20px;
  }
`;

export const HeaderLinks = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 30px;
  align-items: center;
`;

export const LogoImage = styled.img`
  image-rendering: auto;
  width: 206.14px;
  height: 44.22px;
`;

export const HeaderMenu = styled.div`
  display: flex;
  justify-items: center;
  gap: 30px;
  justify-content: center;
`;

export const HeaderMenuText = styled.div<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  position: relative;
  color: #542e00;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-family: "Outfit";
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  gap: 0.3rem;

  &::after {
    content: "";
    position: absolute;
    bottom: -4px;
    left: 0;
    width: ${({ $isActive }) => ($isActive ? "100%" : "0")};
    height: 1px;
    background: ${COLORS.bronze};
    transition: width 0.3s ease;
  }

  &:hover {
    /* color: ${COLORS.bronze}; */
    &::after {
      width: 100%;
    }
  }
`;

export const HeaderUserDropdown = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  color: ${COLORS.secondary};
  font-family: "Outfit";
  font-size: 20px;
  font-weight: 500;
  cursor: pointer;
  padding: 8px 16px;
  gap: 0.8rem;
  border-radius: 8px;
  transition: all 0.25s ease;
  background: ${COLORS.primary};
  border: 1px solid ${COLORS.gold};
  box-shadow: 0 2px 12px rgba(168, 123, 65, 0.08);
  padding: 10px 20px; // Increased touch target
  font-weight: 500; // Better medium weight for Outfit font
  border: 1px solid transparent; // Initial transparent border

  &:hover {
    border-color: ${COLORS.gold}; // Gold border on hover
    background: rgba(184, 159, 114, 0.05); // Subtle gold tint
  }

  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);

  .dropdown-arrow {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    margin-left: 4px;
    font-size: 1.2rem;
  }
`;

export const UserDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  background: ${COLORS.primary};
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(84, 46, 0, 0.12);
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  min-width: 200px;
  overflow: hidden;
  z-index: 1000;
  border: 1px solid ${COLORS.gold};
  transform-origin: top right;
  animation: ${({ $isOpen }) =>
    $isOpen ? "scaleIn 0.25s ease forwards" : "none"};
  font-size: 20px;

  @keyframes scaleIn {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`;

export const DropdownItem = styled.div`
  padding: 20px 30px;
  color: ${COLORS.secondary};
  font-family: "Outfit";
  font-size: 18px;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  background: transparent;

  &:not(:last-child) {
    border-bottom: 1px solid ${COLORS.accent};
  }

  &:hover {
    background: rgba(184, 159, 114, 0.08);
    padding-left: 2.4rem;

    &::after {
      content: "";
      position: absolute;
      left: 1.6rem;
      bottom: 50%;
      width: 3px;
      height: 24px;
      background: ${COLORS.bronze};
      transform: translateY(50%);
      border-radius: 2px;
    }
  }

  &:active {
    background: rgba(184, 159, 114, 0.12);
  }
`;

export const MobileMenuIconDiv = styled.div`
  display: grid;
  place-items: center;
`;

export const MobileMenuText = styled.div``;

export const MobileMenuWrapper = styled.div`
  background: linear-gradient(90deg, #f9f1e7 70%, #fcf8f3 30%);
  padding: 0px 20px;
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  color: #542e00;
  text-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  font-family: "Outfit";
`;

export const LoginButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CartBadge = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background: ${COLORS.oxblood};
  color: white;
  font-size: 12px;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
`;

// export const UserDropdown = styled.div<{ $isOpen: boolean }>`
//   position: absolute;
//   right: 0;
//   top: 100%;
//   background: white;
//   border-radius: 8px;
//   box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
//   display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
//   min-width: 180px;
//   overflow: hidden;
//   z-index: 100;
// `;

// export const DropdownItem = styled.div`
//   padding: 12px 16px;
//   color: ${COLORS.secondary};
//   font-family: "Outfit";
//   cursor: pointer;
//   transition: all 0.2s ease;

//   &:hover {
//     background: "#f9f1e7";
//     /* color: ${COLORS}; */
//   }
// `;
