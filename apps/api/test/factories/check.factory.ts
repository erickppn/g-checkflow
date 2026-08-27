import { Check, CheckStatus, Prisma } from "../../src/generated/prisma/client";
import { CreateCheckDto } from "../../src/modules/operations/dtos/create-check.dto";

let checkNumber = 0;

export function makeCheck(overrides?: Partial<Check>): Check {
  checkNumber += 1;

  return {
    id: crypto.randomUUID(),
    operationId: crypto.randomUUID(),

    issuerId: crypto.randomUUID(),
    bankCode: "341",
    checkNumber: checkNumber.toString().padStart(8, "0"),
    amount: new Prisma.Decimal(1000.00),
    interestRate: new Prisma.Decimal(4.5),
    issueDate: new Date("2026-06-19"),
    dueDate: new Date("2026-07-19"),
    additionalDays: 1,

    days: 30,
    totalDays: 31,
    interest: new Prisma.Decimal(45.00),
    netAmount: new Prisma.Decimal(955.00),

    status: CheckStatus.PENDING,
    returnReason: null,

    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides
  }
}

export function makeCreateCheckDto(
  overrides?: Partial<CreateCheckDto>,
): CreateCheckDto {
  return {
    issuerId: crypto.randomUUID(),
    bankCode: "341",
    checkNumber: "00000001",
    amount: 1000,
    interestRate: 4.5,
    issueDate: new Date("2026-06-19"),
    dueDate: new Date("2026-07-19"),
    additionalDays: 1,

    ...overrides,
  };
}