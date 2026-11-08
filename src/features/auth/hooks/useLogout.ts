"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { logoutAction } from "../actions/logout";

export interface UseLogoutOptions {
  onSuccess?: () => void;
  redirectTo?: string;
  hardRedirect?: boolean;
}

export function useLogout() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = async (options?: UseLogoutOptions) => {
    try {
      setIsPending(true);

      const result = await logoutAction();

      // Cancel all active queries in flight to prevent post-logout cache population
      await queryClient.cancelQueries();
      // Completely clear all TanStack Query cache (queries & mutations)
      queryClient.clear();

      if (options?.onSuccess) {
        options.onSuccess();
      }

      const destination = options?.redirectTo ?? "/login";

      if (options?.hardRedirect) {
        window.location.href = destination;
      } else {
        router.push(destination);
        router.refresh();
      }

      return result;
    } catch (error) {
      // Even on error, clear client cache to prevent cross-session data leaks
      await queryClient.cancelQueries();
      queryClient.clear();

      const destination = options?.redirectTo ?? "/login";
      if (options?.hardRedirect) {
        window.location.href = destination;
      } else {
        router.push(destination);
        router.refresh();
      }

      throw error;
    } finally {
      setIsPending(false);
    }
  };

  return {
    logout,
    isPending,
  };
}

