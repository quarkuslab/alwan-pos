import { ReceiptData, ReceiptFormatter } from "../utils/receipt-formatter"

declare global {
  interface Window {
    PrinterBridge?: {
      print: (text: string) => Promise<void>
      getPrinterStatus: () => Promise<number>
    }
  }
}

const PrinterService = {
  async print(data: ReceiptData) {
    if (window.PrinterBridge) {
      const text = new ReceiptFormatter(data).format()
      await window.PrinterBridge.print(text)
    }
  }
}

export default PrinterService