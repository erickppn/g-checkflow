import { cn } from "@/lib/utils"

export function PageContainer({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main 
      data-slot="main"
      className={cn(`
        flex h-full w-full flex-1 flex-col min-w-0 mx-auto gap-6 px-8 py-6 overflow-hidden
        max-md:px-4 max-lg:gap-3 max-lg:py-4
        max-sm:py-6 
        `, className)}
      {...props}
    />
  );
}