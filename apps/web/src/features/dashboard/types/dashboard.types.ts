import type { CalculateOperationSummaryResult } from "@g-checkflow/shared/calculate-operation-summary";

export interface DashboardAttention {
  pendingChecks: number;
  nextDueCheck: {
    issuerName: string;
    dueDate: string;
  } | null;
}

export interface DashboardSummary {
  openOperations: number;
  receivables: number;
  providerInterest: number;
}

export type DashboardPortfolioStatus =
  | "PENDING"
  | "OVERDUE";

export interface DashboardPortfolioItem {
  status: DashboardPortfolioStatus;
  count: number;
  amount: number;
}

export interface DashboardDueByPeriod {
  year: number;
  month: number;
  upcomingAmount: number;
  overdueAmount: number;
  compensatedAmount: number;
  returnedAmount: number;
}

export interface DashboardTopIssuer {
  issuerId: string;
  issuerName: string;
  amount: number;
}

export interface DashboardRecentOperation {
  id: string;
  number: string,
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  provider: {
    name: string;
  };
  summary: CalculateOperationSummaryResult;
}

export interface DashboardResponse {
  attention: DashboardAttention;
  summary: DashboardSummary;
  portfolio: DashboardPortfolioItem[];
  dueByPeriod: DashboardDueByPeriod[];
  topIssuers: DashboardTopIssuer[];
  recentOperations: DashboardRecentOperation[];
}