import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { OperationsService } from "./operations.service";
import { PrismaService } from "../../infra/database/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { makeCreateOperationDto, makeOperation, makeUpdateOperationDto } from "../../../test/factories/operation.factory";
import { makeCheck, makeCreateCheckDto } from "../../../test/factories/check.factory";
import { makeProvider } from "../../../test/factories/provider.factory";
import { calculateCheck } from "@g-checkflow/shared/calculate-check";
import { NotFoundException } from "@nestjs/common";
import { calculateOperationSummary } from "@g-checkflow/shared/calculate-operation-summary";
import { makeIssuer } from "../../../test/factories/issuer.factory";

describe('OperationsService', () => {
  let operationsService: OperationsService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OperationsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    operationsService = module.get<OperationsService>(OperationsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it("deve criar uma operação e retornar o resumo", async () => {
      const dto = makeCreateOperationDto({
        checks: [
          makeCreateCheckDto(),
          makeCreateCheckDto(),
        ],
      });

      const provider = makeProvider({
        id: dto.providerId,
      });

      const operation = makeOperation({
        providerId: provider.id,
      });

      const issuers = dto.checks.map((check) =>
        makeIssuer({
          id: check.issuerId,
        }),
      );

      prismaMock.issuer.findMany.mockResolvedValue(issuers);

      const checks = [
        makeCheck({
          operationId: operation.id,
        }),
        makeCheck({
          operationId: operation.id,
        }),
      ];

      const operationWithRelations = {
        ...operation,

        provider,
        checks,
      };

      prismaMock.provider.findUnique.mockResolvedValue(provider);
      prismaMock.operation.create.mockResolvedValue(operationWithRelations);

      const expectedChecks = dto.checks.map(check => ({
        ...check,
        ...calculateCheck(check),
      }));

      const result = await operationsService.create(dto);

      expect(result.operation).toEqual(operationWithRelations);

      expect(prismaMock.operation.create).toHaveBeenCalledWith({
        data: {
          providerId: provider.id,
          checks: {
            create: expectedChecks,
          },
        },

        include: {
          provider: true,
          checks: {
            include: {
              issuer: true
            }
          },
        },
      });

      expect(prismaMock.provider.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.operation.create).toHaveBeenCalledTimes(1);
      expect(result.summary).toEqual(calculateOperationSummary(expectedChecks));
    });

    it('deve lançar NotFoundException quando o provider não existir', async () => {
      const dto = makeCreateOperationDto({ providerId: "7b9a8c1234ef456789abcdef01234567" });

      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(operationsService.create(dto)).rejects.toThrow(NotFoundException);
      expect(prismaMock.operation.create).not.toHaveBeenCalled();
    });

    it("deve lançar NotFoundException se algum issuer não existir", async () => {
      const dto = makeCreateOperationDto();

      const provider = makeProvider({
        id: dto.providerId,
      });

      prismaMock.provider.findUnique.mockResolvedValue(
        makeProvider({
          id: dto.providerId,
        }),
      );

      const existingIssuerId = dto.checks[0].issuerId;
      const missingIssuerId = crypto.randomUUID();

      dto.checks.push(
        makeCreateCheckDto({
          issuerId: missingIssuerId,
        }),
      );

      const existingIssuer = makeIssuer({
        id: existingIssuerId,
      });

      prismaMock.issuer.findMany.mockResolvedValue([
        existingIssuer,
      ]);

      await expect(
        operationsService.create(dto),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.issuer.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: [existingIssuerId, missingIssuerId],
          },
        },
        select: {
          id: true,
        },
      });

      expect(prismaMock.operation.create).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('deve atualizar uma operação e retornar o resumo', async () => {
      const dto = makeUpdateOperationDto();

      const provider = makeProvider({
        id: dto.providerId,
      });

      const operation = makeOperation({
        providerId: provider.id,
      });

      const checks = [
        makeCheck({
          operationId: operation.id,
        }),
        makeCheck(),
      ];

      const operationWithRelations = {
        ...operation,
        provider,
        checks,
      };

      prismaMock.operation.findUnique.mockResolvedValue(operation);
      prismaMock.provider.findUnique.mockResolvedValue(provider);

      prismaMock.operation.update.mockResolvedValue(operationWithRelations);

      const expectedChecks = dto.checks.map(check => ({
        ...check,
        ...calculateCheck(check),
      }));

      const result = await operationsService.update(operation.id, dto);

      expect(result.operation).toEqual(operationWithRelations);

      expect(result.summary).toEqual(calculateOperationSummary(expectedChecks));

      expect(prismaMock.operation.update).toHaveBeenCalledWith({
        where: {
          id: operation.id
        },

        data: {
          providerId: provider.id,

          checks: {
            deleteMany: {},

            create: expectedChecks,
          },
        },

        include: {
          provider: true,
          checks: true,
        },
      });

      expect(prismaMock.operation.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.provider.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.operation.update).toHaveBeenCalledTimes(1);
    });

    it('deve lançar NotFoundException se a operação a ser atualizada não existir', async () => {
      const dto = makeUpdateOperationDto({ providerId: "7b9a8c12-34ef-4567-89ab-cdef01234567" });

      prismaMock.operation.findUnique.mockResolvedValue(null);

      await expect(operationsService.update("7b9a8c1234ef456789abcdef01234568", dto)).rejects.toThrow(NotFoundException);

      expect(prismaMock.provider.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando o provider não existir', async () => {
      const dto = makeUpdateOperationDto({ providerId: "7b9a8c12-34ef-4567-89ab-cdef01234567" });

      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(operationsService.update("7b9a8c1234ef456789abcdef01234564", dto)).rejects.toThrow(NotFoundException);
      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('deve retornar todas as operações ordenadas pelas mais recentes', async () => {
      const provider1 = makeProvider();
      const provider2 = makeProvider();

      const operations = [
        {
          ...makeOperation(),
          provider1,
          checks: [
            makeCheck(),
            makeCheck(),
          ],
        },
        {
          ...makeOperation(),
          provider2,
          checks: [
            makeCheck(),
          ],
        },
        {
          ...makeOperation(),
          provider2,
          checks: [
            makeCheck(),
            makeCheck(),
            makeCheck(),
          ],
        },
      ];

      prismaMock.operation.findMany.mockResolvedValue(operations);

      const result = await operationsService.findAll();

      expect(result).toEqual(operations);
      expect(prismaMock.operation.findMany).toHaveBeenCalledWith({
        include: { provider: true, checks: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    const provider = makeProvider();

    const operations = [
      {
        ...makeOperation({ id: "7b9a8c12-34ef-4567-89ab-cdef01234567" }),
        provider,
        checks: [
          makeCheck(),
        ],
      },
      {
        ...makeOperation({ id: "7b9a8c12-34ef-4567-89ab-cdef01234568" }),
        provider,
        checks: [
          makeCheck(),
          makeCheck(),
          makeCheck(),
        ],
      },
    ];

    it('deve retornar uma operação se ela existir', async () => {
      prismaMock.operation.findUnique.mockResolvedValue(operations[1]);

      const result = await operationsService.findById("7b9a8c12-34ef-4567-89ab-cdef01234567");

      expect(result).toEqual(operations[1]);
    });

    it('deve lançar NotFoundException se a operação a ser atualizada não existir', async () => {
      prismaMock.operation.findUnique.mockResolvedValue(null);

      await expect(operationsService.findById("7b9a8c1234ef456789abcdef01234570")).rejects.toThrow(NotFoundException);
      expect(prismaMock.operation.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('deve excluir uma operação, caso ela exista', async () => {
      const operation = makeOperation({
        id: crypto.randomUUID()
      });

      prismaMock.operation.findUnique.mockResolvedValue(operation);
      prismaMock.operation.delete.mockResolvedValue(operation);

      await operationsService.delete(operation.id);

      expect(prismaMock.operation.findUnique).toHaveBeenCalledTimes(1);

      expect(prismaMock.operation.delete).toHaveBeenCalledWith({
        where: { id: operation.id },
      });
    });

    it('deve lançar NotFoundException quando a operação não existir', async () => {
      prismaMock.operation.findUnique.mockResolvedValue(null);

      await expect(operationsService.delete("7b9a8c1234ef456789abcdef01234607")).rejects.toThrow(NotFoundException);
      expect(prismaMock.operation.delete).not.toHaveBeenCalled();
    });
  });
});