import { formatAmount } from "@/utils/amount";
import { createJustifiedLine, createSeperator } from "@/utils/printer-utils";

const PrinterService = {
  async canPrint() {
    if (window.PrinterBridge) {
      return Boolean(await window.PrinterBridge.getPrinterStatus());
    }
    return false;
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
    isFullday: boolean;
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

      // Fullday
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Fullday", data.isFullday ? "Yes" : "No")
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

  async printCompleteBill(data: {
    counterName: string;
    contactInfo: string;
    orderNo: string;
    customerName: string;
    customerPhone: string | null;
    serviceName: string;
    quantity: number;
    startTime: Date;
    endTime: Date;
    duration: number;
    rate: number;
    paidAmount: number;
    discountAmount: number | null;
    balanceAmount: number;
  }) {
    if (window.PrinterBridge) {
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

      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(
        createJustifiedLine("Order No:", data.orderNo)
      );
      await window.PrinterBridge.printText(
        createJustifiedLine("Date:", new Date().toLocaleString())
      );
      await window.PrinterBridge.printText(
        createJustifiedLine("Customer Name:", data.customerName)
      );
      if (data.customerPhone) {
        await window.PrinterBridge.printText(
          createJustifiedLine("Customer Phone:", data.customerPhone)
        );
      }

      // Billing Details Seperator
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator());
      await window.PrinterBridge.setAlignment(1);
      await window.PrinterBridge.printText("BILLING DETAILS\n");
      await window.PrinterBridge.printText(createSeperator());

      await window.PrinterBridge.printText(
        createJustifiedLine("Service:", data.serviceName)
      );
      await window.PrinterBridge.printText(
        createJustifiedLine("Quantity:", data.quantity.toString())
      );
      await window.PrinterBridge.printText(
        createJustifiedLine("Start Time:", data.startTime.toLocaleTimeString())
      );
      await window.PrinterBridge.printText(
        createJustifiedLine("End Time:", data.endTime.toLocaleTimeString())
      );
      await window.PrinterBridge.printText(
        createJustifiedLine("Duration:", data.duration.toFixed(1) + " Hours")
      );
      await window.PrinterBridge.printText(
        createJustifiedLine("Paid Amount:", formatAmount(data.paidAmount))
      );
      await window.PrinterBridge.printText(
        createJustifiedLine(
          "Bill Amount:",
          formatAmount(
            data.paidAmount - (data.balanceAmount + (data.discountAmount ?? 0))
          )
        )
      );
      if (data.discountAmount) {
        await window.PrinterBridge.printText(
          createJustifiedLine(
            "Discount Amount:",
            formatAmount(data.discountAmount)
          )
        );
      }

      // Balance Amount
      await window.PrinterBridge.setAlignment(0);
      await window.PrinterBridge.printText(createSeperator());
      await window.PrinterBridge.setFontSize(36);
      await window.PrinterBridge.printText(
        createJustifiedLine(
          "Balance Amount:",
          formatAmount(data.balanceAmount),
          36
        )
      );
      await window.PrinterBridge.setFontSize(24);
      await window.PrinterBridge.printText(createSeperator());

      await window.PrinterBridge.setAlignment(1);
      await window.PrinterBridge.printText("Thank you for your business!");

      await window.PrinterBridge.lineWrap(2);
      await window.PrinterBridge.cutPaper();
    }
  },
};

export default PrinterService;
