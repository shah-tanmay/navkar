import styled from "styled-components";
import COLORS from "../../constants/color";

export const AddressSelectorContainer = styled.div`
  margin-bottom: 2rem;
  background: white;
  border-radius: 12px;
`;

export const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  background: white;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

export const NewAddressCard = styled.div<{ active: boolean }>`
  background: white;
  border: 1.5px dashed ${COLORS.secondary};
  border-radius: 12px;
  height: 44px;
  padding: 0 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.secondary};
  font-weight: 500;
  font-size: 0.95rem;

  @media (max-width: 768px) {
    height: 42px;
    font-size: 0.9rem;
  }

  /* Fill available horizontal space when it's the last card in a row with odd count */
  &:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    background: white;
    color: ${COLORS.secondary};
    border: 1.5px dashed ${COLORS.secondary};
    font-weight: 500;

    &:hover {
      border-color: ${COLORS.secondary};
    }
  }

  /* Keep normal width when it's the last card in a row with even count */
  &:last-child:nth-child(even) {
    grid-column: auto;
  }

  &:hover {
    border-color: ${COLORS.secondary};
  }
`;

export const AddressCard = styled.div<{ selected: boolean }>`
  position: relative;
  background: white;
  border: 2px solid ${(props) => (props.selected ? COLORS.gold : "rgba(17, 17, 17, 0.1)")};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 1.25rem;
    min-height: auto;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03); /* Extremely soft shadow */
  }
`;



export const AddressContent = styled.div`
  margin-bottom: 1rem;
`;

export const AddressText = styled.p`
  color: ${COLORS.secondary};
  margin: 0.2rem 0;
  font-size: 0.95rem;
`;

export const AddressSubtext = styled.p`
  color: ${COLORS.slate};
  margin: 0.2rem 0;
  font-size: 0.85rem;
`;

export const SelectIndicator = styled.div<{ selected: boolean }>`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => (props.selected ? COLORS.gold : "transparent")};
  border: 2px solid ${(props) => (props.selected ? COLORS.gold : COLORS.slate)};
  color: ${COLORS.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  z-index: 2;

  @media (max-width: 768px) {
    width: 20px;
    height: 20px;
    top: 10px;
    right: 10px;
  }
`;

export const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const EditButton = styled.button`
  background: ${COLORS.gold};
  color: ${COLORS.primary};
  border: none;
  height: 40px;
  flex: 1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;

  &:hover {
    background: ${COLORS.bronze};
  }
`;

export const DeleteButton = styled.button`
  background: white;
  color: #ef4444;
  border: 1px solid #ef4444;
  height: 40px;
  padding: 0 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #fef2f2;
  }
`;
