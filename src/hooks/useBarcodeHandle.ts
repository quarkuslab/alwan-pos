import { useEffect, useState } from "react";

interface Options {
  barcodeLength: number
  barcodeTimeout: number
  onScan: (barcode: string) => void
}

export default function useBarcodeHandle(opts: Options) {
  const [barcodeBuffer, setBarcodeBuffer] = useState("");
  const [lastKeyTime, setLastKeyTime] = useState(0);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const currentTime = new Date().getTime();

      // If it's been too long since the last keystroke, reset the buffer
      if (
        currentTime - lastKeyTime > opts.barcodeTimeout &&
        barcodeBuffer.length > 0
      ) {
        setBarcodeBuffer("");
      }

      // Update the last key time
      setLastKeyTime(currentTime);

      // Handle Enter key - most barcode scanners send an Enter key after scanning
      if (event.key === "Enter" && barcodeBuffer) {
        // Process the complete barcode
        if (barcodeBuffer.length == opts.barcodeLength) {
          opts.onScan(barcodeBuffer)
        }
        setBarcodeBuffer("");
        return;
      }

      // Add character to buffer if it's a valid input
      if (event.key.length === 1) {
        setBarcodeBuffer((prev) => prev + event.key);
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [barcodeBuffer, lastKeyTime, opts]);
}