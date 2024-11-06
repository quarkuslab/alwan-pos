import { AnalyticsContext } from "@/contexts/analytics.context";
import { useContext } from "react";

export function useAnalyticsData() {
  return useContext(AnalyticsContext).counts;
}

export function useAnalyticsUpdate() {
  return useContext(AnalyticsContext).updateCounts;
}
