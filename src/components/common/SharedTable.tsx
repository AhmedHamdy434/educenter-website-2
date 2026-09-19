"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";
import { SharedPagination } from "./SharedPagination";

interface SharedTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading?: boolean;
  // Pagination
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  emptyMessage?: string;
}

export function SharedTable<TData>({
  columns,
  data,
  isLoading = false,
  page = 1,
  limit = 10,
  total = 0,
  totalPages = 1,
  onPageChange,
  onLimitChange,
  emptyMessage = "لا توجد بيانات لعرضها.",
}: SharedTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
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
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-5 py-3 font-bold text-foreground"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-border/60 text-foreground">
              {isLoading ? (
                // Skeleton Rows
                Array.from({ length: limit }).map((_, rowIndex) => (
                  <tr key={rowIndex} className="animate-pulse">
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-5 py-3">
                        <div className="h-4 rounded bg-muted/70 w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
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
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-5 py-3 font-medium text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
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
      {total > 0 && !isLoading && (
        <SharedPagination
          page={page}
          limit={limit}
          total={total}
          totalPages={totalPages}
          onPageChange={onPageChange || (() => {})}
          onLimitChange={onLimitChange || (() => {})}
        />
      )}
    </div>
  );
}
