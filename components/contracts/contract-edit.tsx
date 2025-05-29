"use client";

import { Contract } from "@/app/generated/prisma";
import {
  ContractWithUploadData,
  createContract,
  updateContract
} from "@/app/services/contract-service";
import PageHeader from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Uploader, { Attachment } from "@/components/uploader";
import { BookOpen, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import ContractDeleteButton from "./contract-delete-button";

export default function ContractEdit({ contract: contractObj }: { contract: Contract | null }) {
  const [contract, setContract] = useState<ContractWithUploadData>(
    contractObj ||
      ({
        storage: "upload"
      } as ContractWithUploadData)
  );

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [error, setError] = useState<{ message: string } | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();
  const editing = !!contract?.id;

  const handleInputChange = (name: string, value: number | string | null) => {
    const updatedContract = {
      ...contract,
      [name]: value
    } as ContractWithUploadData;

    setContract(updatedContract);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setError(null);
    setIsSaving(true);
    setInfo(null);

    const form = document.querySelector("form");
    if (!form) {
      throw new Error("Form element not found");
    }

    try {
      // nextjs will aggressively cache the index page if we don't trigger this refresh
      startTransition(() => {
        router.refresh();
      });

      if (editing) {
        await updateContract(contract.id, contract);
        setInfo("Contract updated successfully");
        setIsSaving(false);
      } else {
        const newContract = await createContract(contract);
        setContract(newContract);
        setIsSaving(false);

        router.replace(`/contracts/${newContract.id}`);
        setInfo("Contract created successfully");
      }
    } catch (error) {
      setError(error as { message: string });
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const onAttachmentChange = (attachment: Partial<Attachment>) => {
    setContract((contract) => {
      return {
        ...contract,
        storage: "upload",
        attachmentUrl: attachment.attachmentUrl,
        attachmentType: attachment.attachmentType
      } as Contract;
    });
  };

  const handleRemoveAttachment = () => {
    setContract((contract) => {
      return {
        ...contract,
        attachmentUrl: null,
        attachmentType: null
      } as ContractWithUploadData;
    });
  };

  return (
    <div className="flex flex-col space-y-10">
      <PageHeader
        title={editing ? "Edit Contract" : "Create Contract"}
        backLink={{
          title: "Contracts",
          href: "/contracts"
        }}
        actions={[
          editing ? (
            <ContractDeleteButton
              key="delete-contract"
              contractId={contract.id}
              onConfirm={() => setIsDeleting(true)}
              onSuccess={() => {
                setIsDeleting(false);
                window.location.href = "/contracts";
              }}
              onError={(error: any) => {
                setIsDeleting(false);
                setError(error as { message: string });
              }}
            />
          ) : null,
          editing ? (
            <Button key="view-contract" variant="outline" asChild>
              <Link href={`/c/contracts/${contract.id}`} target="_blank">
                <BookOpen />
                Read
              </Link>
            </Button>
          ) : null
        ]}
      />
      <form>
        {error && <p className="text-sm text-red-500">{error?.message}</p>}
        {info && <p className="text-sm text-stone-500">{info}</p>}
        <div className="flex w-full flex-col items-start space-y-6">
          <div className="flex w-1/2 flex-col items-start gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              placeholder="Contract name"
              name="name"
              id="name"
              defaultValue={contract?.name ?? ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="flex w-1/2 flex-col items-start gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              placeholder="Contract description"
              name="description"
              id="description"
              rows={4}
              defaultValue={contract?.description ?? ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="storage"
                value="upload"
                checked={contract.storage === "upload"}
                onChange={() => handleInputChange("storage", "upload")}
                className="form-radio size-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Upload File</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="storage"
                value="link"
                checked={contract.storage === "link"}
                onChange={() => handleInputChange("storage", "link")}
                className="form-radio size-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">Specify URL</span>
            </label>
          </div>
          {contract.storage === "upload" ? (
            <>
              {contract.attachmentUrl ? (
                <div className="flex w-1/2 flex-col items-start gap-1">
                  <h2 className="text-xl font-semibold">Uploaded File</h2>
                  <p className="text-sm text-gray-500">Attachment</p>
                  <div className="mb-1 mt-3 flex min-h-72 flex-col items-center justify-center gap-3 rounded-md border border-gray-300 p-8">
                    <p className="text-sm text-stone-500">
                      {contract.attachmentUrl.split("/").pop()}
                    </p>
                    <Button size="icon" variant="outline" onClick={handleRemoveAttachment}>
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              ) : null}
              <div
                className={
                  "flex w-full flex-col items-start gap-2" +
                  (contract?.attachmentUrl ? " hidden" : "")
                }
              >
                <Uploader
                  allowedTypes={["pdf"]}
                  acceptTypes="application/pdf"
                  attachmentType={contract.attachmentType}
                  attachmentUrl={contract.attachmentUrl}
                  onChange={onAttachmentChange}
                  setUploading={setIsUploading}
                  autoUpload={true}
                />
              </div>
            </>
          ) : null}
          {contract.storage === "link" && (
            <div className="flex w-1/2 flex-col items-start gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                placeholder="Contract URL"
                name="url"
                id="url"
                defaultValue={contract.url || undefined}
                onChange={(e) => handleInputChange("url", e.target.value)}
              />
            </div>
          )}
          <div className="flex w-full items-center justify-between">
            <Button
              onClick={handleSubmit}
              loading={isSaving || isUploading}
              disabled={isSaving || isUploading || isDeleting}
              loadingText={isSaving ? "Saving" : isUploading ? "Uploading" : undefined}
            >
              {editing ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
