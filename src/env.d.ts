declare global {
  interface Window {
    PrinterBridge?: {
      printText: (text: string) => Promise<void>
      printBarcode: (data: string) => Promise<void>;
      cutPaper: () => Promise<void>
      getPrinterStatus: () => Promise<number>;
    }
  }
}

export { }