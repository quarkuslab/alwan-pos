import {
  AnalyticsContext,
  BillCounts,
  initialBillCounts,
} from "@/contexts/analytics.context";
import { useSystemState } from "@/hooks/useSystem";
import { BillService } from "@/services/bill.service";
import { ReactNode, useCallback, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function AnalyticsProvider({ children }: Props) {
  const [counts, setCounts] = useState<BillCounts>(initialBillCounts);
  const system = useSystemState();

  const updateCounts = useCallback(async () => {
    if (system.status == "loaded") {
      const counts = await BillService.getCounts(system.token);
      setCounts(counts);
    }
  }, [system]);

  return (
    <AnalyticsContext.Provider
      value={{
        counts,
        updateCounts,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
