import type { Provider } from "../../providers/provider.types";
import type { Check } from "./check.types";

export interface OperationBase {
  id: number;

  closedAt: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface Operation extends OperationBase {
  provider: Provider;
  checks: Check[];
}