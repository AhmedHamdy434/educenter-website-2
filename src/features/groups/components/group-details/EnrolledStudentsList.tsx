"use client";

import { useState, useMemo } from "react";
import { Users, UserMinus, CreditCard, Link2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TableSearch } from "@/components/common/TableSearch";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ParentLinkModal } from "@/features/students/components/ParentLinkModal";
import { type GroupDetails } from "../../types";
import { type Student } from "@/features/students/types";

interface EnrolledStudentsListProps {
  students: GroupDetails["students"];
  onRemoveStudent: (studentId: string) => Promise<void>;
  isRemovePending: boolean;
  showRemoveButton?: boolean;
  onViewPayments?: (
    studentId: string,
    studentName: string,
    groupStudentId?: string
  ) => void;
}

export function EnrolledStudentsList({
  students,
  onRemoveStudent,
  isRemovePending,
  showRemoveButton = true,
  onViewPayments,
}: EnrolledStudentsListProps) {
  const [search, setSearch] = useState("");
  const [magicLinkStudent, setMagicLinkStudent] = useState<Student | null>(null);
  const [selectedStudentForRemove, setSelectedStudentForRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Filter students by name, phone, or parent phone
  const filteredStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.student.user.fullName.toLowerCase().includes(search.toLowerCase()) ||
        s.student.user.phone.includes(search) ||
        s.student.parentPhone.includes(search)
    );
  }, [students, search]);

  const handleConfirmRemove = async () => {
    if (selectedStudentForRemove) {
      await onRemoveStudent(selectedStudentForRemove.id);
      setSelectedStudentForRemove(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Search & Count Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Users className="size-5 text-primary" />
          <h2 className="font-bold text-foreground text-base">
            قائمة الطلاب المسجلين ({students.length})
          </h2>
        </div>

        <div className="w-full sm:w-72">
          <TableSearch
            placeholder="ابحث بالاسم أو رقم الهاتف..."
            value={search}
            onChange={setSearch}
          />
        </div>
      </div>

      {/* Students List Container */}
      <Card className="p-0 border border-border bg-card shadow-none overflow-hidden rounded-xl">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead className="bg-secondary/60 border-b border-border text-foreground text-xs font-bold">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">اسم الطالب</th>
                  <th className="p-4">رقم الهاتف</th>
                  <th className="p-4">هاتف ولي الأمر</th>
                  <th className="p-4">تاريخ الانضمام</th>
                  <th className="p-4 text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-foreground">
                {filteredStudents.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4 font-semibold text-muted-foreground text-xs">
                      {index + 1}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {item.student.user.fullName}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs font-mono">
                      {item.student.user.phone}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs font-mono">
                      {item.student.parentPhone}
                    </td>
                    <td className="p-4 text-muted-foreground text-xs">
                      {new Date(item.joinedAt).toLocaleDateString("ar-EG")}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setMagicLinkStudent(item.student as unknown as Student)}
                          className="h-8 gap-1 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300 rounded-lg text-xs"
                          title="توليد رابط تقرير ولي الأمر"
                        >
                          <Link2 className="size-3.5" />
                          <span>ولي الأمر</span>
                        </Button>

                        {onViewPayments && (
                          <Button
                            type="button"
                            variant="brandOutline"
                            size="sm"
                            onClick={() =>
                              onViewPayments(
                                item.student.id,
                                item.student.user.fullName,
                                item.id
                              )
                            }
                            className="h-8 gap-1.5 text-xs rounded-lg"
                          >
                            <CreditCard className="size-3.5 text-primary" />
                            <span>سجل الدفع</span>
                          </Button>
                        )}

                        {showRemoveButton && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setSelectedStudentForRemove({
                                id: item.student.id,
                                name: item.student.user.fullName,
                              })
                            }
                            className="h-8 gap-1 text-destructive hover:bg-destructive/10 rounded-lg text-xs"
                          >
                            <UserMinus className="size-3.5" />
                            <span>إلغاء</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Users className="size-10 mx-auto text-muted-foreground/30 mb-2" />
            <p className="font-semibold text-sm">
              {search
                ? "لا يوجد طلاب يطابقون معايير البحث."
                : "لم يتم تسجيل أي طلاب في هذه المجموعة بعد."}
            </p>
          </div>
        )}
      </Card>

      {/* Parent Magic Link Modal */}
      <ParentLinkModal
        isOpen={!!magicLinkStudent}
        onClose={() => setMagicLinkStudent(null)}
        student={magicLinkStudent}
      />

      {/* Confirmation Dialog for Removing Student */}
      {selectedStudentForRemove && (
        <ConfirmDialog
          isOpen={!!selectedStudentForRemove}
          onClose={() => setSelectedStudentForRemove(null)}
          onConfirm={handleConfirmRemove}
          title="إلغاء تسجيل الطالب من المجموعة"
          description={`هل أنت متأكد من إلغاء تسجيل الطالب "${selectedStudentForRemove.name}" من هذه المجموعة الدراسية؟`}
          confirmLabel="نعم، إلغاء التسجيل"
          cancelLabel="تراجع"
          isLoading={isRemovePending}
        />
      )}
    </div>
  );
}
