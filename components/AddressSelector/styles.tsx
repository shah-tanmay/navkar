import styled from "styled-components";
import COLORS from "../../constants/color";

export const AddressSelectorContainer = styled.div`
  margin-bottom: 2rem;
`;

// export const AddressGrid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
//   gap: 1.5rem;
//   margin-bottom: 2rem;
// `;

export const AddressGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

export const NewAddressCard = styled.div<{ active: boolean }>`
  background: ${(props) => (props.active ? COLORS.primary : COLORS.highlight)};
  border: 2px dashed ${(props) => (props.active ? COLORS.gold : COLORS.slate)};
  border-radius: 12px;
  /* border: 1px dashed ${COLORS.accent}; */
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  position: relative;
  background-color: ${(props) => (props.active ? COLORS.accent : "white")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${COLORS.secondary};
  font-weight: 500;
  /* height: 100%; */

  /* Fill available horizontal space when it's the last card in a row with odd count */
  &:last-child:nth-child(odd) {
    grid-column: 1 / -1;
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
  }

  /* Keep normal width when it's the last card in a row with even count */
  &:last-child:nth-child(even) {
    grid-column: auto;
  }

  &:hover {
    background-color: ${COLORS.accent};
    border-color: ${COLORS.secondary};
  }
`;

export const AddressCard = styled.div<{ selected: boolean }>`
  position: relative;
  background: white;
  border: 2px solid ${(props) => (props.selected ? COLORS.gold : COLORS.accent)};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${COLORS.accent};
  }
`;

// export const NewAddressCard = styled.div<{ active: boolean }>`
//   background: ${(props) => (props.active ? COLORS.primary : COLORS.highlight)};
//   border: 2px dashed ${(props) => (props.active ? COLORS.gold : COLORS.slate)};
//   border-radius: 12px;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   font-weight: 500;
//   color: ${COLORS.slate};
//   cursor: pointer;
//   transition: all 0.3s ease;

//   &:hover {
//     border-color: ${COLORS.gold};
//     color: ${COLORS.secondary};
//   }
// `;

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
  top: 10px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${(props) => (props.selected ? COLORS.gold : "transparent")};
  border: 2px solid ${(props) => (props.selected ? COLORS.gold : COLORS.slate)};
  color: ${COLORS.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
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
