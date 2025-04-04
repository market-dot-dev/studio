"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  TableOptions,
  Table as ReactTable,
  Row,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card } from "@/components/ui/card"
import { ReactElement, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { SessionUser } from "@/app/models/Session"

// Extend the ColumnDef type to include an emphasized property
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends unknown, TValue> {
    emphasized?: boolean
  }
  
  interface TableMeta<TData> {
    rowProps?: (row: TData) => React.HTMLAttributes<HTMLTableRowElement>
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  meta?: Record<string, any>
  className?: string
  tableOptions?: Partial<TableOptions<TData>>
  noResults?: ReactNode
  cardProps?: React.ComponentProps<typeof Card>
  tableContainerClassName?: string
  currentUser?: SessionUser | null | undefined
  isLoading?: boolean
  fullWidth?: boolean
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
  isLoading = false,
  fullWidth = false,
}: DataTableProps<TData, TValue>): ReactElement {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta,
    ...tableOptions,
  })

  return (
    <Card className={cn("p-0", fullWidth && "w-full", className)} {...cardProps}>
      <div className={cn(fullWidth && "w-full", tableContainerClassName)}>
        <Table fullWidth={fullWidth}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent" fullWidth={fullWidth}>
                {headerGroup.headers.map((header, index) => {
                  const isFirst = index === 0;
                  const isLast = index === headerGroup.headers.length - 1;
                  return (
                    <TableHead 
                      key={header.id}
                      isFirst={isFirst && fullWidth}
                      isLast={isLast && fullWidth}
                    >
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
              Array(data.length || 4).fill(0).map((_, index) => (
                <TableRow key={`skeleton-${index}`} fullWidth={fullWidth}>
                  {Array(columns.length).fill(0).map((_, cellIndex) => {
                    const isFirst = cellIndex === 0;
                    const isLast = cellIndex === columns.length - 1;
                    return (
                      <TableCell 
                        key={`skeleton-cell-${index}-${cellIndex}`}
                        isFirst={isFirst && fullWidth}
                        isLast={isLast && fullWidth}
                      >
                        <Skeleton className="h-6" />
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // Get any custom row props from the meta
                const rowProps = table.options.meta?.rowProps?.(row.original) || {};
                
                return (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    fullWidth={fullWidth}
                    {...rowProps}
                  >
                    {row.getVisibleCells().map((cell, index) => {
                      const isFirst = index === 0;
                      const isLast = index === row.getVisibleCells().length - 1;
                      return (
                        <TableCell 
                          key={cell.id}
                          emphasized={cell.column.columnDef.meta?.emphasized}
                          isFirst={isFirst && fullWidth}
                          isLast={isLast && fullWidth}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow fullWidth={fullWidth}>
                <TableCell 
                  colSpan={columns.length} 
                  className="min-h-24 text-center"
                  isFirst={fullWidth}
                  isLast={fullWidth}
                >
                  {noResults}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
} 