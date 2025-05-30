import * as React from "react";

import { cn } from "@/lib/utils";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-stone-200/50", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("min-h-12 [&_tr:last-child]:border-0", className)} {...props} />
));
TableBody.displayName = "TableBody";

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-primary font-semibold text-primary-foreground", className)}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-stone-200/50 transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      )}
      {...props}
    />
  )
);
TableRow.displayName = "TableRow";

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sticky?: "left" | "right";
  isActionsColumn?: boolean;
}

const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, sticky, isActionsColumn, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-9 whitespace-nowrap px-5 text-left align-middle text-xxs/5 font-semibold uppercase tracking-wide text-stone-500 [&:has([role=checkbox])]:pr-0",
        sticky === "right" && !isActionsColumn && "sticky right-0 z-10 bg-white rounded-tr-md",
        sticky === "right" && isActionsColumn && "sticky right-0 z-10 bg-transparent rounded-tr-md",
        sticky === "left" && "sticky left-0 z-10 bg-white rounded-tl-md",
        isActionsColumn && "w-0",
        !sticky && isActionsColumn && "bg-transparent",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  emphasized?: boolean;
  sticky?: "left" | "right";
  isActionsColumn?: boolean;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, emphasized, sticky, isActionsColumn, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(
        "whitespace-nowrap px-5 py-3 align-middle [&:has([role=checkbox])]:pr-0",
        emphasized ? "font-semibold text-stone-800" : "text-stone-500",
        sticky === "right" && "sticky right-0 z-10 bg-white",
        sticky === "left" && "sticky left-0 z-10 bg-white",
        isActionsColumn && "w-0",
        className
      )}
      {...props}
    />
  )
);
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
));
TableCaption.displayName = "TableCaption";

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
