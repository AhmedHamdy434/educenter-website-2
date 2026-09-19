import { ApiResponse } from "@/types";
import { toast } from "sonner";

export const handleResponseToast = <T>(result: ApiResponse<T>) => {
  if (result.success) {
    toast.success(result.message || "تمت العملية بنجاح");
  } else {
    toast.error(result.message || "حدث خطأ ما");
  }
};
