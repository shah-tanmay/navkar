import styled, { keyframes } from "styled-components";
import COLORS from "../../constants/color";

const breakpoints = {
  small: "480px",
  medium: "768px",
  large: "1024px",
};

export const CartContainer = styled.div`
  display: flex;
  gap: 2rem;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
  font-family: "Outfit";

  @media (max-width: ${breakpoints.large}) {
    flex-direction: column;
  }

  > *:only-child {
    margin: auto;
  }
`;

export const MainContent = styled.div`
  flex: 1;
  min-width: 0;
`;

export const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid ${COLORS.accent};

  h1 {
    color: ${COLORS.secondary};
    font-size: 2rem;
    margin: 0;
  }
`;

export const ContinueShopping = styled.a`
  color: ${COLORS.gold};
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    color: ${COLORS.bronze};
  }
`;

export const CartItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CartItem = styled.div`
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px ${COLORS.accent};
  position: relative;

  @media (max-width: ${breakpoints.medium}) {
    grid-template-columns: 1fr;
  }
`;

export const ItemImage = styled.img`
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
`;

export const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;

  h3 {
    color: ${COLORS.secondary};
    margin: 0;
    font-size: 1.2rem;
  }
`;

export const RemoveButton = styled.button`
  background: none;
  border: none;
  color: ${COLORS.slate};
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${COLORS.oxblood};
  }
`;

export const ItemOptions = styled.div`
  display: flex;
  gap: 1rem;
  color: ${COLORS.slate};
  font-size: 0.9rem;
`;

export const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${COLORS.primary};
  border-radius: 8px;
  padding: 0.5rem;
  width: fit-content;

  span {
    min-width: 30px;
    text-align: center;
  }
`;

export const QuantityButton = styled.button`
  background: ${COLORS.highlight};
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.gold};
    color: white;
  }
`;

export const DeliveryEstimate = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${COLORS.gold};
  font-size: 0.9rem;
`;

export const PriceSection = styled.div`
  text-align: right;
  min-width: 120px;

  @media (max-width: ${breakpoints.medium}) {
    text-align: left;
  }
`;

export const CurrentPrice = styled.div`
  color: ${COLORS.secondary};
  font-weight: 600;
  font-size: 1.2rem;
`;

export const OriginalPrice = styled.div`
  color: ${COLORS.slate};
  text-decoration: line-through;
  font-size: 0.9rem;
`;

export const OrderSummary = styled.div`
  width: 400px;
  position: sticky;
  top: 2rem;
  height: fit-content;

  @media (max-width: ${breakpoints.large}) {
    width: 100%;
    position: static;
  }
`;

export const SummaryCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px ${COLORS.accent};
`;

export const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 1rem 0;
  color: ${COLORS.secondary};
`;

export const PromoSection = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 2rem 0;
  padding: 1rem;
  background: ${COLORS.primary};
  border-radius: 8px;

  input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
  }
`;

export const ApplyButton = styled.button`
  background: ${COLORS.gold};
  color: ${COLORS.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${COLORS.bronze};
  }
`;

export const TotalRow = styled(SummaryRow)`
  padding-top: 1rem;
  border-top: 2px solid ${COLORS.accent};
  font-weight: 600;
`;

export const TotalPrice = styled.span`
  color: ${COLORS.gold};
  font-size: 1.3rem;
`;

export const CheckoutButton = styled.button`
  background: ${COLORS.secondary};
  color: white;
  width: 100%;
  padding: 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;

  &:hover {
    transform: translateY(-2px);
  }
`;

export const TrustBadges = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 1rem 0;

  img {
    height: 40px;
    opacity: 0.8;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

export const GuaranteeText = styled.p`
  text-align: center;
  color: ${COLORS.slate};
  font-size: 0.9rem;
  margin: 1rem 0;
`;

export const RecommendedSection = styled.section`
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid ${COLORS.accent};

  h2 {
    color: ${COLORS.secondary};
    margin-bottom: 1.5rem;
  }
`;

export const RecommendedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

export const RecommendedProduct = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px ${COLORS.accent};
  }

  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 1rem;
  }

  h4 {
    color: ${COLORS.secondary};
    margin: 0.5rem 0;
  }

  p {
    color: ${COLORS.gold};
    font-weight: 600;
    margin: 0.5rem 0;
  }
`;

export const AddButton = styled.button`
  background: ${COLORS.primary};
  color: ${COLORS.secondary};
  border: 1px solid ${COLORS.accent};
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;

  &:hover {
    background: ${COLORS.gold};
    color: white;
  }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: ${COLORS.primary};
  border-radius: 20px;
  margin: 2rem 0;
  min-height: 60vh;
`;

export const EmptyIcon = styled.div`
  font-size: 6rem;
  color: ${COLORS.gold};
  margin-bottom: 2rem;
  animation: ${float} 3s ease-in-out infinite;

  @media (max-width: ${breakpoints.medium}) {
    font-size: 4rem;
  }
`;

export const EmptyText = styled.h2`
  color: ${COLORS.secondary};
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
  max-width: 600px;
  line-height: 1.3;

  @media (max-width: ${breakpoints.medium}) {
    font-size: 1.8rem;
  }
`;

export const EmptySubtext = styled.p`
  color: ${COLORS.slate};
  font-size: 1.1rem;
  margin-bottom: 2rem;
  max-width: 500px;
`;

export const ShopButton = styled.a`
  background: ${COLORS.oxblood};
  color: white;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.1rem;
  box-shadow: 0 10px 20px ${COLORS.accent};

  &:hover {
    background: ${COLORS.navy};
    transform: translateY(-2px);
  }

  svg {
    font-size: 1.4rem;
  }
`;
