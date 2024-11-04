import { CreateInitialBillData } from "@/services/bill.service";
import { createContext } from "react";

export type OperationsContextType = {
  createInitialBill: (data: CreateInitialBillData) => Promise<void>
}

export const OperationsContext = createContext<OperationsContextType>({
  createInitialBill: async () => { }
})