"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import { Contract } from "@prisma/client";

import useCurrentSession from "@/app/hooks/use-current-session";
import Link from "next/link";

import DashboardCard from "@/components/common/dashboard-card";
import { SessionUser } from "@/app/models/Session";

const ContractRow = ({
  contract,
  currentUser,
}: {
  contract: Contract;
  currentUser: SessionUser;
}) => {
  const ownsContract = contract.maintainerId === currentUser?.id;

  return (
    <TableRow key={contract.id}>
      <TableCell>
        {ownsContract ? (
          <Link href={`/contracts/${contract.id}`}>
            <span className="underline">{contract.name}</span>
          </Link>
        ) : (
          <span>{contract.name}</span>
        )}
      </TableCell>
      <TableCell>{contract.description}</TableCell>
      <TableCell>
        <div className="flex flex-row justify-end gap-1">
          <Link href={`/c/contracts/${contract.id}`} target="_blank">
            View
          </Link>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function ContractSettings({
  contracts,
}: {
  contracts: Contract[];
}) {
  const { currentUser } = useCurrentSession();

  return (
    <>
      <DashboardCard>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell></TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => (
              <ContractRow
                key={contract.id}
                contract={contract}
                currentUser={currentUser}
              />
            ))}
          </TableBody>
        </Table>
      </DashboardCard>
    </>
  );
}
