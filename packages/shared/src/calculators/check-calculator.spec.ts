import { calculateCheck, CalculateCheckInput } from "./check-calculator.js";

describe("calculateCheck", () => {

  it("deve calcular corretamente um cheque conforme a planilha do Gustavo", () => {
    const input: CalculateCheckInput = {
      amount: 1100,
      interestRate: 4.5,
      operationDate: new Date(2026, 5, 19),
      dueDate: new Date(2026, 6, 20),
      compensationDays: 1,
    };

    const result = calculateCheck(input);

    expect(result).toEqual({
      days: 31,
      totalDays: 32,
      interest: 52.8,
      netAmount: 1047.2,
    });
  });

  it("deve calcular corretamente os dias até o vencimento", () => {
    const input: CalculateCheckInput = {
      amount: 1000,
      interestRate: 4.5,
      operationDate: new Date(2026, 5, 19),
      dueDate: new Date(2026, 5, 29),
      compensationDays: 1,
    };

    const result = calculateCheck(input);

    expect(result.days).toBe(10);
    expect(result.totalDays).toBe(11);
  });

  it("deve considerar corretamente diferentes taxas de juros", () => {
    const input: CalculateCheckInput = {
      amount: 1000,
      interestRate: 6,
      operationDate: new Date(2026, 5, 19),
      dueDate: new Date(2026, 6, 19),
      compensationDays: 0,
    };

    const result = calculateCheck(input);

    expect(result.interest).toBe(60);
    expect(result.netAmount).toBe(940);
  });

  it("deve considerar os dias adicionais de compensação", () => {
    const input: CalculateCheckInput = {
      amount: 1000,
      interestRate: 4.5,
      operationDate: new Date(2026, 5, 19),
      dueDate: new Date(2026, 6, 19),
      compensationDays: 5,
    };

    const result = calculateCheck(input);

    expect(result.days).toBe(30);
    expect(result.totalDays).toBe(35);
  });

  it("deve retornar zero dias quando o cheque estiver vencido", () => {
    const input: CalculateCheckInput = {
      amount: 1000,
      interestRate: 4.5,
      operationDate: new Date(2026, 6, 20),
      dueDate: new Date(2026, 6, 19),
      compensationDays: 0,
    };

    const result = calculateCheck(input);

    expect(result.days).toBe(0);
    expect(result.totalDays).toBe(0);
  });

  it("deve retornar zero dias se o cheque estiver vencido, mesmo se houver dias de compensação", () => {
    const input: CalculateCheckInput = {
      amount: 1000,
      interestRate: 4.5,
      operationDate: new Date(2026, 6, 20),
      dueDate: new Date(2026, 6, 19),
      compensationDays: 2, 
    };

    const result = calculateCheck(input);

    expect(result).toEqual({
      days: 0,
      totalDays: 0,
      interest: 0,
      netAmount: 1000,
    });
  });

  it("deve arredondar os valores monetários para duas casas decimais", () => {
    const input: CalculateCheckInput = {
      amount: 1234.56,
      interestRate: 4.73,
      operationDate: new Date(2026, 5, 19),
      dueDate: new Date(2026, 6, 20),
      compensationDays: 3,
    };

    const result = calculateCheck(input);

    expect(result).toEqual({
      days: 31,
      totalDays: 34,
      interest: 66.18,
      netAmount: 1168.38,
    });
  });
});
