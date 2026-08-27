import { TestingModule, Test } from "@nestjs/testing";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

import { PrismaService } from "../../infra/database/prisma.service";
import { IssuersService } from "./issuers.service";
import { normalizeIssuerName } from "@g-checkflow/shared/normalize-ussuer-name";
import { makeCreateIssuerDto, makeIssuer, makeUpdateIssuerDto } from "../../../test/factories/issuer.factory";
import { Prisma } from "../../generated/prisma/client";
import { ConflictException, NotFoundException } from "@nestjs/common";

describe("IssuersService", () => {
  let issuersService: IssuersService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IssuersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    issuersService = module.get<IssuersService>(IssuersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("deve criar um novo issuer com sucesso", async () => {
      const dto = makeCreateIssuerDto();

      const issuer = makeIssuer({
        name: dto.name,
        normalizedName: normalizeIssuerName(dto.name),
      });

      prismaMock.issuer.create.mockResolvedValue(issuer);

      const result = await issuersService.create(dto);

      expect(result).toEqual(issuer);

      expect(prismaMock.issuer.create).toHaveBeenCalledWith({
        data: {
          ...dto,
          normalizedName: normalizeIssuerName(dto.name),
        },
      });
    });

    it("deve lançar ConflictException se o issuer já existir", async () => {
      const dto = makeCreateIssuerDto();

      const error = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          code: "P2002",
          clientVersion: Prisma.prismaVersion.client,
        },
      );

      prismaMock.issuer.create.mockRejectedValue(error);

      await expect(
        issuersService.create(dto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("findAll", () => {
    it("deve retornar todos os issuers", async () => {
      const issuers = [
        makeIssuer(),
        makeIssuer(),
        makeIssuer(),
      ];

      prismaMock.issuer.findMany.mockResolvedValue(issuers);

      const result = await issuersService.findAll();

      expect(result).toEqual(issuers);

      expect(prismaMock.issuer.findMany).toHaveBeenCalledWith({
        where: {
          normalizedName: {
            contains: "",
          },
        },
        orderBy: {
          name: "asc",
        },
        take: 5,
      });
    });

    it("deve retornar issuers filtrados pela busca", async () => {
      const searchTerm = "João";
      const expectedNormalized = normalizeIssuerName(searchTerm);

      const issuers = [
        makeIssuer({
          name: "João da Silva",
          normalizedName: normalizeIssuerName("João da Silva"),
        }),
        makeIssuer({
          name: "João Pereira",
          normalizedName: normalizeIssuerName("João Pereira"),
        }),
      ];

      prismaMock.issuer.findMany.mockResolvedValue(issuers);

      const result = await issuersService.findAll("João");

      expect(result).toEqual(issuers);

      expect(prismaMock.issuer.findMany).toHaveBeenCalledWith({
        where: {
          normalizedName: {
            contains: expectedNormalized,
          },
        },
        orderBy: {
          name: "asc",
        },
        take: 5,
      });
    });


  });

  describe("findById", () => {
    it("deve retornar o issuer se ele existir", async () => {
      const issuer = makeIssuer();

      prismaMock.issuer.findUnique.mockResolvedValue(issuer);

      const result = await issuersService.findById(issuer.id);

      expect(result).toEqual(issuer);

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: { id: issuer.id },
      });
    });

    it("deve lançar NotFoundException se o issuer não existir", async () => {
      prismaMock.issuer.findUnique.mockResolvedValue(null);

      const id = crypto.randomUUID();

      await expect(
        issuersService.findById(id)
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe("update", () => {
    it("deve atualizar o issuer com sucesso se ele existir", async () => {
      const issuer = makeIssuer();

      const dto = makeUpdateIssuerDto({
        name: "João da Silva Alterado",
      });

      prismaMock.issuer.findUnique.mockResolvedValue(issuer);

      const updatedIssuer = {
        ...issuer,
        name: dto.name,
        normalizedName: normalizeIssuerName(dto.name),
      };

      prismaMock.issuer.update.mockResolvedValue(updatedIssuer);

      const result = await issuersService.update(issuer.id, dto);

      expect(result).toEqual(updatedIssuer);

      expect(prismaMock.issuer.update).toHaveBeenCalledWith({
        where: {
          id: issuer.id,
        },
        data: {
          ...dto,
          normalizedName: normalizeIssuerName(dto.name),
        },
      });

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: {
          id: issuer.id,
        },
      });

      expect(prismaMock.issuer.update).toHaveBeenCalledTimes(1);
    });

    it("deve lançar NotFoundException ao tentar atualizar um issuer inexistente", async () => {
      const id = crypto.randomUUID();
      const dto = makeUpdateIssuerDto();

      prismaMock.issuer.findUnique.mockResolvedValue(null);

      await expect(
        issuersService.update(id, dto)
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.issuer.update).not.toHaveBeenCalled();

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it("deve lançar ConflictException se o novo nome do issuer já existir", async () => {
      const issuer = makeIssuer();

      const dto = makeUpdateIssuerDto({
        name: "João da Silva",
      });

      prismaMock.issuer.findUnique.mockResolvedValue(issuer);

      const error = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed",
        {
          code: "P2002",
          clientVersion: Prisma.prismaVersion.client,
        },
      );

      prismaMock.issuer.update.mockRejectedValue(error);

      await expect(
        issuersService.update(issuer.id, dto)
      ).rejects.toThrow(ConflictException);

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: { id: issuer.id },
      });

      expect(prismaMock.issuer.update).toHaveBeenCalledTimes(1);
    });
  });

  describe("delete", () => {
    it("deve deletar o issuer se ele existir", async () => {
      const issuer = makeIssuer();

      prismaMock.issuer.findUnique.mockResolvedValue(issuer);
      prismaMock.issuer.delete.mockResolvedValue(issuer);

      const result = await issuersService.delete(issuer.id);

      expect(result).toEqual(issuer);

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: { id: issuer.id },
      });

      expect(prismaMock.issuer.delete).toHaveBeenCalledWith({
        where: { id: issuer.id },
      });
    });

    it("deve lançar NotFoundException ao tentar deletar um issuer inexistente", async () => {
      const id = crypto.randomUUID();

      prismaMock.issuer.findUnique.mockResolvedValue(null);

      await expect(
        issuersService.delete(id)
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: { id },
      });

      expect(prismaMock.issuer.delete).not.toHaveBeenCalled();
    });
  });
});