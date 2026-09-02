import type { ColumnDef } from "@tanstack/react-table"

import type { Check } from "../types/check.types"
import { banks } from "@/app/_auth/operacoes/nova"
import { currencyFormatter } from "@/utils"
import { addDays, format } from "date-fns"
import { Button } from "@/components/ui/button"
import { CircleCheck, Info, MoreHorizontal, Pen, Trash2, Undo2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { CheckAction } from "../components/operation-checks-table"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Badge } from "@/components/ui/badge"

const statusLabels = {
  PENDING: "Pendente",
  COMPENSATED: "Compensado",
  RETURNED: "Devolvido",
} as const;

export function getOperationCheckColumns(
  setCheckAction: ({ type, check }: CheckAction) => void,
  selectedRowId?: string
): ColumnDef<Check>[] {
  return [
    {
      id: "issuer",
      header: "Emitente",
      cell: ({ row }) => {
        const isSelected = row.original.id === selectedRowId;

        return (
          <>
            {isSelected && (<span className="absolute inset-y-0 left-0 w-0.75 bg-blue-500" />)}

            <span>{row.original.issuer.name}</span>
          </>
        )
      },
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
          {format(
            addDays(
              new Date(row.original.dueDate),
              row.original.additionalDays,
            ),
            "dd/MM/yyyy",
          )}
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
        const check = row.original

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
          <div>
            <HoverCard>
              <HoverCardTrigger
                className="flex items-center gap-1.5 cursor-help"
                render={
                  <Badge variant={config.variant}>
                    <Info className="size-3.5" />

                    <span>{statusLabels[status]}</span>
                  </Badge>
                }
              />

              <HoverCardContent>
                <div className="space-y-1">
                  <p className="text-sm font-medium">

                    {statusLabels[status] === "Devolvido" ? (
                      <span>
                        Motivo da devolução
                      </span>
                    ) : statusLabels[status] === "Compensado" ? (
                      <span>
                        Cheque compensado
                      </span>
                    ) : (
                      <span>
                        Cheque pendente
                      </span>
                    )}
                  </p>

                  {statusLabels[status] === "Devolvido" && (
                    <p className="text-sm text-muted-foreground">
                      {check.returnReason}
                    </p>
                  )}
                </div>
              </HoverCardContent>
            </HoverCard>
          </div>
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