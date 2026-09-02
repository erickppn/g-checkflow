import { DataTable } from "@/components/common/data-table"
import { PageTitle } from "@/components/common/page-title"
import { Search } from "@/components/common/search"
import { PageContainer } from "@/components/layout/page-container"
import { useChecks } from "@/features/operations/checks/checks.queries"
import { checksColumns } from "@/features/operations/checks/components/checks-columns"
import type { CheckStatus } from "@/features/operations/checks/types/check.types"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { FunnelX, Loader2 } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/common/filters/date-picker-range"
import { StatusFilter } from "@/components/common/filters/status-filter"
import { Button } from "@/components/ui/button"

export const Route = createFileRoute("/_auth/cheques/")({
  component: RouteComponent,
});

interface ChecksListState {
  page: number;
  limit: number;
  search: string;
  status?: CheckStatus;
  providerId?: string;
  issuerId?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

function RouteComponent() {
  const [filters, setFilters] = useState<ChecksListState>({
    page: 1,
    limit: 15,
    search: "",
    status: undefined,
    providerId: undefined,
    issuerId: undefined,
    dueDateFrom: undefined,
    dueDateTo: undefined,
    sortBy: "dueDate",
    sortOrder: "asc",
  });

  const { data, isLoading, isFetching } = useChecks(filters);

  function updateFilters<K extends keyof ChecksListState>(
    field: K,
    value: ChecksListState[K],
  ) {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateDateRange(range: DateRange | undefined) {
    setFilters((prev) => ({
      ...prev,
      dueDateFrom: range?.from?.toISOString(),
      dueDateTo: range?.to?.toISOString(),
      page: 1,
    }));
  }

  const pagination = {
    page: filters.page,
    limit: filters.limit,
    total: data?.meta.total ?? 0,
    totalPages: data?.meta.totalPages ?? 0,
    onPageChange: (page: number) => {
      updateFilters("page", page);
    },
    onLimitChange: (limit: number) => {
      setFilters((prev) => ({
        ...prev,
        page: 1,
        limit,
      }));
    },
  };

  const navigate = useNavigate();

  return (
    <PageContainer className="max-w-400">
      <header className="
        flex gap-6 justify-between items-center 
        max-lg:flex-col max-lg:gap-5 max-lg:items-start
      ">
        <PageTitle title="Cheques" subtitle="Consulte e gerencie todos os cheques registrados" />

        <div className="flex flex-1 items-end justify-end gap-4">
          <div className="
            flex items-center max-w-2xl justify-end flex-1 
            max-lg:max-w-full max-lg:w-full
          ">
            <Search
              placeholder="Pesquisar por emitente ou nº do cheque"
              value={filters.search}
              onValueChange={(value) => {
                updateFilters("search", value);
                updateFilters("page", 1);
              }}
            />
          </div>

          <div className="flex gap-2 items-end">
            <StatusFilter
              value={filters.status}
              onChange={(value) => updateFilters("status", value)}
            />

            <DatePickerWithRange
              from={filters.dueDateFrom}
              to={filters.dueDateTo}
              onChange={updateDateRange}
              label="Vencimento"
            />

            <Button
              variant="link"
              size="sm"
              className="hover:cursor-pointer mb-1 p-0"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  page: 1,
                  search: "",
                  status: undefined,
                  dueDateFrom: undefined,
                  dueDateTo: undefined,
                }));
              }}
            >
              <FunnelX />
              Limpar filtros
            </Button>
          </div>
        </div>
      </header>

      <section className="flex flex-1 flex-col overflow-hidden rounded-md border border-border bg-card shadow-sm">
        {isLoading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between px-6 py-4 max-sm:px-3">
              <span className="text-sm font-semibold">
                Cheques • {data?.meta.total ?? 0} registros
              </span>

              {isFetching && (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              )}
            </div>

            <DataTable
              columns={checksColumns}
              data={data?.data ?? []}
              label="chequ(es)"
              serverPagination={pagination}

              onRowClick={(check) => {
                navigate({
                  to: `/operacoes/$id`,
                  params: {
                    id: check.operationId,
                  },
                  search: {
                    checkId: check.id,
                  },
                });
              }}
            />
          </>
        )}
      </section>
    </PageContainer>
  )
}
