import {
  AnalyticsContext,
  AnalyticsContextType,
  AnalyticsState,
} from "@/contexts/analytics.context";
import { useSystemState } from "@/hooks/useSystem";
import { SystemService } from "@/services/system.service";
import { ReactNode, useCallback, useState } from "react";

interface Props {
  children: ReactNode;
}

export default function AnalyticsProvider({ children }: Props) {
  const [state, setState] = useState<AnalyticsState>({ status: "loading" });
  const system = useSystemState();

  const updateCounts: AnalyticsContextType["updateCounts"] =
    useCallback(async () => {
      if (system.status == "loaded") {
        const counts = await SystemService.getAnalytics(system.token);
        setState({ status: "loaded", counts });
      }
    }, [system]);

  return (
    <AnalyticsContext.Provider
      value={{
        state,
        updateCounts,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
}
