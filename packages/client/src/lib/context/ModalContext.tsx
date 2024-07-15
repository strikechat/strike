import React, { createContext, useState, useContext, ReactNode } from 'react';

type ModalContextType = {
  showModal: (content: ReactNode, onConfirm?: () => void, onCancel?: () => void) => void;
  hideModal: () => void;
  modalContent: ReactNode | null;
  onConfirm?: () => void;
  onCancel?: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider = ({ children } : any) => {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();
  const [onCancel, setOnCancel] = useState<(() => void) | undefined>();

  const showModal = (content: ReactNode, onConfirm?: () => void, onCancel?: () => void) => {
    setModalContent(content);
    setOnConfirm(() => onConfirm);
    setOnCancel(() => onCancel);
  };

  const hideModal = () => {
    setModalContent(null);
    setOnConfirm(undefined);
    setOnCancel(undefined);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal, modalContent, onConfirm, onCancel }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
