import styled, { keyframes } from "styled-components";
import { ButtonWrapper } from "../../../components/Button/styles";
import COLORS from "../../../constants/color";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

export const ProductPageWrapper = styled.div`
  background: ${COLORS.primary}; /* Clean white */
  padding: 4rem 2rem;
  min-height: 100vh;
  font-family: "Outfit", sans-serif;
  position: relative;

  @media (max-width: 768px) {
    padding: 0; /* Zero wrapper padding so sticky elements can form a solid edge-to-edge block */
  }

  /* 
  &::after {
    content: "";
    display: block;
    height: 140px; 
  }
  */
`;

export const HeroSection = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 3rem;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
  
  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 0.5rem; /* Tighter vertical stacking */
  }
`;

export const ImageGallery = styled.div`
  position: sticky;
  top: 100px;
  height: fit-content;
  z-index: 20;

  @media (max-width: 1200px) {
    position: relative;
    top: auto;
    z-index: 1;
  }

  @media (max-width: 768px) {
    display: contents; /* Completely detaches wrapper constraints, allowing MainImage to stick across the whole HeroSection */
  }
`;

export const ProductDetails = styled.div`
  padding: 2rem;
  background: ${COLORS.primary}; /* Same as wrapper */
  border-radius: 20px;

  @media (max-width: 768px) {
    padding: 0 1rem 1rem 1rem; /* Minimal breathable inner padding */
    background: transparent;
    border-radius: 0;
  }
`;

export const SocialProof = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${COLORS.gold};
  font-size: 1.1rem;
  margin-bottom: 0.5rem;

  span {
    color: ${COLORS.secondary};
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

export const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.6rem;
    margin-bottom: 1.5rem;
  }
`;

export const ScarcityLabel = styled.div<{ $tag?: string; $isBlackout?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1rem;
  border-radius: 4px; /* Minimal rounding for sleek look */
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  cursor: default;
  border-left: 3px solid ${COLORS.gold};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  background: ${props => props.$isBlackout ? COLORS.secondary : COLORS.accent};
  color: ${props => props.$isBlackout ? COLORS.primary : COLORS.secondary};

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.7rem;
    width: fit-content;
  }
`;

export const ProductTitle = styled.h1`
  font-size: 2.2rem;
  color: ${COLORS.secondary};
  margin-bottom: 0.5rem;
  font-weight: 700;
  letter-spacing: -1px;

  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

export const PriceTag = styled.div`
  font-size: 2rem;
  color: ${COLORS.secondary};
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }

  span {
    font-size: 1rem;
    color: #999;
    text-decoration: line-through;
    font-weight: 400;
  }
`;

export const SoldAsLine = styled.div`
  font-size: 0.95rem;
  color: #666;
  margin-top: -1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  strong { color: ${COLORS.secondary}; }
  
  .note {
    font-size: 0.85rem;
    color: #999;
    font-style: italic;
  }
`;

// Trust Badges
export const TrustBadgesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0;
  padding: 1.5rem 0;
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

export const TrustBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: ${COLORS.secondary};
  font-size: 0.95rem;
  font-weight: 500;

  svg {
    color: ${COLORS.gold};
    font-size: 1.2rem;
  }
`;

// Accordions
export const AccordionContainer = styled.div`
  border-bottom: 1px solid #ebebeb;
`;

export const AccordionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  cursor: pointer;
  color: ${COLORS.secondary};
  font-size: 1.1rem;
  font-weight: 600;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1rem 0;
    font-size: 1rem;
  }

  &:hover {
    color: ${COLORS.gold};
  }

  svg {
    transition: transform 0.3s ease;
  }
`;

export const AccordionContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${(props) => (props.$isOpen ? "1000px" : "0")};
  overflow: hidden;
  transition: max-height 0.4s ease-in-out;
  color: #555;
  line-height: 1.7;
  
  .content-inner {
    padding-bottom: 1.5rem;
  }
`;

export const WarrantyBadge = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${COLORS.secondary};
  color: ${COLORS.gold};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  z-index: 3;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

export const PurchaseCard = styled.div<{ $hideOnMobile?: boolean; $isSecondary?: boolean }>`
  background: ${COLORS.primary};
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  margin-top: 1rem;
  position: sticky;
  top: 100px;
  z-index: 100;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  height: fit-content;
  isolation: isolate; 
  
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 1200px) {
    position: relative;
    top: auto;
    z-index: 1;
  }

  @media (max-width: 768px) {
    display: ${props => (props.$hideOnMobile ? "none" : "flex")};
    position: relative;
    top: auto;
    z-index: 10;
    margin: ${props => (props.$isSecondary ? "2.5rem 0" : "1.5rem 0")}; 
    padding: 1.5rem; 
    border-radius: 12px; 
    background: #fff; 
    box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    border: 1px solid #efefef;
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;

    & > div {
      flex: none;
      margin: 0 !important;
      width: 100%;

      button {
        margin: 0 !important;
        height: 52px;
        font-size: 1rem;
        width: 100% !important;
      }
    }
  }

  /* Hide secondary (mobile-flow) CTA on desktop */
  @media (min-width: 769px) {
    display: ${props => (props.$isSecondary ? "none" : "flex")};
  }
`;

export const MobileStickyActions = styled.div<{ $visible: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: ${COLORS.primary};
    padding: 1.5rem; 
    z-index: 3000;
    box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.1);
    border-top: 1px solid #efefef;
    transform: translateY(${props => (props.$visible ? "0" : "100%")});
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    & > div {
      width: 100%;

      button {
        height: 52px; 
        font-size: 1rem;
        font-weight: 600;
      }
    }
  }
`;

