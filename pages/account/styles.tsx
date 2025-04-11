import styled from "styled-components";
import COLORS from "../../constants/color";

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
  padding: 1rem;
  background: ${COLORS.primary};
  border-bottom: 1px solid ${COLORS.accent};
  position: sticky;
  top: 0;
  z-index: 100;

  @media (min-width: ${breakpoints.medium}) {
    width: 280px;
    height: 100vh;
    border-right: 1px solid ${COLORS.accent};
    border-bottom: none;
    padding: 2rem;
  }
`;

export const UserCard = styled.div`
  text-align: center;
  padding: 1rem 0;
  border-bottom: 1px solid ${COLORS.accent};

  @media (min-width: ${breakpoints.medium}) {
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
  margin: 1rem 0;

  @media (min-width: ${breakpoints.medium}) {
    margin: 2rem 0;
  }
`;

export const NavItem = styled.div<{ active?: boolean }>`
  color: ${(props) => (props.active ? COLORS.secondary : COLORS.slate)};
  padding: 1rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  transition: all 0.3s ease;
  background: ${(props) => (props.active ? COLORS.highlight : "transparent")};

  &:hover {
    background: ${COLORS.highlight};
    color: ${COLORS.secondary};

    .arrow {
      opacity: 1;
    }
  }

  svg {
    font-size: 1.2rem;
    color: ${(props) => (props.active ? COLORS.gold : COLORS.bronze)};
  }

  .arrow {
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  @media (min-width: ${breakpoints.medium}) {
    justify-content: flex-start;
    .arrow {
      display: none;
    }
  }
`;

export const LogoutButton = styled.button`
  background: ${COLORS.gold};
  color: ${COLORS.secondary};
  border: 1px solid ${COLORS.accent};
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: auto;
  width: 100%;

  &:hover {
    background: ${COLORS.bronze};
    color: ${COLORS.primary};
  }
`;

export const MainContent = styled.main`
  flex: 1;
  padding: 1rem;

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
    background: ${COLORS.highlight};
    color: ${COLORS.secondary};
  }
`;

export const OrderRow = styled.tr`
  transition: background 0.3s ease;

  &:hover {
    background: ${COLORS.highlight};
  }
`;

export const OrderId = styled.span`
  color: ${COLORS.gold};
  font-weight: 600;
`;

export const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: ${(props) =>
    props.status === "Delivered"
      ? COLORS.gold
      : props.status === "Processing"
      ? COLORS.slate
      : COLORS.bronze};
  color: ${COLORS.primary};
  font-size: 0.9rem;
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
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px ${COLORS.accent};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const MobileOrderDetail = styled.p`
  color: ${COLORS.slate};
  margin: 0.5rem 0;
  font-size: 0.9rem;
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
