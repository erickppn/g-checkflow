import type { DashboardTopIssuer } from "../types/dashboard.types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { currencyFormatter } from "@/utils";

interface TopIssuersChartProps {
  data: DashboardTopIssuer[];
}

export function TopIssuersChart({ data }: TopIssuersChartProps) {

  return (
    <Card className="flex flex-col rounded-md border border-slate-200/60 bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <CardHeader>
        <CardTitle className="font-semibold">
          Maiores emitentes a vencer
        </CardTitle>

        <CardDescription>
          Principais origens de cheques a vencer
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-5">
        {data.map((item) => (
          <div key={item.issuerId}>
            <div className="mb-1 flex items-center justify-between gap-4">
              <span className="truncate text-sm font-medium">
                {item.issuerName}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-2 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{
                    width: `${(item.amount / data[0].amount) * 100}%`,
                  }}
                />

              </div>

              <span className="shrink-0 text-sm font-medium">
                {currencyFormatter.format(item.amount)}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}