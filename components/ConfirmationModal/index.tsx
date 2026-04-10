import React from "react";
import ReactModal from "react-modal";
import styled from "styled-components";
import COLORS from "../../constants/color";
import { IoClose } from "react-icons/io5";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  padding: 2rem;
  position: relative;
  font-family: "Outfit", sans-serif;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: ${COLORS.slate};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  &:hover {
    background-color: ${COLORS.highlight};
  }
`;

const Title = styled.h3`
  margin: 0 0 1rem;
  color: ${COLORS.secondary};
  font-size: 1.25rem;
  font-weight: 600;
`;

const Message = styled.p`
  margin: 0 0 2rem;
  color: ${COLORS.slate};
  line-height: 1.5;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

const Button = styled.button<{ variant?: "primary" | "danger" | "secondary" }>`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  font-size: 0.9rem;

  ${(props) => {
    switch (props.variant) {
      case "danger":
        return `
          background-color: #ef4444;
          color: white;
          &:hover { background-color: #dc2626; }
        `;
      case "primary":
        return `
          background-color: ${COLORS.gold};
          color: ${COLORS.primary};
          &:hover { background-color: ${COLORS.bronze}; }
        `;
      default:
        return `
          background-color: ${COLORS.highlight};
          color: ${COLORS.secondary};
          &:hover { background-color: ${COLORS.accent}; }
        `;
    }
  }}
`;

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "primary" | "danger";
}

export const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
}: ConfirmationModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      ariaHideApp={false}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem",
        },
        content: {
          position: "relative",
          margin: "auto",
          border: "none",
          background: "none",
          padding: 0,
          width: "auto",
          height: "auto",
          inset: "auto",
          overflow: "visible",
        },
      }}
    >
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <IoClose size={20} />
        </CloseButton>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          <Button onClick={onClose} variant="secondary">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant={variant}>
            {confirmText}
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </ReactModal>
  );
};
