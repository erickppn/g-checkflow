import { PageTitle } from '@/components/common/page-title';
import { SummaryCard } from '@/components/common/summary-card';
import { PageContainer } from '@/components/layout/page-container';
import { OperationChecksTable } from '@/features/operations/checks/components/operation-checks-table';
import { operationsQueries, useOperation } from '@/features/operations/operations.queries'
import { ProviderAvatar } from '@/features/providers/components/provider-avatar';
import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns';
import { CheckCircle2, CircleDot, Clock3, FileText, Percent } from 'lucide-react';

type checkSearch = {
  checkId?: string
}

export const Route = createFileRoute('/_auth/operacoes/$id/')({
  loader: ({ context: { queryClient }, params: { id } }) => {
    return queryClient.ensureQueryData(
      operationsQueries.findById(id)
    )
  },

  validateSearch: (search: Record<string, unknown>): checkSearch => {
    return {
      checkId: typeof search.checkId === 'string' ? search.checkId : undefined,
    }
  },

  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams();
  const { checkId } = Route.useSearch();

  const { data: operation } = useOperation(id);

  return (
    <div className="flex flex-1 overflow-hidden flex-col min-w-0">
      <section className="
        flex flex-col border-b border-border bg-card/80 px-8 
        max-md:px-4
      ">
        <div className="
          w-full grid grid-cols-[minmax(0,1fr)_100px_100px] gap-4 items-start max-w-440 mx-auto py-3 
          max-lg:grid-ols-2
        ">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Cliente
            </span>

            <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm">
              <ProviderAvatar
                className="size-6 text-[10px]"
                name={operation.provider.name}
              />

              <span className="text-foreground">
                {operation.provider.name}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Taxa padrão
            </span>

            <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm">
              <Percent className="size-4 text-muted-foreground" />

              <span className="text-muted-foreground">
                {operation.provider.defaultInterestRate}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-full">
            <span className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Comp. padrão
            </span>
            <div className="flex h-10 items-center gap-2 rounded-lg border bg-background px-3 text-sm">
              <Clock3 className="size-4 text-muted-foreground" />

              <span className="text-muted-foreground">
                {operation.provider.defaultCompensationDays ?? 0} {operation.provider.defaultCompensationDays != 1 ? "dias" : "dia"}
              </span>
            </div>
          </div>
        </div>
      </section>

      <PageContainer>
        <div className="flex min-h-0 flex-col gap-6 max-w-440 flex-1 mx-auto w-full relative">
          <div className="
            flex justify-between items-center
            max-[420px]:flex-col
          ">
            <PageTitle
              title={`Operação #${operation.number}`}
              subtitle="Gerencie os cheques e acompanhe o andamento da operação."
            />

            <div className="
              flex flex-col items-end gap-1 text-right
              max-[420px]:mt-3
            ">
              {operation.closedAt ? (
                <>
                  <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-700 whitespace-nowrap">
                    <CheckCircle2 className="size-4" />
                    Operação fechada
                  </div>

                  <span className="text-xs text-muted-foreground">
                    {format(
                      new Date(operation.closedAt),
                      "dd/MM/yyyy 'às' HH:mm"
                    )}
                  </span>
                </>
              ) : (
                <div className="flex items-center gap-1.5 text-sm font-medium text-blue-700 whitespace-nowrap">
                  <CircleDot className="size-4" />
                  Operação aberta
                </div>
              )}
            </div>
          </div>

          <div className="
            flex gap-5 min-h-0 flex-1 
            max-xl:flex-col
          ">
            <OperationChecksTable
              checks={operation.checks}
              selectedRowId={checkId}
            />

            <SummaryCard
              checks={operation.checks}
              onAction={() => { }}
              isSaving={false}

              actionIcon={<FileText />}
              actionLabel="Gerar relatório"
            />
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
