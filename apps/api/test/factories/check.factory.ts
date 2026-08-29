import { Check as PrismaCheck, CheckStatus, Prisma } from "../../src/generated/prisma/client";
import { UpdateCheckDto } from "../../src/modules/operations/checks/dtos/update-check.dto";
import { CreateCheckDto } from "../../src/modules/operations/dtos/create-check.dto";

type FactoryCheck = Omit<
  PrismaCheck,
  "amount" | "interestRate" | "interest" | "netAmount"
> & {
  amount: number;
  interestRate: number;
  interest: number;
  netAmount: number;
};

let checkNumber = 0;

export function makeCheck(overrides?: Partial<FactoryCheck>): FactoryCheck {
  checkNumber += 1;

  return {
    id: crypto.randomUUID(),
    operationId: crypto.randomUUID(),

    issuerId: crypto.randomUUID(),
    bankCode: "341",
    checkNumber: checkNumber.toString().padStart(8, "0"),
    amount: 1000.00,
    interestRate: 4.5,
    issueDate: new Date("2026-06-19"),
    dueDate: new Date("2026-07-19"),
    additionalDays: 1,

    days: 30,
    totalDays: 31,
    interest: 45.00,
    netAmount: 955.00,

    status: CheckStatus.PENDING,
    returnReason: null,

    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides
  }
}

function toPrismaCheck(check: FactoryCheck): PrismaCheck {
  return {
    ...check,
    amount: new Prisma.Decimal(check.amount),
    interestRate: new Prisma.Decimal(check.interestRate),
    interest: new Prisma.Decimal(check.interest),
    netAmount: new Prisma.Decimal(check.netAmount),
  };
}

export function makePrismaCheck(
  overrides?: Partial<FactoryCheck>,
): PrismaCheck {
  return toPrismaCheck(makeCheck(overrides));
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

export function makeUpdateCheckDto(
  overrides?: Partial<UpdateCheckDto>,
): UpdateCheckDto {
  return {
    issuerId: crypto.randomUUID(),
    bankCode: "341",
    checkNumber: "00000001",
    amount: 1100,
    interestRate: 3.5,
    issueDate: new Date("2026-06-19"),
    dueDate: new Date("2026-07-19"),
    additionalDays: 2,

    ...overrides,
  };
}