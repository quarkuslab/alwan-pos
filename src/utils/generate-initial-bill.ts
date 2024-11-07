import { CreateInitialBillResponse } from "@/services/bill.service";

export function generateInitialBill(data: CreateInitialBillResponse): string {
  const LINE_WIDTH = 48;

  // Helper function to center text
  function centerText(text: string): string {
    const padding = Math.max(0, Math.floor((LINE_WIDTH - text.length) / 2));
    return " ".repeat(padding) + text;
  }

  // Helper function to create separator line
  function createSeparator(char: string = "-"): string {
    return char.repeat(LINE_WIDTH);
  }

  // Helper function to format currency
  function formatCurrency(amount: number): string {
    return amount.toFixed(2);
  }

  // Helper function to justify text between label and value
  function justifyBetween(label: string, value: string | number): string {
    const valueStr = String(value);
    const contentLength = label.length + valueStr.length;
    const padding = Math.max(0, LINE_WIDTH - contentLength);
    return `${label}${" ".repeat(padding)}${valueStr}`;
  }

  // Common terms and conditions
  const termsAndConditions = [
    "1. Paid amount is non-refundable",
    "2. Customer is responsible for their belongings",
    "3. Management reserves the right to terminate service",
    "4. By using this service, you agree to our terms",
  ];

  const billContent = [
    // Header
    createSeparator("="),
    centerText(data.counter.name),
    centerText("L.L.C"),
    centerText(data.counter.contactInfo),
    createSeparator(),

    // Order Details
    justifyBetween("Order No:", data.orderNo),
    justifyBetween("Date:", new Date(data.startTime).toLocaleDateString()),
    justifyBetween("Time:", new Date(data.startTime).toLocaleTimeString()),
    createSeparator(),

    // Customer Details
    justifyBetween("Customer:", data.customerName),
    data.customerPhone ? justifyBetween("Phone:", data.customerPhone) : "",
    createSeparator(),

    // Service Details
    centerText("Service Details"),
    createSeparator(),
    justifyBetween("Service:", data.service.title),
    justifyBetween("Counter:", data.counter.name),
    justifyBetween("Quantity:", data.quantity),
    data.isFullday ? justifyBetween("Full Day:", "Yes") : "",
    justifyBetween(
      "Rate/Hour:",
      `AED ${formatCurrency(data.service.pricePerHour)}`
    ),
    data.service.calculationMethod === "balance"
      ? justifyBetween(
          "Deposit Required:",
          `AED ${formatCurrency(data.service.advanceAmount)}`
        )
      : "",
    createSeparator(),

    // Payment Details
    justifyBetween("Amount Paid:", `AED ${formatCurrency(data.paidAmount)}`),
    justifyBetween("Payment Method:", data.paymentMethod.toUpperCase()),
    createSeparator(),

    // Footer
    centerText("Thank you for choosing our service!"),
    createSeparator(),
    "Terms & Conditions:",
    ...termsAndConditions,
    data.remarks ? [createSeparator(), `Note: ${data.remarks}`] : [],
    createSeparator("="),
    centerText("Please keep this receipt"),
    centerText("Present this receipt when checking out"),
    createSeparator("="),
  ]
    .flat()
    .filter(Boolean);

  return billContent.join("\n");
}
