"use client";

import { Button } from "@tremor/react";
import Modal from ".";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { X } from "lucide-react";

interface ModalContextProps {
  show: (content: ReactNode, onHideCallback?: () => void, ignoreFocusTrap? : boolean, header?: ReactNode, modalClassNames?: string) => void;
  hide: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalClasses, setModalClasses] = useState<string>('');
  const [modalHeader, setModalHeader] = useState<ReactNode | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [onHideCallback, setOnHideCallback] = useState<(() => void) | undefined>(undefined);
  const [ignoreFocusTrap, setIgnoreFocusTrap] = useState(false);

  const show = (content: ReactNode,  onHideCallback?: () => void, ignoreFocusTrap?:boolean, header?: ReactNode, modalClassnames?: string) => {
    if(header) {
      setModalHeader(header);
    }
    if(modalClassnames) {
      setModalClasses(modalClassnames);
    }
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
          <div className={"bg-white border rounded-md overflow-auto shadow-lg flex flex-col items-stretch " + modalClasses}>
            <div className=" bg-stone-100 h-16 border border-x-0 gap-4 flex p-4 justify-between items-center">
              {modalHeader}
              <Button onClick={hide} icon={X} variant="light" />
            </div>
            {modalContent}
          </div>
          
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
