import styled from "styled-components";
import COLORS from "../../constants/color";

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: ${COLORS.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${COLORS.oxblood};
  }
`;

// Add global modal styles
export const GlobalModalStyles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    position: relative;
    background: white;
    border-radius: 8px;
    max-width: 600px;
    width: 90%;
    max-height: 90vh;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    outline: none;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
`;

export const UpdateButton = styled.button`
  background: ${COLORS.gold};
  color: ${COLORS.primary};
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 15px;

  &:hover {
    background: ${COLORS.bronze};
  }
`;

export const ButtonDiv = styled.div`
  display: flex;
  flex: 1;
  margin-top: 1rem;
`;
