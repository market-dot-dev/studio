"use client";

import { Button } from "@/components/ui/button";
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
        <Modal
          showModal={showModal}
          setShowModal={setShowModal}
          ignoreFocusTrap={ignoreFocusTrap}
        >
          <div
            className={
              "flex flex-col items-stretch overflow-auto rounded-md border bg-white shadow-lg " +
              modalClasses
            }
          >
            <div className="flex h-12 items-center justify-between gap-4 border border-x-0 bg-stone-100 p-4">
              {modalHeader}
              <Button size="icon" variant="ghost" onClick={hide}>
                <X />
              </Button>
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
