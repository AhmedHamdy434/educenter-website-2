export const subscriptionKeys = {
  all: ["subscription"] as const,
  details: () => [...subscriptionKeys.all, "details"] as const,
  usage: () => [...subscriptionKeys.all, "usage"] as const,
};
