"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  TableOptions,
  useReactTable
} from "@tanstack/react-table";

import { SessionUser } from "@/app/models/Session";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { ReactElement, ReactNode } from "react";

// Extend the ColumnDef type to include an emphasized property
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    emphasized?: boolean;
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  meta?: Record<string, any>;
  className?: string;
  tableOptions?: Partial<TableOptions<TData>>;
  noResults?: ReactNode;
  cardProps?: React.ComponentProps<typeof Card>;
  tableContainerClassName?: string;
  currentUser?: SessionUser | null | undefined;
  isLoading?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  meta = {},
  className = "",
  tableOptions = {},
  noResults = "No results",
  cardProps,
  tableContainerClassName,
  currentUser,
  isLoading = false
}: DataTableProps<TData, TValue>): ReactElement<any> {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
    ...tableOptions
  });

  return (
    <Card className={cn("p-0", className)} {...cardProps}>
      <div className={tableContainerClassName}>
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
            {isLoading ? (
              Array(data.length || 4)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array(columns.length)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <TableCell key={`skeleton-cell-${index}-${cellIndex}`}>
                          <Skeleton className="h-6" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} emphasized={cell.column.columnDef.meta?.emphasized}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="min-h-24 text-center">
                  {noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
