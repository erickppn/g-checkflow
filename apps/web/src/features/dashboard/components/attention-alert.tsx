import { Link } from "@tanstack/react-router";
import { AlertCircle, ArrowUpRight, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { DashboardAttention } from "../types/dashboard.types";

type AttentionAlertProps = DashboardAttention & {
  daysUntilDue: number | null;
};

export function AttentionAlert({
  pendingChecks,
  nextDueCheck,
  daysUntilDue,
}: AttentionAlertProps) {
  if (pendingChecks === 0) {
    return (
      <div className="relative flex items-center overflow-hidden rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-5 py-4">
        <div className="absolute inset-y-0 left-0 w-1 bg-emerald-500" />

        <div className="flex items-center gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
            <CircleCheck className="size-5 text-emerald-600" />
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-emerald-800">
              Tudo em dia
            </p>

            <p className="text-xs text-muted-foreground">
              Não há cheques pendentes de compensação.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="
      relative flex items-center justify-between overflow-hidden rounded-lg border bg-warning/10 px-5 py-4 animate-alert
      max-sm:flex-col
    ">
      <div className="absolute inset-y-0 left-0 w-1 bg-warning" />

      <div className="
        flex items-center gap-4
        max-sm:mb-3
      ">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-warning/15">
          <AlertCircle className="size-5 text-warning animateping" />
        </div>

        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-warning">
            {pendingChecks} cheques pendentes de compensação
          </p>

          <p className="text-xs text-muted-foreground">
            {nextDueCheck && daysUntilDue !== null
              ? `O próximo vencimento é de ${nextDueCheck.issuerName}, em ${daysUntilDue} dias.`
              : "Não há próximos vencimentos."}
          </p>
        </div>
      </div>

      <Button
        variant="link"
        className="h-auto shrink-0 px-2 py-1 font-semibold text-warning hover:text-warning/80 hover:cursor-pointer"
        nativeButton={false}
        render={<Link to="/cheques" search={{ status: "PENDING" }} />}
      >
        Revisar cheques
        <ArrowUpRight className="size-3.5" />
      </Button>
    </div>
  )
}