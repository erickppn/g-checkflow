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

  private async findOperationOrFail(id: number) {
    const operation = await this.prisma.operation.findUnique({
      where: { id }
    });

    if (!operation) throw new NotFoundException('Operation not found');

    return operation;
  }

  private async findProviderOrFail(id: number) {
    const provider = await this.prisma.provider.findUnique({
      where: { id },
    });

    if (!provider) throw new NotFoundException('Provider not found');

    return provider;
  }

  async create(data: CreateOperationDto) {
    const provider = await this.findProviderOrFail(data.providerId);

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
        checks: true,
      },
    });

    const summary = calculateOperationSummary(calculatedChecks);

    return {
      operation,
      summary
    }
  }

  async update(id: number, data: UpdateOperationDto) {
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
        checks: true,
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

  async findById(id: number) {
    const operation = await this.prisma.operation.findUnique({
      where: { id },

      include: {
        provider: true,
        checks: true
      }
    });

    if (!operation) throw new NotFoundException('Operation not found');

    return operation;
  }

  async delete(id: number) {
    await this.findOperationOrFail(id);

    await this.prisma.operation.delete({
      where: { id },
    });
  }
}