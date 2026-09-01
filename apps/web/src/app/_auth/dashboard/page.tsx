import { PageTitle } from "@/components/common/page-title"
import { PageContainer } from "@/components/layout/page-container"
import { Button } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router"
import { format } from "date-fns";
import { AlertCircle, ArrowUpRight, Plus } from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const date = format(new Date(), "EEEE, dd 'DE' MMMM 'DE' yyyy").toUpperCase();
  const { user } = Route.useRouteContext();

  return (
    <PageContainer className="max-w-360">
      <header className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {date}
          </span>

          <PageTitle
            title={`Bom dia, ${user.name}`}
            subtitle="Aqui está o que precisa da sua atenção hoje."
          />
        </div>

        <Button
          render={
            <Link to='/operacoes/nova' />
          }

          className="py-5 shrink-0"
        >
          <Plus data-icon="inline-start" /> Nova Operação
        </Button>
      </header>

      <div className="relative flex items-center justify-between bg-orange-500/10 px-5 py-3.5">
        <div className="absolute inset-y-0 left-0 w-0.5 bg-orange-500" />

        <div className="flex items-center gap-4">
          <AlertCircle className="size-5 text-orange-500" />

          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-orange-700">
              8 cheques pendentes de compensação
            </p>

            <p className="text-xs text-muted-foreground">
              O próximo vencimento é de Ana Lima, em 4 dias.
            </p>
          </div>
        </div>

        <Button
          variant="link"
          className="h-auto px-2 py-1 font-medium text-orange-700 hover:cursor-pointer"
          nativeButton={false}

          render={
            <Link to="/cheques"/>
          }
        >
          Revisar cheques
          <ArrowUpRight className="size-3.5" />
        </Button>
      </div>
    </PageContainer>
  )
}
