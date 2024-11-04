import client from "@/lib/client";

const CounterService = {
  async getDetails(token: string) {
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

  async register(data: { name: string; contactNumber: string }) {
    const res = await client.post("/counters/register", data);
    return res.data.token as string
  }
}

export default CounterService