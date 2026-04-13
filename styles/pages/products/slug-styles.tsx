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
    flex-direction: row;
    align-items: center;
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

export const WarrantyBadge = styled.div<{ $isHighlight?: boolean }>`
  position: absolute;
  top: 20px;
  right: 20px;
  background: ${props => props.$isHighlight ? COLORS.gold : COLORS.secondary};
  color: ${props => props.$isHighlight ? COLORS.secondary : COLORS.gold};
  padding: ${props => props.$isHighlight ? '0.6rem 1.25rem' : '0.8rem 1.5rem'};
  border-radius: 8px;
  font-size: ${props => props.$isHighlight ? '0.8rem' : '0.9rem'};
  font-weight: 700;
  letter-spacing: 0.5px;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  border: ${props => props.$isHighlight ? `1.5px solid ${COLORS.secondary}` : 'none'};

  @media (max-width: 768px) {
    top: 25px;
    right: 25px;
    padding: 0.5rem 1rem;
    font-size: 0.7rem;
  }
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

export const DyeLotDisclaimer = styled.span`
  display: block;
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.75rem;
  font-style: italic;
  font-weight: 400;
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
  margin-top: 2rem;
  padding: 1.5rem;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  animation: ${fadeIn} 0.4s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);

  h3 {
    margin: 0 0 1.25rem 0;
    font-size: 1.1rem;
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
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    input {
      padding: 0.85rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      font-family: "Outfit", sans-serif;
      transition: all 0.3s ease;
      background: #fdfdfd;

      &:focus {
        outline: none;
        border-color: ${COLORS.gold};
        box-shadow: 0 0 0 3px rgba(186, 129, 96, 0.1);
      }
      
      &::placeholder {
        color: #9ca3af;
      }
    }
  }
`;

export const RecommendationCard = styled.div`
  margin: 2rem 0;
  padding: 1.75rem;
  background: linear-gradient(135deg, #fffaf5 0%, #ffffff 100%);
  border: 1px solid #fae7d9;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(186, 129, 96, 0.05);
  animation: ${fadeIn} 0.5s ease;

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin: 1.5rem 0;
  }
`;

export const RecommendationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.25rem;
  
  h3 {
    font-size: 1.15rem;
    color: ${COLORS.secondary};
    margin: 0;
    font-weight: 700;
  }
  
  svg {
    color: ${COLORS.gold};
    font-size: 1.3rem;
  }
`;

export const RecommendationBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  
  .input-section {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    
    label {
      font-size: 0.9rem;
      color: #4b5563;
      font-weight: 500;
    }
    
    .input-row {
      display: flex;
      gap: 0.5rem;
      width: 100%;
      box-sizing: border-box;
      
      input {
        flex: 1;
        min-width: 0; /* Prevents input from forcing parent width */
        padding: 0.85rem 1rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s;
        &:focus { border-color: ${COLORS.gold}; }
      }
      
      select {
        flex: 0 0 110px; /* Fixed width for unit selector */
        padding: 0.85rem 0.5rem;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background: #fff;
        font-size: 0.9rem;
        outline: none;
        cursor: pointer;
      }
    }
  }
  
  .result-section {
    background: #ffffff;
    padding: 1.25rem;
    border-radius: 12px;
    border: 1px solid #f3f4f6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    
    @media (max-width: 480px) {
      flex-direction: column;
      text-align: center;
    }
    
    .text {
      flex: 1;
      span.count {
        font-size: 1.4rem;
        font-weight: 800;
        color: ${COLORS.gold};
        margin: 0 0.4rem;
      }
      p {
        margin: 0.25rem 0 0 0;
        font-size: 0.85rem;
        color: #6b7280;
      }
    }
    
    button {
      background: ${COLORS.secondary};
      color: white;
      border: none;
      padding: 0.75rem 1.25rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      
      &:hover {
        background: ${COLORS.gold};
        transform: translateY(-2px);
      }
    }
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
  margin: 1.5rem 0 2rem 0;
  background: #fdfdfd; 
  padding: 1.25rem; 
  border-radius: 12px; 
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  
  h2 {
    font-size: 0.95rem;
    color: #111827;
    margin-bottom: 1.25rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    line-height: 1.2;
    
    svg {
      color: #ba8160;
      font-size: 1rem;
      flex-shrink: 0;
    }
  }

  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;

    @media (max-width: 768px) {
      gap: 1rem;
      justify-content: flex-start;
    }
  }
`;

export const ProductRecommendationCard = styled.div`
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 75px;

  @media (max-width: 768px) {
    width: 65px;
  }

  &:hover {
    transform: translateY(-2px);
    
    .img-wrapper img {
      transform: scale(1.05);
    }
  }

  .img-wrapper {
    width: 75px;
    height: 75px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 0.6rem;
    position: relative;
    background: #f9f9f9;
    border: 1px solid #f3f4f6;
    box-shadow: 0 2px 4px rgba(0,0,0,0.03);
    
    @media (max-width: 768px) {
      width: 65px;
      height: 65px;
    }
    
    img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
  }

  h3 { 
    font-size: 0.75rem; 
    font-weight: 600; 
    margin: 0; 
    color: #4b5563; 
    line-height: 1.3; 
    max-width: 100%;
    word-break: break-word;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    @media (max-width: 768px) {
      font-size: 0.7rem;
    }
  }
`;

export const HangingOptions = styled.div`
  margin-top: 2rem;
  
  h3 {
    font-size: 1.1rem;
    color: #111827;
    margin-bottom: 1rem;
    font-weight: 600;
  }
`;

export const HangingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

export const HangingCard = styled.div<{ $active: boolean }>`
  border: 1.5px solid ${props => props.$active ? "#ba8160" : "#e5e7eb"};
  background: ${props => props.$active ? "#fffaf5" : "#fff"};
  border-radius: 10px;
  padding: 0.6rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.$active ? "0 4px 8px rgba(186, 129, 96, 0.1)" : "0 1px 2px rgba(0,0,0,0.02)"};

  &:hover {
    border-color: #ba8160;
    transform: translateY(-1px);
    
    .img-wrapper img {
      transform: scale(1.05);
    }
  }

  .img-wrapper {
    width: 100%;
    aspect-ratio: 3/2; /* Optimal balance for detailed view */
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    background: #fdfaf7; /* Boutique off-white background */
    border: 1px solid #f2ece4; /* Subtle neutral border */
    padding: 0.25rem; /* Breathing margin for elegance */
    
    img { transition: transform 0.5s ease; width: 100%; height: 100%; object-fit: cover; } /* 'cover' to fill frame elegantly */
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    
    span.name {
      font-weight: 700;
      font-size: 0.9rem;
      color: #111827;
      letter-spacing: -0.01em;
    }
    
    span.desc {
      font-size: 0.7rem;
      color: #6b7280;
      line-height: 1.3;
    }
  }

  ${props => props.$active && `
    &::after {
      content: '✓';
      position: absolute;
      top: 0.4rem;
      right: 0.4rem;
      background: #ba8160;
      color: white;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: bold;
      z-index: 2;
    }
  `}
`;
