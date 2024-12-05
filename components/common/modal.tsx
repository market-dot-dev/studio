import { ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function Modal({
  isOpen,
  children,
  showCloseButton = true,
  onClose,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div className="relative z-50 max-h-[90vh] w-full max-w-4xl overflow-y-scroll rounded-lg bg-white p-6 shadow-xl">
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
