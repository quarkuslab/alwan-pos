import client from "@/lib/client";
import {
  BillCounts,
  RegisterResponse,
  Service,
  SystemCounter,
  SystemCounterUpdateData,
  SystemRegisterData,
} from "@/types/system";

export const SystemService = {
  async getDetails(token: string): Promise<SystemCounter> {
    const res = await client.get<{ counter: SystemCounter }>(
      "/operations/counter/current",
      {
        headers: {
          "X-Counter-Token": token,
        },
      }
    );
    return res.data.counter;
  },

  async register(data: SystemRegisterData): Promise<RegisterResponse> {
    const res = await client.post<RegisterResponse>(
      "/operations/counter/register",
      data
    );
    return {
      counter: res.data.counter,
      token: res.data.token,
    };
  },

  async getServices(token: string): Promise<Service[]> {
    const res = await client.get<{ services: Service[] }>(
      "/operations/counter/services",
      {
        headers: {
          "X-Counter-Token": token,
        },
      }
    );
    return res.data.services;
  },

  async updateDetails(
    token: string,
    data: SystemCounterUpdateData
  ): Promise<SystemCounter> {
    const res = await client.post<{ counter: SystemCounter }>(
      "/operations/counter/update",
      data,
      {
        headers: {
          "X-Counter-Token": token,
        },
      }
    );
    return res.data.counter;
  },

  async getAnalytics(token: string): Promise<BillCounts> {
    const res = await client.get<{ counts: BillCounts }>(
      "/operations/counter/analytics",
      {
        headers: {
          "X-Counter-Token": token,
        },
      }
    );
    return res.data.counts;
  },
};
