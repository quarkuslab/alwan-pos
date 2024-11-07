import { CompleteBill } from "@/types/bill";
import { generateCompleteBill } from "@/utils/generate-complete-bill";
import { generateInitialBill } from "@/utils/generate-initial-bill";

const PrinterService = {
  async canPrint() {
    if (window.PrinterBridge) {
      return Boolean(await window.PrinterBridge.getPrinterStatus());
    }
    return false;
  },

  async printCompleteBill(bill: CompleteBill) {
    if (window.PrinterBridge) {
      const data = generateCompleteBill(bill);
      await window.PrinterBridge.printText(data);
      await window.PrinterBridge.cutPaper();
    }
  },

  async printInitialBill(bill: CompleteBill) {
    if (window.PrinterBridge) {
      const text = generateInitialBill(bill);
      await window.PrinterBridge.printText(text);
      await window.PrinterBridge.printBarcode(bill.orderNo);
      await window.PrinterBridge.cutPaper();
    }
  },
};

export default PrinterService;
