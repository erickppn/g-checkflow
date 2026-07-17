import { differenceInCalendarDays } from "date-fns";
import { roundMoney } from "../utils/round-money.js";

export interface CalculateCheckInput {
  amount: number;
  interestRate: number;
  operationDate: Date;
  dueDate: Date;
  compensationDays: number;
}

export interface CalculateCheckResult {
  days: number;
  totalDays: number;
  interest: number;
  netAmount: number;
}

export function calculateCheck(input: CalculateCheckInput,
) {
  const {
    amount,
    interestRate,
    operationDate,
    dueDate,
    compensationDays,
  } = input;

  // Calcula a diferença entre a data de vencimento e a data atual.
  // Math.max: Cheques vencidos não possuem dias negativos.
  const days = Math.max(
    differenceInCalendarDays(
      dueDate,
      operationDate,
    ), 0
  );

  const totalDays = days > 0 ? days + compensationDays : 0;

  // A taxa informada é mensal.
  // O cálculo utiliza juros simples proporcionais por dia.
  const dailyInterestRate = (interestRate / 100) / 30;

  const interest = amount * dailyInterestRate * totalDays;

  const netAmount = amount - interest;

  return {
    days,
    totalDays,
    interest: roundMoney(interest),
    netAmount: roundMoney(netAmount),
  };
}
