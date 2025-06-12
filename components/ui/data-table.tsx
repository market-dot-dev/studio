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

// Extend the ColumnDef type to include emphasized property
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
    meta: meta as any,
    ...tableOptions
  });

  return (
    <Card className={cn("p-0", className)} {...cardProps}>
      <div className={cn("overflow-x-auto", tableContainerClassName)}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header, headerIndex) => {
                  // Automatically make columns with id "actions" sticky to the right
                  const isActionsColumn = header.column.id === "actions";
                  const isFirstHeader = headerIndex === 0;
                  const isLastHeader = headerIndex === headerGroup.headers.length - 1;

                  return (
                    <TableHead
                      key={header.id}
                      sticky={isActionsColumn ? "right" : undefined}
                      isActionsColumn={isActionsColumn}
                      className={cn(
                        isFirstHeader && "rounded-tl-md",
                        isLastHeader && "rounded-tr-md"
                      )}
                    >
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
                      .map((_, cellIndex) => {
                        const column = columns[cellIndex];
                        const isActionsColumn = column && "id" in column && column.id === "actions";

                        return (
                          <TableCell
                            key={`skeleton-cell-${index}-${cellIndex}`}
                            isActionsColumn={isActionsColumn}
                          >
                            <Skeleton className="h-6" />
                          </TableCell>
                        );
                      })}
                  </TableRow>
                ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => {
                const subRowComponent = renderSubRowComponent ? renderSubRowComponent(row) : null;
                const isLastRow = rowIndex === table.getRowModel().rows.length - 1;
                return (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && "selected"}
                      className={cn(subRowComponent && "!border-b-0")}
                    >
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        // Automatically make columns with id "actions" sticky to the right
                        const isActionsColumn = cell.column.id === "actions";
                        const isFirstCell = cellIndex === 0;
                        const isLastCell = cellIndex === row.getVisibleCells().length - 1;

                        return (
                          <TableCell
                            key={cell.id}
                            emphasized={cell.column.columnDef.meta?.emphasized}
                            sticky={isActionsColumn ? "right" : undefined}
                            isActionsColumn={isActionsColumn}
                            className={cn(
                              isLastRow && isFirstCell && "rounded-bl-md",
                              isLastRow && isLastCell && "rounded-br-md"
                            )}
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        );
                      })}
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
