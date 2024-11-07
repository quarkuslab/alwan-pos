import { OperationsContext } from "@/contexts/operations.context";
import { useContext } from "react";

export function useCreateInitialBillOperation() {
  return useContext(OperationsContext).createInitialBill;
}

export function useCancelBillOperation() {
  return useContext(OperationsContext).cancelBill;
}

export function useCompleteBillOperation() {
  return useContext(OperationsContext).completeBill;
}
