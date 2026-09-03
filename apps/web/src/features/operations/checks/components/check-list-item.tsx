import { currencyFormatter } from "@/utils";
import type { Check } from "../types/check.types";
import { Badge } from "@/components/ui/badge";
import { banks } from "@/app/_auth/operacoes/nova";
import { format } from "date-fns";

interface OperationCheckListItemProps {
  check: Check;
  isSelected?: boolean;
}

const statusLabels = {
  PENDING: "Pendente",
  COMPENSATED: "Compensado",
  RETURNED: "Devolvido",
} as const;

const statusConfig = {
  PENDING: {
    label: "Pendente",
    variant: "secondary" as const,
  },
  COMPENSATED: {
    label: "Compensado",
    variant: "default" as const,
  },
  RETURNED: {
    label: "Devolvido",
    variant: "destructive" as const,
  },
};

export function CheckListItem({
  check,
  isSelected,
}: OperationCheckListItemProps) {
  const config = statusConfig[check.status];

  return (
    <div
      className="w-full relative flex items-center gap-4 px-6 py-3 border-t"
    >
      {isSelected && (
        <span className="absolute inset-y-0 inset-x-0 left-0 w-0.75 bg-blue-500" />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3">
          <span className="truncate font-medium">
            {check.issuer.name}
          </span>

          <Badge variant={config.variant}>
            {statusLabels[check.status]}
          </Badge>
        </div>

        <span className="text-xs text-start text-muted-foreground mt-0.5">
          {banks.find(
            (bank) => bank.code === check.bankCode,
          )?.name}{" "}
          • Nº {check.checkNumber}
        </span>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <span>
            Bruto{" "}
            <strong>
              {currencyFormatter.format(check.amount)}
            </strong>
          </span>

          <span>
            Jur.{" "}
            <strong className="text-red-400">
              {currencyFormatter.format(check.interest)}
            </strong>
            {" · "}
            {check.interestRate}%
          </span>

          <span>
            Venc.{" "}
            {format(check.dueDate, "dd/MM/yy")}
            {" · "}
            {check.totalDays}d
          </span>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <span className="font-medium text-green-700">
          {currencyFormatter.format(check.netAmount)}
        </span>

        <p className="text-xs text-muted-foreground">
          líquido
        </p>
      </div>
    </div>
  );
}