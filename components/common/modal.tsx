import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import clsx from "clsx";

interface ModalProps {
  isOpen: boolean;
  children: ReactNode;
  maxWidth?: string; 
  showCloseButton?: boolean;
  onClose?: () => void;
}

export default function Modal({
  isOpen,
  children,
  maxWidth = 'max-w-4xl',
  showCloseButton = true,
  onClose,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" />
      <div
        className={clsx(
          "relative z-50 max-h-[calc(100vh-48px)] w-full overflow-y-scroll rounded-lg bg-white p-6 shadow-border-xl md:max-h-[85vh] md:p-10",
          maxWidth,
        )}
      >
        {showCloseButton && (
          <Button
            onClick={onClose}
            size="icon"
            variant="ghost"
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        <div className="flex items-center justify-center">{children}</div>
      </div>
    </div>
  );
}
