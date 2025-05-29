"use client";

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
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  Row,
  TableOptions,
  useReactTable
} from "@tanstack/react-table";
import * as React from "react";
import { ReactNode } from "react";

// Extend the ColumnDef type to include an emphasized property
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData, TValue> {
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
  isLoading?: boolean;
  renderSubRowComponent?: (row: Row<TData>) => ReactNode;
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
  isLoading = false,
  renderSubRowComponent
}: DataTableProps<TData, TValue>): React.ReactElement<any> {
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
              table.getRowModel().rows.map((row) => {
                const subRowComponent = renderSubRowComponent ? renderSubRowComponent(row) : null;
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(subRowComponent && "!border-b-0")}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          emphasized={cell.column.columnDef.meta?.emphasized}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {subRowComponent && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="p-0">
                          {subRowComponent}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
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
