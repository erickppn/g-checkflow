import { roundMoney } from "../utils/round-money.js";

export interface CalculateOperationSummaryInput {
  amount: number;
  interest: number;
  netAmount: number;
}

export interface CalculateOperationSummaryResult {
  checksCount: number;

  grossAmount: number;
  interest: number;
  netAmount: number;
}

export function calculateOperationSummary(
  checks: CalculateOperationSummaryInput[],
): CalculateOperationSummaryResult {
  const summary = checks.reduce(
    (acc, check) => {
      acc.checksCount += 1;

      acc.grossAmount += check.amount;
      acc.interest += check.interest;
      acc.netAmount += check.netAmount;

      return acc;
    },
    {
      checksCount: 0,
      grossAmount: 0,
      interest: 0,
      netAmount: 0,
    },
  );

  return {
    checksCount: summary.checksCount,
    grossAmount: roundMoney(summary.grossAmount),
    interest: roundMoney(summary.interest),
    netAmount: roundMoney(summary.netAmount),
  }
}
