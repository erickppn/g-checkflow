import { normalizeIssuerName } from "@g-checkflow/shared/normalize-ussuer-name";
import { Issuer } from "../../src/generated/prisma/client";
import { CreateIssuerDto } from "../../src/modules/issuers/dto/create-issuer.dto";
import { UpdateIssuerDto } from "../../src/modules/issuers/dto/update-issuer.dto";

export function makeIssuer(
  overrides?: Partial<Issuer>
): Issuer {
  const id = crypto.randomUUID();
  const name = `Issuer Teste ${id}`;

  return {
    id,
    name: `Issuer Teste ${id}`,
    normalizedName: normalizeIssuerName(name),
    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides,
  };
}

export function makeCreateIssuerDto(
  overrides?: Partial<CreateIssuerDto>
): CreateIssuerDto {
  return {
    name: "João da Silva",

    ...overrides,
  };
}

export function makeUpdateIssuerDto(
  overrides?: Partial<UpdateIssuerDto>
): UpdateIssuerDto {
  return {
    name: "João da Silva Alterado",

    ...overrides,
  };
}