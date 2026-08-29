import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../../infra/database/prisma.service";
import { UpdateCheckDto } from "./dtos/update-check.dto";
import { calculateCheck } from "@g-checkflow/shared/calculate-check";
import { CheckStatus } from "../../../generated/prisma/enums";
import { ReturnCheckDto } from "./dtos/return-check.dto";
import { Check } from "../../../generated/prisma/client";

function serializeCheck(check: Check) {
  return {
    ...check,
    amount: Number(check.amount),
    interestRate: Number(check.interestRate),
    interest: Number(check.interest),
    netAmount: Number(check.netAmount),
  };
}

@Injectable()
export class ChecksService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  private async findCheckOrFail(id: string) {
    const check = await this.prisma.check.findUnique({
      where: { id },
    })

    if (!check) {
      throw new NotFoundException("Check not found")
    }

    return check
  }

  private async findIssuerOrFail(id: string) {
    const issuer = await this.prisma.issuer.findUnique({
      where: { id },
    });

    if (!issuer) {
      throw new NotFoundException("Issuer not found");
    }

    return issuer;
  }

  private async checkAndCloseOperation(operationId: string) {
    const [totalChecks, pendingChecks] = await Promise.all([
      this.prisma.check.count({
        where: { operationId },
      }),

      this.prisma.check.count({
        where: {
          operationId,
          status: CheckStatus.PENDING,
        },
      }),
    ]);

    if (totalChecks === 0 || pendingChecks > 0) {
      return;
    }

    const closedOperation = await this.prisma.operation.update({
      where: { id: operationId },
      data: {
        closedAt: new Date(),
      },
    });

    return closedOperation.closedAt;
  }

  async update(id: string, data: UpdateCheckDto) {
    await this.findCheckOrFail(id);

    if (data.issuerId) {
      await this.findIssuerOrFail(data.issuerId);
    }

    const calculatedFinancials = calculateCheck(data);

    const updatedCheck = await this.prisma.check.update({
      where: { id },
      data: {
        ...data,
        ...calculatedFinancials,
      },
      include: {
        issuer: true,
      },
    });

    return serializeCheck(updatedCheck);
  }

  async compensate(id: string) {
    const check = await this.findCheckOrFail(id);

    if (check.status !== CheckStatus.PENDING) {
      throw new BadRequestException(
        "Only pending checks can be compensated"
      );
    }

    const compensatedCheck = await this.prisma.check.update({
      where: { id },
      data: {
        status: CheckStatus.COMPENSATED,
      },
      include: {
        issuer: true,
      },
    });

    const closedAt = await this.checkAndCloseOperation(check.operationId,);

    return {
      check: serializeCheck(compensatedCheck),
      operation: {
        closedAt,
      },
    };
  }

  async return(id: string, data: ReturnCheckDto) {
    const check = await this.findCheckOrFail(id);

    if (check.status !== CheckStatus.PENDING) {
      throw new BadRequestException(
        "Only pending checks can be returned"
      );
    }

    const returnedCheck = await this.prisma.check.update({
      where: { id },
      data: {
        status: CheckStatus.RETURNED,
        returnReason: data.returnReason,
      },
      include: {
        issuer: true,
      }
    });

    const closedAt = await this.checkAndCloseOperation(check.operationId);

    return {
      check: serializeCheck(returnedCheck),
      operation: {
        closedAt,
      },
    };
  }

  async delete(id: string) {
    const check = await this.findCheckOrFail(id);

    await this.prisma.check.delete({
      where: { id },
    });

    const closedAt = await this.checkAndCloseOperation(check.operationId);

    return {
      operationId: check.operationId,
      closedAt
    };
  }
}