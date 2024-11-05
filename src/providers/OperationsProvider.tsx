import { OperationsContext } from "@/contexts/operations.context";
import { useAsyncToast } from "@/hooks/useAsyncToast";
import { useSystemState } from "@/hooks/useSystem";
import { BillService, CreateInitialBillData } from "@/services/bill.service";
import { ReactNode, useCallback } from "react";

interface Props {
  children: ReactNode;
}

export default function OperationsProvider({ children }: Props) {
  const system = useSystemState();
  const toast = useAsyncToast();

  const createInitialBill = useCallback(
    async (data: CreateInitialBillData) => {
      if (system.status == "loaded") {
        const promise = BillService.createInitialBill({
          token: system.token,
          counter: system.counter,
          data,
        });
        toast({
          promise: promise,
          loading: "Generating Bill...",
          success: "Bill Printed Successfully",
        });
        await promise;
      }
    },
    [system, toast]
  );

  const cancelBill = useCallback(
    async (id: number) => {
      if (system.status == "loaded") {
        const promise = BillService.cancelBill(system.token, id);
        toast({
          promise,
          loading: "Cancelling bill...",
          success: "Bill canceled successfully",
          error: () => "Bill Cancellation failed",
        });
        await promise;
      }
    },
    [system, toast]
  );

  return (
    <OperationsContext.Provider
      value={{
        createInitialBill,
        cancelBill,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
}
