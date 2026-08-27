import { Operation } from "../../src/generated/prisma/client";
import { CreateOperationDto } from "../../src/modules/operations/dtos/create-operation.dto";
import { UpdateOperationDto } from "../../src/modules/operations/dtos/update-operation.dto";
import { makeCreateCheckDto } from "./check.factory";

export function makeOperation(
  overrides?: Partial<Operation>,
): Operation {
  return {
    id: crypto.randomUUID(),
    providerId: crypto.randomUUID(),
    closedAt: null,

    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides,
  };
}

export function makeCreateOperationDto(
  overrides?: Partial<CreateOperationDto>,
): CreateOperationDto {
  return {
    providerId: crypto.randomUUID(),

    checks: [
      makeCreateCheckDto(),
    ],

    ...overrides,
  };
}


export function makeUpdateOperationDto(
  overrides?: Partial<UpdateOperationDto>,
): UpdateOperationDto {
  return {
    providerId: crypto.randomUUID(),

    checks: [
      makeCreateCheckDto(),
    ],

    ...overrides,
  };
}