"use client";

import Modal from ".";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";

interface ModalContextProps {
  show: (content: ReactNode, onHideCallback?: () => void, ignoreFocusTrap? : boolean) => void;
  hide: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [onHideCallback, setOnHideCallback] = useState<(() => void) | undefined>(undefined);
  const [ignoreFocusTrap, setIgnoreFocusTrap] = useState(false);

  const show = (content: ReactNode,  onHideCallback?: () => void, ignoreFocusTrap?:boolean) => {
    setModalContent(content);
    setShowModal(true);
    setOnHideCallback(() => onHideCallback);
    setIgnoreFocusTrap(ignoreFocusTrap || false);
  };

  useEffect(() => {
    if (!showModal && onHideCallback) {
      onHideCallback();
      setOnHideCallback(undefined);
      
    }
  }, [showModal])

  const hide = () => {
    setShowModal(false);
    setTimeout(() => {
      setModalContent(null);
    }, 300); // Adjust this timeout as per your transition duration
  };

  return (
    <ModalContext.Provider value={{ show, hide }}>
      {children}
      {showModal && (
        <Modal showModal={showModal} setShowModal={setShowModal} ignoreFocusTrap={ignoreFocusTrap}>
          {modalContent}
        </Modal>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
