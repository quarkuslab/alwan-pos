import client from "@/lib/client";

export interface SystemCounter {
  id: string;
  name: string;
  contactInfo: string;
}

export interface SystemService {
  id: string;
  title: string;
  calculationMethod: "usage" | "balance";
  advanceAmount: number;
  pricePerHour: number;
  description: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SystemRegisterData {
  name: string;
  contactInfo: string;
}

interface SystemCounterUpdateData {
  contactInfo?: string;
}

export const SystemService = {
  async getDetails(token: string): Promise<SystemCounter> {
    const res = await client.get("/operations/counter/current", {
      headers: {
        "X-Counter-Token": token,
      },
    });
    return res.data.counter;
  },

  async register(
    data: SystemRegisterData
  ): Promise<{ counter: SystemCounter; token: string }> {
    const res = await client.post("/operations/counter/register", data);
    return res.data;
  },

  async getServices(token: string): Promise<SystemService[]> {
    const res = await client.get("/services", {
      headers: {
        "X-Counter-Token": token,
      },
    });
    return res.data.services;
  },

  async updateDetails(
    token: string,
    data: SystemCounterUpdateData
  ): Promise<SystemCounter> {
    const res = await client.post("/operations/counter/update", data, {
      headers: {
        "X-Counter-Token": token,
      },
    });
    return res.data.counter;
  },
};
