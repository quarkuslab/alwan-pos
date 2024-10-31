import { ReceiptFormatter, type ReceiptData } from "@/utils/receipt-formatter"

const PrinterService = {
  async print(data: ReceiptData) {
    if (window.PrinterBridge) {
      const text = new ReceiptFormatter(data).format()
      await window.PrinterBridge.print(text)
    } else {
      console.log('no printer')
    }
  }
}

export default PrinterService