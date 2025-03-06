"use client";

import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { Contract } from "@prisma/client";
import { useState } from "react";

import useCurrentSession from "@/app/hooks/use-current-session";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { SessionUser } from "@/app/models/Session";

const ContractRow = ({ contract, currentUser, handleView }: {
  contract: Contract,
  currentUser: SessionUser,
  handleView: any
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
          {/* {ownsContract ? (
            <>
              <Button size='sm' onClick={() => (window.location.href = `/contracts/${contract.id}/edit`)}>Edit</Button>
              <Button size='sm' variant="destructive" onClick={() => handleDelete(contract.id)} loading={isDeleting} loadingText="Deleting" className="ml-2">Delete</Button>
            </>
          ) : null} */}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default function ContractSettings({ contracts }: { contracts: Contract[] }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const { currentUser } = useCurrentSession();



  const handleView = (contract: Contract) => {
    window.location.href = `/contracts/${contract.id}`;
  };

  return (
    <Card>
      {error && <p className="text-red-500 p-2">{error.message}</p>}
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
              handleView={handleView}
            />
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
