import { calculateOperationSummary } from "./operation-summary-calculator.js";

describe("calculateOperationSummary", () => {
  it("deve retornar um resumo vazio quando nenhum cheque for informado", () => {
    const summary = calculateOperationSummary([]);

    expect(summary).toEqual({
      checksCount: 0,
      grossAmount: 0,
      interest: 0,
      netAmount: 0,
    });
  });

  it("deve calcular corretamente o resumo de um único cheque", () => {
    const summary = calculateOperationSummary([
      {
        amount: 1000,
        interest: 45,
        netAmount: 955,
      },
    ]);

    expect(summary).toEqual({
      checksCount: 1,
      grossAmount: 1000,
      interest: 45,
      netAmount: 955,
    });
  });

  it("deve calcular corretamente o resumo de múltiplos cheques", () => {
    const summary = calculateOperationSummary([
      {
        amount: 1000,
        interest: 30,
        netAmount: 970,
      },
      {
        amount: 2500,
        interest: 100,
        netAmount: 2400,
      },
      {
        amount: 1000,
        interest: 15,
        netAmount: 985
      },
    ]);

    expect(summary).toEqual({
      checksCount: 3,
      grossAmount: 4500,
      interest: 145,
      netAmount: 4355
    });
  });

  it("deve arredondar corretamente os valores monetários do resumo", () => {
    const summary = calculateOperationSummary([
      {
        amount: 0.1,
        interest: 0.1,
        netAmount: 0.1,
      },
      {
        amount: 0.2,
        interest: 0.2,
        netAmount: 0.2,
      },
    ]);

    expect(summary).toEqual({
      checksCount: 2,
      grossAmount: 0.3,
      interest: 0.3,
      netAmount: 0.3,
    });
  });
});