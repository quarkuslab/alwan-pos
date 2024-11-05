import { CreateInitialBillData } from "@/services/bill.service";
import { createContext } from "react";

export type OperationsContextType = {
  createInitialBill: (data: CreateInitialBillData) => Promise<void>;
  cancelBill: (id: number) => Promise<void>;
};

export const OperationsContext = createContext<OperationsContextType>({
  createInitialBill: async () => {},
  cancelBill: async () => {},
});
