"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface ResultsPerPageProps {
  perPage: number;
  isDisabled: boolean;
  onChange: (value: number) => void;
}

export default function ResultsPerPage({ perPage, isDisabled, onChange }: ResultsPerPageProps) {
  return (
    <>
      <div className="text-sm">Results per Page</div>
      <div>
        <Select
          disabled={isDisabled}
          value={`${perPage}`}
          onValueChange={(e: string) => onChange(parseInt(e))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Results per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
}
