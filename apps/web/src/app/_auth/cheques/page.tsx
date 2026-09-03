import { DataTable } from "@/components/common/data-table"
import { PageTitle } from "@/components/common/page-title"
import { Search } from "@/components/common/search"
import { PageContainer } from "@/components/layout/page-container"
import { useChecks } from "@/features/operations/checks/checks.queries"
import { checksColumns } from "@/features/operations/checks/components/checks-columns"
import type { CheckStatus } from "@/features/operations/checks/types/check.types"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { FunnelX, Loader2 } from "lucide-react"
import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { DatePickerWithRange } from "@/components/common/filters/date-picker-range"
import { StatusFilter } from "@/components/common/filters/status-filter"
import { Button } from "@/components/ui/button"
import { SortDropdown } from "@/components/common/data-table/sort-dropdown"
import { checkSortOptions } from "@/features/operations/checks/constants/check-sort-options"
import { CheckListItem } from "@/features/operations/checks/components/check-list-item"

type ChecksSearch = {
  status?: CheckStatus;
};

export const Route = createFileRoute("/_auth/cheques/")({
  validateSearch: (search: Record<string, unknown>): ChecksSearch => {
    return {
      status:
        search.status === "PENDING" ||
          search.status === "COMPENSATED" ||
          search.status === "RETURNED"
          ? search.status
          : undefined,
    };
  },

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
  const search = Route.useSearch();

  const [filters, setFilters] = useState<ChecksListState>({
    page: 1,
    limit: 15,
    search: "",
    status: search.status,
    providerId: undefined,
    issuerId: undefined,
    dueDateFrom: undefined,
    dueDateTo: undefined,
    sortBy: "dueDate",
    sortOrder: "asc",
  });

  const { data, isLoading } = useChecks(filters);

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
        max-lg:flex-col max-lg:gap-2 max-lg:items-start
      ">
        <PageTitle title="Cheques" subtitle="Consulte e gerencie todos os cheques registrados" />

        <div className="
          flex flex-1 items-end justify-end gap-4
          max-lg:w-full
          max-md:flex-col max-md:gap-3 mt-4
        ">
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

          <div className="
            flex gap-3 items-end
            max-md:w-full
          ">
            <div className="flex-1">
              <StatusFilter
                className="max-md:w-full"
                value={filters.status}
                onChange={(value) => updateFilters("status", value)}
              />
            </div>

            <div className="flex-1">
              <DatePickerWithRange
                className="max-md:w-full"
                from={filters.dueDateFrom}
                to={filters.dueDateTo}
                onChange={updateDateRange}
                label="Vencimento"
              />
            </div>

            <Button
              variant="link"
              size="sm"
              className="mb-1 shrink-0 p-0 hover:cursor-pointer"
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
            <div className="
              flex items-center justify-between px-6 py-4 max-sm:px-3
              max-md:flex-col max-md:items-start max-md:gap-2
            ">
              <span className="text-start text-sm font-semibold">
                Cheques • {data?.meta.total ?? 0} registros
              </span>

              <SortDropdown
                className="max-md:w-full"
                options={checkSortOptions}
                selected={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={(id) => {
                  const option = checkSortOptions.find(
                    (option) => option.id === id,
                  );

                  if (!option) return;

                  setFilters((prev) => ({
                    ...prev,
                    page: 1,
                    sortBy: option.sortBy,
                    sortOrder: option.sortOrder,
                  }));
                }}
              />
            </div>

            <DataTable
              classname="max-lg:hidden"
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

            <div className="divide-y overflow-auto lg:hidden">
              {data?.data.map((check) => (
                <Link
                  key={check.id}
                  to="/operacoes/$id"
                  params={{
                    id: check.operationId
                  }}
                  search={{
                    checkId: check.id
                  }}
                >
                  <CheckListItem
                    check={check}
                  />
                </Link>
              ))}
            </div>
          </>
        )}
      </section>
    </PageContainer>
  )
}
