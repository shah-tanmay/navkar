import styled from "styled-components";
import COLORS from "../../../constants/color";

const breakpoints = {
  small: "480px",
  medium: "768px",
  large: "1024px",
  xlarge: "1280px",
};

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Outfit";
  min-height: 100vh;
  background: ${COLORS.primary};
`;

export const AccountContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: ${breakpoints.medium}) {
    flex-direction: row;
  }
`;

export const Sidebar = styled.aside`
  width: 100%;
  padding: 0.75rem 1rem;
  background: ${COLORS.primary};
  border-bottom: 1px solid ${COLORS.accent};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (min-width: ${breakpoints.medium}) {
    width: 280px;
    min-height: 100vh;
    border-right: 1px solid ${COLORS.accent};
    border-bottom: none;
    padding: 2rem;
  }
`;

export const UserCard = styled.div`
  display: none; /* Hidden on mobile to save space */
  text-align: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${COLORS.accent};

  @media (min-width: ${breakpoints.medium}) {
    display: block;
    padding: 2rem 0;
  }
`;

export const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid ${COLORS.gold};
  margin-bottom: 1rem;

  @media (min-width: ${breakpoints.medium}) {
    width: 100px;
    height: 100px;
  }
`;

export const UserName = styled.h2`
  color: ${COLORS.secondary};
  margin: 0.5rem 0;
  font-size: 1.25rem;

  @media (min-width: ${breakpoints.medium}) {
    font-size: 1.5rem;
  }
`;

export const UserEmail = styled.p`
  color: ${COLORS.slate};
  margin: 0;
  font-size: 0.9rem;
`;

export const NavMenu = styled.nav`
  margin: 0.75rem 0 0;
  display: flex;
  flex-direction: row;
  gap: 0;
  border-bottom: 1px solid ${COLORS.accent};

  @media (min-width: ${breakpoints.medium}) {
    flex-direction: column;
    margin: 2rem 0;
    border-bottom: none;
  }
`;

export const NavItem = styled.div<{ active?: boolean }>`
  color: ${(props) => (props.active ? COLORS.secondary : COLORS.slate)};
  padding: 0.75rem 0.5rem 0.6rem;
  border-bottom: 2px solid ${(props) => (props.active ? COLORS.gold : "transparent")};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  background: transparent;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  flex: 1;

  span {
    display: block; /* Always show text labels */
  }

  svg {
    font-size: 1.1rem;
    color: ${(props) => (props.active ? COLORS.gold : COLORS.slate)};
  }

  &:hover {
    color: ${COLORS.secondary};
    svg { color: ${COLORS.gold}; }
  }

  @media (min-width: ${breakpoints.medium}) {
    flex: none;
    flex-direction: row;
    justify-content: flex-start;
    padding: 1rem;
    margin: 0.5rem 0;
    gap: 1rem;
    font-size: 1rem;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    border-bottom: none;
    border-radius: 8px;
    background: ${(props) => (props.active ? COLORS.highlight : "transparent")};
    border-left: 3px solid ${(props) => (props.active ? COLORS.gold : "transparent")};

    .arrow { display: none; }
  }
