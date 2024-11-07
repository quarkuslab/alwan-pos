declare global {
  interface Window {
    PrinterBridge?: {
      printLogo: () => Promise<void>;
      printText: (text: string) => Promise<void>;
      printBarcode: (data: string) => Promise<void>;
      cutPaper: () => Promise<void>;
      getPrinterStatus: () => Promise<number>;
    };
    SettingsBridge?: {
      saveString: (key: string, value: string) => Promise<void>;
      getString: (key: string) => Promise<string | null>;
      hasKey: (key: string) => Promise<boolean>;
      remove: (key: string) => Promise<void>;
      clear: () => Promise<void>;
    };
  }
}

export {};
