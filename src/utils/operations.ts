import { BillService } from "@/services/bill.service";
import PrinterService from "@/services/printer.service";
import { CompleteBillRequest, CreateInitialBillRequest } from "@/types/bill";

export async function createInitialBillFlow(
  token: string,
  data: CreateInitialBillRequest
) {
  const canPrint = await PrinterService.canPrint();
  if (!canPrint) throw new Error("Unable to print");
  const bill = await BillService.createInitialBill(token, data);
  await PrinterService.printInitialBill({
    counterName: bill.counter.name,
    contactInfo: bill.counter.contactInfo,
    orderNo: bill.orderNo,
    orderDate: bill.startTime,
    customerName: bill.customerName,
    customerPhone: bill.customerPhone ?? null,
    serviceName: bill.service.title,
    quantity: bill.quantity,
    rate: bill.service.pricePerHour,
    paymentMethod: bill.paymentMethod.toUpperCase(),
    remarks: bill.remarks ?? null,
    paidAmount: bill.paidAmount,
  });
}

export async function createCompleteBillFlow(
  token: string,
  data: CompleteBillRequest
) {
  const canPrint = await PrinterService.canPrint();
  if (!canPrint) throw new Error("Unable to print");
  const bill = await BillService.completeBill(token, data);
  await PrinterService.printCompleteBill(bill);
  return bill;
}
