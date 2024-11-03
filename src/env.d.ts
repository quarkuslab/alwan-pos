declare global {
  interface Window {
    PrinterBridge?: {
      print: (text: string) => Promise<void>
      getPrinterStatus: () => Promise<number>
    }
  }
}

export { }