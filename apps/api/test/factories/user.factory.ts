import { User, UserRole } from "../../src/generated/prisma/client";
import { LoginDto } from "../../src/modules/auth/dto/login.dto";
import { CreateUserDto } from "../../src/modules/users/dto/create-user.dto";

export function makeUser(overrides: Partial<User> = {}): User {
  return {
    id: crypto.randomUUID(),
    name: "Gustavo Silva",
    email: "gustavo@potencialjeans.com.br",
    passwordHash: "$argon2id$...",
    role: UserRole.MASTER,
    providerId: null,
    createdAt: new Date(),
    updatedAt: new Date(),

    ...overrides,
  };
}

export function makeCreateUserDto(
  overrides: Partial<CreateUserDto> = {},
): CreateUserDto {
  return {
    name: "Gustavo Silva",
    email: "gustavo@potencialjeans.com.br",
    password: "senha123",
    role: UserRole.MASTER,
    providerId: undefined,

    ...overrides,
  };
}

export function makeLoginDto(
  overrides: Partial<LoginDto> = {},
): LoginDto {
  return {
    email: "gustavo@potencialjeans.com.br",
    password: "senha123",

    ...overrides,
  };
}