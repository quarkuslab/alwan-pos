import client from "@/lib/client";
import PrinterService from "./printer.service";
import { formatDateForBill } from "@/utils/time";
import { SystemCounter, SystemService } from "./system.service";
import { BillCounts } from "@/contexts/analytics.context";

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
  service: SystemService;
}

export interface CreateInitialBillData {
  customerName: string;
  customerPhone?: string;
  remarks?: string;
  paymentMethod: "cash" | "card";
  time: Date;
  service: SystemService;
}

interface PaginatedSearchResponse {
  bills: SearchResultBill[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}

export const BillService = {
  async createInitialBill(opts: {
    token: string;
    counter: SystemCounter;
    data: CreateInitialBillData;
  }): Promise<InitialBill> {
    const res = await client.post(
      "/operations/counter/create-initial-bill",
      {
        serviceId: opts.data.service.id,
        customerName: opts.data.customerName,
        customerPhone: opts.data.customerPhone,
        startTime: opts.data.time,
        amountPaid: opts.data.service.advanceAmount,
        paymentMethod: opts.data.paymentMethod,
      },
      {
        headers: {
          "X-Counter-Token": opts.token,
        },
      }
    );
    const initialBill: InitialBill = {
      ...res.data.initialBill,
      startTime: new Date(res.data.initialBill.startTime),
    };
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
    return res.data.initialBill;
  },

  async search(
    token: string,
    query: string,
    params: { page: number; limit: number }
  ): Promise<PaginatedSearchResponse> {
    const res = await client.post(
      "/operations/counter/search",
      {
        query,
        page: params.page,
        limit: params.limit,
      },
      {
        headers: {
          "X-Counter-Token": token,
        },
      }
    );
    const data = res.data as PaginatedSearchResponse;
    return {
      ...data,
      bills: data.bills.map((bill) => ({
        ...bill,
        startTime: new Date(bill.startTime),
      })),
    };
  },

  async cancelBill(token: string, billId: number): Promise<void> {
    await client.post(
      "/operations/counter/cancel-bill",
      { billId },
      {
        headers: {
          "X-Counter-Token": token,
        },
      }
    );
  },

  async getCounts(token: string): Promise<BillCounts> {
    const res = await client.get("/operations/counter/analytics", {
      headers: {
        "X-Counter-Token": token,
      },
    });
    return res.data.counts;
  },
};
