import type { Issuer } from "@/features/issuers/types/issuers.types";

export type CheckStatus =
  | "PENDING"
  | "COMPENSATED"
  | "RETURNED";

export interface CheckBase {
  id: string;

  issuerId: string;

  bankCode: string;
  checkNumber: string;

  amount: string;
  interestRate: string;

  issueDate: string;
  dueDate: string;

  additionalDays: number;
}

export interface Check extends CheckBase {
  days: number;
  totalDays: number;

  interest: string;
  netAmount: string;

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