export function formatAmount(amount: number) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "AED",
  }).format(amount);
}
