"use client";

import { Flex, Text, TextInput, Button } from "@tremor/react";
import { Contract } from "@prisma/client";
import { useState } from "react";
import { updateContract, createContract, ContractWithUploadData } from "@/app/services/contract-service";
import { useRouter } from "next/navigation";
import Uploader, { Attachment } from "@/components/uploader";

export default function ContractEdit({ contract: contractObj }: { contract: Contract | null }) {
  const [contract, setContract] = useState<ContractWithUploadData>(contractObj || ({
    storage: 'upload',
  } as ContractWithUploadData));

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const router = useRouter();
  const editing = !!contract?.id;

  const handleInputChange = (
		name: string,
		value: number | string | null,
	) => {
		const updatedContract = { ...contract, [name]: value } as ContractWithUploadData;
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
      if (editing) {
        await updateContract(contract.id, contract);
        setInfo("Contract updated successfully");
        setIsSaving(false);
        
        //router.push("/maintainer/contracts");
      } else {
        const newContract = await createContract(contract);
        setContract(newContract);
        setIsSaving(false);
        
        router.replace(`/maintainer/contracts/${newContract.id}/edit`);
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
        } as Contract
    });
  };

  const onUploadDataChange = (uploadData: File | null) => {
    setContract((contract) => {
      return {
        ...contract,
        storage: "upload",
        uploadData,
      } as ContractWithUploadData
    });
  }

  return (
    <>
      <h2 className="mb-4 text-xl font-semibold">
        {editing ? "Edit Contract" : "Create Contract"}
      </h2>
      <form>
        {error && <Text className="text-red-500">{error?.message}</Text>}
        {info && <Text className="text-green-500">{info}</Text>}
        <Flex flexDirection="col" alignItems="start" className="w-full space-y-6">
          <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <TextInput
              placeholder="Contract name"
              name="name"
              id="name"
              defaultValue={contract?.name ?? ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </Flex>
          <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <TextInput
              placeholder="Contract description"
              name="description"
              id="description"
              defaultValue={contract?.description ?? ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
            />
          </Flex>
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
              <span className="ml-2 text-sm font-medium text-gray-700">Upload File</span>
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
              <span className="ml-2 text-sm font-medium text-gray-700">Specify URL</span>
            </label>
          </div>
          {contract.storage === "upload" && (
            <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
              <label htmlFor="attachment" className="block text-sm font-medium text-gray-700">
                Attachment
              </label>
              <Uploader
                allowedTypes={['pdf']}
                attachmentType={contract.attachmentType}
                attachmentUrl={contract.attachmentUrl}
                onChange={onAttachmentChange}
              />
            </Flex>
          )}
          {contract.storage === "link" && (
            <Flex flexDirection="col" alignItems="start" className="w-1/2 gap-2">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                URL
              </label>
              <TextInput
                placeholder="Contract URL"
                name="url"
                id="url"
                defaultValue={contract.url || undefined}
                onChange={(e) => handleInputChange("url", e.target.value)}
              />
            </Flex>
          )}
          <Button onClick={handleSubmit} disabled={isSaving}>
            {editing ? "Save Contract" : "Create Contract"}
          </Button>
        </Flex>
      </form>
    </>
  );
}