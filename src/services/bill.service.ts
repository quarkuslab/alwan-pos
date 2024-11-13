import client from "@/lib/client";
import {
  CompleteBill,
  CompleteBillRequest,
  CreateInitialBillRequest,
  CreateInitialBillResponse,
  FinalPageResult,
  PaginatedSearchResponse,
} from "@/types/bill";

export const BillService = {
  async createInitialBill(
    token: string,
    data: CreateInitialBillRequest
  ): Promise<CompleteBill> {
    const response = await client.post<CreateInitialBillResponse>(
      "/counter/create-initial-bill",
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
      "/counter/complete-bill",
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
        "/counter/search",
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

  async getBillData(token: string, orderNo: string): Promise<FinalPageResult> {
    try {
      const response = await client.get<{ bill: FinalPageResult }>(
        `/counter/bill-data/${orderNo}`,
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
        "/counter/cancel-bill",
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
        "/counter/fail-bill",
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
