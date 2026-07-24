import { Operation } from "../../src/generated/prisma/client";
import { CreateOperationDto } from "../../src/modules/operations/dtos/create-operation.dto";
import { UpdateOperationDto } from "../../src/modules/operations/dtos/update-operation.dto";
import { makeCreateCheckDto } from "./check.factory";

let id = 0;

export function makeOperation(
  overrides?: Partial<Operation>,
): Operation {
  id += 1;

  return {
    id,
    providerId: 1,
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
    providerId: 1,

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
    providerId: 1,

    checks: [
      makeCreateCheckDto(),
    ],

    ...overrides,
  };
}