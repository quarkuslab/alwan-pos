import { CompleteBill, CreateInitialBillResponse } from "./bill.service";
import { generateCompleteBill } from "@/utils/generate-complete-bill";
import { generateInitialBill } from "@/utils/generate-initial-bill";

const PrinterService = {
  async printBarcode(data: string) {
    if (window.PrinterBridge) {
      await window.PrinterBridge.printBarcode(data);
      await window.PrinterBridge.cutPaper();
    }
  },

  async printCompleteBill(bill: CompleteBill) {
    if (window.PrinterBridge) {
      const data = generateCompleteBill(bill);
      await window.PrinterBridge.printText(data);
      await window.PrinterBridge.cutPaper();
    }
  },

  async printInitialBill(bill: CreateInitialBillResponse) {
    if (window.PrinterBridge) {
      const text = generateInitialBill(bill);
      await window.PrinterBridge.printText(text);
      await window.PrinterBridge.printBarcode(bill.orderNo);
      await window.PrinterBridge.cutPaper();
    }
  },
};

export default PrinterService;
