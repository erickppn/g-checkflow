import { PageTitle } from "@/components/common/page-title"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button";
import { AttentionAlert } from "@/features/dashboard/components/attention-alert";
import { PeriodChart } from "@/features/dashboard/components/period-chart";
import { PortfolioChart } from "@/features/dashboard/components/portfolio-chart";
import { RecentOperations } from "@/features/dashboard/components/recent-operations";
import { SummaryCard } from "@/features/dashboard/components/summary-cards";
import { TopIssuersChart } from "@/features/dashboard/components/top-issuer-chart";
import { dashboardQueries, useDashboard } from "@/features/dashboard/dashboard.queries";
import { currencyFormatter } from "@/utils";
import { createFileRoute, Link } from "@tanstack/react-router"
import { format } from "date-fns";
import { BanknoteArrowDown, FolderOpen, HandCoins, Plus } from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(
      dashboardQueries.all()
    );
  },

  component: RouteComponent,
})

function RouteComponent() {
  const date = format(new Date(), "EEEE, dd 'DE' MMMM 'DE' yyyy").toUpperCase();

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Bom dia"
      : hour < 18
        ? "Boa tarde"
        : "Boa noite";

  const { user } = Route.useRouteContext();

  const { data } = useDashboard();

  const nextDueCheck = data.attention.nextDueCheck;

  const daysUntilDue = nextDueCheck
    ? Math.ceil(
      (new Date(nextDueCheck.dueDate).getTime() - Date.now()) /
      (1000 * 60 * 60 * 24),
    )
    : null;

  return (
    <PageContainer
      className="overflow-y-scroll block relative"
    >
      <div className="flex flex-col gap-6 max-w-340 mx-auto">
        <header className="flex flex-col gap-8 mt-3 mb-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-7">
            <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {date}
            </span>

            <PageTitle
              title={`${greeting}, ${user.name}`}
              subtitle="Aqui está o que precisa da sua atenção hoje."
            />
          </div>

          <Button
            render={
              <Link to='/operacoes/nova' />
            }

            className="py-5 shrink-0 max-sm:hidden"
          >
            <Plus data-icon="inline-start" /> Nova Operação
          </Button>
        </header>

        <div className="grid gap-4 max-[640px]:grid-cols-1 max-[860px]:grid-cols-2 min-[861px]:grid-cols-3">
          <SummaryCard
            className="max-[860px]:col-span-2 max-[640px]:col-span-1"
            title="Operações abertas"
            value={data.summary.openOperations}
            icon={FolderOpen}
            iconVariant="blue"
          />

          <SummaryCard
            title="Recebíveis em aberto"
            value={currencyFormatter.format(data.summary.receivables)}
            description="Valor bruto dos títulos a receber"
            icon={BanknoteArrowDown}
            iconVariant="green"
          />

          <SummaryCard
            title="Juros previstos"
            value={currencyFormatter.format(data.summary.providerInterest)}
            description="Lucro estimado nas operações"
            icon={HandCoins}
            iconVariant="purple"
          />
        </div>

        <AttentionAlert
          pendingChecks={data.attention.pendingChecks}
          nextDueCheck={data.attention.nextDueCheck}
          daysUntilDue={daysUntilDue}
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <PortfolioChart data={data.portfolio} />

          <PeriodChart data={data.dueByPeriod} />

          <div className="md:col-span-2 xl:col-span-1">
            <TopIssuersChart data={data.topIssuers} />
          </div>
        </div>

        <RecentOperations
          data={data.recentOperations}
        />
      </div>
    </PageContainer>
  )
}
