import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";
import { ChevronUp, FilePlus, ReceiptText, UserRound, Users } from "lucide-react";

export function MobileNavigation() {
  return (
    <nav
      aria-label="Navegação principal"
      className="
        flex items-center justify-around
        border-t bg-background py-2
        sm:hidden
    ">
      <Link
        to="/cheques"
        className="
          group flex flex-col gap-0.5 items-center justify-center
          rounded-md px-4 py-2
          text-xs text-gray-500 font-semibold transition-colors
          data-[status=active]:text-blue-500
          hover:bg-slate-100
      ">
        <ReceiptText
          size={20}
          className="transition-transform group-data-[status=active]:scale-110"
        />

        <span>Cheques</span>
      </Link>

      <Link
        to="/prestadores"
        className="
          group flex flex-col gap-0.5 items-center rounded-md px-4 py-2
          text-xs text-gray-500 font-semibold transition-colors
        data-[status=active]:text-blue-500
        hover:bg-slate-100
      ">
        <Users
          size={20}
          className="transition-transform group-data-[status=active]:scale-110"
        />

        <span>Prestadores</span>
      </Link>
      
      <Link
        to="/operacoes/nova"
        className="
          group flex flex-col gap-0.5 items-center rounded-md px-4 py-2
          text-gray-500 text-xs font-semibold transition-colors
        data-[status=active]:text-blue-500
        hover:bg-slate-100
      ">
        <FilePlus size={20}
          className="transition-transform group-data-[status=active]:scale-110"
        />

        <span className="max-[448px]:hidden">Nova Operação</span>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex gap-2.5 items-center px-4 py-2 rounded-lg hover:bg-slate-100 transition cursor-pointer">
            <div className="bg-slate-200 rounded-full w-fit p-1">
              <UserRound className="text-slate-400 size-5" />
            </div>

            <ChevronUp className="text-slate-400 size-5" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              Gustavo
            </DropdownMenuLabel>

            <DropdownMenuItem disabled>
              Configurações
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              Usuários
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              Sair
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}