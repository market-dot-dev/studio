"use client";

import { cn } from "@/lib/utils";
import { FileIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface FileUploaderProps {
  fileUrl?: string | null;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File) => void;
  previewType?: "image" | "file" | "auto";
  placeholder?: React.ReactNode;
  name?: string;
  className?: string;
}

export function FileUploader({
  fileUrl,
  accept = "*/*",
  maxSizeMB = 5,
  onFileSelect,
  previewType = "auto",
  placeholder,
  name = "file",
  className
}: FileUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageFile = (file: File | string) => {
    if (typeof file === "string") {
      // Check if URL looks like an image
      return /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(file);
    }
    return file.type.startsWith("image/");
  };

  const shouldShowImagePreview = () => {
    if (previewType === "image") return true;
    if (previewType === "file") return false;

    if (previewUrl && selectedFileName) {
      return isImageFile(selectedFileName);
    }
    if (fileUrl) {
      return isImageFile(fileUrl);
    }
    return false;
  };

  const handleFile = (selectedFile: File) => {
    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Validate file type if accept is specified
    if (accept !== "*/*") {
      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const fileExtension = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExtension === type.toLowerCase();
        }
        return selectedFile.type.match(new RegExp(type.replace("*", ".*")));
      });

      if (!isAccepted) {
        toast.error(`Please select a valid file type: ${accept}`);
        return;
      }
    }

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(selectedFile);
      fileInputRef.current.files = dataTransfer.files;
    }

    // Create preview URL for images
    if (isImageFile(selectedFile)) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }

    setSelectedFileName(selectedFile.name);

    // Call the optional callback
    if (onFileSelect) {
      onFileSelect(selectedFile);
    }
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

  const renderPreview = () => {
    // Show selected file preview
    if (previewUrl && shouldShowImagePreview()) {
      return (
        <Image
          src={previewUrl}
          alt="File preview"
          className="max-h-16 max-w-16 rounded object-contain"
          height={64}
          width={64}
          priority
        />
      );
    }

    // Show selected file name for non-images
    if (selectedFileName && !shouldShowImagePreview()) {
      return (
        <div className="flex flex-col items-center gap-1">
          <FileIcon className="size-5 text-muted-foreground" />
          <span className="max-w-[100px] truncate text-xs text-muted-foreground">
            {selectedFileName}
          </span>
        </div>
      );
    }

    // Show existing file from URL
    if (fileUrl) {
      if (shouldShowImagePreview()) {
        return (
          <Image
            src={fileUrl}
            alt="Current file"
            className="max-h-16 max-w-16 rounded object-contain"
            height={64}
            width={64}
            priority
          />
        );
      } else {
        const fileName = fileUrl.split("/").pop() || "File";
        return (
          <div className="flex flex-col items-center gap-1">
            <FileIcon className="size-5 text-muted-foreground" />
            <span className="max-w-[100px] truncate text-xs text-muted-foreground">{fileName}</span>
          </div>
        );
      }
    }

    if (placeholder) {
      return <>{placeholder}</>;
    }

    // Helper function to format accepted file types for display
    const formatAcceptedTypes = () => {
      if (accept === "*/*") return null;

      // Don't show text for "any image"
      if (accept === "image/*") return null;

      const types = accept.split(",").map((t) => t.trim());
      const extensions = types.filter((t) => t.startsWith("."));
      const mimeTypes = types.filter((t) => !t.startsWith("."));

      const formattedTypes: string[] = [];

      // Add file extensions
      if (extensions.length > 0) {
        formattedTypes.push(...extensions);
      }

      // Add human-readable mime types
      mimeTypes.forEach((mime) => {
        if (mime === "image/*") formattedTypes.push("images");
        else if (mime === "video/*") formattedTypes.push("videos");
        else if (mime === "audio/*") formattedTypes.push("audio");
        else if (mime === "application/pdf") formattedTypes.push(".pdf");
        else if (mime.includes("/")) {
          const ext = mime.split("/")[1];
          if (ext && ext !== "*") formattedTypes.push(`.${ext}`);
        }
      });

      return formattedTypes.join(", ");
    };

    const acceptedTypes = formatAcceptedTypes();

    if (accept.includes("image")) {
      return (
        <div className="flex flex-col items-center gap-2">
          <ImageIcon className="size-5 text-muted-foreground" />
          {acceptedTypes && (
            <span className="text-xs text-muted-foreground">Upload {acceptedTypes}</span>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center gap-2">
        <FileIcon className="size-5 text-muted-foreground" />
        {acceptedTypes && (
          <span className="text-xs text-muted-foreground">Upload {acceptedTypes}</span>
        )}
      </div>
    );
  };

  return (
    <>
      <button
        type="button"
        className={cn(
          "flex h-[120px] w-full cursor-pointer items-center justify-center rounded border border-dashed transition-colors",
          isDragOver
            ? "border-stone-400 bg-stone-200"
            : "border-stone-300 bg-stone-200/50 hover:border-stone-400",
          className
        )}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {renderPreview()}
      </button>
      <input
        ref={fileInputRef}
        name={name}
        type="file"
        accept={accept}
        onChange={handleImageUpload}
        className="hidden"
      />
    </>
  );
}
