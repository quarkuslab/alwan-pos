import { OperationsContext } from "@/contexts/operations.context";
import { useContext } from "react";

export function useCreateInitialBill() {
  return useContext(OperationsContext).createInitialBill
}