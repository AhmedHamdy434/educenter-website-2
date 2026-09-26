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
  const [queryClient] = useState(
    () =>
      new QueryClient({
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
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

