"use client";

import { Text, TextInput, Button, Textarea } from "@tremor/react";
import { Contract } from "@prisma/client";
import Link from "next/link";
import PageHeading from "@/components/common/page-heading";
import { startTransition, useCallback, useState } from "react";
import {
  updateContract,
  createContract,
  ContractWithUploadData,
} from "@/app/services/contract-service";
import { useRouter } from "next/navigation";
import Uploader, { Attachment } from "@/components/uploader";

import { FaRegTrashAlt } from "react-icons/fa";
import ContractDeleteButton from "./contract-delete-button";

export default function ContractEdit({
  contract: contractObj,
}: {
  contract: Contract | null;
}) {
  
  const [contract, setContract] = useState<ContractWithUploadData>(
    contractObj ||
      ({
        storage: "upload",
      } as ContractWithUploadData),
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
      [name]: value,
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
        attachmentType: attachment.attachmentType,
      } as Contract;
    });
  };
  

  const handleRemoveAttachment = () => {
    setContract((contract) => {
      return {
        ...contract,
        attachmentUrl: null,
        attachmentType: null,
      } as ContractWithUploadData;
    });
  };

  return (
    <>
      <div className="flex justify-between w-full items-center">
        <Link href="/contracts" className="underline">← All Contracts</Link>
        { editing ? <Link href={`/c/contracts/${contract.id}`} target="_blank" className="underline">View</Link> : null}
      </div>
      <PageHeading title={editing ? "Edit Contract" : "Create Contract"} />
      <form>
        {error && <Text className="text-red-500">{error?.message}</Text>}
        {info && <Text className="text-green-500">{info}</Text>}
        <div className="flex flex-col items-start w-full space-y-6">
          <div className="flex flex-col items-start w-1/2 gap-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <TextInput
              placeholder="Contract name"
              name="name"
              id="name"
              defaultValue={contract?.name ?? ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          <div className="flex flex-col items-start w-1/2 gap-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description
            </label>
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
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Upload File
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="storage"
                value="link"
                checked={contract.storage === "link"}
                onChange={() => handleInputChange("storage", "link")}
                className="form-radio h-4 w-4 text-blue-600 transition duration-150 ease-in-out"
              />
              <span className="ml-2 text-sm font-medium text-gray-700">
                Specify URL
              </span>
            </label>
          </div>
          {
            contract.storage === "upload" ? 
            <>
            { contract.attachmentUrl ? 
              <div className="flex flex-col items-start w-1/2 gap-1">
                  <h2 className="text-xl font-semibold">Uploaded File</h2>
                  <p className="text-sm text-gray-500">
                    Attachment
                  </p>
                <div className="flex flex-col mt-3 mb-1 border items-center justify-center p-8 gap-3 rounded-md border-gray-300 min-h-72">
                  
                    <Text>{contract.attachmentUrl.split('/').pop()}</Text>
                    <Button size="xs" onClick={handleRemoveAttachment} variant="light" color="red">
                      <FaRegTrashAlt />
                    </Button>
                  
                </div>
              </div>
             :
              null 
            }
              <div className={"flex flex-col items-start w-1/2 gap-2" + (contract?.attachmentUrl ? ' hidden' : '')}>
                
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
          : null}
          {contract.storage === "link" && (
            <div className="flex flex-col items-start w-1/2 gap-2">
              <label
                htmlFor="url"
                className="block text-sm font-medium text-gray-700"
              >
                URL
              </label>
              <TextInput
                placeholder="Contract URL"
                name="url"
                id="url"
                defaultValue={contract.url || undefined}
                onChange={(e) => handleInputChange("url", e.target.value)}
              />
            </div>
          )}
          <div className="flex items-center justify-between w-full">
            <Button onClick={handleSubmit} disabled={isSaving || isDeleting || isUploading}>
              {editing ? "Save Contract" : "Create Contract"}
            </Button>
            {editing ? 
            <ContractDeleteButton
              contractId={contract.id}
              onConfirm={() => setIsDeleting(true)}
              onSuccess={() => {
                setIsDeleting(false);
                window.location.href = '/contracts';
              }}
              onError={(error: any) => {
                setIsDeleting(false);
                setError(error as { message: string });
              }}
          
              />: null
            }
          </div>
        </div>
      </form>
    </>
  );
}
