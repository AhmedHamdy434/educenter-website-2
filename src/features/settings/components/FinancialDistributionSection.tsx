"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Calculator, Percent } from "lucide-react";

interface FinancialDistributionSectionProps {
  teacherShare: number;
  centerShare: number;
  onChange: (teacherShare: number, centerShare: number) => void;
}

export function FinancialDistributionSection({
  teacherShare,
  centerShare,
  onChange,
}: FinancialDistributionSectionProps) {
  const [simulationAmount, setSimulationAmount] = React.useState<number>(500);

  const handleTeacherChange = (val: number) => {
    const clampedTeacher = Math.min(100, Math.max(0, val));
    const clampedCenter = 100 - clampedTeacher;
    onChange(clampedTeacher, clampedCenter);
  };

  const handleCenterChange = (val: number) => {
    const clampedCenter = Math.min(100, Math.max(0, val));
    const clampedTeacher = 100 - clampedCenter;
    onChange(clampedTeacher, clampedCenter);
  };

  const simulatedTeacherAmount = ((simulationAmount * teacherShare) / 100).toFixed(2);
  const simulatedCenterAmount = ((simulationAmount * centerShare) / 100).toFixed(2);

  return (
    <Card className="p-6 space-y-6 border-border bg-card">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Percent className="size-5 text-primary" />
            توزيع العوائد المالية (نسبة المعلم والسنتر)
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            حدد النسبة المئوية الافتراضية لاقتسام رسوم الاشتراكات بين السنتر والمعلمين.
          </p>
        </div>
      </div>

      {/* Visual Proportion Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-semibold">
          <span className="text-primary flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-primary inline-block" />
            نسبة المعلم: {teacherShare}%
          </span>
          <span className="text-amber-600 flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-amber-500 inline-block" />
            نسبة السنتر: {centerShare}%
          </span>
        </div>
        <div className="h-5 w-full bg-secondary rounded-full overflow-hidden flex border border-border/50 shadow-inner">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${teacherShare}%` }}
          />
          <div
            className="h-full bg-amber-500 transition-all duration-300"
            style={{ width: `${centerShare}%` }}
          />
        </div>
      </div>

      {/* Inputs & Dual Slider */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2 bg-secondary/30 p-4 rounded-xl border border-border/40">
          <Label className="text-sm font-semibold text-foreground">
            نسبة المعلم (%)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              value={teacherShare}
              onChange={(e) => handleTeacherChange(Number(e.target.value) || 0)}
              className="text-center font-bold text-lg"
            />
            <span className="text-sm font-bold text-muted-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            المبلغ المستحق للمعلم من كل اشتراك يتم تحصيله.
          </p>
        </div>

        <div className="space-y-2 bg-secondary/30 p-4 rounded-xl border border-border/40">
          <Label className="text-sm font-semibold text-foreground">
            نسبة السنتر (%)
          </Label>
          <div className="flex items-center gap-3">
            <Input
              type="number"
              min={0}
              max={100}
              step={1}
              value={centerShare}
              onChange={(e) => handleCenterChange(Number(e.target.value) || 0)}
              className="text-center font-bold text-lg"
            />
            <span className="text-sm font-bold text-muted-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground">
            حصة المركز التشغيلية من قيمة كل اشتراك.
          </p>
        </div>
      </div>

      {/* Interactive Simulation Card */}
      <div className="bg-primary/5 rounded-xl p-4 border border-primary/15 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-primary flex items-center gap-1.5">
            <Calculator className="size-4" />
            محاكاة حسابية فورية للتوزيع:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">المبلغ التجريبي:</span>
            <Input
              type="number"
              value={simulationAmount}
              onChange={(e) => setSimulationAmount(Number(e.target.value) || 0)}
              className="w-24 h-8 text-center text-xs font-bold bg-background"
            />
            <span className="text-xs font-semibold">ج.م</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-card p-3 rounded-lg border border-border shadow-xs">
            <div className="text-xs text-muted-foreground">مستحق المعلم</div>
            <div className="text-lg font-black text-primary mt-1">
              {simulatedTeacherAmount} <span className="text-xs font-normal">ج.م</span>
            </div>
          </div>
          <div className="bg-card p-3 rounded-lg border border-border shadow-xs">
            <div className="text-xs text-muted-foreground">حصة السنتر الإجمالية</div>
            <div className="text-lg font-black text-amber-600 mt-1">
              {simulatedCenterAmount} <span className="text-xs font-normal">ج.م</span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Note */}
      <div className="flex items-start gap-3 p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs leading-relaxed">
        <AlertCircle className="size-4.5 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">قاعدة تجميد النسب (Locked Snapshot): </span>
          تعديل النسب يسري فورياً على الالتزامات والتحصيلات الجديدة فقط. المعاملات والاشتراكات السابقة تحتفظ بنسبها التاريخية المحسوبة وقت القبض لضمان الدقة المحاسبية وعدم التلاعب في سجلات المعلمين.
        </div>
      </div>
    </Card>
  );
}
