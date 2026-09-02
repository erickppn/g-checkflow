import type { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import type { CheckListItem } from "../types/check.types";
import { currencyFormatter } from "@/utils";
import { banks } from "@/app/_auth/operacoes/nova";
import { format } from "date-fns";

export const checksColumns: ColumnDef<CheckListItem>[] = [
  {
    accessorKey: "issuer.name",
    header: "Emitente",

    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {row.original.issuer.name}
      </span>
    ),
  },

  {
    id: "provider",
    header: "Prestador",

    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.operation.provider.name}
      </span>
    ),
  },

  {
    accessorKey: "checkNumber",
    header: "Nº Cheque",

    cell: ({ row }) => (
      <span className="text-muted-foreground">
        {row.original.checkNumber}
      </span>
    ),
  },

  {
    accessorKey: "bankCode",
    header: "Banco",

    cell: ({ row }) => (
      <span>
        {banks.find(
          (bank) => bank.code === row.original.bankCode
        )?.name}
      </span>
    ),
  },

  {
    accessorKey: "amount",
    header: "Valor",

    cell: ({ row }) => (
      <span className="font-medium text-foreground">
        {currencyFormatter.format(row.original.amount)}
      </span>
    ),
  },

  {
    accessorKey: "dueDate",
    header: "Vencimento",

    cell: ({ row }) => {
      return (
        <span className="text-muted-foreground">
          {format(row.original.issueDate, "dd/MM/yyyy")}
        </span>
      );
    },
  },

  {
    accessorKey: "interestRate",
    header: "Taxa",

    cell: ({ row }) => (
      <span>{row.original.interestRate}%</span>
    ),
  },

  {
    accessorKey: "netAmount",
    header: "Líquido",

    cell: ({ row }) => (
      <span className="text-green-700">
        {currencyFormatter.format(row.original.netAmount)}
      </span>
    ),
  },

  {
    accessorKey: "status",
    header: "Status",

    cell: ({ row }) => {
      const status = row.original.status;

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

      const config = statusConfig[status];

      return (
        <Badge variant={config.variant}>
          {config.label}
        </Badge>
      );
    },
  },
];