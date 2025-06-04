"use client";

import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function FileUploadClient() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setFile(selectedFile);

    // Set the file on the input element so it's included in form submission
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      fileInputRef.current.files = dataTransfer.files;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="logo">
        Logo <span className="ml-1 text-xs font-normal text-muted-foreground">Optional</span>
      </Label>
      <button
        type="button"
        className={`flex h-32 w-full cursor-pointer items-center justify-center rounded border border-dashed transition-colors ${
          isDragOver
            ? "border-stone-400 bg-stone-200"
            : "border-stone-300 bg-stone-200/50 hover:border-stone-400"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Logo preview"
            className="max-h-20 max-w-20 rounded object-contain"
          />
        ) : (
          <div className="text-center">
            <ImageIcon className="mx-auto size-5 text-muted-foreground" />
            <p className="mb-1 mt-2 text-xs font-medium text-muted-foreground">
              Click to upload or drag & drop
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </div>
        )}
      </button>
      <input
        ref={fileInputRef}
        name="logo"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </div>
  );
}
