import client from "@/lib/client";
import PrinterService from "./printer.service";
import { formatDateForBill } from "@/utils/time";
import { SystemCounter, SystemService } from "./system.service";

export interface InitialBill {
  status: "paid" | "cancelled" | "completed";
  serviceId: string;
  customerName: string;
  customerPhone: string | null;
  startTime: Date;
  amountPaid: number;
  paymentMethod: "cash" | "card";
  id: number;
  orderNo: string;
  counterId: string;
}

export interface SearchResultBill extends InitialBill {
  service: SystemService
}

export interface CreateInitialBillData {
  customerName: string;
  customerPhone?: string;
  remarks?: string;
  paymentMethod: "cash" | "card";
  time: Date;
  service: SystemService;
}

export const BillService = {
  async createInitialBill(opts: { token: string; counter: SystemCounter; data: CreateInitialBillData }): Promise<InitialBill> {
    const res = await client.post('/bills/initial', {
      serviceId: opts.data.service.id,
      customerName: opts.data.customerName,
      customerPhone: opts.data.customerPhone,
      startTime: opts.data.time,
      amountPaid: opts.data.service.advanceAmount,
      paymentMethod: opts.data.paymentMethod
    }, {
      headers: {
        'X-Counter-Token': opts.token
      }
    })
    const initialBill: InitialBill = {
      ...res.data.initialBill,
      startTime: new Date(res.data.initialBill.startTime)
    }
    await PrinterService.print({
      companyName: "Alwan Alqarya Exhibition Organizing",
      companyAddress: opts.counter.name,
      contactInfo: opts.counter.contactInfo,
      orderNo: initialBill.orderNo,
      orderDate: formatDateForBill(initialBill.startTime),
      customerName: initialBill.customerName,
      customerNumber: initialBill.customerPhone || "",
      advance: initialBill.amountPaid,
      termsAndConditions: [
        "1.Shopping Trolley AED 10/HR and AED 50/Unit Limited.",
        "2.Baby Cart Single AED 15/HR and AED 75/Unit Limited.",
        "3.Baby Cart Double AED 25/HR and AED 100/Unit Limited.",
        "4.Wheel Chair AED 10/HR.",
        "5.Electric Wheel Chair 50 10/HR and AED 200/Unlimited.",
        "6.Electric Scooter AED 50/HR and AED 250/Unit Limited.",
        "7.Maximum Grace Period is 15 Minutes.",
      ],
      items: [
        {
          name: opts.data.service.title,
          qty: 1,
          uom: "NOS",
          price: opts.data.service.pricePerHour,
          value: opts.data.service.pricePerHour,
        },
      ],
    });
    return res.data.initialBill
  },


  async search(token: string, query: string): Promise<SearchResultBill[]> {
    const res = await client.post('/counters/search', { query }, {
      headers: {
        'X-Counter-Token': token
      }
    })
    // @ts-expect-error ignore conversion errors
    return res.data.bills.map((bill: object) => ({ ...bill, startTime: new Date(bill.startTime) } as SearchResultBill))
  }
}