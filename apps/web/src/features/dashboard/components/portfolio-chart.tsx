import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

import type { DashboardPortfolioItem } from "../types/dashboard.types";
import { currencyFormatter } from "@/utils";

interface PortfolioChartProps {
  data: DashboardPortfolioItem[];
}

const chartConfig = {
  amount: {
    label: "Valor",
  },
  PENDING: {
    label: "A vencer",
    color: "var(--chart-1)",
  },
  OVERDUE: {
    label: "Vencido",
    color: "var(--color-destructive)",
  },
} satisfies ChartConfig;

export function PortfolioChart({ data }: PortfolioChartProps) {
  const chartData = data.map((item) => ({
    status: item.status,
    amount: item.amount,
    fill: chartConfig[item.status].color,
  }));

  return (
    <Card className="flex flex-col rounded-md shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] border border-slate-200/60 bg-card">
      <CardHeader>
        <CardTitle className="font-semibold">
          Situação da Carteira
        </CardTitle>

        <CardDescription>
          Distribuição entre cheques pendentes e vencidos
        </CardDescription>
      </CardHeader>

      <CardContent className="
        flex flex-1 items-center gap-4
        max-xl:flex-col
      ">
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-full max-w-56 shrink-0"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  nameKey="status"
                />
              }
            />

            <Pie
              data={chartData}
              dataKey="amount"
              nameKey="status"
              innerRadius={55}
              strokeWidth={2}
            >
            </Pie>
          </PieChart>
        </ChartContainer>

        <div className="
          flex min-w-0 flex-1 flex-col gap-5
          max-xl:flex-row
        ">
          {data.map((item) => {
            const config = chartConfig[item.status];

            return (
              <div
                key={item.status}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex min-w-0 items-start gap-2.5">
                  <span
                    className="mt-1.5 size-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />

                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-medium">
                      {config.label}
                    </span>

                    <span className="shrink-0 text-xs">
                      {currencyFormatter.format(item.amount)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  )
}
