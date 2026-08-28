import { useState } from "react";
import { CornerDownLeft, EllipsisVertical, Pen, Trash2 } from "lucide-react";
import { format } from "date-fns";

import { Kbd } from "@/components/ui/kbd";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableFooter } from "@/components/ui/table";

import { currencyFormatter } from "@/utils";
import { CheckForm } from "./check-form";

import { banks } from "@/app/_auth/operacoes/nova";
import type { ProviderWithOperationsCount } from "@/features/providers/types/provider.types";
import type { CalculatedCheck } from "../types/check.types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface ChecksTableProps {
  checks: CalculatedCheck[];
  onAddCheck: (check: CalculatedCheck) => void;
  onUpdateCheck: (check: CalculatedCheck) => void;
  currentProvider: ProviderWithOperationsCount | null;
  onRemoveCheck: (checkId: string) => void;
}

export function ChecksTable({
  checks,
  onAddCheck,
  currentProvider,
  onRemoveCheck,
  onUpdateCheck
}: ChecksTableProps) {
  const [editingCheck, setEditingCheck] = useState<CalculatedCheck | null>(null);

  function handleEditCheck(check: CalculatedCheck) {
    setEditingCheck(check)
  }

  function handleUpdateCheck(check: CalculatedCheck) {
    onUpdateCheck(check)
    setEditingCheck(null)
  }

  return (
    <section className="
      flex flex-1 flex-col overflow-hidden rounded-md border border-borde bg-card shadow-sm
      max-md:hidden
    ">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Cheques da operação</h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Digite na última linha e pressione Enter para adicionar o próximo.
          </p>
        </div>

        <div className="flex items-center gap-1">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
            <Kbd className="inline-flex items-center gap-1 font-sans text-xs font-medium">
              <CornerDownLeft className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
              <span>Enter</span>
            </Kbd>
            <span>adiciona</span>
          </div>

          <span className="text-slate-300 dark:text-slate-600">•</span>

          <div className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-400">
            <Kbd className="font-sans text-xs font-medium">↹ Tab</Kbd>
            <span>navega</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow className="bg-muted hover:bg-muted/90 uppercase text-[11px] font-bold tracking-wider">
              <TableHead className="w-2 text-center">#</TableHead>
              <TableHead className="min-w-32.5">Emitente</TableHead>
              <TableHead className="min-w-32.5">Banco</TableHead>
              <TableHead className="w-24">Nº Cheque</TableHead>
              <TableHead className="min-w-28">Valor</TableHead>
              <TableHead className="w-28">Data de registro</TableHead>
              <TableHead className="w-28">Vencimento</TableHead>
              <TableHead className="w-20 text-center">Taxa</TableHead>
              <TableHead className="w-16 text-center">Comp</TableHead>
              <TableHead className="w-16 text-center">Dias</TableHead>
              <TableHead className="w-24 text-right">Juros</TableHead>
              <TableHead className="w-28 text-right">Líquido</TableHead>
              <TableHead className="w-10 text-center"><span className="sr-only">Ações</span></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {checks.map((check, i) => (
              <TableRow
                key={check.id + i}
                className={
                  editingCheck?.id === check.id
                    ? "bg-blue-50/60"
                    : ""
                }
              >
                <TableCell className="text-center text-muted-foreground relative">
                  {editingCheck?.id === check.id && (
                    <span className="absolute inset-y-0 left-0 w-0.75 bg-blue-500" />
                  )}

                  {i + 1}
                </TableCell>

                <TableCell>
                  {check.issuer.name}
                </TableCell>

                <TableCell>
                  {banks.find((bank) => bank.code === check.bankCode)?.name}
                </TableCell>

                <TableCell>
                  {check.checkNumber}
                </TableCell>

                <TableCell>
                  R$ {check.amount}
                </TableCell>

                <TableCell>
                  {format(check.issueDate, "dd/MM/yyyy")}
                </TableCell>

                <TableCell>
                  {format(check.dueDate, "dd/MM/yyyy")}
                </TableCell>

                <TableCell className="text-center">
                  {check.interestRate}%
                </TableCell>

                <TableCell className="text-center">
                  {check.additionalDays}
                </TableCell>

                <TableCell className="text-center">
                  {check.totalDays}
                </TableCell>

                <TableCell className="text-right text-red-600">
                  {currencyFormatter.format(check.interest)}
                </TableCell>

                <TableCell className="text-right text-green-700">
                  {currencyFormatter.format(check.netAmount)}
                </TableCell>

                <TableCell className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={
                        <Button variant="ghost" size="icon-sm">
                          <EllipsisVertical />
                        </Button>
                      }
                    />

                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <DropdownMenuItem
                          onClick={() => handleEditCheck(check)}
                        >
                          <Pen />
                          Editar
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => onRemoveCheck(check.id)}
                          variant="destructive"
                        >
                          <Trash2 />
                          Deletar
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>

          <TableFooter className="sticky bottom-0 z-10 bg-card">
            <CheckForm
              checks={checks}
              currentProvider={currentProvider}
              editingCheck={editingCheck}
              onAddCheck={onAddCheck}
              onUpdateCheck={handleUpdateCheck}
              onCancelEdit={() => setEditingCheck(null)}
            />
          </TableFooter>
        </Table>
      </div>
    </section>
  )
}