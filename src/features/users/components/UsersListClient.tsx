"use client";

import { useMemo, useCallback } from "react";
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
import { STATUSES } from "@/constants/dropdown-options";
import { type UserListItem, type UserFilterParams } from "../types";
import { type ApiResponse } from "@/types";

interface UserFilters {
  active?: string;
  role?: string;
}

interface UsersListClientProps {
  initialData: ApiResponse<UserListItem[]>;
}

export function UsersListClient({ initialData }: UsersListClientProps) {
  const {
    page,
    limit,
    search,
    active,
    role,
    sortBy,
    sortOrder,
    sorting,
    onSortingChange,
    updateQuery,
  } = useTableFilters<UserFilters>();

  const queryParams: UserFilterParams = {
    page,
    limit,
    search,
    active,
    role,
    sortBy,
    sortOrder,
  };

  const { data, isLoading } = useUsersQuery(queryParams, initialData);

  const users = data?.data || [];

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
          <TableSearch placeholder="ابحث بالاسم أو البريد أو الهاتف..." />
          <div className="flex flex-wrap items-center gap-3">
            <FilterDropdown
              placeholder="نوع الحساب"
              value={role || ""}
              onChange={(val) =>
                updateQuery({
                  role: val || undefined,
                  page: 1,
                })
              }
              options={[
                { label: "معلم", value: "TEACHER" },
                { label: "طالب", value: "STUDENT" },
              ]}
              allOptionLabel="كل الأدوار"
            />
            <FilterDropdown
              placeholder="حالة الحساب"
              value={active || ""}
              onChange={(val) =>
                updateQuery({
                  active: val || undefined,
                  page: 1,
                })
              }
              options={STATUSES}
            />
          </div>
        </div>

        <SharedTable
          columns={columns}
          data={users}
          isLoading={isLoading}
          meta={data?.meta}
          sorting={sorting}
          onSortingChange={onSortingChange}
          emptyMessage="لم يتم العثور على أي مستخدمين مطابقين لمعايير البحث."
        />
      </Card>
    </div>
  );
}

