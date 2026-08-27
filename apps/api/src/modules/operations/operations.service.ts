import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../infra/database/prisma.service";
import { CreateOperationDto } from "./dtos/create-operation.dto";
import { calculateCheck } from "@g-checkflow/shared/calculate-check";
import { calculateOperationSummary } from "@g-checkflow/shared/calculate-operation-summary"
import { UpdateOperationDto } from "./dtos/update-operation.dto";

@Injectable()
export class OperationsService {
  constructor(
    private readonly prisma: PrismaService
  ) { }

  private async findOperationOrFail(id: string) {
    const operation = await this.prisma.operation.findUnique({
      where: { id }
    });

    if (!operation) throw new NotFoundException('Operation not found');

    return operation;
  }

  private async findProviderOrFail(id: string) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) throw new NotFoundException('Provider not found');

    return provider;
  }

  async create(data: CreateOperationDto) {
    const provider = await this.findProviderOrFail(data.providerId);

    const issuerIds = [
      ...new Set(data.checks.map((check) => check.issuerId)),
    ];

    const issuers = await this.prisma.issuer.findMany({
      where: {
        id: {
          in: issuerIds,
        },
      },
      select: {
        id: true,
      },
    });

    const foundIssuerIds = new Set(
      issuers.map((issuer) => issuer.id),
    );

    const missingIssuerId = issuerIds.find(
      (id) => !foundIssuerIds.has(id),
    );

    if (missingIssuerId) {
      throw new NotFoundException("Issuer not found");
    }

    const calculatedChecks = data.checks.map((check) => {
      const calculatedFinancials = calculateCheck(check);

      return {
        ...check,
        ...calculatedFinancials,
      };
    });

    const operation = await this.prisma.operation.create({
      data: {
        providerId: provider.id,

        checks: {
          create: calculatedChecks,
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

    const summary = calculateOperationSummary(calculatedChecks);

    return {
      operation,
      summary
    }
  }

  async update(id: string, data: UpdateOperationDto) {
    await this.findOperationOrFail(id);

    const provider = await this.findProviderOrFail(data.providerId);

    const calculatedChecks = data.checks.map((check) => {
      const calculatedFinancials = calculateCheck(check);

      return {
        ...check,
        ...calculatedFinancials,
      };
    });

    const summary = calculateOperationSummary(calculatedChecks);

    const updatedOperation = await this.prisma.operation.update({
      where: {
        id,
      },

      data: {
        providerId: provider.id,

        checks: {
          deleteMany: {},

          create: calculatedChecks,
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

    return {
      operation: updatedOperation,
      summary,
    }
  }

  async findAll() {
    return this.prisma.operation.findMany({
      include: {
        provider: true,
        checks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string) {
    const operation = await this.prisma.operation.findUnique({
      where: { id },

      include: {
        provider: true,
        checks: {
          include: {
            issuer: true
          }
        }
      }
    });

    if (!operation) throw new NotFoundException('Operation not found');

    return operation;
  }

  async delete(id: string) {
    await this.findOperationOrFail(id);

    await this.prisma.operation.delete({
      where: { id },
    });
  }
}