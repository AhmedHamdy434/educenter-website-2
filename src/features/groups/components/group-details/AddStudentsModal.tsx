"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SharedModal } from "@/components/common/SharedModal";
import { TableSearch } from "@/components/common/TableSearch";
import { Loading } from "@/components/common/Loading";
import { FormDatePicker } from "@/components/common/form-date-picker";
import { getStudents } from "@/features/students/actions/students-actions";

interface AddStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradeId: string;
  gradeName: string;
  enrolledStudentIds: Set<string>;
  onAddStudents: (studentIds: string[], subscriptionStartDate?: string) => Promise<void>;
  isAddPending: boolean;
}

export function AddStudentsModal({
  isOpen,
  onClose,
  gradeId,
  gradeName,
  enrolledStudentIds,
  onAddStudents,
  isAddPending,
}: AddStudentsModalProps) {
  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [modalSearch, setModalSearch] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(getTodayDateString);
  const [dateError, setDateError] = useState("");

  // Fetch candidates (students in the same grade) when modal is opened
  const { data: candidatesResponse, isLoading: isCandidatesLoading } = useQuery({
    queryKey: ["students", "options", { gradeId }],
    queryFn: () => getStudents({ gradeId, limit: 100 }),
    enabled: isOpen && !!gradeId,
  });

  const candidatesData = candidatesResponse?.data;

  // Filter out students who are already enrolled in this group
  const candidates = useMemo(() => {
    const list = candidatesData || [];
    return list.filter((s) => !enrolledStudentIds.has(s.id));
  }, [candidatesData, enrolledStudentIds]);

  // Client-side search for candidates inside the modal
  const filteredCandidates = useMemo(() => {
    return candidates.filter(
      (c) =>
        c.user.fullName.toLowerCase().includes(modalSearch.toLowerCase()) ||
        c.user.phone.includes(modalSearch)
    );
  }, [candidates, modalSearch]);

  const toggleSelectStudent = (id: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAllCandidates = () => {
    if (selectedStudentIds.length === filteredCandidates.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(filteredCandidates.map((c) => c.id));
    }
  };

  const handleClose = () => {
    setSelectedStudentIds([]);
    setSubscriptionStartDate(getTodayDateString());
    setDateError("");
    setModalSearch("");
    onClose();
  };

  const handleSave = async () => {
    if (selectedStudentIds.length === 0) return;
    if (!subscriptionStartDate) {
      setDateError("تاريخ بدء الاشتراك مطلوب");
      return;
    }
    await onAddStudents(selectedStudentIds, subscriptionStartDate);
    setSelectedStudentIds([]);
    setSubscriptionStartDate(getTodayDateString());
    setDateError("");
    setModalSearch("");
  };

  return (
    <SharedModal
      isOpen={isOpen}
      onClose={handleClose}
      title="إدراج طلاب في المجموعة الدراسية"
    >
      <div className="space-y-4 text-right" dir="rtl">
        <p className="text-xs text-muted-foreground">
          يتم عرض الطلاب النشطين المسجلين في مرحلة <strong className="text-foreground">{gradeName}</strong> والذين لم يتم تسجيلهم في هذه المجموعة بعد.
        </p>

        <div className="w-full">
          <TableSearch
            placeholder="ابحث عن طالب بالاسم أو الهاتف..."
            value={modalSearch}
            onChange={setModalSearch}
          />
        </div>

        <FormDatePicker
          label="تاريخ بدء الاشتراك"
          placeholder="اختر تاريخ بدء الاشتراك..."
          value={subscriptionStartDate}
          onChange={(val) => {
            setSubscriptionStartDate(val);
            if (val) setDateError("");
          }}
          required
          error={dateError}
        />

        {/* Candidates list content */}
        {isCandidatesLoading ? (
          <Loading message="جاري تحميل قائمة الطلاب..." />
        ) : filteredCandidates.length > 0 ? (
          <div className="space-y-3">
            {/* Select All checkbox bar */}
            <div className="flex items-center justify-between bg-secondary/50 px-3 py-2 rounded-lg border border-border text-xs font-bold text-foreground">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="select-all"
                  checked={
                    selectedStudentIds.length === filteredCandidates.length &&
                    filteredCandidates.length > 0
                  }
                  onChange={toggleSelectAllCandidates}
                  className="size-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                />
                <label htmlFor="select-all" className="cursor-pointer select-none">
                  تحديد الكل ({filteredCandidates.length})
                </label>
              </div>
              <span>تم اختيار {selectedStudentIds.length} طالب</span>
            </div>

            {/* Scrollable list */}
            <div className="max-h-60 overflow-y-auto border border-border rounded-xl divide-y divide-border pr-1 -mr-1">
              {filteredCandidates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => toggleSelectStudent(c.id)}
                  className="flex items-center gap-3 p-3 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedStudentIds.includes(c.id)}
                    onChange={() => {}}
                    className="size-4 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer shrink-0"
                  />
                  <div className="flex flex-col text-sm flex-1">
                    <span className="font-bold text-foreground">{c.user.fullName}</span>
                    <span className="text-xs text-muted-foreground font-mono">{c.user.phone}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground bg-secondary/20 border border-border rounded-xl">
            <Users className="size-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="font-bold text-foreground text-xs">لا يوجد طلاب متاحين</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {modalSearch
                ? "لا يوجد نتائج مطابقة للبحث."
                : "جميع طلاب هذا الصف مسجلون بالفعل في هذه المجموعة."}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 justify-end border-t border-border pt-4 mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            className="h-10 px-5 rounded-lg border-border text-foreground hover:bg-muted font-medium"
          >
            إلغاء
          </Button>
          <Button
            type="button"
            variant="brand"
            onClick={handleSave}
            disabled={selectedStudentIds.length === 0 || isAddPending}
            className="h-10 px-6 rounded-lg flex items-center gap-2 font-bold shadow-none"
          >
            {isAddPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              <>
                <Plus className="size-4" />
                إضافة الطلاب المحددين
              </>
            )}
          </Button>
        </div>
      </div>
    </SharedModal>
  );
}
