export interface SelectOption {
  value: string;
  label: string;
}

export function toSelectOptions<T>(
  items?: T[] | null,
  valueKey: keyof T | ((item: T) => string | number) = "id" as keyof T,
  labelKey: keyof T | ((item: T) => string) = "name" as keyof T,
): SelectOption[] {
  if (!items || !Array.isArray(items)) return [];

  return items.map((item) => ({
    value: String(
      typeof valueKey === "function" ? valueKey(item) : item[valueKey] ?? ""
    ),
    label:
      typeof labelKey === "function"
        ? labelKey(item)
        : String(item[labelKey] ?? ""),
  }));
}

export const mapToOptions = toSelectOptions;
