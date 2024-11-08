export interface SystemCounter {
  id: string;
  name: string;
  contactInfo: string;
}

export interface Service {
  id: string;
  title: string;
  calculationMethod: "usage" | "balance";
  advanceAmount: number;
  pricePerHour: number;
  hasFulldayCalculation: boolean;
  description?: string;
}

export interface SystemRegisterData {
  name: string;
  contactInfo: string;
  password: string;
}

export interface SystemCounterUpdateData {
  contactInfo?: string;
}

export interface RegisterResponse {
  counter: SystemCounter;
  token: string;
}

export interface BillCounts {
  paidCount: number;
  cancelledCount: number;
  completedCount: number;
}
