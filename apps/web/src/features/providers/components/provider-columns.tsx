import type { ColumnDef } from "@tanstack/react-table"
import { Pen, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { Provider } from "../provider.types";
import { Link } from "@tanstack/react-router";

const getAvatarConfig = (name: string) => {
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  const colors = [
    "bg-blue-100 text-blue-600",
    "bg-green-100 text-green-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
    "bg-pink-100 text-pink-600",
    "bg-yellow-100 text-yellow-700",
    "bg-teal-100 text-teal-600",
  ];
  
  const index = name.length % colors.length;
  return { initials, colorClass: colors[index] };
};

export const providerColumns: ColumnDef<Provider>[] = [
  {
    accessorKey: "name",
    header: "Prestador",

    cell: ({ row }) => {
      const { initials, colorClass } = getAvatarConfig(row.original.name);

      return (
        <div className="flex items-center gap-2.5">
          <div className={`flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${colorClass}`}>
            {initials}
          </div>
          <span className="text-slate-900">{row.original.name}</span>
        </div>
      );
    }
  },

  {
    accessorKey: "phone",
    header: "Telefone",

    cell: ({ row }) => <span className="text-slate-600">{row.getValue("phone")}</span>
  },

  {
    accessorKey: "defaultInterestRate",
    header: "Taxa padrão (%)",

    cell: ({ row }) => {
      const val = row.getValue<number>("defaultInterestRate");
      return <span className="text-slate-600">{val.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}%</span>;
    }
  },

  {
    accessorKey: "defaultCompensationDays",
    header: "Dias adicionais (comp.)",

    cell: ({ row }) => {
      const days = row.getValue<number>("defaultCompensationDays");
      return <span className="text-slate-600">{days} {days === 1 ? "dia" : "dias"}</span>;
    }
  },

  {
    accessorKey: "notes",
    header: "Observações",
    cell: ({ row }) => {
      const notes = row.getValue<string>("notes");

      if (!notes) {
        return <span className="text-slate-400">---</span>;
      }

      return (
        <div className="max-w-90 truncate text-muted-foreground cursor-default">
          {notes}
        </div>
      );
    }
  },

  {
    accessorKey: "operationsCount",
    header: () => <div className="text-center">Operações</div>,
    cell: ({ row }) => (
      <div className="text-center">
        {row.getValue("operationsCount")}
      </div>
    )
  },

  {
    accessorKey: "actions",
    header: () => <div className="text-center">Ações</div>,

    cell: ({ row }) => {
      const provider = row.original;

      return (
        <div className="flex items-center justify-center gap-2">
          <Button 
            variant="outline" size="icon" 
            className="h-8 w-8 text-slate-500 hover:text-slate-900"
            render={<Link to={`/prestadores/$id/editar`} params={{ id: String(provider.id) }} />}
          >
            <Pen className="h-4 w-4" />
            <span className="sr-only">Editar</span>
          </Button>

          <Button variant="destructive" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Deletar</span>
          </Button>
        </div>
      )
    }
  }
]