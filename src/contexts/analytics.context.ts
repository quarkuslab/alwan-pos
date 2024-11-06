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

export type AnalyticsState =
  | {
      status: "loading";
    }
  | {
      status: "loaded";
      counts: BillCounts;
    };

export type AnalyticsContextType = {
  state: AnalyticsState;
  updateCounts: () => void;
};

export const AnalyticsContext = createContext<AnalyticsContextType>({
  state: { status: "loading" },
  updateCounts: () => {},
});
