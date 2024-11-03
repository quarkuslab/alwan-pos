import { ReceiptData, ReceiptFormatter } from "@/utils/receipt-formatter"

const PrinterService = {
  async print(data: ReceiptData) {
    if (window.PrinterBridge) {
      const text = new ReceiptFormatter(data).format()
      await window.PrinterBridge.printText(text)
      await window.PrinterBridge.printBarcode(data.orderNo)
      await window.PrinterBridge.cutPaper()
    }
  },
  async printBarcode(data: string) {
    if (window.PrinterBridge) {
      await window.PrinterBridge.printBarcode(data)
      await window.PrinterBridge.cutPaper()
    }
  }
}

export default PrinterService