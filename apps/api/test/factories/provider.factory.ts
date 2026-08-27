import { Prisma, Provider } from "../../src/generated/prisma/client";
import { CreateProviderDto } from "../../src/modules/providers/dto/create-provider.dto";
import { UpdateProviderDto } from "../../src/modules/providers/dto/update-provider.dto";


export function makeProvider(overrides?: Partial<Provider>): Provider {
  let id = crypto.randomUUID();
  
  return {
    id,
    name: `Provider Teste ${id}`,
    phone: null,
    notes: null,
    defaultCompensationDays: 1,
    defaultInterestRate: new Prisma.Decimal(4.5),
    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides
  }
}

export function makeCreateProviderDto(overrides?: Partial<CreateProviderDto>): CreateProviderDto {
  return {
    name: "Gustavo Fornecedor",
    phone: '(11) 99999-9999',
    defaultCompensationDays: 1,
    defaultInterestRate: 4.5,

    ...overrides
  }
}

export function makeUpdateProviderDto(overrides?: Partial<UpdateProviderDto>): UpdateProviderDto {
  return {
    name: "Gustavo Alterado",

    ...overrides
  }
}