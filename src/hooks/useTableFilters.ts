"use client";

import { useMemo, useCallback } from "react";
import { DEFAULT_LIMIT } from "@/constants/dropdown-options";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type SortingState, type OnChangeFn } from "@tanstack/react-table";

type QueryValue = string | number | boolean | undefined | null;

type BaseQuery = {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export function useTableFilters<
  T extends object = Record<string, QueryValue>,
>() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;

  const sorting: SortingState = useMemo(() => {
    if (!sortBy) return [];
    return [{ id: sortBy, desc: sortOrder === "desc" }];
  }, [sortBy, sortOrder]);

  const updateQuery = useCallback(
    (updates: (Partial<T> & BaseQuery) | BaseQuery) => {
      const params = new URLSearchParams(searchParams.toString());

      const targetUpdates = {
        page: 1,
        ...updates,
      };

      Object.entries(targetUpdates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const onSortingChange: OnChangeFn<SortingState> = useCallback(
    (updaterOrValue) => {
      const nextSorting =
        typeof updaterOrValue === "function"
          ? updaterOrValue(sorting)
          : updaterOrValue;

      if (nextSorting.length === 0) {
        updateQuery({ sortBy: undefined, sortOrder: undefined });
      } else {
        const first = nextSorting[0];
        updateQuery({
          sortBy: first.id,
          sortOrder: first.desc ? "desc" : "asc",
        });
      }
    },
    [sorting, updateQuery],
  );

  const resetFilters = useCallback(() => {
    router.push(pathname);
  }, [pathname, router]);

  const query = {} as T;

  searchParams.forEach((value, key) => {
    if (!["page", "limit", "search", "sortBy", "sortOrder"].includes(key)) {
      query[key as keyof T] = value as T[keyof T];
    }
  });

  return {
    page,
    limit,
    search,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    ...query,
    updateQuery,
    resetFilters,
  };
}