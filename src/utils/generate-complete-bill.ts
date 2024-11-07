import { CompleteBill } from "@/types/bill";

export function generateCompleteBill(bill: CompleteBill): string {
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

  // Helper function to format duration
  function formatDuration(): string {
    const hours = bill.finalBill.billedHours;
    return `${hours.toFixed(1)} hours`;
  }

  // Helper function to create a row with label and value
  function createRow(label: string, value: string): string {
    const padding = LINE_WIDTH - label.length - value.length;
    return `${label}${" ".repeat(padding)}${value}`;
  }

  // Generate the bill content
  const lines: string[] = [
    createSeparator("="),
    centerText("BILLING RECEIPT"),
    centerText(bill.counter.name),
    centerText(bill.counter.contactInfo),
    createSeparator(),
    "",
    createRow("Order No:", bill.orderNo),
    createRow("Date:", new Date(bill.startTime).toLocaleDateString()),
    createRow("Time:", new Date(bill.startTime).toLocaleTimeString()),
    "",
    createRow("Customer:", bill.customerName),
    bill.customerPhone ? createRow("Phone:", bill.customerPhone) : "",
    "",
    createRow("Service:", bill.service.title),
    createRow("Counter:", bill.counter.name),
    createRow("Quantity:", bill.quantity.toString()),
    "",
    createSeparator("-"),
    centerText("BILLING DETAILS"),
    createSeparator("-"),
    "",
    createRow("Start Time:", new Date(bill.startTime).toLocaleTimeString()),
    createRow(
      "End Time:",
      new Date(bill.finalBill.endTime).toLocaleTimeString()
    ),
    createRow("Duration:", formatDuration()),
    "",
    bill.isFullday ? createRow("Full Day Rate:", "Yes") : "",
    createRow(
      "Rate per Hour:",
      `₹${formatCurrency(bill.service.pricePerHour)}`
    ),
    createRow("Advance Paid:", `₹${formatCurrency(bill.paidAmount)}`),
    createRow(
      "Balance Amount:",
      `₹${formatCurrency(bill.finalBill.balanceAmount)}`
    ),
    createRow("Payment Method:", bill.paymentMethod.toUpperCase()),
    "",
    createSeparator(),
    centerText("Thank you for your business!"),
    bill.remarks ? centerText(`Note: ${bill.remarks}`) : "",
    createSeparator("="),
    "",
    centerText("Keep this receipt for reference"),
    "",
  ].filter(Boolean); // Remove empty strings when no remarks/phone

  return lines.join("\n");
}
