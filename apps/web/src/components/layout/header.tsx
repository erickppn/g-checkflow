import { ChevronDown, LayoutDashboard, ReceiptText, UserRound, UsersRound } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="
      flex justify-between w-full px-8 bg-white border-b border-slate-200 shadow-xs 
      max-md:px-4 
      max-sm:hidden
    ">
      <div className="
        flex gap-6 
        max-lg:gap-10
        max-md:gap-5
      ">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600/10 text-primary">
            <ReceiptText className="size-4.5" />
          </div>

          <div className="flex items-baseline gap-1.5">
            <h1 className="text-sm text-slate-800 font-semibold tracking-wide max-md:hidden">
              Sistema de Cheques
            </h1>

            <span className="
              text-[13px] text-slate-500
              max-lg:hidden
            ">
              · Potencial Jeans
            </span>
          </div>
        </div>

        <nav className="flex gap-2 items-center text-sm text-gray-500 font-semibold">
          <Link
            to="/dashboard"
            className="
              group relative h-full flex items-center py-3 
              data-[status=active]:text-blue-500 data-[status=active]:border-blue-400
          ">
            <div className="flex gap-1 items-center rounded-md px-2.5 py-1.5 transition-colors group-data-[status=active]:bg-slate-100 group-hover:bg-slate-100">
              <LayoutDashboard size={16} />

              <span>
                Dashboard
              </span>
            </div>

            <div className="
              absolute bottom-0 left-1/2 h-0.75 w-0 -translate-x-1/2 rounded-t-full bg-blue-400 transition-all
              group-data-[status=active]:w-full
            "/>
          </Link>
          
          <Link
            to="/cheques"
            className="
              group relative h-full flex items-center py-3 
              data-[status=active]:text-blue-500 data-[status=active]:border-blue-400
          ">
            <div className="flex gap-1 items-center rounded-md px-2.5 py-1.5 transition-colors group-data-[status=active]:bg-slate-100 group-hover:bg-slate-100">
              <ReceiptText size={16} />

              <span>
                Cheques
              </span>
            </div>

            <div className="
              absolute bottom-0 left-1/2 h-0.75 w-0 -translate-x-1/2 rounded-t-full bg-blue-400 transition-all
              group-data-[status=active]:w-full
            "/>
          </Link>

          <Link
            to="/prestadores"
            className="
              group relative h-full flex items-center py-3 
              data-[status=active]:text-blue-500 data-[status=active]:border-blue-400
          ">
            <div className="flex gap-1 items-center rounded-md px-2.5 py-1.5 transition-colors group-data-[status=active]:bg-slate-100 group-hover:bg-slate-100">
              <UsersRound size={18} />

              <span>
                Prestadores
              </span>
            </div>

            <div className="
              absolute bottom-0 left-1/2 h-0.75 w-0 -translate-x-1/2 rounded-t-full bg-blue-400 transition-all
              group-data-[status=active]:w-full
            "/>
          </Link>
        </nav>
      </div>

      <div className="flex gap-4 items-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className="flex gap-2.5 items-center px-2 py-1 rounded-lg hover:bg-slate-100 transition cursor-pointer">
              <div className="bg-slate-200 rounded-full w-fit p-1">
                <UserRound className="text-slate-400 size-5" />
              </div>

              <div className="flex gap-1 items-center">
                <span className="
                  font-sembold text-sm text-slate-600 
                  max-lg:hidden
                ">
                  Gustavo
                </span>

                <ChevronDown className="text-slate-400 size-5" />
              </div>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup>
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
      </div>
    </header>
  )
}