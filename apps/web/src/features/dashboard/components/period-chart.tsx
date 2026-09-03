import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import type { DashboardDueByPeriod } from "../types/dashboard.types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { format } from "date-fns";

interface DueByPeriodChartProps {
  data: DashboardDueByPeriod[];
}

const chartConfig = {
  upcomingAmount: {
    label: "A vencer",
    color: "var(--chart-1)",
  },
  overdueAmount: {
    label: "Vencidos",
    color: "var(--color-destructive)",
  },
  compensatedAmount: {
    label: "Compensados",
    color: "var(--color-primary)",
  },
  returnedAmount: {
    label: "Devolvidos",
    color: "var(--warning)",
  },
} satisfies ChartConfig;

export function PeriodChart({ data }: DueByPeriodChartProps) {
  const chartData = data.map((item) => ({
    period: format(
      new Date(item.year, item.month - 1),
      "MMM",
    ),
    upcomingAmount: item.upcomingAmount,
    overdueAmount: item.overdueAmount,
    compensatedAmount: item.compensatedAmount,
    returnedAmount: item.returnedAmount,
  }));

  return (
    <Card className="flex flex-col rounded-md border border-slate-200/60 bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <CardHeader>
        <CardTitle>
          Recebíveis por Mês
        </CardTitle>

        <CardDescription>
          Volume total de compensações no período
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center px-6">
        <ChartContainer
          config={chartConfig}
          className="min-h-75 w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />

            <Bar
              dataKey="upcomingAmount"
              fill="var(--color-upcomingAmount)"
              radius={4}
            />

            <Bar
              dataKey="overdueAmount"
              fill="var(--color-overdueAmount)"
              radius={4}
            />

            <Bar
              dataKey="compensatedAmount"
              fill="var(--color-compensatedAmount)"
              radius={4}
            />

            <Bar
              dataKey="returnedAmount"
              fill="var(--color-returnedAmount)"
              radius={4}
            />
          </BarChart>

          <ChartLegend
            content={<ChartLegendContent />}
          />
        </ChartContainer>
      </CardContent>
    </Card>
  )
}