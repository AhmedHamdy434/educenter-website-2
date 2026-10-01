"use client";

import { useState, useRef } from "react";
import { ChevronDown, X, Check, Search, Loader2 } from "lucide-react";
import { FormSelect, type SelectOption } from "@/components/common/form-select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { useSubjectsOptionsQuery } from "@/features/subjects/hooks/queries";
import { cn } from "@/lib/utils";

export interface SelectedSubject {
  id: string;
  name: string;
  gradeName: string;
}

interface SubjectPickerProps {
  gradesOptions: SelectOption[];
  isGradesLoading?: boolean;
  selectedSubjects: SelectedSubject[];
  onAdd: (subject: SelectedSubject) => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
  error?: string;
  isOpen: boolean;
}

export function SubjectPicker({
  gradesOptions,
  isGradesLoading,
  selectedSubjects,
  onAdd,
  onRemove,
  onClearAll,
  error,
  isOpen,
}: SubjectPickerProps) {
  const [selectedGradeId, setSelectedGradeId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const { data: gradeSubjects = [], isLoading: isSubjectsLoading } =
    useSubjectsOptionsQuery(
      selectedGradeId || undefined,
      isOpen && Boolean(selectedGradeId),
    );

  const selectedIds = selectedSubjects.map((s) => s.id);
  const activeGradeCount = gradeSubjects.filter((s) =>
    selectedIds.includes(s.value),
  ).length;

  const filteredSubjects = gradeSubjects.filter((opt) =>
    (opt.name || opt.label).toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleToggle = (opt: {
    value: string;
    label: string;
    name?: string;
    gradeName?: string;
  }) => {
    if (selectedIds.includes(opt.value)) {
      onRemove(opt.value);
    } else {
      const gradeName =
        opt.gradeName ||
        gradesOptions.find((g) => g.value === selectedGradeId)?.label ||
        "";
      const name =
        opt.name ||
        opt.label.replace(/\s*\(.*?\)\s*$/, "").trim() ||
        opt.label;
      onAdd({ id: opt.value, name, gradeName });
    }
  };

  return (
    <div className="space-y-3 rounded-xl border border-border bg-secondary/10 p-3.5">
      {/* Grade + Subject Dropdowns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Grade Selector */}
        <div className="space-y-1">
          <Label className="text-xs font-semibold text-muted-foreground block text-right select-none">
            المرحلة الدراسية
          </Label>
          <FormSelect
            name="gradeSelector"
            value={selectedGradeId}
            onValueChange={(val) => {
              setSelectedGradeId(val);
              setSearchQuery("");
            }}
            options={gradesOptions}
            isLoading={isGradesLoading}
            placeholder="اختر المرحلة لعرض موادها..."
          />
        </div>

        {/* Subjects Dropdown for Active Grade */}
        <div className="space-y-1 relative" ref={dropdownRef}>
          <Label className="text-xs font-semibold text-muted-foreground block text-right select-none">
            المواد الدراسية في هذه المرحلة
          </Label>
          <button
            type="button"
            disabled={!selectedGradeId || isSubjectsLoading}
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            className={cn(
              "w-full min-h-11 px-4 py-2.5 rounded-xl border border-input bg-card text-foreground text-sm font-medium outline-none transition-all text-right flex items-center justify-between shadow-none cursor-pointer",
              (!selectedGradeId || isSubjectsLoading) &&
                "opacity-60 cursor-not-allowed bg-muted",
            )}
          >
            <span className="text-xs text-muted-foreground">
              {isSubjectsLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" />
                  جاري تحميل المواد...
                </span>
              ) : !selectedGradeId ? (
                "اختر المرحلة أولاً"
              ) : gradeSubjects.length === 0 ? (
                "لا توجد مواد لهذه المرحلة"
              ) : activeGradeCount === 0 ? (
                "اختر المواد التي يدرسها..."
              ) : (
                <span className="text-foreground font-bold bg-secondary px-2.5 py-1 rounded-md border border-border">
                  تم اختيار {activeGradeCount} مادة من هذه المرحلة
                </span>
              )}
            </span>
            <ChevronDown
              className={cn(
                "size-4 text-muted-foreground transition-transform duration-200 shrink-0 mr-2",
                isDropdownOpen && "rotate-180 text-primary",
              )}
            />
          </button>

          {isDropdownOpen && selectedGradeId && !isSubjectsLoading && (
            <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-border bg-card shadow-lg p-1.5 animate-in fade-in-50 zoom-in-95 duration-100 flex flex-col max-h-64">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40 rounded-lg mb-1">
                <Search className="size-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="ابحث عن مادة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-xs text-foreground placeholder:text-muted-foreground outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="overflow-y-auto flex-1 py-1 max-h-48 space-y-0.5">
                {filteredSubjects.length > 0 ? (
                  filteredSubjects.map((opt) => {
                    const isSelected = selectedIds.includes(opt.value);
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => handleToggle(opt)}
                        className={cn(
                          "w-full px-3 py-2 text-right text-xs font-semibold rounded-lg transition-colors flex items-center justify-between cursor-pointer",
                          isSelected
                            ? "bg-secondary text-primary font-bold"
                            : "text-foreground hover:bg-muted",
                        )}
                      >
                        <span>{opt.name || opt.label}</span>
                        {isSelected && (
                          <Check className="size-4 text-primary shrink-0" />
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-4 py-3 text-center text-xs text-muted-foreground">
                    لا توجد مواد مطابقة.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Subjects Display */}
      <div className="space-y-2 pt-1 border-t border-border/60">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-muted-foreground">
            المواد المختارة ({selectedSubjects.length}):
          </span>
          {selectedSubjects.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-destructive hover:underline cursor-pointer"
            >
              مسح الكل
            </button>
          )}
        </div>

        {selectedSubjects.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground bg-background/50">
            لم يتم اختيار أي مواد بعد. اختر المرحلة ثم حدد المواد التي يدرسها المعلم.
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 rounded-lg border border-border bg-card p-2.5 max-h-36 overflow-y-auto">
            {selectedSubjects.map((sub) => (
              <div
                key={sub.id}
                className="inline-flex items-center gap-1.5 bg-secondary text-primary border border-border px-2.5 py-1 rounded-md text-xs font-bold select-none animate-in zoom-in-95 duration-100"
              >
                <span>{sub.name}</span>
                {sub.gradeName && (
                  <Badge
                    variant="outline"
                    className="px-1.5 py-0 text-[10px] bg-background/80 font-normal text-muted-foreground border-border"
                  >
                    {sub.gradeName}
                  </Badge>
                )}
                <button
                  type="button"
                  aria-label={`إزالة ${sub.name}`}
                  onClick={() => onRemove(sub.id)}
                  className="hover:bg-primary/10 rounded p-0.5 transition-colors text-primary cursor-pointer mr-0.5"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {error && (
          <p className="text-xs text-destructive font-semibold">{error}</p>
        )}
      </div>
    </div>
  );
}
