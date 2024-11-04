import { CounterService } from "./counter.service";

export interface CreateInitialBillData {
  customerName: string;
  customerPhone?: string;
  remarks?: string;
  paymentMethod: "cash" | "card";
  time: Date;
  service: CounterService;
}