"use client";

import { useState, useMemo, useCallback } from "react";
import { UserCheck } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { TableSearch } from "@/components/common/TableSearch";
import { FilterDropdown } from "@/components/common/FilterDropdown";
import { SharedTable } from "@/components/common/SharedTable";
import { Card } from "@/components/ui/card";
import { getUserColumns } from "./columns";
import { useUsersQuery } from "../hooks/queries";
import { useUpdateUserStatusMutation } from "../hooks/mutations";
import { useTableFilters } from "@/hooks/useTableFilters";
import { type UserListItem } from "../types";
import { type ApiResponse } from "@/types";

interface UsersListClientProps {
  initialData: ApiResponse<UserListItem[]>;
}

export function UsersListClient({ initialData }: UsersListClientProps) {
  const [role, setRole] = useState<string>("");
  const {
    params,
    setPage,
    handleSearchChange,
    handleFilterChange,
    handleLimitChange,
  } = useTableFilters();

  const queryParams = useMemo(
    () => ({
      page: params.page,
      limit: params.limit,
      search: params.search,
      active: params.active,
      role: role || undefined,
    }),
    [params, role]
  );

  const { data, isLoading } = useUsersQuery(queryParams, initialData);

  const users = data?.data || [];
  const total = data?.meta?.total || users.length;
  const totalPages = data?.meta?.totalPages || 1;

  const updateStatusMutation = useUpdateUserStatusMutation();
  const togglingId = updateStatusMutation.isPending
    ? updateStatusMutation.variables?.id || null
    : null;

  const handleToggle = useCallback(
    (id: string, currentStatus: boolean) => {
      updateStatusMutation.mutate({ id, isActive: !currentStatus });
    },
    [updateStatusMutation]
  );

  const columns = useMemo(
    () =>
      getUserColumns({
        onToggleStatus: handleToggle,
        togglingId,
      }),
    [handleToggle, togglingId]
  );

  return (
    <div className="space-y-6 text-right" dir="rtl">
      {/* 1. Header */}
      <PageHeader
        title="مستخدمو المركز"
        description="عرض وتصفية جميع الحسابات التابعة للمركز (معلمين، طلاب، وإداريين) وإدارة حالة التفعيل."
        icon={UserCheck}
      />

      {/* 2. Filters & Table inside Container Card */}
      <Card className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-2">
          <TableSearch
            placeholder="ابحث بالاسم أو البريد أو الهاتف..."
            value={params.search}
            onChange={handleSearchChange}
          />
          <div className="flex items-center gap-3">
            <FilterDropdown
              placeholder="نوع الحساب"
              value={role}
              onChange={setRole}
              options={[
                { label: "معلم", value: "TEACHER" },
                { label: "طالب", value: "STUDENT" },
              ]}
            />
            <FilterDropdown
              placeholder="حالة الحساب"
              value={(params.active as unknown as string) || ""}
              onChange={(val) => handleFilterChange("active", val)}
              options={[
                { label: "نشط", value: "true" },
                { label: "معطل", value: "false" },
              ]}
            />
          </div>
        </div>

        <SharedTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          page={params.page}
          limit={params.limit}
          total={total}
          totalPages={totalPages}
          onPageChange={setPage}
          onLimitChange={handleLimitChange}
          emptyMessage="لم يتم العثور على أي مستخدمين مطابقين لمعايير البحث."
        />
      </Card>
    </div>
  );
}
