import { ReceiptData, ReceiptFormatter } from "@/utils/receipt-formatter";
import { CompleteBill } from "./bill.service";
import { generateCompleteBill } from "@/utils/print-complete-bill";

const PrinterService = {
  async print(data: ReceiptData) {
    if (window.PrinterBridge) {
      const text = new ReceiptFormatter(data).format();
      await window.PrinterBridge.printText(text);
      await window.PrinterBridge.printBarcode(data.orderNo);
      await window.PrinterBridge.cutPaper();
    }
  },
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
};

export default PrinterService;
