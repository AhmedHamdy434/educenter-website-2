"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/common/Loading";
import { QueryErrorState } from "@/components/common/QueryErrorState";
import { Settings, Save, RotateCcw } from "lucide-react";
import { useCenterSettingsQuery } from "../hooks/queries";
import { useUpdateCenterSettingsMutation } from "../hooks/mutations";
import { FinancialDistributionSection } from "./FinancialDistributionSection";
import { GeneralCenterSettingsSection } from "./GeneralCenterSettingsSection";
import { CenterSettings } from "../types";

export function OwnerSettingsClient() {
  const { data: settings, isLoading, isError, error, refetch } = useCenterSettingsQuery();
  const updateMutation = useUpdateCenterSettingsMutation();

  const [userEdits, setUserEdits] = useState<Partial<CenterSettings> | null>(null);

  if (isLoading) {
    return <Loading message="جاري تحميل إعدادات المركز..." />;
  }

  if (isError || !settings) {
    return (
      <QueryErrorState
        errorMessage={error instanceof Error ? error.message : "فشل تحميل الإعدادات"}
        onRetry={refetch}
      />
    );
  }

  const formData: CenterSettings = userEdits ? { ...settings, ...userEdits } : settings;

  const handleDistributionChange = (teacherShare: number, centerShare: number) => {
    setUserEdits((prev) => ({
      ...prev,
      teacherSharePercentage: teacherShare,
      centerSharePercentage: centerShare,
    }));
  };

  const handleGeneralChange = (updates: Partial<CenterSettings>) => {
    setUserEdits((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const handleReset = () => {
    setUserEdits(null);
  };

  const handleSave = () => {
    if (!userEdits) return;
    updateMutation.mutate(formData, {
      onSuccess: () => {
        setUserEdits(null);
      },
    });
  };

  const isDirty = userEdits !== null;

  return (
    <div className="space-y-6 text-right pb-12">
      <PageHeader
        title="إعدادات المركز"
        description="إدارة السياسات التشغيلية والمالية ونسب توزيع العوائد بين السنتر والمعلمين."
        icon={Settings}
      >
        <div className="flex items-center gap-2">
          {isDirty && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={updateMutation.isPending}
              className="gap-1.5"
            >
              <RotateCcw className="size-4" />
              تراجع
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
            className="gap-1.5 font-bold"
          >
            <Save className="size-4" />
            {updateMutation.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        <FinancialDistributionSection
          teacherShare={formData.teacherSharePercentage}
          centerShare={formData.centerSharePercentage}
          onChange={handleDistributionChange}
        />

        <GeneralCenterSettingsSection
          allowStudentCreditAdvance={formData.allowStudentCreditAdvance}
          currency={formData.currency}
          receiptNotes={formData.receiptNotes}
          onChange={handleGeneralChange}
        />
      </div>
    </div>
  );
}
