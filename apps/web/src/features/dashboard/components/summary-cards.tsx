import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface MetricCardProps {
  title: string
  value: string | number
  description?: string
  icon: LucideIcon
  iconVariant?: "blue" | "green" | "purple"
  className?: string
}

const variantStyles = {
  blue: {
    topBorder: "border-t-blue-500",
    iconBg: "bg-blue-50 text-blue-600",
  },
  green: {
    topBorder: "border-t-emerald-500",
    iconBg: "bg-emerald-100/80 text-emerald-600",
  },
  purple: {
    topBorder: "border-t-purple-500",
    iconBg: "bg-purple-50 text-purple-600",
  },
}

export function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  iconVariant = "blue",
  className,
}: MetricCardProps) {
  const variant = variantStyles[iconVariant]

  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200/60 bg-card border-t transition-all duration-200 ease-out hover:-translate-y-1",
        variant.topBorder,
        "shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] dark:shadow-none",
        className
      )}
    >
      <div className="flex items-center gap-4 p-5">
        <div
          className={cn(
            "flex p-4 items-center justify-center rounded-lg",
            variant.iconBg
          )}
        >
          <Icon />
        </div>

        <div className="flex flex-col">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {title}
          </span>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {value}
          </span>
        </div>
      </div>

      {description && (
        <div>
          <div className="h-px w-full bg-slate-100 dark:bg-slate-800/80" />

          <p className="text-xs text-center py-2 text-muted-foreground">
            {description}
          </p>
        </div>
      )}
    </div>
  )
}