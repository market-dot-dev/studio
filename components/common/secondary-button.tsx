import { Button } from "@tremor/react";
import { ChevronRight } from "lucide-react";

interface SecondaryButtonProps {
  label: string;
  onClick?: () => void;
  className?: string;
}

export default function SecondaryButton({ label, onClick, className = "" }: SecondaryButtonProps) {
  return (
    <Button
      size="xs"
      variant="secondary"
      className={`group w-fit border-gray-200 bg-white py-1 pr-1.5 transition-colors ${className}`}
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronRight
        size={16}
        className="mb-0.5 ml-0.5 inline-block transition-transform group-hover:translate-x-px"
      />
    </Button>
  );
} 