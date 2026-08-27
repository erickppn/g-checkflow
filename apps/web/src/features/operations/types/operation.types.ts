import type { Provider } from "../../providers/types/provider.types";
import type { Check, CreateCheckInput } from "./check.types";

export interface OperationBase {
  id: string;

  closedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface Operation extends OperationBase {
  provider: Provider;
  checks: Check[];
}

export interface OperationWithSummary {
  operation: Operation,
  summary: {
    checksCount: number
    grossAmount: number
    interest: number
    netAmount: number
  }
}

export interface CreateOperationInput {
  providerId: string
  checks: CreateCheckInput[]
}