import { DeepMockProxy, mockDeep } from "jest-mock-extended";
import { ChecksService } from "./checks.service";
import { PrismaService } from "../../../infra/database/prisma.service";
import { Test, TestingModule } from "@nestjs/testing";
import { makeCheck, makeCreateCheckDto, makePrismaCheck, makeUpdateCheckDto } from "../../../../test/factories/check.factory";
import { makeIssuer } from "../../../../test/factories/issuer.factory";
import { calculateCheck } from "@g-checkflow/shared/calculate-check";
import { CheckStatus, Prisma } from "../../../generated/prisma/client";
import { makeOperation } from "../../../../test/factories/operation.factory";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("ChecksService", () => {
  let checksService: ChecksService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaService>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChecksService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    checksService = module.get<ChecksService>(ChecksService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("update", () => {
    it("deve atualizar o cheque com sucesso", async () => {
      const operation = makeOperation();

      const issuer = makeIssuer();

      const check = makeCheck({
        issuerId: issuer.id,
        operationId: operation.id
      });

      const dto = makeUpdateCheckDto({
        issuerId: check.issuerId,
        amount: 2000,
        interestRate: 5,
      });

      const updatedCheck = makeCheck({
        ...check,

        ...dto,
        updatedAt: new Date(),
      });

      prismaMock.check.findUnique.mockResolvedValue(makePrismaCheck(check));

      prismaMock.issuer.findUnique.mockResolvedValue(issuer);

      prismaMock.check.update.mockResolvedValue(makePrismaCheck(updatedCheck));

      const expectedFinancials = calculateCheck(dto);

      const result = await checksService.update(check.id, dto);

      expect(result).toEqual(updatedCheck);

      expect(prismaMock.check.update).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },

        data: {
          ...dto,
          ...expectedFinancials,
        },

        include: {
          issuer: true,
        },
      });

      expect(prismaMock.check.update).toHaveBeenCalledTimes(1);
    });

    it("deve lançar NotFoundException ao tentar atualizar um cheque inexistente", async () => {
      const dto = makeUpdateCheckDto();

      prismaMock.check.findUnique.mockResolvedValue(null);

      await expect(
        checksService.update("7b9a8c1234ef456789abcdef01234567", dto)
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.check.findUnique).toHaveBeenCalledWith({
        where: {
          id: "7b9a8c1234ef456789abcdef01234567",
        },
      });

      expect(prismaMock.check.update).not.toHaveBeenCalled();
    });

    it("deve lançar NotFoundException ao tentar atualizar com um emitente inexistente", async () => {
      const check = makeCheck();

      const dto = makeUpdateCheckDto({
        issuerId: crypto.randomUUID(),
      });

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.issuer.findUnique.mockResolvedValue(null);

      await expect(
        checksService.update(check.id, dto),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.issuer.findUnique).toHaveBeenCalledWith({
        where: {
          id: dto.issuerId,
        },
      });

      expect(prismaMock.check.update).not.toHaveBeenCalled();
    });
  });

  describe("compensate", () => {
    it("deve compensar um cheque pendente com sucesso", async () => {
      const operation = makeOperation();

      const issuer = makeIssuer();

      const check = makeCheck({
        operationId: operation.id,
        issuerId: issuer.id,
        status: CheckStatus.PENDING,
      });

      const compensatedCheck = makeCheck({
        ...check,
        status: CheckStatus.COMPENSATED,
        issuerId: issuer.id,
      });

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.update.mockResolvedValue(
        makePrismaCheck(compensatedCheck),
      );

      prismaMock.check.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1);

      const result = await checksService.compensate(check.id);

      expect(result).toEqual({
        check: compensatedCheck,
        operation: {
          closedAt: undefined,
        },
      });

      expect(prismaMock.check.update).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },
        data: {
          status: CheckStatus.COMPENSATED,
        },
        include: {
          issuer: true,
        },
      });

      expect(prismaMock.check.update).toHaveBeenCalledTimes(1);
    });

    it("deve compensar um cheque devolvido com sucesso", async () => {
      const operation = makeOperation();

      const issuer = makeIssuer();

      const returnReason = "Cheque sem fundos";

      const check = makeCheck({
        operationId: operation.id,
        issuerId: issuer.id,
        status: CheckStatus.RETURNED,
        returnReason,
      });

      const compensatedCheck = makeCheck({
        ...check,
        status: CheckStatus.COMPENSATED,
        returnReason,
      });

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.update.mockResolvedValue(
        makePrismaCheck(compensatedCheck),
      );

      prismaMock.check.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);

      const closedAt = new Date();

      prismaMock.operation.update.mockResolvedValue({
        ...operation,
        closedAt,
      });

      const result = await checksService.compensate(check.id);

      expect(result).toEqual({
        check: compensatedCheck,
        operation: {
          closedAt,
        },
      });

      expect(prismaMock.check.update).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },
        data: {
          status: CheckStatus.COMPENSATED,
        },
        include: {
          issuer: true,
        },
      });
    });

    it("deve fechar a operação quando o cheque compensado era o último pendente", async () => {
      const operation = makeOperation();

      const issuer = makeIssuer();

      const check = makeCheck({
        operationId: operation.id,
        issuerId: issuer.id,
        status: CheckStatus.PENDING,
      });

      const compensatedCheck = makeCheck({
        ...check,
        status: CheckStatus.COMPENSATED,
        issuerId: issuer.id,
      });

      const closedAt = new Date();

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.update.mockResolvedValue(
        makePrismaCheck(compensatedCheck),
      );

      prismaMock.check.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);

      prismaMock.operation.update.mockResolvedValue({
        ...operation,
        closedAt,
      });

      const result = await checksService.compensate(check.id);

      expect(result).toEqual({
        check: compensatedCheck,
        operation: {
          closedAt,
        },
      });

      expect(prismaMock.operation.update).toHaveBeenCalledWith({
        where: {
          id: operation.id,
        },
        data: {
          closedAt: expect.any(Date),
        },
      });

      expect(prismaMock.operation.update).toHaveBeenCalledTimes(1);
    });

    it("deve lançar BadRequestException ao tentar compensar um cheque já compensado", async () => {
      const check = makeCheck({
        status: CheckStatus.COMPENSATED,
      });

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      await expect(
        checksService.compensate(check.id),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.check.findUnique).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },
      });

      expect(prismaMock.check.update).not.toHaveBeenCalled();
      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });
  });

  describe("returnCheck", () => {
    it("deve devolver um cheque pendente com sucesso", async () => {
      const operation = makeOperation();

      const issuer = makeIssuer();

      const check = makeCheck({
        operationId: operation.id,
        issuerId: issuer.id,
        status: CheckStatus.PENDING,
      });

      const returnReason = "Cheque sem fundos";

      const returnedCheck = makeCheck({
        ...check,
        status: CheckStatus.RETURNED,
        returnReason,
        issuerId: issuer.id,
      });

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.update.mockResolvedValue(
        makePrismaCheck(returnedCheck),
      );

      prismaMock.check.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1);

      const result = await checksService.return(check.id, { returnReason });

      expect(result).toEqual({
        check: returnedCheck,
        operation: {
          closedAt: undefined,
        },
      });

      expect(prismaMock.check.update).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },
        data: {
          status: CheckStatus.RETURNED,
          returnReason,
        },
        include: {
          issuer: true,
        },
      });

      expect(prismaMock.check.update).toHaveBeenCalledTimes(1);

      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });

    it("deve fechar a operação quando o cheque devolvido era o último pendente", async () => {
      const operation = makeOperation();

      const issuer = makeIssuer();

      const check = makeCheck({
        operationId: operation.id,
        issuerId: issuer.id,
        status: CheckStatus.PENDING,
      });

      const returnReason = "Cheque sem fundos";

      const returnedCheck = makeCheck({
        ...check,
        status: CheckStatus.RETURNED,
        returnReason,
        issuerId: issuer.id,
      });

      const closedAt = new Date();

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.update.mockResolvedValue(
        makePrismaCheck(returnedCheck),
      );

      prismaMock.check.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);

      prismaMock.operation.update.mockResolvedValue({
        ...operation,
        closedAt,
      });

      const result = await checksService.return(check.id, { returnReason });

      expect(result).toEqual({
        check: returnedCheck,
        operation: {
          closedAt,
        },
      });

      expect(prismaMock.operation.update).toHaveBeenCalledWith({
        where: {
          id: operation.id,
        },
        data: {
          closedAt: expect.any(Date),
        },
      });

      expect(prismaMock.operation.update).toHaveBeenCalledTimes(1);
    });

    it("deve lançar BadRequestException ao tentar devolver um cheque que não está pendente", async () => {
      const check = makeCheck({
        status: CheckStatus.COMPENSATED,
      });

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      const returnReason = "Cheque sem fundos";

      await expect(
        checksService.return(check.id, { returnReason }),
      ).rejects.toThrow(BadRequestException);

      expect(prismaMock.check.findUnique).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },
      });

      expect(prismaMock.check.update).not.toHaveBeenCalled();
      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });
  });

  describe("delete", () => {
    it("deve deletar um cheque com sucesso sem fechar a operação", async () => {
      const operation = makeOperation();

      const check = makeCheck({
        operationId: operation.id,
        status: CheckStatus.PENDING,
      });

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.delete.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.count
        .mockResolvedValueOnce(2)
        .mockResolvedValueOnce(1);

      const result = await checksService.delete(check.id);

      expect(result).toEqual({
        operationId: operation.id,
        closedAt: undefined,
      });

      expect(prismaMock.check.delete).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },
      });

      expect(prismaMock.check.delete).toHaveBeenCalledTimes(1);

      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });

    it("deve fechar a operação quando o cheque deletado era o último pendente", async () => {
      const operation = makeOperation();

      const check = makeCheck({
        operationId: operation.id,
        status: CheckStatus.PENDING,
      });

      const closedAt = new Date();

      prismaMock.check.findUnique.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.delete.mockResolvedValue(
        makePrismaCheck(check),
      );

      prismaMock.check.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0);

      prismaMock.operation.update.mockResolvedValue({
        ...operation,
        closedAt,
      });

      const result = await checksService.delete(check.id);

      expect(result).toEqual({
        operationId: operation.id,
        closedAt,
      });

      expect(prismaMock.check.delete).toHaveBeenCalledWith({
        where: {
          id: check.id,
        },
      });

      expect(prismaMock.operation.update).toHaveBeenCalledWith({
        where: {
          id: operation.id,
        },
        data: {
          closedAt: expect.any(Date),
        },
      });

      expect(prismaMock.operation.update).toHaveBeenCalledTimes(1);
    });

    it("deve lançar NotFoundException ao tentar deletar um cheque inexistente", async () => {
      const checkId = crypto.randomUUID();

      prismaMock.check.findUnique.mockResolvedValue(null);

      await expect(
        checksService.delete(checkId),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.check.findUnique).toHaveBeenCalledWith({
        where: {
          id: checkId,
        },
      });

      expect(prismaMock.check.delete).not.toHaveBeenCalled();
      expect(prismaMock.operation.update).not.toHaveBeenCalled();
    });
  });
});