import client from "@/lib/client";
import PrinterService from "./printer.service";
import { SystemCounter, SystemService } from "./system.service";
import { BillCounts } from "@/contexts/analytics.context";

export interface CreateInitialBillResponse extends InitialBill {
  counter: SystemCounter;
  service: SystemService;
}

export interface InitialBill {
  status: "paid" | "cancelled" | "completed";
  serviceId: string;
  customerName: string;
  customerPhone: string | null;
  startTime: Date;
  paidAmount: number;
  paymentMethod: "cash" | "card";
  id: number;
  orderNo: string;
  counterId: string;
  quantity: number;
  remarks: string | null;
  isFullday: boolean;
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
  quantity: number;
  isFullday: boolean;
  service: SystemService;
  paidAmount: number;
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

export interface CompleteBillRequest {
  orderNo: string;
  endTime: Date;
  balanceAmount: number;
  billedHours: number;
}

interface FinalBill {
  id: number;
  orderNo: string;
  endTime: Date;
  balanceAmount: number;
  billedHours: number;
}

export interface CompleteBill {
  id: number;
  orderNo: string;
  customerName: string;
  customerPhone: string | null;
  startTime: Date;
  paidAmount: number;
  isFullday: boolean;
  quantity: number;
  paymentMethod: "cash" | "card";
  status: "paid" | "cancelled" | "completed";
  remarks: string | null;

  counter: SystemCounter;
  service: SystemService;
  finalBill: FinalBill;
}

export const BillService = {
  async completeBill(token: string, data: CompleteBillRequest) {
    const res = await client.post("/operations/counter/complete-bill", data, {
      headers: {
        "X-Counter-Token": token,
      },
    });
    const bill: CompleteBill = {
      ...res.data.bill,
      startTime: new Date(res.data.bill.startTime),
      finalBill: {
        ...res.data.bill.finalBill,
        endTime: new Date(res.data.bill.finalBill.endTime),
      },
    };
    return bill;
  },

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
        paidAmount: opts.data.paidAmount,
        paymentMethod: opts.data.paymentMethod,
        quantity: opts.data.quantity,
        isFullday: opts.data.isFullday,
        remarks: opts.data.remarks,
      },
      {
        headers: {
          "X-Counter-Token": opts.token,
        },
      }
    );
    const initialBill: CreateInitialBillResponse = {
      ...res.data.initialBill,
      startTime: new Date(res.data.initialBill.startTime),
    };
    return initialBill;
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

  async getBillData(token: string, orderNo: string): Promise<SearchResultBill> {
    const res = await client.get(`/operations/counter/bill-data/${orderNo}`, {
      headers: {
        "X-Counter-Token": token,
      },
    });
    return {
      ...res.data.bill,
      startTime: new Date(res.data.bill.startTime),
    };
  },
};
