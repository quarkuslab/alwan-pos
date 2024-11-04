import client from "@/lib/client";

export interface CounterData {
  name: string
  contactNumber: string
}

export interface CounterService {
  id: string
  title: string
  calculationMethod: 'usage' | 'balance'
  advanceAmount: number
  pricePerHour: number
  description: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const CounterService = {
  async getDetails(token: string): Promise<CounterData> {
    const res = await client.get("/counters/current", {
      headers: {
        "X-Counter-Token": token,
      },
    });
    return {
      name: res.data.counter.name,
      contactNumber: res.data.counter.contactNumber
    }
  },

  async register(data: { name: string; contactNumber: string }): Promise<string> {
    const res = await client.post("/counters/register", data);
    return res.data.token
  },

  async getServices(token: string): Promise<CounterService[]> {
    const res = await client.get('/services', {
      headers: {
        'X-Counter-Token': token
      }
    })
    return res.data.services
  }
}

export default CounterService