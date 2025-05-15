"use client";

import { User } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";

interface UserSelectionStepProps {
  selectedUsers: User[];
  setSelectedUsers: (users: User[]) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
}

function DataTable<TData, TValue>({ columns, data, onRowClick }: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => onRowClick && onRowClick(row.original)}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export default function UserSelectionStep({
  selectedUsers,
  setSelectedUsers
}: UserSelectionStepProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/admin/users");

        if (!response.ok) {
          // Get error details from response
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();

        if (!data || !Array.isArray(data)) {
          throw new Error("Invalid data format returned from API");
        }

        console.log(`Loaded ${data.length} users from API`);
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error instanceof Error ? error.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectUser = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers([...filteredUsers]);
    }
  };

  const isUserSelected = (userId: string) => {
    return selectedUsers.some((user) => user.id === userId);
  };

  const isAllSelected = filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length;

  // Define columns for the table
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: "select",
        header: function SelectHeader() {
          return (
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={handleSelectAll}
              aria-label="Select all"
            />
          );
        },
        cell: function SelectCell({ row }) {
          const user = row.original;
          return (
            <Checkbox
              checked={isUserSelected(user.id!)}
              onCheckedChange={() => handleSelectUser(user)}
              aria-label="Select row"
              onClick={(e) => e.stopPropagation()}
            />
          );
        }
      },
      {
        accessorKey: "name",
        header: "Name",
        cell: function NameCell({ row }) {
          return <div>{row.original.name || "N/A"}</div>;
        }
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: function EmailCell({ row }) {
          return <div>{row.original.email || "N/A"}</div>;
        }
      }
    ],
    [isAllSelected, handleSelectAll, isUserSelected, handleSelectUser]
  );

  // Error state
  if (error) {
    return (
      <Card className="border border-red-200 bg-red-50 p-4">
        <h2 className="mb-2 text-lg font-semibold text-red-700">Error Loading Users</h2>
        <p className="mb-4 text-red-600">{error}</p>
        <p className="text-sm text-gray-700">
          This could be due to insufficient permissions or server issues. Please ensure you have
          admin privileges and try again.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto mb-4 size-8 animate-spin rounded-full border-4 border-gray-300 border-t-black"></div>
        <p className="text-gray-600">Loading users...</p>
      </div>
    );
  }

  // Empty state
  if (users.length === 0) {
    return (
      <Card className="p-4 text-center">
        <h2 className="mb-2 text-lg font-semibold">No Users Found</h2>
        <p className="mb-4 text-gray-600">
          There are no users in the system or you may not have permission to view them.
        </p>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Select Recipients</h2>
          <p className="text-sm text-gray-500">
            {selectedUsers.length} of {users.length} users selected
          </p>
        </div>
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      </div>

      <DataTable columns={columns} data={filteredUsers} onRowClick={handleSelectUser} />
    </div>
  );
}
