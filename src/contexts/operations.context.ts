import {
  CompleteBillRequest,
  CreateInitialBillData,
} from "@/services/bill.service";
import { createContext } from "react";

export type OperationsContextType = {
  createInitialBill: (data: CreateInitialBillData) => Promise<void>;
  completeBill: (data: CompleteBillRequest) => Promise<void>;
  cancelBill: (id: number) => Promise<void>;
};

export const OperationsContext = createContext<OperationsContextType>({
  createInitialBill: async () => {},
  cancelBill: async () => {},
  completeBill: async () => {},
});
