import * as React from "react"

import { cn } from "@/lib/utils"

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  fullWidth?: boolean;
}

const Table = React.forwardRef<
  HTMLTableElement,
  TableProps
>(({ className, fullWidth, ...props }, ref) => (
  <div className={cn("relative w-full overflow-auto", fullWidth && "px-0")}>
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0 min-h-12", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-primary font-semibold text-primary-foreground", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  fullWidth?: boolean;
}

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  TableRowProps
>(({ className, fullWidth, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-stone-200/75 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      fullWidth && "w-full",
      className,
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow"

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  isFirst?: boolean;
  isLast?: boolean;
}

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  TableHeadProps
>(({ className, isFirst, isLast, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-10 whitespace-nowrap px-5 py-2 text-left !text-stone-500 align-middle text-xxs/5 font-semibold uppercase tracking-wide [&:has([role=checkbox])]:pr-0",
      isFirst && "pl-6 md:pl-10",
      isLast && "pr-6 md:pr-10",
      className,
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead"

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  emphasized?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, emphasized, isFirst, isLast, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "whitespace-nowrap px-5 py-3 align-middle [&:has([role=checkbox])]:pr-0",
        emphasized ? "font-semibold text-stone-800" : "text-stone-500",
        isFirst && "pl-6 md:pl-10",
        isLast && "pr-6 md:pr-10",
        className,
      )}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
