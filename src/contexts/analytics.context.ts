import { createContext } from "react";

export interface BillCounts {
  paidCount: number;
  cancelledCount: number;
  completedCount: number;
}

export const initialBillCounts: BillCounts = {
  paidCount: 0,
  cancelledCount: 0,
  completedCount: 0,
};

interface AnalyticsContextType {
  counts: BillCounts;
  updateCounts: () => void;
}

export const AnalyticsContext = createContext<AnalyticsContextType>({
  counts: initialBillCounts,
  updateCounts: () => {},
});
