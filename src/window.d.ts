declare global {
  interface Window {
    PrinterBridge?: {
      lineWrap: (lines: number) => Promise<void>;
      setFontSize: (fontSize: number) => Promise<void>;
      setAlignment: (alignmentValue: number) => Promise<void>;
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
