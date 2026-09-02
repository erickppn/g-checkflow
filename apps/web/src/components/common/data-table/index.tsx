import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState } from "@tanstack/react-table"
import { DataTablePagination } from "./data-table-pagination";
import { SearchX } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServerPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  sorting?: SortingState;
  globalFilter?: string;
  label: string;

  serverPagination?: ServerPagination;

  onRowClick?: (row: TData) => void;
}

export function DataTable<TData, TValue>({
  sorting,
  globalFilter,
  columns,
  data,
  label,
  serverPagination,
  onRowClick
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,

    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: serverPagination
      ? undefined
      : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),

    manualPagination: !!serverPagination,

    pageCount: serverPagination?.totalPages,

    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="flex flex-1 min-h-0 flex-col">
      <div className="flex-1 min-h-0 overflow-auto">
        <Table className="min-w-200">
          <TableHeader
            className="border-t"
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="bg-muted hover:bg-muted/90 uppercase text-[11px] font-bold tracking-wider"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="
                        sticky -top-px z-10 first:pl-6 last:pr-6 bg-muted
                        max-sm:first:pl-3 max-sm:last:pl-3
                    ">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50/80 border-b transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "first:pl-6 last:pr-6 py-2.5 text-sm max-sm:first:pl-3 max-sm:last:pl-3 relative",
                        onRowClick && "cursor-pointer hover:bg-muted/50",
                      )}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-full text-center">
                  <div className="flex flex-col items-center justify-center gap-2 py-8">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-400 text-slate-100">
                      <SearchX className="h-6 w-6" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-semibold text-slate-900 text-base">
                        Nenhum prestador encontrado
                      </h3>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto">
                        {globalFilter
                          ? <span>{`Não encontramos nenhum resultado para "${globalFilter}".`}</span>
                          : "Nenhum prestador foi cadastrado ainda no sistema."}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination
        table={table}
        label={label}
        serverPagination={serverPagination}
      />
    </div>
  )
}