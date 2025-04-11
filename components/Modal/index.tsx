import { ReactNode } from "react";
import ReactModal from "react-modal";
import { IoClose } from "react-icons/io5";
import {
  ModalContainer,
  ModalHeader,
  ModalFooter,
  CloseButton,
} from "./styles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={title || "Modal"}
      className="modal-content"
      overlayClassName="modal-overlay"
      ariaHideApp={false}
    >
      <ModalContainer>
        <ModalHeader>
          {title && <h2>{title}</h2>}
          <CloseButton onClick={onClose}>
            <IoClose size={24} />
          </CloseButton>
        </ModalHeader>

        <div className="modal-body">{children}</div>

        <ModalFooter>
          <button className="close-btn" onClick={onClose}>
            Close
          </button>
        </ModalFooter>
      </ModalContainer>
    </ReactModal>
  );
};
