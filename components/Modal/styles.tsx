import styled from "styled-components";
import COLORS from "../../constants/color";

export const ModalContainer = styled.div`
  font-family: "Outfit";
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .modal-body {
    flex: 1;
    padding: 20px;
    overflow-y: auto;
  }
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background-color: ${COLORS.primary};
  border-bottom: 1px solid ${COLORS.accent};

  h2 {
    margin: 0;
    color: ${COLORS.secondary};
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

export const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid ${COLORS.accent};
  background-color: ${COLORS.primary};

  .close-btn {
    padding: 8px 16px;
    background-color: ${COLORS.danger};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;

    &:hover {
      opacity: 0.9;
    }
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.danger};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;

  &:hover {
    background-color: rgba(220, 53, 69, 0.1);
  }
`;
