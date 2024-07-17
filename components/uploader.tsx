"use client";

import { useState, useCallback, useMemo, ChangeEvent, useEffect } from "react";
import { toast } from "sonner";
import LoadingDots from "@/components/icons/loading-dots";
import { Button } from "@tremor/react";

export type Attachment = {
  attachmentType: string;
  attachmentUrl: string;
};

type UploadPreviewProps = {
  uploadData: string | null | undefined;
  file: File | null | undefined;
  attachmentUrl: string | null | undefined;
  attachmentType: string | null | undefined;
};

const UploadPreview = ({
  uploadData,
  file,
  attachmentUrl,
  attachmentType,
}: UploadPreviewProps) => {
  if ((file?.type || attachmentType) === "application/pdf") {
    return (
      <>
        <div className="absolute z-[4] flex h-full w-full flex-col items-center justify-center rounded-md bg-white/80 px-10 backdrop-blur-md">
          <svg
            className="h-7 w-7 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
            <polyline points="13 2 13 9 20 9"></polyline>
          </svg>
          <p className="mt-2 text-center text-sm text-gray-500">{file?.name || '[filename missing]'}</p>
        </div>
      </>
    );
  } else {
    const imageUrl = uploadData || attachmentUrl || undefined;
    if (!uploadData && !attachmentUrl) return <></>;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={imageUrl}
        alt="Preview"
        className="h-full w-full rounded-md object-cover"
      />
    );
  }
};

type UploaderProps = {
  allowedTypes?: string[];
  acceptTypes?: string;
  attachmentUrl: string | null;
  attachmentType: string | null;
  onChange?: (attachment: Partial<Attachment>) => void;
  autoUpload?: boolean;
  setUploading?: (uploading: boolean) => void;
};

const defaultAllowedTypes = ["png", "jpg", "gif", "mp4"];
const defaultAcceptTypes = "image/*"

export default function Uploader({
  allowedTypes = defaultAllowedTypes,
  acceptTypes = defaultAcceptTypes,
  attachmentUrl,
  attachmentType,
  onChange,
  autoUpload = false,
  setUploading,
}: UploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploadData, setUploadData] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(
    attachmentUrl || null,
  );
  

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          toast.error("File size too big (max 50MB)");
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setUploadData((prev) => e.target?.result as string);
          };
          reader.readAsDataURL(file);
          if (autoUpload) {
            onSubmit(file);  // Automatically start the upload process if autoUpload is true
          }
        }
      }
    },
    [setUploadData, autoUpload],
  );

  const toastUploadSuccess = (url: string) => {
    toast(
      <div className="relative">
        <div className="p-2">
          <p className="font-semibold text-gray-900">File uploaded!</p>
          <p className="mt-1 text-sm text-gray-500">
            Your file has been uploaded to{" "}
            <a
              className="font-medium text-gray-900 underline"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {url}
            </a>
          </p>
        </div>
      </div>,
      {
        closeButton: true,
      }
    )
  };

  const onDropEvent = (e: any) => {
    const file = e?.dataTransfer?.files && e.dataTransfer.files[0];

    if (file) {
      if (file.size / 1024 / 1024 > 50) {
        toast.error("File size too big (max 50MB)");
      } else {
        setFile(file);
        const reader = new FileReader();
        reader.onload = (e) => {
          setUploadData((prev) => e.target?.result as string);
        };
        reader.readAsDataURL(file);
        if (autoUpload) {
          onSubmit(file);  // Automatically start the upload process if autoUpload is true
        }
      }
    }
  };

  const onRemove = () => {
    setFile(null);
    setUploadData(null);
    setUploadedFilePath(null);
    onChange?.({ attachmentUrl: "", attachmentType: "" });
  };

  const onSubmit = async (file: File) => {
    setSaving(true);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.setRequestHeader("content-type", file?.type || "application/octet-stream");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        setProgress(percentComplete);
      }
    };

    xhr.onload = async () => {
      if (xhr.status === 200) {
        const { url } = JSON.parse(xhr.responseText);
        setUploadedFilePath(url);
        onChange?.({ attachmentUrl: url, attachmentType: file.type });
        toastUploadSuccess(url);
      } else {
        const error = xhr.responseText;
        toast.error(error);
      }
      setSaving(false);
      setProgress(0);
    };

    xhr.onerror = () => {
      toast.error("An error occurred during the upload");
      setSaving(false);
      setProgress(0);
    };

    xhr.send(file);
  };

  const saveDisabled = useMemo(() => {
    return !file || !uploadData || saving;
  }, [uploadData, saving, file]);

  useEffect(() => {
    setUploading?.(saving);
  }, [saving])

  return (
    <form className="grid w-full gap-6">
      <div>
        <div className="mb-4 space-y-1">
          <h2 className="text-xl font-semibold">Upload a file</h2>
          <p className="text-sm text-gray-500">
            Accepted formats:{" "}
            {allowedTypes.map((type) => `.${type}`).join(", ")}
          </p>
        </div>
        <label
          htmlFor="image-upload"
          className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
        >
          <div
            className="absolute z-[5] h-full w-full rounded-md"
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);

              onDropEvent(e);
            }}
          />
          <div
            className={`${
              dragActive ? "border-2 border-black" : ""
            } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
              uploadData || uploadedFilePath
                ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                : "bg-white opacity-100 hover:bg-gray-50"
            }`}
          >
            <svg
              className={`${
                dragActive ? "scale-110" : "scale-100"
              } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
              <path d="M12 12v9"></path>
              <path d="m16 16-4-4-4 4"></path>
            </svg>
            <p className="mt-2 text-center text-sm text-gray-500">
              Drag and drop or click to upload.
            </p>
            <p className="mt-2 text-center text-sm text-gray-500">
              Max file size: 50MB
            </p>
            <span className="sr-only">Photo upload</span>
          </div>
          {((file && uploadData) || attachmentUrl) && (
            <>
              <UploadPreview
                file={file}
                attachmentType={attachmentType || file?.type}
                uploadData={uploadData}
                attachmentUrl={attachmentUrl}
              />
            </>
          )}
        </label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            id="image-upload"
            name="image"
            type="file"
            accept={acceptTypes}
            className="sr-only"
            onChange={onChangePicture}
          />
        </div>
      </div>

      {saving && (
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
          </div>
        </div>
      )}

      {uploadedFilePath && (
        <div>
          <Button
            onClick={onRemove}
            className="flex h-10 w-full items-center justify-center rounded-md border border-black bg-black text-sm text-white transition-all hover:bg-white hover:text-black focus:outline-none"
          >
            Remove
          </Button>
        </div>
      )}
      {!uploadedFilePath && !autoUpload && (
        <Button
          disabled={saveDisabled}
          onClick={(e) => {
            e.preventDefault();
            onSubmit(file!);
          }}
          className={`${
            saveDisabled
              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
              : "border-black bg-black text-white hover:bg-white hover:text-black"
          } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
        >
          {saving ? (
            <LoadingDots color="#808080" />
          ) : (
            <p className="text-sm">Confirm upload</p>
          )}
        </Button>
      )}
    </form>
  );
}
