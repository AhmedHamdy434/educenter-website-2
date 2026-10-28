"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  OnChangeFn,
  Row,
} from "@tanstack/react-table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { SharedPagination } from "./SharedPagination";
import { DEFAULT_LIMIT } from "@/constants/dropdown-options";
import { cn } from "@/lib/utils";
import { Meta } from "@/types";

interface SharedTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  meta?: Meta;
  emptyMessage?: string;
  hidePagination?: boolean;
  rowClassName?: (row: Row<TData>) => string;
  getRowId?: (originalRow: TData, index: number) => string;
}

export function SharedTable<TData>({
  columns,
  data,
  isLoading = false,
  sorting,
  onSortingChange,
  meta = { total: 1, page: 1, limit: 10, totalPages: 1 },
  emptyMessage = "لا توجد بيانات لعرضها.",
  hidePagination = false,
  rowClassName,
  getRowId,
}: SharedTableProps<TData>) {
  const { total, page, limit, totalPages } = meta;
  const table = useReactTable({
    data,
    columns,
    getRowId,
    state: {
      sorting: sorting ?? [],
    },
    onSortingChange,
    manualSorting: true,
    enableMultiSort: false,
    defaultColumn: {
      enableSorting: false,
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4 text-right" dir="rtl">
      {/* Table Container */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-right text-sm">
            {/* Table Header: Pure background contrast without noisy borders */}
            <thead className="bg-secondary/70 text-foreground text-xs">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    const canSort = header.column.getCanSort();
                    const isSorted = header.column.getIsSorted();

                    return (
                      <th
                        key={header.id}
                        className={cn(
                          "px-5 py-3 font-bold text-foreground transition-colors",
                          canSort &&
                            "cursor-pointer select-none hover:bg-secondary/90",
                        )}
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={cn(
                              "flex items-center gap-1.5",
                              canSort && "group",
                            )}
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </span>
                            {canSort && (
                              <span className="shrink-0 text-muted-foreground transition-colors">
                                {isSorted === "asc" ? (
                                  <ArrowUp className="size-3.5 text-primary" />
                                ) : isSorted === "desc" ? (
                                  <ArrowDown className="size-3.5 text-primary" />
                                ) : (
                                  <ArrowUpDown className="size-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                                )}
                              </span>
                            )}
                          </div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: limit ?? DEFAULT_LIMIT }).map(
                  (_, rowIndex) => (
                    <tr key={rowIndex} className="animate-pulse">
                      {columns.map((_, colIndex) => (
                        <td key={colIndex} className="px-5 py-3">
                          <div className="h-4 rounded bg-muted/70 w-3/4" />
                        </td>
                      ))}
                    </tr>
                  ),
                )
              ) : data.length === 0 ? (
                // Empty State
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center text-muted-foreground font-medium text-xs"
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                // Rendered Rows with crisp scanning density
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "hover:bg-muted/30 transition-colors",
                      rowClassName?.(row),
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-5 py-3 font-medium text-xs"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {!hidePagination && total > 0 && !isLoading && (
        <SharedPagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
        />
      )}
    </div>
  );
}
