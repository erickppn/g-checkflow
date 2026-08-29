import type { ColumnDef } from "@tanstack/react-table"

import type { Check } from "../types/check.types"
import { banks } from "@/app/_auth/operacoes/nova"
import { currencyFormatter } from "@/utils"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { CircleCheck, MoreHorizontal, Pen, Trash2, Undo2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CheckAction } from "../components/operation-checks-table"

const statusLabels = {
  PENDING: "Pendente",
  COMPENSATED: "Compensado",
  RETURNED: "Devolvido",
} as const;

export function getOperationCheckColumns(
  setCheckAction: ({ type, check }: CheckAction) => void,
): ColumnDef<Check>[] {
  return [
    {
      id: "issuer",
      header: "Emitente",
      cell: ({ row }) => (
        <span>{row.original.issuer.name}</span>
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
      accessorKey: "checkNumber",
      header: "Nº Cheque",
    },

    {
      accessorKey: "amount",
      header: "Valor",
      cell: ({ row }) => (
        <span>
          {currencyFormatter.format(row.original.amount)}
        </span>
      ),
    },

    {
      id: "period",
      header: "Período",
      cell: ({ row }) => (
        <span>
          {format(row.original.issueDate, "dd/MM/yyyy")} —{" "}
          {format(row.original.dueDate, "dd/MM/yyyy")}
        </span>
      ),
    },

    {
      accessorKey: "interestRate",
      header: "Taxa",
      cell: ({ row }) => (
        <span>{row.original.interestRate}%</span>
      ),
    },

    {
      accessorKey: "additionalDays",
      header: "Comp.",
      cell: ({ row }) => (
        <span>{row.original.additionalDays}</span>
      ),
    },

    {
      accessorKey: "totalDays",
      header: "Dias",
      cell: ({ row }) => (
        <span>{row.original.totalDays}</span>
      ),
    },

    {
      accessorKey: "interest",
      header: "Juros",
      cell: ({ row }) => (
        <span className="text-red-600">
          {currencyFormatter.format(row.original.interest)}
        </span>
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

        return (
          <span>
            {statusLabels[status]}
          </span>
        );
      },
    },

    {
      id: "actions",
      header: () => <div className="text-center">Ações</div>,

      cell: ({ row }) => {
        const check = row.original

        return (
          <div className="flex items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="hover:cursor-pointer"
                  />
                }
              >
                <MoreHorizontal />
                <span className="sr-only">Ações do cheque</span>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => setCheckAction({
                    type: "edit",
                    check,
                  })}
                >
                  <Pen />
                  Editar
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => setCheckAction({
                    type: "delete",
                    check,
                  })}
                >
                  <Trash2 />
                  Excluir
                </DropdownMenuItem>

                {check.status === "PENDING" && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem 
                      onClick={() => setCheckAction({
                        type: "compensate",
                        check
                      })}
                    >
                      <CircleCheck />
                      Compensar
                    </DropdownMenuItem>

                    <DropdownMenuItem 
                      onClick={() => setCheckAction({
                        type: "return",
                        check
                      })}
                    >
                      <Undo2 />
                      Devolver
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
      },
    },
  ]
}