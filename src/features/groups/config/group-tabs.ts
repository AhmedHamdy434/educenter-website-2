export const GROUP_TABS = [
  "students",
  "attendance",
  "reports",
  "payments",
  "extra-sessions",
] as const;

export type GroupTab = (typeof GROUP_TABS)[number];

export function getGroupTab(value: string | null): GroupTab {
  return GROUP_TABS.find((tab) => tab === value) ?? "students";
}
