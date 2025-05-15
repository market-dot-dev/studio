"use server";

import { Contract, Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { generateId } from "@/lib/utils";
import { put } from "@vercel/blob";
import { getCurrentUser } from "./UserService";

export type ContractWithUploadData = Contract & { uploadData?: File };

class ContractService {
  static async getContractById(id: string): Promise<Contract | null> {
    return prisma.contract.findUnique({ where: { id } });
  }

  static async getContractsByCurrentMaintainer(): Promise<Contract[]> {
    const currentUser = await getCurrentUser();

    if (!currentUser) return [];
    return ContractService.getContractsByMaintainerId(currentUser.id);
  }

  static async getContractsByMaintainerId(maintainerId: string | null): Promise<Contract[]> {
    return prisma.contract.findMany({
      where: {
        OR: [{ maintainerId: null }, { maintainerId: maintainerId }]
      }
    });
  }

  static async destroyContract(id: string): Promise<Contract> {
    const currentUser = await getCurrentUser();
    const contract = await prisma.contract.findUnique({ where: { id } });

    if (!contract) {
      throw new Error("Contract not found");
    }

    if (contract.maintainerId !== currentUser?.id && currentUser?.roleId !== "admin") {
      throw new Error("Unauthorized");
    }

    return prisma.contract.delete({ where: { id } });
  }

  private static async uploadFile(file: File): Promise<{ url: string; type: string }> {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error(
        "Missing BLOB_READ_WRITE_TOKEN token. Note: Vercel Blob is currently in beta – please fill out this form for access: https://tally.so/r/nPDMNd"
      );
    }

    const filename = `${generateId()}.${file.type.split("/")[1]}`;
    const { url } = await put(filename, file, {
      access: "public"
    });

    return { url, type: file.type };
  }

  private static async uploadAttachment(
    contract: ContractWithUploadData
  ): Promise<Prisma.ContractCreateInput> {
    console.log("~~~~~~~~~~~~~~ uploading");
    if (contract.uploadData) {
      const file = contract.uploadData as any as File;
      const { url, type } = await this.uploadFile(file);
      console.log("~~~~~~~~~~~~~~ uploading: ", { url, type });

      contract.attachmentUrl = url;
      contract.attachmentType = type;
    }

    if (contract.attachmentUrl) {
      contract.storage = "upload";
    } else {
      contract.attachmentType = null;
      contract.storage = "link";
    }

    return contract as Prisma.ContractCreateInput;
  }

  static async updateContract(
    id: string,
    contractAttributes: ContractWithUploadData
  ): Promise<Contract> {
    const currentUser = await getCurrentUser();
    const existingContract = await prisma.contract.findUnique({
      where: { id }
    });

    if (!existingContract) {
      throw new Error("Contract not found");
    }

    if (existingContract.maintainerId !== currentUser?.id && currentUser?.roleId !== "admin") {
      throw new Error("Unauthorized");
    }

    // const updateData = await this.uploadAttachment(contractAttributes);

    return prisma.contract.update({ where: { id }, data: contractAttributes });
  }

  static async createContract(contractAttributes: ContractWithUploadData): Promise<Contract> {
    const maintainerId = (await getCurrentUser())?.id;
    if (!maintainerId) {
      throw new Error("Unauthorized");
    }

    const contract = await this.uploadAttachment(contractAttributes);

    return await prisma.contract.create({
      data: {
        ...contract,
        maintainer: {
          connect: {
            id: maintainerId
          }
        }
      }
    });
  }
}

export const getContractById = async (id: string) => {
  return ContractService.getContractById(id);
};

export const updateContract = async (id: string, contract: ContractWithUploadData) => {
  return ContractService.updateContract(id, contract);
};

export const getContractsByCurrentMaintainer = async () => {
  return ContractService.getContractsByCurrentMaintainer();
};

export const destroyContract = async (id: string) => {
  return ContractService.destroyContract(id);
};

export const createContract = async (contract: ContractWithUploadData) => {
  return ContractService.createContract(contract);
};
