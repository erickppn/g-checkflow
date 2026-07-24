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
          checks: true,
        },
      });

      expect(prismaMock.provider.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaMock.operation.create).toHaveBeenCalledTimes(1);
      expect(result.summary).toEqual(calculateOperationSummary(expectedChecks));
    });

    it('deve lançar NotFoundException quando o provider não existir', async () => {
      const dto = makeCreateOperationDto({ providerId: 999 });

      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(operationsService.create(dto)).rejects.toThrow(NotFoundException);
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
      const dto = makeUpdateOperationDto({ providerId: 999 });

      prismaMock.operation.findUnique.mockResolvedValue(null);

      await expect(operationsService.update(400, dto)).rejects.toThrow(NotFoundException);

      expect(prismaMock.provider.findUnique).not.toHaveBeenCalled();
      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });

    it('deve lançar NotFoundException quando o provider não existir', async () => {
      const dto = makeUpdateOperationDto({ providerId: 999 });

      prismaMock.provider.findUnique.mockResolvedValue(null);

      await expect(operationsService.update(99, dto)).rejects.toThrow(NotFoundException);
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
        ...makeOperation({ id: 1 }),
        provider,
        checks: [
          makeCheck(),
        ],
      },
      {
        ...makeOperation({ id: 2 }),
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

      const result = await operationsService.findById(1);

      expect(result).toEqual(operations[1]);
    });

    it('deve lançar NotFoundException se a operação a ser atualizada não existir', async () => {
      prismaMock.operation.findUnique.mockResolvedValue(null);

      await expect(operationsService.findById(3)).rejects.toThrow(NotFoundException);
      expect(prismaMock.operation.findUnique).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('deve excluir uma operação, caso ela exista', async () => {
      const operation = makeOperation();

      prismaMock.operation.findUnique.mockResolvedValue(operation);
      prismaMock.operation.delete.mockResolvedValue(operation);

      await operationsService.delete(1);

      expect(prismaMock.operation.findUnique).toHaveBeenCalledTimes(1);

      expect(prismaMock.operation.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('deve lançar NotFoundException quando a operação não existir', async () => {
      prismaMock.operation.findUnique.mockResolvedValue(null);

      await expect(operationsService.delete(99)).rejects.toThrow(NotFoundException);
      expect(prismaMock.operation.delete).not.toHaveBeenCalled();
    });
  });
});