import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from '../../infra/database/prisma.service';
import { makeCreateUserDto, makeUser } from '../../../test/factories/user.factory';
import { ConflictException } from '@nestjs/common';
import * as argon2 from "argon2";

describe('UsersService', () => {
  let usersService: UsersService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar um usuário com sucesso", async () => {
      const dto = makeCreateUserDto();

      const user = makeUser({
        name: dto.name,
        email: dto.email,
        role: dto.role,
        providerId: dto.providerId ?? null,
      });

      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue(user);

      const result = await usersService.create(dto);

      expect(result).toEqual({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        providerId: user.providerId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: dto.email,
        },
      });

      expect(prismaMock.user.create).toHaveBeenCalledTimes(1);

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          name: dto.name,
          email: dto.email,
          passwordHash: expect.any(String),
          role: dto.role,
          providerId: dto.providerId,
        },
      });

      const createCall = prismaMock.user.create.mock.calls[0];

      const passwordHash = createCall[0].data.passwordHash;

      expect(
        await argon2.verify(passwordHash, dto.password),
      ).toBe(true);

      expect(result).not.toHaveProperty("passwordHash");
    });

    it("deve lançar ConflictException se o email já estiver cadastrado", async () => {
      const dto = makeCreateUserDto();

      const existingUser = makeUser({
        email: dto.email,
      });

      prismaMock.user.findUnique.mockResolvedValue(existingUser);

      await expect(
        usersService.create(dto),
      ).rejects.toThrow(ConflictException);

      expect(prismaMock.user.create).not.toHaveBeenCalled();
    });
  });

  describe("findByEmail", () => {
    it("deve retornar o usuário pelo email", async () => {
      const user = makeUser();

      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await usersService.findByEmail(user.email);

      expect(result).toEqual(user);

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: user.email,
        },
      });
    });

    it("deve retornar null se o usuário não existir", async () => {
      const email = "naoexiste@potencialjeans.com.br";

      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await usersService.findByEmail(email);

      expect(result).toBeNull();

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          email,
        },
      });
    });
  });
});
