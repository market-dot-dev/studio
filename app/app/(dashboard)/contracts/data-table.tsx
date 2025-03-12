"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card";
import { SessionUser } from "@/app/models/Session"
import { MouseEvent } from "react"
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  currentUser?: SessionUser | null | undefined
  isLoading?: boolean
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  currentUser,
  isLoading = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const handleRowClick = (e: MouseEvent, row: TData) => {
    // Don't trigger row click when clicking on action buttons or links
    if (
      (e.target as HTMLElement).closest('.dropdown-trigger') ||
      (e.target as HTMLElement).closest('button') ||
      (e.target as HTMLElement).closest('a')
    ) {
      return;
    }
    
    if (onRowClick) {
      onRowClick(row);
    }
  };

  // Check if the row is clickable (editable by the user)
  const isRowClickable = (row: TData) => {
    if (!currentUser || !onRowClick) return false;
    
    // For Contract type only
    if ((row as any).maintainerId === currentUser.id) {
      return true;
    }
    
    return false;
  };

  return (
    <Card>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            // Render skeleton rows when loading
            Array(4).fill(0).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                {Array(columns.length).fill(0).map((_, cellIndex) => (
                  <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
                    <Skeleton className="h-6" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const isClickable = isRowClickable(row.original);
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={(e) => isClickable && handleRowClick(e, row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      emphasized={cell.column.id === 'name' || cell.column.id === 'contractName'}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Card>
  )
} 