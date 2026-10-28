"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  ScanLine,
  Search,
  X,
  UserCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SessionStudent, AttendanceStatus } from "@/features/attendance/types";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface AttendanceScannerBarProps {
  students: SessionStudent[];
  isProcessing: boolean;
  onStudentRecorded: (student: SessionStudent) => void | Promise<boolean | void>;
}

// Helper to normalize Arabic text for resilient search
function normalizeArabic(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[\u064B-\u065F]/g, ""); // strip tashkeel
}

export function AttendanceScannerBar({
  students,
  isProcessing,
  onStudentRecorded,
}: AttendanceScannerBarProps) {
  // Scanner state
  const [scannedCode, setScannedCode] = useState("");
  const scannerInputRef = useRef<HTMLInputElement>(null);

  // Manual search state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(0);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(searchContainerRef, () => setIsSearchOpen(false));

  // Focus scanner input on mount and when autoFocusEnabled is on
  useEffect(() => {
    if (scannerInputRef.current) {
      scannerInputRef.current.focus();
    }
  }, []);

  // Method to refocus scanner
  const refocusScanner = useCallback(() => {
    if (scannerInputRef.current) {
      setTimeout(() => {
        scannerInputRef.current?.focus();
      }, 50);
    }
  }, []);

  // Normalize code for comparison
  const normalizeCode = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    return {
      raw: trimmed,
      withoutPrefix: trimmed.replace(/^STU-/, ""),
      withPrefix: trimmed.startsWith("STU-") ? trimmed : `STU-${trimmed}`,
    };
  };

  // Find a student by scanned code, studentId, or phone
  const findStudentByCode = useCallback(
    (code: string): SessionStudent | undefined => {
      const { raw, withoutPrefix, withPrefix } = normalizeCode(code);
      if (!raw) return undefined;

      return students.find((s) => {
        if (!s.studentCode && !s.phone && !s.studentId) return false;
        const studentCodeUpper = s.studentCode?.trim().toUpperCase() || "";
        const studentCodeNoPrefix = studentCodeUpper.replace(/^STU-/, "");

        return (
          studentCodeUpper === raw ||
          studentCodeUpper === withPrefix ||
          studentCodeNoPrefix === withoutPrefix ||
          s.phone?.trim() === raw ||
          s.studentId === raw
        );
      });
    },
    [students]
  );

  // Handle Scanner submission
  const handleScannerSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const code = scannedCode.trim();
    if (!code || isProcessing) return;

    const student = findStudentByCode(code);

    if (!student) {
      toast.error(`كود الطالب (${code}) غير موجود في هذه المجموعة.`);
      setScannedCode("");
      refocusScanner();
      return;
    }

    if (student.status === AttendanceStatus.PRESENT) {
      toast.info(`الطالب "${student.fullName}" مسجل حضوره بالفعل.`);
      setScannedCode("");
      refocusScanner();
      return;
    }

    // Process attendance
    setScannedCode("");
    await onStudentRecorded(student);
    refocusScanner();
  };

  // Handle KeyDown on Scanner Input (Enter / Tab)
  const handleScannerKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      handleScannerSubmit();
    }
  };

  // Filtered students for manual search
  const searchResults = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return [];

    const normQ = normalizeArabic(q);
    const upperQ = q.toUpperCase();

    return students.filter((s) => {
      const normName = normalizeArabic(s.fullName);
      const studentCode = (s.studentCode || "").toUpperCase();
      const phone = s.phone || "";

      return (
        normName.includes(normQ) ||
        studentCode.includes(upperQ) ||
        phone.includes(q)
      );
    });
  }, [students, searchQuery]);

  // Handle selection from manual search
  const handleSelectStudentFromSearch = async (student: SessionStudent) => {
    if (isProcessing) return;

    if (student.status === AttendanceStatus.PRESENT) {
      toast.info(`الطالب "${student.fullName}" مسجل حضوره بالفعل.`);
      setSearchQuery("");
      setIsSearchOpen(false);
      refocusScanner();
      return;
    }

    setSearchQuery("");
    setIsSearchOpen(false);
    await onStudentRecorded(student);
    refocusScanner();
  };

  // Handle KeyDown on Manual Search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSearchIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSearchIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = searchResults[selectedSearchIndex];
      if (selected) {
        handleSelectStudentFromSearch(selected);
      }
    } else if (e.key === "Escape") {
      setIsSearchOpen(false);
    }
  };

  return (
    <Card className="p-4 bg-secondary/30 border border-border rounded-xl shadow-none">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
        {/* Left Side (Desktop): Barcode / QR Scanner Input */}
        <div className="col-span-1 lg:col-span-7 space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <label
              htmlFor="barcode-scanner-input"
              className="text-xs font-bold text-foreground flex items-center gap-1.5"
            >
              <ScanLine className="size-4 text-primary animate-pulse" />
              <span>قارئ الباركود والـ QR (Scanner)</span>
              <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                جاهز للمسح
              </span>
            </label>
          </div>

          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <Input
                id="barcode-scanner-input"
                ref={scannerInputRef}
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                onKeyDown={handleScannerKeyDown}
                placeholder="امسح الباركود أو اكتب الكود ثم اضغط Enter..."
                disabled={isProcessing}
                className="h-10 pr-9 pl-3 text-sm font-mono bg-card border-border focus:border-primary focus:ring-primary/20 rounded-lg placeholder:font-sans placeholder:text-xs placeholder:text-muted-foreground"
                autoComplete="off"
              />
              <ScanLine className="size-4 text-muted-foreground absolute right-3 top-3 pointer-events-none" />
              {scannedCode && (
                <button
                  type="button"
                  onClick={() => {
                    setScannedCode("");
                    refocusScanner();
                  }}
                  className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>

            <Button
              type="button"
              onClick={() => handleScannerSubmit()}
              disabled={isProcessing || !scannedCode.trim()}
              variant="brand"
              className="h-10 px-4 rounded-lg font-bold text-xs whitespace-nowrap cursor-pointer shrink-0"
            >
              {isProcessing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                "تسجيل الكود"
              )}
            </Button>
          </div>
        </div>

        {/* Right Side (Desktop): Manual Search */}
        <div
          ref={searchContainerRef}
          className="col-span-1 lg:col-span-5 space-y-1.5 relative"
        >
          <div className="flex items-center justify-between">
            <label
              htmlFor="manual-search-input"
              className="text-xs font-bold text-foreground flex items-center gap-1.5"
            >
              <Search className="size-3.5 text-muted-foreground" />
              <span>بحث يدوي سريع عن طالب</span>
            </label>
            {searchQuery && (
              <span className="text-[11px] text-muted-foreground font-medium">
                {searchResults.length} نتيجة
              </span>
            )}
          </div>

          <div className="relative">
            <Input
              id="manual-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
                setSelectedSearchIndex(0);
              }}
              onFocus={() => {
                if (searchQuery.trim()) setIsSearchOpen(true);
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder="ابحث بالاسم، الهاتف، أو الكود..."
              className="h-10 pr-9 pl-8 text-sm bg-card border-border focus:border-primary focus:ring-primary/20 rounded-lg placeholder:text-xs placeholder:text-muted-foreground"
              autoComplete="off"
            />
            <Search className="size-4 text-muted-foreground absolute right-3 top-3 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
                className="absolute left-3 top-3 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown Popover */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-lg z-50 max-h-72 overflow-y-auto divide-y divide-border">
              {searchResults.length > 0 ? (
                searchResults.map((student, idx) => {
                  const isPresent =
                    student.status === AttendanceStatus.PRESENT;
                  const isSelected = idx === selectedSearchIndex;

                  return (
                    <button
                      key={student.studentId}
                      type="button"
                      onClick={() => handleSelectStudentFromSearch(student)}
                      className={`w-full p-2.5 text-right flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isSelected ? "bg-muted/80" : "hover:bg-muted/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="size-8 rounded-full bg-secondary text-primary border border-border flex items-center justify-center font-bold text-xs shrink-0">
                          {student.fullName.substring(0, 2)}
                        </div>
                        <div className="flex flex-col overflow-hidden text-right">
                          <span className="font-bold text-foreground text-xs truncate">
                            {student.fullName}
                          </span>
                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-mono">
                            {student.studentCode && (
                              <Badge
                                variant="subtle"
                                className="px-1.5 py-0 text-[10px] font-mono h-4"
                              >
                                {student.studentCode}
                              </Badge>
                            )}
                            <span dir="ltr">{student.phone}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5">
                        {isPresent ? (
                          <Badge
                            variant="subtle"
                            className="bg-emerald-50 text-emerald-800 border-emerald-200 text-[11px] gap-1 font-bold"
                          >
                            <CheckCircle2 className="size-3" />
                            <span>حاضر</span>
                          </Badge>
                        ) : student.status ? (
                          <Badge variant="subtle" className="text-[11px] font-bold">
                            {student.status}
                          </Badge>
                        ) : (
                          <Badge
                            variant="default"
                            className="h-7 px-2.5 text-[11px] rounded-lg font-bold flex items-center gap-1 bg-primary text-primary-foreground shadow-xs pointer-events-none"
                          >
                            <UserCheck className="size-3" />
                            <span>تحضير</span>
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-foreground">
                    لا يوجد طالب يطابق البحث
                  </p>
                  <p className="text-[11px]">
                    تأكد من كتابة الاسم أو رقم الهاتف أو كود الطالب بشكل صحيح.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
