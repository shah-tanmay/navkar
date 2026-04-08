import styled from "styled-components";
import COLORS from "../../constants/color";

export const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

export const StickyHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px);
  padding: 1rem 0;
  margin-bottom: 1rem;
  border-bottom: 1px solid ${COLORS.accent};
  display: flex;
  justify-content: space-between;
  align-items: center;

  .actions {
    display: flex;
    gap: 1rem;
  }
`;

export const Card = styled.div`
  background: #fff;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  border: 1px solid ${COLORS.accent};
`;

export const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${COLORS.secondary};
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  
  &::before {
    content: "";
    width: 4px;
    height: 1.5rem;
    background: ${COLORS.gold};
    border-radius: 2px;
  }
`;

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
`;

export const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  grid-column: ${props => props.$fullWidth ? "1 / -1" : "auto"};
  display: flex;
  flex-direction: column;
  gap: 0.6rem;

  label {
    font-weight: 600;
    font-size: 0.9rem;
    color: ${COLORS.secondary};
    opacity: 0.8;
  }

  input, textarea, select {
    padding: 1rem;
    border: 2px solid ${COLORS.accent};
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.2s;
    background: #fcfcfc;

    &:focus {
      outline: none;
      border-color: ${COLORS.gold};
      background: #fff;
      box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
    }
  }

  textarea {
    min-height: 120px;
    resize: vertical;
  }
`;

export const VariantSection = styled.div`
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const VariantSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  position: sticky;
  top: 100px;
`;

export const VariantItem = styled.button<{ $active?: boolean }>`
  background: ${props => props.$active ? COLORS.secondary : "#fff"};
  color: ${props => props.$active ? "#fff" : COLORS.secondary};
  border: 1px solid ${props => props.$active ? COLORS.secondary : COLORS.accent};
  padding: 1rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;

  &:hover {
    background: ${props => props.$active ? COLORS.secondary : COLORS.accent};
  }

  .swatch {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2);
  }

  .info {
    flex: 1;
    font-weight: 600;
    font-size: 0.9rem;
    
    span {
      display: block;
      font-size: 0.75rem;
      opacity: 0.6;
      font-weight: 400;
    }
  }
`;

export const ImagePreview = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 12px;
  background: ${COLORS.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-top: 0.5rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .placeholder {
    color: #999;
    font-size: 0.9rem;
  }
`;

export const Button = styled.button<{ $variant?: "primary" | "secondary" | "danger" }>`
  padding: 0.8rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;

  background: ${props => {
    if (props.$variant === "primary") return COLORS.gold;
    if (props.$variant === "danger") return COLORS.danger;
    return COLORS.accent;
  }};
  
  color: ${props => props.$variant === "primary" ? "#fff" : props.$variant === "danger" ? "#fff" : COLORS.secondary};

  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;
