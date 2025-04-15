"use client";
import { Trash2 } from "lucide-react";

interface SearchHistoryProps {
  isVisible: boolean;
  history: string[];
  onSelect: (url: string) => void;
  onDelete: (url: string) => void;
}

export default function SearchHistory({
  isVisible,
  history,
  onSelect,
  onDelete
}: SearchHistoryProps) {
  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative w-full">
      <div className="absolute left-0 top-0 z-50 flex w-full flex-col rounded-b-md border border-t-0 bg-white py-2 text-sm shadow-lg">
        {history.map((url: string, index: number) => (
          <div
            key={index}
            className="group flex cursor-pointer items-center justify-between px-4 hover:bg-gray-200"
            onClick={() => onSelect(url)}
          >
            <div className="w-full py-2">{url}</div>
            <Trash2
              className="ml-2 hidden size-4 text-red-600 group-hover:block"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(url);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
