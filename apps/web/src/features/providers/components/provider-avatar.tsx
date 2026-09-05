import { cn } from "@/lib/utils";

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

interface ProviderAvatarProps {
  name: string
  className?: string
}

export function ProviderAvatar({ name, className }: ProviderAvatarProps) {
  const { initials, colorClass } = getAvatarConfig(name);

  return (
    <div className="flex items-center gap-2.5">
      <div className={cn(
        "flex size-8.5 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
        colorClass,
        className
      )}>
        {initials}
      </div>
    </div>
  );
}