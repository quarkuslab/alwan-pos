import { ReceiptData, ReceiptFormatter } from "@/utils/receipt-formatter"

const PrinterService = {
  async print(data: ReceiptData) {
    if (window.PrinterBridge) {
      const text = new ReceiptFormatter(data).format()
      await window.PrinterBridge.print(text)
    }
  }
}

export default PrinterService