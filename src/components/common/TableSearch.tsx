"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";

interface TableSearchProps {
  placeholder?: string;
  paramName?: string;
  debounceMs?: number;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function TableSearch({
  placeholder = "ابحث هنا...",
  paramName = "search",
  debounceMs = 400,
  className,
  value: controlledValue,
  onChange: controlledOnChange,
}: TableSearchProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isControlled = controlledOnChange !== undefined;

  const currentParam = !isControlled ? (searchParams.get(paramName) ?? "") : "";
  const [prevParam, setPrevParam] = useState(currentParam);
  const [searchTerm, setSearchTerm] = useState(controlledValue ?? currentParam);
  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);

  const [prevControlledValue, setPrevControlledValue] =
    useState(controlledValue);

  // Sync internal state if controlledValue changes
  if (isControlled && controlledValue !== prevControlledValue) {
    setPrevControlledValue(controlledValue);
    setSearchTerm(controlledValue ?? "");
  }

  // Sync internal state if URL search param changes externally (e.g. navigation or reset)
  if (!isControlled && currentParam !== prevParam) {
    setPrevParam(currentParam);
    setSearchTerm(currentParam);
  }

  // Update URL search param or call controlledOnChange when debounced search term changes
  useEffect(() => {
    if (isControlled) {
      controlledOnChange(debouncedSearchTerm);
      return;
    }

    const activeParam = searchParams.get(paramName) ?? "";
    if (debouncedSearchTerm === activeParam) return;

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearchTerm.trim()) {
      params.set(paramName, debouncedSearchTerm.trim());
    } else {
      params.delete(paramName);
    }

    if (params.has("page")) {
      params.set("page", "1");
    }

    const newQuery = params.toString();
    const targetUrl = newQuery ? `${pathname}?${newQuery}` : pathname;

    router.replace(targetUrl, { scroll: false });
  }, [
    debouncedSearchTerm,
    isControlled,
    controlledOnChange,
    paramName,
    pathname,
    router,
    searchParams,
  ]);

  return (
    <div className={cn("relative w-full", className)}>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <Search className="size-4 text-muted-foreground" />
      </div>

      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="h-10 w-full rounded-xl border border-border bg-card pr-9 pl-9 text-sm text-foreground placeholder:text-muted-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary shadow-none"
      />
    </div>
  );
}
