"use client";

import { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  MutationCache,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { handleResponseToast } from "@/lib/api/handleResponseToast";
import type { ApiResponse } from "@/types";

export default function ReactQueryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [queryClient] = useState(() => {
    const client = new QueryClient({
      mutationCache: new MutationCache({
        onSuccess: (data, _variables, _context, mutation) => {
          if (mutation.meta?.skipToast) return;

          if (data && typeof data === "object" && "success" in data) {
            const res = data as ApiResponse<unknown>;
            if (mutation.meta?.successMessage && res.success) {
              toast.success(mutation.meta.successMessage);
            } else if (mutation.meta?.errorMessage && !res.success) {
              toast.error(mutation.meta.errorMessage);
            } else {
              handleResponseToast(res);
            }
          }
        },
        onError: (error, _variables, _context, mutation) => {
          if (mutation.meta?.skipToast) return;

          if (mutation.meta?.errorMessage) {
            toast.error(mutation.meta.errorMessage);
          } else {
            handleResponseToast({
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "حدث خطأ أثناء تنفيذ العملية. يرجى المحاولة لاحقاً.",
              data: null,
            });
          }
        },
      }),
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000 * 5, // 5 minutes stale time
          refetchOnWindowFocus: false, // disable refetch on window focus
        },
      },
    });

    // Intercept all queries centrally: if a Server Action resolves with success: false,
    // throw an Error so TanStack Query marks isError: true and sets error.message from the backend.
    const originalDefaultQueryOptions = client.defaultQueryOptions.bind(client);
    client.defaultQueryOptions = function (options) {
      const defaulted = originalDefaultQueryOptions(options);
      if (
        defaulted.queryFn &&
        typeof defaulted.queryFn === "function" &&
        !(defaulted as unknown as { _intercepted?: boolean })._intercepted
      ) {
        const originalQueryFn = defaulted.queryFn;
        defaulted.queryFn = async function (...args) {
          const res = await originalQueryFn(...args);
          if (
            res &&
            typeof res === "object" &&
            "success" in res &&
            (res as { success: boolean }).success === false
          ) {
            const error = new Error(
              (res as { message?: string }).message ||
                "حدث خطأ أثناء تحميل البيانات.",
            );
            Object.assign(error, res);
            throw error;
          }
          return res;
        };
        (defaulted as unknown as { _intercepted?: boolean })._intercepted = true;
      }
      return defaulted;
    };

    return client;
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