export const ShippingPromoBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem 0;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  color: ${COLORS.secondary};
  width: fit-content;
  
  svg { 
    color: ${COLORS.gold}; 
    font-size: 1.2rem;
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.4rem 0;
  }
`;

export const DeliveryTimeline = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
  
  svg { color: #27ae60; }
`;

export const PincodeWrapper = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #ebebeb;

  h4 {
    font-size: 0.9rem;
    color: ${COLORS.secondary};
    margin-bottom: 0.75rem;
  }

  .input-group {
    display: flex;
    gap: 0.5rem;

    input {
      flex: 1;
      padding: 0.6rem 1rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
      &:focus { outline: none; border-color: ${COLORS.gold}; }
    }

    button {
      padding: 0.6rem 1.2rem;
      background: ${COLORS.secondary};
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
    }
  }
`;

export const ThumbnailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    gap: 0.5rem;
    padding: 1rem 1rem 0 1rem; /* Breathes perfectly in line with text */
    margin-top: 0;
  }
`;

export const Thumbnail = styled.div`
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: #fff;
  padding: 0px;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    border-color: ${COLORS.gold};
  }

  &.active {
    border-color: ${COLORS.secondary};
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const SelectorRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

export const ColorOptions = styled.div`
  h3 {
    color: ${COLORS.secondary};
    margin-bottom: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
  }
  .swatches {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

export const ColorSwatch = styled.div<{ color: string }>`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #eaeaea;
  transition: all 0.3s ease;
  background: ${(props) => props.color};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  z-index: 1;

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  &:hover {
    transform: scale(1.1);
  }

  &.selected {
    border-color: ${COLORS.secondary};
    transform: scale(1.15);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
    z-index: 2; /* Stays slightly elevated among swatches, but still under sticky nav */
  }
`;

export const MainImage = styled.div`
  background: #fdfdfd;
  border-radius: 12px;
  padding: 0;
  position: relative;
  width: 100%;
  aspect-ratio: 4/5;
  max-width: 100%;
  max-height: 520px;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  z-index: 100;
  box-sizing: border-box;

  @media (max-width: 768px) {
    height: 320px;
    max-height: none;
    position: sticky;
    top: 0px; 
    border-radius: 0; 
    margin: 0; 
    background: ${COLORS.primary}; /* Solid outer background masks scrolling content */
    padding: 15px; /* Added breathable padding */
    box-shadow: none;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);
    border-radius: 12px; /* Rounds the inner edges of the image itself! */
  }

  &:hover img {
    transform: scale(1.05);
  }
`;

export const StickyButtonContainer = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem;
  z-index: 1000;
  box-shadow: 0 -5px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

export const SizeOptions = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    color: ${COLORS.secondary};
    margin-bottom: 0.75rem;
    font-size: 1rem;
    font-weight: 600;
  }
  
  .options-wrapper {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

export const SizeButton = styled.button<{ selected?: boolean }>`
  padding: 0.8rem 1.5rem;
  background: ${(props) => (props.selected ? COLORS.secondary : "transparent")};
  border: 1px solid ${(props) => (props.selected ? COLORS.secondary : "#ccc")};
  color: ${(props) => (props.selected ? "#fff" : COLORS.secondary)};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Outfit", sans-serif;
  font-weight: 500;

  @media (max-width: 768px) {
    padding: 0.6rem 1rem;
    font-size: 0.9rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
`;

export const QuantitySelectorContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const CustomSizeContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #fdfdfd;
  border: 1px dashed #ddd;
  border-radius: 12px;
  animation: ${fadeIn} 0.4s ease;

  h4 {
    margin: 0 0 1rem 0;
    font-size: 0.95rem;
    color: ${COLORS.secondary};
    font-weight: 600;
  }

  .inputs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-size: 0.8rem;
      color: #666;
      font-weight: 500;
    }

    input {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      font-family: "Outfit", sans-serif;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: ${COLORS.gold};
        box-shadow: 0 0 0 3px rgba(186, 129, 96, 0.1);
      }
    }
  }

  .helper-text {
    margin-top: 1rem;
    font-size: 0.8rem;
    color: #888;
    line-height: 1.4;
    font-style: italic;
  }
`;

export const QuantitySelectorText = styled.h3`
  color: ${COLORS.secondary};
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
`;

export const FeatureList = styled.ul`
  margin: 0;
  padding-left: 1rem;
  list-style: none;
`;

export const FeatureListItem = styled.li`
  padding: 0.5rem 0;
  position: relative;
  font-size: 1rem;
  padding-left: 1.5rem;

  &::before {
    content: "✓";
    position: absolute;
    left: 0;
    color: ${COLORS.gold};
    font-weight: bold;
  }
`;

export const FabricDetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    
    label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #999;
      letter-spacing: 0.5px;
    }
    span {
      font-size: 0.95rem;
      font-weight: 600;
      color: ${COLORS.secondary};
    }
  }
`;

export const ReviewSection = styled.div`
  max-width: 1400px;
  margin: 6rem auto 0;
  padding: 4rem 2rem;
  border-top: 1px solid #ebebeb;
  text-align: center;

  h2 {
    font-size: 2rem;
    color: ${COLORS.secondary};
    margin-bottom: 1rem;
  }
  p { color: #777; margin-bottom: 2rem; }
`;

export const RecommendationsContainer = styled.div`
  display: none; /* User requested removal */
`;

export const RecommendationCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;

  .img-wrapper {
    aspect-ratio: 4/5;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 1rem;
    position: relative;
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  }

  h3 { font-size: 1.1rem; color: ${COLORS.secondary}; margin-bottom: 0.25rem; }
  p { color: ${COLORS.gold}; font-weight: 600; }

  &:hover {
    transform: translateY(-10px);
    .img-wrapper img { transform: scale(1.1); }
  }
`;
