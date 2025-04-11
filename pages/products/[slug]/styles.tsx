import styled, { keyframes } from "styled-components";
import { ButtonWrapper } from "../../../components/Button/styles";
import COLORS from "../../../constants/color";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ProductPageWrapper = styled.div`
  background: #f9f1e7;
  padding: 4rem 2rem;
  min-height: 100vh;
  font-family: "Outfit", sans-serif;
  position: relative;

  /* Reserve space at the bottom for the sticky button */
  &::after {
    content: "";
    display: block;
    height: 80px; /* Adjust to match the sticky button container’s height */
  }
`;

export const HeroSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

export const ImageGallery = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;
`;

export const ProductDetails = styled.div`
  padding: 2rem;
  background: rgba(249, 241, 231, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 30px;
`;

export const ProductTitle = styled.h1`
  font-size: 2.2rem;
  color: #542e00;
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

export const PriceTag = styled.div`
  font-size: 1.8rem;
  color: #542e00;
  font-weight: 500;
  margin-bottom: 1.5rem;
`;

export const FeatureList = styled.ul`
  margin: 2rem 0;
  padding-left: 1.5rem;
  position: relative;
  list-style: none;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 2px;
    background: #b89f72;
  }
`;

export const FeatureListItem = styled.li`
  padding: 1rem 0;
  position: relative;
  font-size: 1.1rem;
  line-height: 1.6;
  padding-left: 2rem;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 1.4rem;
    width: 8px;
    height: 8px;
    background: #b89f72;
    border-radius: 50%;
  }
`;

export const WarrantyBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: #542e00;
  color: #f9f1e7;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(84, 46, 0, 0.15);
`;

export const PurchaseCard = styled.div`
  background: #fcf8f3;
  padding: 1.5rem;
  border-radius: 20px;
  margin-bottom: 2rem;
  position: sticky;
  top: 20px; /* Adjust this value based on your header height */
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  /* Add height calculation */
  height: fit-content;
`;

export const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 2rem;
`;

export const Thumbnail = styled.div`
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #fff;
  padding: 8px;

  &:hover {
    transform: translateY(-5px);
    border-color: #b89f72;
  }

  &.active {
    border-color: #542e00;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }
`;

export const SelectorRow = styled.div`
  display: flex;
  gap: 5rem;
  margin-bottom: 2rem;
  background: #fcf8f3;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const ColorOptions = styled.div`
  /* flex: 1; */

  .swatches {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

export const ColorSwatch = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.3s ease;
  background: ${(props) => props.color};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.1);
  }

  &.selected {
    border-color: #542e00;
    transform: scale(1.15);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`;

export const MainImage = styled.div`
  background: #fff;
  border-radius: 30px;
  padding: 1.5rem;
  position: relative;
  max-width: 600px;
  margin: 0 auto;

  img {
    width: 100%;
    height: auto;
    max-height: 500px;
    object-fit: contain;
    transition: transform 0.3s ease;
  }

  &:hover img {
    transform: scale(1.02);
  }
`;

export const StickyButtonContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(249, 241, 231, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const BuyNowButton = styled(ButtonWrapper)`
  &&& {
    background: #b89f72;
    border-color: #b89f72;
    font-weight: 700;
    letter-spacing: 0.5px;

    &:hover {
      background: #9d845a;
      border-color: #9d845a;
      transform: translateY(-2px);
    }
  }
`;

export const DescriptionBlock = styled.div`
  background: rgba(252, 248, 243, 0.8);
  padding: 1.5rem;
  border-radius: 15px;
  margin: 2rem 0;
  border-left: 4px solid #b89f72;
  font-size: 1.1rem;
  line-height: 1.7;
`;

export const SizeOptions = styled.div`
  background: #fcf8f3;
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
`;

export const SizeButton = styled.button<{ selected?: boolean }>`
  display: block;
  width: 100%;
  padding: 0.8rem;
  margin: 0.5rem 0;
  background: ${(props) => (props.selected ? "#b89f72" : "transparent")};
  border: 2px solid ${(props) => (props.selected ? "#b89f72" : "#542e00")};
  color: ${(props) => (props.selected ? "#fff" : "#542e00")};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const CompactQuantitySelector = styled.div`
  flex: 1;

  .controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const SmallQuantityButton = styled.button`
  width: 28px;
  height: 28px;
  border: 1px solid #542e00;
  background: transparent;
  color: #542e00;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #542e00;
    color: #fff;
  }
`;

// These styled components are no longer used but kept for reference
export const SizeQuantitySection = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const QuantitySelector = styled.div`
  background: #fcf8f3;
  padding: 1.5rem;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #542e00;
  background: transparent;
  color: #542e00;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #542e00;
    color: #fff;
  }
`;

export const SectionTitle = styled.h2`
  font-size: 1.8rem;
  color: #542e00;
  position: relative;
  padding-left: 2rem;
  margin: 2rem 0 1.5rem;
  font-weight: 600;
  letter-spacing: -0.5px;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 28px;
    width: 4px;
    background: #b89f72;
    border-radius: 2px;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(
      90deg,
      #b89f72 0%,
      rgba(184, 159, 114, 0.2) 100%
    );
  }
`;

export const QuantitySelectorContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const QuantitySelectorText = styled.h3`
  color: ${COLORS.secondary};
`;
