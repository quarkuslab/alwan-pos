import {} from "@/services/bill.service";
import { CompleteBillRequest, CreateInitialBillRequest } from "@/types/bill";
import { createContext } from "react";

export type OperationsContextType = {
  createInitialBill: (data: CreateInitialBillRequest) => Promise<void>;
  completeBill: (data: CompleteBillRequest) => Promise<void>;
  cancelBill: (id: number) => Promise<void>;
};

export const OperationsContext = createContext<OperationsContextType>({
  createInitialBill: async () => {},
  cancelBill: async () => {},
  completeBill: async () => {},
});
