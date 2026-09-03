import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../infra/database/prisma.service';
import { CheckStatus } from '../../generated/prisma/enums';

import { roundMoney } from "@g-checkflow/shared/round-money";
import { calculateOperationSummary } from '@g-checkflow/shared/calculate-operation-summary';

@Injectable()
export class DashboardService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  private async getAttention() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [pendingChecks, nextDueCheck] = await Promise.all([
      this.prisma.check.count({
        where: {
          status: CheckStatus.PENDING,
        },
      }),

      this.prisma.check.findFirst({
        where: {
          status: CheckStatus.PENDING,
          dueDate: {
            gte: today,
          },
        },
        orderBy: {
          dueDate: "asc",
        },
        select: {
          dueDate: true,
          issuer: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      pendingChecks,
      nextDueCheck: nextDueCheck
        ? {
          issuerName: nextDueCheck.issuer.name,
          dueDate: nextDueCheck.dueDate,
        }
        : null,
    };
  }

  private async getSummary() {
    const [openOperations, aggregate] = await Promise.all([
      this.prisma.operation.count({
        where: { closedAt: null },
      }),
      this.prisma.check.aggregate({
        where: { status: CheckStatus.PENDING },
        _sum: {
          amount: true,
          interest: true,
        },
      }),
    ]);

    return {
      openOperations,
      receivables: roundMoney(Number(aggregate._sum.amount ?? 0)),
      providerInterest: roundMoney(Number(aggregate._sum.interest ?? 0)),
    };
  }

  private async getPortfolio() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const [overdueStats, upcomingStats] = await Promise.all([
      this.prisma.check.aggregate({
        where: {
          status: CheckStatus.PENDING,
          dueDate: {
            lt: today,
          },
        },
        _count: {
          _all: true,
        },
        _sum: {
          amount: true,
        },
      }),

      this.prisma.check.aggregate({
        where: {
          status: CheckStatus.PENDING,
          dueDate: {
            gte: today,
          },
        },
        _count: {
          _all: true,
        },
        _sum: {
          amount: true,
        },
      }),
    ]);

    return [
      {
        status: CheckStatus.PENDING,
        count: upcomingStats._count._all,
        amount: roundMoney(
          Number(upcomingStats._sum.amount ?? 0),
        ),
      },
      {
        status: "OVERDUE",
        count: overdueStats._count._all,
        amount: roundMoney(
          Number(overdueStats._sum.amount ?? 0),
        ),
      },
    ];
  }

  private async getDueByPeriod() {
    const now = new Date();

    const currentYear = now.getUTCFullYear();
    const currentMonth = now.getUTCMonth();

    const startDate = new Date(
      Date.UTC(
        currentYear,
        currentMonth - 2,
        1,
      ),
    );

    const endDate = new Date(
      Date.UTC(
        currentYear,
        currentMonth + 3,
        1,
      ),
    );

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const checks = await this.prisma.check.findMany({
      where: {
        status: {
          in: [
            CheckStatus.PENDING,
            CheckStatus.COMPENSATED,
            CheckStatus.RETURNED,
          ],
        },
        dueDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: {
        dueDate: true,
        amount: true,
        status: true,
      },
      orderBy: {
        dueDate: "asc",
      },
    });

    const periods = Array.from({ length: 5 }, (_, index) => {
      const date = new Date(
        Date.UTC(
          currentYear,
          currentMonth - 2 + index,
          1,
        ),
      );

      return {
        year: date.getUTCFullYear(),
        month: date.getUTCMonth() + 1,
        upcomingAmount: 0,
        overdueAmount: 0,
        compensatedAmount: 0,
        returnedAmount: 0,
      };
    });

    for (const check of checks) {
      const month = check.dueDate.getUTCMonth() + 1;
      const year = check.dueDate.getUTCFullYear();

      const period = periods.find(
        (period) =>
          period.year === year &&
          period.month === month,
      );

      if (!period) {
        continue;
      }

      if (check.status === CheckStatus.COMPENSATED) {
        period.compensatedAmount += Number(check.amount);
        continue;
      }

      if (check.status === CheckStatus.RETURNED) {
        period.returnedAmount += Number(check.amount);
        continue;
      }

      if (check.dueDate < today) {
        period.overdueAmount += Number(check.amount);
      } else {
        period.upcomingAmount += Number(check.amount);
      }
    }

    return periods.map((period) => ({
      ...period,
      upcomingAmount: roundMoney(period.upcomingAmount),
      overdueAmount: roundMoney(period.overdueAmount),
      compensatedAmount: roundMoney(period.compensatedAmount),
      returnedAmount: roundMoney(period.returnedAmount),
    }));
  }

  private async getTopIssuers() {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const topIssuers = await this.prisma.check.groupBy({
      by: ["issuerId"],
      where: {
        status: CheckStatus.PENDING,
        dueDate: {
          gte: today,
        },
      },
      _sum: {
        amount: true,
      },
      orderBy: {
        _sum: {
          amount: "desc",
        },
      },
      take: 5,
    });

    const issuers = await this.prisma.issuer.findMany({
      where: {
        id: {
          in: topIssuers.map((item) => item.issuerId),
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    const issuerMap = new Map(
      issuers.map((issuer) => [issuer.id, issuer.name]),
    );

    return topIssuers.flatMap((item) => {
      const issuerName = issuerMap.get(item.issuerId);

      if (!issuerName) {
        return [];
      }

      return [{
        issuerId: item.issuerId,
        issuerName,
        amount: roundMoney(Number(item._sum.amount ?? 0)),
      }];
    });
  }

  private async getRecentOperations() {
    const operations = await this.prisma.operation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        closedAt: true,
        number: true,
        provider: {
          select: {
            name: true,
          },
        },
        checks: {
          select: {
            amount: true,
            interest: true,
            netAmount: true,
          },
        },
      },
    });

    return operations.map((operation) => ({
      id: operation.id,
      createdAt: operation.createdAt,
      updatedAt: operation.updatedAt,
      closedAt: operation.closedAt,
      provider: operation.provider,
      number: operation.number,

      summary: calculateOperationSummary(
        operation.checks.map((check) => ({
          amount: Number(check.amount),
          interest: Number(check.interest),
          netAmount: Number(check.netAmount),
        })),
      ),
    }));
  }

  async getDashboard() {
    const [attention, summary, portfolio, dueByPeriod, topIssuers, recentOperations] = await Promise.all([
      this.getAttention(),
      this.getSummary(),
      this.getPortfolio(),
      this.getDueByPeriod(),
      this.getTopIssuers(),
      this.getRecentOperations(),
    ]);

    return {
      attention,
      summary,
      portfolio,
      dueByPeriod,
      topIssuers,
      recentOperations
    };
  }
}
