import React, { createContext, useContext, useState, ReactNode, ReactElement } from 'react';

type ModalContextType = {
    modalContent: ReactElement | null;
    showModal: (content: ReactElement, onConfirm?: () => void, onCancel?: () => void) => void;
    hideModal: () => void;
    onConfirm: (() => void) | null;
    onCancel: (() => void) | null;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [modalContent, setModalContent] = useState<ReactElement | null>(null);
    const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);
    const [onCancel, setOnCancel] = useState<(() => void) | null>(null);

    const showModal = (content: ReactElement, onConfirm?: () => void, onCancel?: () => void) => {
        setModalContent(content);
        setOnConfirm(() => onConfirm || null);
        setOnCancel(() => onCancel || null);
    };

    const hideModal = () => {
        setModalContent(null);
        setOnConfirm(null);
        setOnCancel(null);
    };

    return (
        <ModalContext.Provider value={{ modalContent, showModal, hideModal, onConfirm, onCancel }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};
