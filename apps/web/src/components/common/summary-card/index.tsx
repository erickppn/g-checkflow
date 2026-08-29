import { useMemo } from "react";
import { BarChart3, DollarSign, Loader2, Percent } from "lucide-react";

import { calculateOperationSummary } from "@g-checkflow/shared/calculate-operation-summary";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { CalculatedCheck, Check } from "@/features/operations/checks/types/check.types";
import { currencyFormatter } from "@/utils";

interface SummaryCardProps {
  checks: CalculatedCheck[] | Check[];
  onAction: () => void;
  actionLabel?: string
  actionIcon?: React.ReactNode
  isSaving?: boolean
}

export function SummaryCard({ checks, onAction, actionIcon, actionLabel, isSaving }: SummaryCardProps) {
  const summary = useMemo(() => {
    return calculateOperationSummary(checks);
  }, [checks]);

  return (
    <Card className="h-fit rounded-md border border-border bg-card shadow-sm max-xl:p-0">
      <CardHeader className="max-xl:hidden">
        <div className="flex items-center justify-between gap-6">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Resumo da operação
            </CardTitle>

            <CardDescription className="mt-0.5 text-xs text-muted-foreground">
              Principais valores da operação.
            </CardDescription>
          </div>

          <div className="
            flex size-8 items-center justify-center rounded-lg bg-blue-600/10 text-primary
            max-2xl:hidden
          ">
            <BarChart3 className="size-4.5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0 max-xl:flex flex-wrap">
        <div className="flex items-end gap-2 border-t px-4 py-3 flex-1 max-xl:items-center">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-slate-900">
              {checks.length}
            </span>

            <span className="text-xs font-normal text-slate-500 ">
              {(checks.length > 1 || checks.length == 0) ? "cheques" : "cheque"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t px-4 py-3 flex-1">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap">
              Valor bruto total
            </span>

            <span className="text-lg font-bold text-slate-900">
              {currencyFormatter.format(summary.grossAmount)}
            </span>
          </div>

        </div>

        <div className="flex items-center gap-2 border-t px-4 py-3 flex-1">
          <div className="flex  flex-col gap-1">
            <span className="flex items-center gap-1 text-xs font-medium text-slate-500 whitespace-nowrap">
              <Percent className="size-4 text-rose-500" /> 
              Total de juros
            </span>

            <p className="text-lg font-bold text-slate-900">
              {currencyFormatter.format(summary.interest)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items gap-1 border-y border-emerald-300 bg-emerald-50/30 px-4 py-3 flex-1 max-xl:border-b-0">
          <span className="flex items-center gap-1 text-xs text-emerald-600 whitespace-nowrap">
            <DollarSign className="size-4" />
            Valor líquido total
          </span>

          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {currencyFormatter.format(summary.netAmount)}
          </p>
        </div>

        <div className="mt-4 mx-4 flex items-center max-xl:basis-full max-xl:my-2">
          <Button 
            className="w-full py-4" 
            onClick={onAction}
            disabled={isSaving}
          >
            { !isSaving ? (
              <>
                {actionIcon}

                <span className="max-md:hidden">
                  {actionLabel}
                </span>
              </>
            ) : (
              <Loader2 className="animate-spin"/>
            )}
            
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}