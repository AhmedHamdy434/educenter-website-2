"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sliders, Receipt, Clock, Coins } from "lucide-react";

interface GeneralCenterSettingsSectionProps {
  allowStudentCreditAdvance: boolean;
  currency: string;
  receiptNotes?: string | null;
  onChange: (updates: {
    allowStudentCreditAdvance?: boolean;
    currency?: string;
    receiptNotes?: string | null;
  }) => void;
}

export function GeneralCenterSettingsSection({
  allowStudentCreditAdvance,
  currency,
  receiptNotes,
  onChange,
}: GeneralCenterSettingsSectionProps) {
  return (
    <Card className="p-6 space-y-6 border-border bg-card">
      <div className="border-b border-border pb-4">
        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
          <Sliders className="size-5 text-primary" />
          سياسات التحصيل والعمليات التشغيلية
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          تحكم في سياسة إدارة أرصدة الطلاب الدائنة وإعدادات الإيصالات المالية.
        </p>
      </div>

      <div className="space-y-5 divide-y divide-border/60">
        {/* Advance Student Credit */}
        <div className="flex items-center justify-between pt-3 first:pt-0">
          <div className="space-y-0.5 max-w-[80%]">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              السماح بأرصدة الطلاب الدائنة والدفع المسبق
            </Label>
            <p className="text-xs text-muted-foreground">
              تمكين الكاشير من تحصيل مبالغ تفوق الاستحقاق الحالي وحفظ الفائض كرصيد دائن للطالب وتخصيصه تلقائياً للشهور اللاحقة.
            </p>
          </div>
          <Switch
            checked={allowStudentCreditAdvance}
            onCheckedChange={(checked) => onChange({ allowStudentCreditAdvance: checked })}
          />
        </div>

        {/* Currency Setting */}
        <div className="flex items-center justify-between pt-4">
          <div className="space-y-0.5 max-w-[70%]">
            <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Coins className="size-4 text-primary" />
              العملة الرسمية للمركز
            </Label>
            <p className="text-xs text-muted-foreground">
              الرمز النقدي المعتمد في الفواتير وكشوف الحسابات.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Input
              value={currency}
              onChange={(e) => onChange({ currency: e.target.value.toUpperCase() })}
              className="w-24 text-center font-bold font-mono"
            />
          </div>
        </div>

        {/* Receipt Notes */}
        <div className="space-y-2 pt-4">
          <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Receipt className="size-4 text-primary" />
            بيان وملاحظات الإيصالات المالية الافتراضية
          </Label>
          <p className="text-xs text-muted-foreground">
            نص ثابت يظهر في أسفل إيصالات القبض الورقية أو الرقمية المسلمة للطلاب.
          </p>
          <Textarea
            value={receiptNotes || ""}
            onChange={(e) => onChange({ receiptNotes: e.target.value })}
            placeholder="مثال: يرجى الاحتفاظ بالإيصال لإثبات سداد الاشتراك الشهري..."
            rows={2}
            className="text-xs"
          />
        </div>
      </div>
    </Card>
  );
}
