import { SystemCounter, Service } from "./system";

export type BillStatus = "pending" | "cancelled" | "completed";
export type PaymentMethod = "cash" | "card";

export interface InitialBillBase {
  customerName: string;
  customerPhone?: string;
  startTime: Date;
  paidAmount: number;
  quantity: number;
  isFullday: boolean;
  remarks?: string;
  paymentMethod: PaymentMethod;
}

export interface InitialBill extends InitialBillBase {
  id: number;
  orderNo: string;
  serviceId: string;
  counterId: string;
  status: BillStatus;
}

export interface FinalBill {
  id: number;
  orderNo: string;
  counterId: string;
  initialBillId: number;
  endTime: Date;
  billedHours: number;
  balanceAmount: number;
}

export interface CompleteBill
  extends Omit<InitialBill, "serviceId" | "counterId"> {
  counter: SystemCounter;
  service: Service;
  finalBill: FinalBill;
}

export interface CreateInitialBillRequest extends InitialBillBase {
  serviceId: string;
}

export interface CreateInitialBillResponse {
  bill: CompleteBill;
}

export interface CompleteBillRequest {
  orderNo: string;
  endTime: Date;
  billedHours: number;
  balanceAmount: number;
}

export interface SearchBillsRequest {
  query: string;
  page: number;
  limit: number;
}

export interface SearchResultBill extends InitialBill {
  service: Service;
  final?: {
    id: number;
    orderNo: string;
    endTime: Date;
    balanceAmount: number;
    billedHours: number;
  };
}

export interface PaginatedSearchResponse {
  bills: SearchResultBill[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasMore: boolean;
  };
}
