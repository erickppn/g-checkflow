import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { DashboardRecentOperation } from "../types/dashboard.types";
import { format } from "date-fns";
import { currencyFormatter } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";

interface RecentOperationsTableProps {
  data: DashboardRecentOperation[];
}

export function RecentOperations({
  data,
}: RecentOperationsTableProps) {
  return (
    <Card className="flex flex-col rounded-md border border-slate-200/60 bg-card shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)]">
      <CardHeader>
        <CardTitle className="font-semibold">
          Operações recentes
        </CardTitle>

        <CardDescription>
          Últimas operações criadas ou atualizadas.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted hover:bg-muted/90 uppercase text-[11px] font-bold tracking-wider">
              <TableHead>Operação</TableHead>

              <TableHead className="max-[560px]:hidden">
                Prestador
              </TableHead>

              <TableHead className="text-center max-md:hidden">
                Cheques
              </TableHead>

              <TableHead>Valor líquido</TableHead>

              <TableHead className="max-lg:hidden">
                Juros previstos
              </TableHead>

              <TableHead>Status</TableHead>

              <TableHead className="max-sm:hidden">
                Atualizado em
              </TableHead>

              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((operation) => {
              const isClosed = !!operation.closedAt;

              return (
                <TableRow key={operation.id}>
                  <TableCell>
                    <span className="font-medium">
                      #{operation.number}
                    </span>
                  </TableCell>

                  <TableCell className="max-[560px]:hidden">
                    <span>{operation.provider.name}</span>
                  </TableCell>

                  <TableCell className="text-center max-md:hidden">
                    <span>{operation.summary.checksCount}</span>
                  </TableCell>

                  <TableCell>
                    <span className="text-green-700">
                      {currencyFormatter.format(
                        operation.summary.netAmount,
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="max-lg:hidden">
                    <span className="text-red-600">
                      {currencyFormatter.format(
                        operation.summary.interest,
                      )}
                    </span>
                  </TableCell>

                  <TableCell className="max-sm:hidden">
                    <Badge variant={isClosed ? "default" : "secondary"}>
                      <span>
                        {isClosed ? "Fechada" : "Aberta"}
                      </span>
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <span className="max-[420px]:hidden">
                      {format(
                        new Date(operation.updatedAt),
                        "dd/MM/yyyy HH:mm",
                      )}
                    </span>

                    <span className="min-[420px]:hidden">
                      {format(
                        new Date(operation.updatedAt),
                        "dd/MM/yyyy",
                      )}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="hover:cursor-pointer"
                        nativeButton={false}
                      >
                        <Link
                          to="/operacoes/$id"
                          params={{ id: operation.id }}
                        >
                          <ArrowUpRight />

                          <span className="sr-only">
                            Abrir operação
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}