`;

export const LogoutButton = styled.button`
  display: none; /* Hidden on mobile - use header sign out instead */
  background: ${COLORS.gold};
  color: ${COLORS.secondary};
  border: 1px solid ${COLORS.accent};
  padding: 1rem;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  width: 100%;

  @media (min-width: ${breakpoints.medium}) {
    display: flex;
  }

  &:hover {
    background: ${COLORS.bronze};
    color: ${COLORS.primary};
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  background: ${COLORS.highlight};

  @media (min-width: ${breakpoints.medium}) {
    padding: 2rem 3rem;
  }
`;

export const Section = styled.section`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 12px ${COLORS.accent};
  margin-bottom: 2rem;

  @media (min-width: ${breakpoints.medium}) {
    padding: 2rem;
  }
`;

export const SectionTitle = styled.h2`
  color: ${COLORS.secondary};
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${COLORS.gold};

  @media (min-width: ${breakpoints.medium}) {
    font-size: 1.8rem;
  }
`;

export const OrdersTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  display: none;

  @media (min-width: ${breakpoints.medium}) {
    display: table;
  }

  th,
  td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid ${COLORS.accent};
  }

  th {
    background: ${COLORS.secondary};
    color: white;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`;

export const OrderRow = styled.tr`
  transition: background 0.3s ease;

  &:hover {
    background: ${COLORS.highlight};
  }
`;

export const OrderId = styled.span`
  color: ${COLORS.secondary};
  font-weight: 700;
  font-family: monospace;
`;

export const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ProductItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const ProductImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
  border: 1px solid ${COLORS.accent};
`;

export const ProductName = styled.span`
  font-size: 0.9rem;
  color: ${COLORS.slate};
  
  strong {
    color: ${COLORS.secondary};
  }
`;

export const Price = styled.span`
  color: ${COLORS.secondary};
  font-weight: 600;
`;

export const MobileOrdersList = styled.div`
  display: block;

  @media (min-width: ${breakpoints.medium}) {
    display: none;
  }
`;

export const MobileOrderCard = styled.div`
  background: white;
  padding: 1.25rem;
  margin-bottom: 0.75rem;
  border-radius: 12px;
  border: 1px solid ${COLORS.accent};
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const MobileOrderDetail = styled.p`
  color: ${COLORS.secondary};
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
`;

export const MobileProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin: 0.5rem 0;
  padding: 0.75rem 0;
  border-top: 1px solid ${COLORS.accent};
  border-bottom: 1px solid ${COLORS.accent};
`;

export const MobileOrderActions = styled.div`
  display: flex;
  gap: 0.75rem;
  border-top: 1px solid ${COLORS.accent};
  padding-top: 0.75rem;
`;

export const MobileOrderToken = styled.div`
  font-family: monospace;
  font-size: 0.75rem;
  color: ${COLORS.slate};
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  margin-bottom: 0.25rem;
`;
export const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;

  @media (min-width: ${breakpoints.small}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${breakpoints.medium}) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
`;

export const AddressCard = styled.div`
  background: white;
  padding: 1.5rem;
  border: 1px solid ${COLORS.accent};
  border-radius: 8px;
`;

export const AddAddressCard = styled(AddressCard)`
  border: 2px dashed ${COLORS.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${COLORS.gold};
    color: ${COLORS.gold};
  }
`;

export const AddressName = styled.h3`
  color: ${COLORS.secondary};
  margin: 0 0 0.5rem;
`;

export const AddressText = styled.p`
  color: ${COLORS.slate};
  margin: 0;
  line-height: 1.6;
`;

export const AddressActions = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
`;

export const EditButton = styled.button`
  background: ${COLORS.gold};
  color: ${COLORS.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.bronze};
  }
`;

export const RemoveButton = styled(EditButton)`
  background: ${COLORS.oxblood};
`;

export const SecurityForm = styled.form`
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: ${breakpoints.medium}) {
    max-width: 500px;
  }
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Input = styled.input`
  padding: 1rem;
  border: 1px solid ${COLORS.accent};
  border-radius: 8px;
  background: white;
  color: ${COLORS.secondary};
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: ${COLORS.gold};
    box-shadow: 0 0 0 2px ${COLORS.highlight};
  }
`;

export const SaveButton = styled.button`
  background: ${COLORS.gold};
  color: ${COLORS.primary};
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  align-self: flex-start;

  &:hover {
    background: ${COLORS.bronze};
  }
`;

export const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  border: 1px solid ${COLORS.gold};
  background: white;
  color: ${COLORS.secondary};
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: "Outfit";
  flex: 1;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;

  @media (max-width: 360px) {
    font-size: 0.75rem;
    padding: 0.5rem 0.6rem;
    gap: 0.25rem;
  }

  &:hover {
    background: ${COLORS.gold};
    color: white;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
    
    svg { color: white; }
  }

  svg {
    font-size: 1rem;
    color: ${COLORS.gold};
    transition: color 0.3s ease;
  }

  &.support-btn {
    border-color: ${COLORS.secondary};
    &:hover {
      background: ${COLORS.secondary};
      box-shadow: 0 4px 12px rgba(17, 17, 17, 0.2);
    }
    svg {
      color: ${COLORS.slate};
    }
  }
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  
  ${(props) => {
    switch (props.status.toLowerCase()) {
      case "delivered":
        return `background: #e6f4ea; color: #1e7e34;`;
      case "shipped":
        return `background: #e8f0fe; color: #1a73e8;`;
      case "processing":
      case "received":
        return `background: #fff4e5; color: #ff9800;`;
      default:
        return `background: ${COLORS.highlight}; color: ${COLORS.slate};`;
    }
  }}
`;

export const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media (min-width: ${breakpoints.large}) {
    grid-template-columns: 1.5fr 1fr;
  }
`;

export const SettingsCard = styled.div`
  background: white;
  padding: 1.5rem;
  border: 1px solid ${COLORS.accent};
  border-radius: 12px;
  height: fit-content;

  h3 {
    display: flex;
    align-items: center;
    color: ${COLORS.secondary};
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid ${COLORS.accent};
  }
`;

export const Footer = styled.footer`
  background: ${COLORS.secondary};
  color: ${COLORS.primary};
  padding: 1.5rem;
  text-align: center;
  margin-top: auto;

  p {
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }

  @media (min-width: ${breakpoints.medium}) {
    padding: 2rem;
  }
`;
