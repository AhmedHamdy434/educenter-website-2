import { Button } from "@/components/ui/button";

interface FormActionsProps {
  onCancel?: () => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  submitDisabled?: boolean;
}

export function FormActions({
  onCancel,
  isLoading = false,
  isSubmitting = false,
  submitLabel = "حفظ البيانات",
  cancelLabel = "إلغاء",
  submitDisabled = false,
}: FormActionsProps) {
  const loading = isLoading || isSubmitting;

  return (
    <div className="flex items-center justify-end gap-3 border-t border-border pt-5 mt-6">
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          className="border-border text-foreground hover:bg-muted font-medium"
        >
          {cancelLabel}
        </Button>
      )}

      <Button
        type="submit"
        variant="brand"
        disabled={loading || submitDisabled}
        className="font-bold shadow-none"
      >
        {loading ? "جاري الحفظ..." : submitLabel}
      </Button>
    </div>
  );
}
