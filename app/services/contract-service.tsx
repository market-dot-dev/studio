"use server";

import { Contract, Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { generateId } from "@/lib/utils";
import { put } from "@vercel/blob";
import { requireOrganization, requireUser } from "./user-context-service";

export type ContractWithUploadData = Contract & { uploadData?: File };

class ContractService {
  static async getContractById(id: string): Promise<Contract | null> {
    return prisma.contract.findUnique({ where: { id } });
  }

  static async getContractsByCurrentOrganization(): Promise<Contract[]> {
    const organization = await requireOrganization();
    return this.getContractsByOrganizationId(organization.id);
  }

  static async getContractsByOrganizationId(organizationId: string): Promise<Contract[]> {
    return prisma.contract.findMany({
      where: {
        organizationId: organizationId
      }
    });
  }

  static async destroyContract(id: string): Promise<Contract> {
    const user = await requireUser();
    const organization = await requireOrganization();
    const contract = await prisma.contract.findUnique({
      where: { id }
    });

    if (!contract) {
      throw new Error("Contract not found");
    }

    // Check if contract belongs to the current organization
    if (contract.organizationId !== organization.id) {
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

    const filename = `${generateId()}.${file.type.split("/")[1]}`; // @TODO: random ids might not be necessary with @vercel/blob v1 anymore
    const { url } = await put(filename, file, {
      access: "public"
    });

    return { url, type: file.type };
  }

  private static async uploadAttachment(
    contract: ContractWithUploadData
  ): Promise<Prisma.ContractCreateInput> {
    if (contract.uploadData) {
      const file = contract.uploadData as any as File;
      const { url, type } = await this.uploadFile(file);

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
    const organization = await requireOrganization();
    const existingContract = await prisma.contract.findUnique({
      where: { id }
    });

    if (!existingContract) {
      throw new Error("Contract not found");
    }

    // Check if contract belongs to the current organization
    if (existingContract.organizationId !== organization.id) {
      throw new Error("Unauthorized");
    }

    // const updateData = await this.uploadAttachment(contractAttributes);

    return prisma.contract.update({ where: { id }, data: contractAttributes });
  }

  static async createContract(contractAttributes: ContractWithUploadData): Promise<Contract> {
    const organization = await requireOrganization();
    const contract = await this.uploadAttachment(contractAttributes);

    return await prisma.contract.create({
      data: {
        ...contract,
        organization: {
          connect: {
            id: organization.id
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

export const getContractsByCurrentOrganization = async () => {
  return ContractService.getContractsByCurrentOrganization();
};

export const destroyContract = async (id: string) => {
  return ContractService.destroyContract(id);
};

export const createContract = async (contract: ContractWithUploadData) => {
  return ContractService.createContract(contract);
};
