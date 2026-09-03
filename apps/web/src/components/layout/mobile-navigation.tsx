import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/auth.mutations";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronUp, FilePlus, LayoutDashboard, ReceiptText, UserRound } from "lucide-react";

export function MobileNavigation() {
  const { data: user } = useCurrentUser();

  const logout = useLogout();

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.href = "/";
      }
    });
  }

  return (
    <nav
      aria-label="Navegação principal"
      className="
        flex items-center justify-around
        border-t bg-background py-1.5
        sm:hidden
    ">
      <Link
        to="/dashboard"
        className="
          group flex flex-col gap-0.5 items-center justify-center
          rounded-md px-4 py-2
          text-xs text-gray-500 font-semibold transition-colors
          data-[status=active]:text-blue-500
          hover:bg-slate-100
      ">
        <LayoutDashboard
          size={20}
          className="transition-transform group-data-[status=active]:scale-110"
        />

        <span className="max-[400px]:hidden">Dashboard</span>
      </Link>

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

        <span className="max-[400px]:hidden">Cheques</span>
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

        <span className="max-[400px]:hidden">Nova Operação</span>
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

        <DropdownMenuContent className="w-fit">
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              {user?.email}
            </DropdownMenuLabel>

            <DropdownMenuItem>
              <Link
                to="/prestadores"
                className="flex items-center justify-between w-full"
              >
                Prestadores
                <ArrowUpRight />
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem disabled>
              Configurações
            </DropdownMenuItem>

            <DropdownMenuItem disabled>
              Usuários
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem
              variant="destructive"
              onClick={handleLogout}
              disabled={logout.isPending}
            >
              {logout.isPending ? "Saindo..." : "Sair"}
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
}