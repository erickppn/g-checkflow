import type { Issuer } from "@/features/issuers/types/issuers.types";

export type CheckStatus =
  | "PENDING"
  | "COMPENSATED"
  | "RETURNED";

export interface CheckBase {
  id: string;

  issuerId: string;

  operationId: string

  bankCode: string;
  checkNumber: string;

  amount: number;
  interestRate: number;

  issueDate: string;
  dueDate: string;

  additionalDays: number;
}

export interface Check extends CheckBase {
  days: number;
  totalDays: number;

  interest: number;
  netAmount: number;

  status: CheckStatus;
  returnReason: string | null;

  createdAt: string;
  updatedAt: string;

  issuer: Issuer
}

export interface DraftCheck {
  issuer: Issuer | null
  bankCode: string
  checkNumber: string
  amount: string
  interestRate: string
  issueDate: string
  dueDate: string
  additionalDays: string
}

export interface CalculatedCheck {
  id: string,
  issuer: Issuer
  bankCode: string
  checkNumber: string
  amount: number
  interestRate: number
  issueDate: Date
  dueDate: Date
  additionalDays: number

  days: number
  totalDays: number
  interest: number
  netAmount: number
}

export interface CreateCheckInput {
  issuerId: string
  bankCode: string
  checkNumber: string
  amount: number
  interestRate: number
  issueDate: string
  dueDate: string
  additionalDays: number
}

export interface UpdateCheckInput {
  issuerId?: string
  bankCode?: string
  checkNumber?: string
  amount?: number
  interestRate?: number
  issueDate?: string
  dueDate?: string
  additionalDays?: number
}

export interface ReturnCheckInput {
  returnReason: string
}

export interface UpdateCheckMutationInput {
  id: string
  data: UpdateCheckInput
}

export interface ReturnCheckMutationInput {
  id: string
  data: ReturnCheckInput
}

export interface CheckActionResponse {
  check: Check;
  operation: {
    closedAt: string | null;
  };
}

export interface DeleteCheckResponse {
  operationId: string;
  closedAt: string | null;
}

export interface GetChecksParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: CheckStatus;
  providerId?: string;
  issuerId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CheckListItem extends Check {
  operation: {
    id: string;
    provider: {
      id: string;
      name: string;
    };
  };
}

export interface ChecksListResponse {
  data: CheckListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}