"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useCallback, useState } from "react";
import SearchHistory from "./search-history";

interface SearchBarProps {
  initialValue: string;
  isLoading: boolean;
  onSearch: (url: string) => void;
  onValidate: (url: string) => string | null;
  history: string[];
  onDeleteHistory: (url: string) => void;
}

export function SearchBar({
  initialValue,
  isLoading,
  onSearch,
  onValidate,
  history,
  onDeleteHistory
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [isUrlInputFocused, setIsUrlInputFocused] = useState<boolean>(false);

  const handleUrlSearch = useCallback(() => {
    const validUrl = onValidate(inputValue);
    if (validUrl) {
      onSearch(validUrl);
      setIsUrlInputFocused(false);
    }
  }, [inputValue, onValidate, onSearch]);

  return (
    <div className="flex gap-3">
      <div className="w-full">
        <Input
          icon={<Search />}
          value={inputValue}
          placeholder="Enter a Repo URL..."
          onFocus={() => setIsUrlInputFocused(true)}
          onClick={() => setIsUrlInputFocused(true)}
          onBlur={() => {
            setTimeout(() => {
              setIsUrlInputFocused(false);
            }, 100);
          }}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInputValue(e.target.value);
          }}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter") {
              handleUrlSearch();
            }
          }}
        />
        <SearchHistory
          isVisible={isUrlInputFocused && history.length > 0}
          history={history}
          onSelect={(url) => {
            setInputValue(url);
            setTimeout(() => handleUrlSearch(), 0);
          }}
          onDelete={onDeleteHistory}
        />
      </div>
      <Button loading={isLoading} onClick={handleUrlSearch}>
        Search
      </Button>
    </div>
  );
}
