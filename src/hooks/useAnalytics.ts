import { AnalyticsContext } from "@/contexts/analytics.context";
import { useContext } from "react";

export function useAnalyticsState() {
  return useContext(AnalyticsContext).state;
}

export function useAnalyticsUpdate() {
  return useContext(AnalyticsContext).updateCounts;
}
