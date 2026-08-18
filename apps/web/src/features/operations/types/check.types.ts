export type CheckStatus =
  | "PENDING"
  | "COMPENSATED"
  | "RETURNED";

export interface CheckBase {
  id: number;

  issuerName: string;

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
}

export interface DraftCheck {
  issuerName: string
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
  issuerName: string
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