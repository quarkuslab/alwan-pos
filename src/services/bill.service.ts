import client from "@/lib/client";
import {
  CompleteBill,
  CompleteBillRequest,
  CreateInitialBillRequest,
  CreateInitialBillResponse,
  PaginatedSearchResponse,
  SearchResultBill,
} from "@/types/bill";

export const BillService = {
  async createInitialBill(
    token: string,
    data: CreateInitialBillRequest
  ): Promise<CompleteBill> {
    const response = await client.post<CreateInitialBillResponse>(
      "/operations/counter/create-initial-bill",
      data,
      {
        headers: { "X-Counter-Token": token },
      }
    );

    return {
      ...response.data.bill,
      startTime: new Date(response.data.bill.startTime),
    };
  },

  async completeBill(
    token: string,
    data: CompleteBillRequest
  ): Promise<CompleteBill> {
    const response = await client.post<{ bill: CompleteBill }>(
      "/operations/counter/complete-bill",
      data,
      {
        headers: { "X-Counter-Token": token },
      }
    );

    return {
      ...response.data.bill,
      startTime: new Date(response.data.bill.startTime),
      finalBill: {
        ...response.data.bill.finalBill,
        endTime: new Date(response.data.bill.finalBill.endTime),
      },
    };
  },

  async searchBills(
    token: string,
    query: string,
    params: { page: number; limit: number }
  ): Promise<PaginatedSearchResponse> {
    try {
      const response = await client.post<PaginatedSearchResponse>(
        "/operations/counter/search",
        {
          query,
          page: params.page,
          limit: params.limit,
        },
        {
          headers: { "X-Counter-Token": token },
        }
      );

      return {
        ...response.data,
        bills: response.data.bills.map((bill) => ({
          ...bill,
          startTime: new Date(bill.startTime),
        })),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to search bills: ${error.message}`);
      }
      throw error;
    }
  },

  async getBillData(token: string, orderNo: string): Promise<SearchResultBill> {
    try {
      const response = await client.get<{ bill: SearchResultBill }>(
        `/operations/counter/bill-data/${orderNo}`,
        {
          headers: { "X-Counter-Token": token },
        }
      );

      const bill = response.data.bill;
      return {
        ...bill,
        startTime: new Date(bill.startTime),
        ...(bill.final && {
          final: {
            ...bill.final,
            endTime: new Date(bill.final.endTime),
          },
        }),
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get bill data: ${error.message}`);
      }
      throw error;
    }
  },

  async cancelBill(token: string, billId: number): Promise<void> {
    try {
      await client.post(
        "/operations/counter/cancel-bill",
        { billId },
        {
          headers: { "X-Counter-Token": token },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to cancel bill: ${error.message}`);
      }
      throw error;
    }
  },

  async failBill(token: string, billId: number): Promise<void> {
    try {
      await client.post(
        "/operations/counter/fail-bill",
        { billId },
        {
          headers: { "X-Counter-Token": token },
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update bill: ${error.message}`);
      }
      throw error;
    }
  },
};
