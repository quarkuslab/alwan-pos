import { CompleteBill } from "@/types/bill";
import { formatAmount } from "@/utils/amount";
import { generateCompleteBill } from "@/utils/generate-complete-bill";
import { createJustifiedLine, createSeperator } from "@/utils/printer-utils";

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

  async printInitialBill(data: {
    counterName: string;
    contactInfo: string;
    orderNo: string;
    orderDate: Date;
    customerName: string;
    customerPhone: string | null;
    serviceName: string;
    quantity: number;
    rate: number;
    paidAmount: number;
    paymentMethod: string;
    remarks: string | null;
  }) {
    if (window.PrinterBridge) {
      await window.PrinterBridge.printLogo();
      await window.PrinterBridge.lineWrap(1);

      // Company
      await window.PrinterBridge.setAlignment(1);
      await window.PrinterBridge.setFontSize(36);
      await window.PrinterBridge.printText(
        "Alwan Alqarya Exhibition\nOrganizing L.L.C\n"
      );

      // Counter Details
      await window.PrinterBridge.setAlignment(1);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(data.counterName + "\n");
      await window.PrinterBridge.printText(data.contactInfo + "\n");

      // Seperator
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator());

      // Order No
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText("Order No:\n");
      await window.PrinterBridge.setFontSize(48);
      await window.PrinterBridge.printText("#" + data.orderNo + "\n");

      // Date
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Date", data.orderDate.toLocaleString())
      );

      // Customer Name
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Customer Name:", data.customerName)
      );

      // Customer Phone
      if (data.customerPhone) {
        await window.PrinterBridge.setAlignment(0);
        await window.PrinterBridge.setFontSize(24);
        await window.PrinterBridge.printText(
          createJustifiedLine("Customer Phone:", data.customerPhone)
        );
      }

      // Seperator
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator());

      // Service
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Service", data.serviceName)
      );

      // Quantity
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Quantity", data.quantity.toString())
      );

      // Rate
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Rate/Hour", formatAmount(data.rate))
      );

      // Payment Method
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Payment Method", data.paymentMethod)
      );

      // Remarks
      if (data.remarks) {
        await window.PrinterBridge.setAlignment(0);
        await window.PrinterBridge.setFontSize(24);
        await window.PrinterBridge.printText(
          createJustifiedLine("Remarks", data.remarks)
        );
      }

      // Seperator
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator());

      // Amount Paid
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(36);
      await window.PrinterBridge.printText(
        createJustifiedLine("Amount Paid", formatAmount(data.paidAmount), 36)
      );

      // Seperator
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator());

      // Terms and Conditions
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText("Terms & Conditions:\n");
      await window.PrinterBridge.printText(
        "1. Shopping Trolley AED 10/HR\n   and AED 50/Unlimited\n"
      );
      await window.PrinterBridge.printText(
        "2. Baby Cart Single AED 15/HR\n   and AED 75/Unlimited\n"
      );
      await window.PrinterBridge.printText(
        "3. Baby Cart Double AED 25/HR\n   and AED 100/Unlimited\n"
      );
      await window.PrinterBridge.printText("4. Wheel Chair AED 10/HR\n");
      await window.PrinterBridge.printText(
        "5. Electric Wheel Chair 50/HR\n   and AED 200/Unlimited\n"
      );
      await window.PrinterBridge.printText(
        "6. Electric Scooter AED 60/HR\n   and AED 250/Unlimited\n"
      );
      await window.PrinterBridge.printText(
        "7. Maximum Grace Period is 15 Minutes\n"
      );

      // Seperator
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator("="));

      // Message
      await window.PrinterBridge.setAlignment(1);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText("Please keep this receipt\n");
      await window.PrinterBridge.printText(
        "Present this receipt when checking out\n"
      );

      // Seperator
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator("="));

      // Barcode
      await window.PrinterBridge.lineWrap(1);
      await window.PrinterBridge.printBarcode(data.orderNo);
      await window.PrinterBridge.lineWrap(3);

      // Cut Paper
      await window.PrinterBridge.cutPaper();
    }
  },
};

export default PrinterService;
