import { useState } from "react";

import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import { SortDropdown } from "@/components/common/data-table/sort-dropdown";
import { Search } from "@/components/common/search";
import { PageContainer } from "@/components/layout/page-container";
import { PageTitle } from "@/components/common/page-title";
import { Button } from "@/components/ui/button";

import { providerSortOptions, type ProviderSortId } from "@/features/providers/constants/provider-sort-options";
import { providerColumns } from "@/features/providers/components/provider-columns";
import { providersQueries, useProviders } from "@/features/providers/providers.queries";

export const Route = createFileRoute("/_auth/prestadores/")({
  loader: ({ context: { queryClient } }) => {
    return queryClient.ensureQueryData(providersQueries.all())
  },

  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useProviders();
  
  const [selectedSort, setSelectedSort] = useState<ProviderSortId>("name-asc");
  const [globalFilter, setGlobalFilter] = useState("");

  const sorting =providerSortOptions.find(
    option => option.id === selectedSort
  )!.sorting;

  return (
    <PageContainer className="max-w-360">
      <header className="
        flex gap-6 justify-between items-center 
        max-lg:flex-col max-lg:gap-5 max-lg:items-start
      ">
        <PageTitle title="Prestadores" subtitle="Gerencie todos os prestadores cadastrados no sistema."/>

        <div className="
          flex items-center h-full max-w-2xl gap-5 py-1.5 justify-end flex-1 
          max-lg:max-w-full max-lg:w-full
        ">
          <Search
            placeholder="Pesquisar por nome, telefone ou observações..."
            value={globalFilter}
            onValueChange={setGlobalFilter}
          />

          <Button
            variant="default"
            render={
              <Link to="/prestadores/novo" />
            }
            className="pr-4 h-full" 
            nativeButton={false}
          >
            <Plus /> Novo Prestador
          </Button>
        </div>
      </header>

      <section className="border flex flex-1 min-h-0 bg flex-col rounded-md shadow-md">
        <div className="flex items-center justify-between px-6 py-2.5 max-sm:px-3">
          <span className="text-sm font-semibold">
            <span className="max-sm:hidden">Prestadores</span> • {data.length} registros
          </span>

          <SortDropdown
            options={providerSortOptions}
            selected={selectedSort}
            onValueChange={setSelectedSort}
          />
        </div>

        <DataTable
          columns={providerColumns}
          data={data}
          sorting={sorting}
          globalFilter={globalFilter}
        />
      </section>
    </PageContainer>
  )
}
