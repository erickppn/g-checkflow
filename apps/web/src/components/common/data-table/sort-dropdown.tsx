import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

type SortDropdownProps<T extends string> = {
  options: readonly {
    id: T;
    label: string;
  }[];

  selected: T;

  onValueChange: (id: T) => void;

  className?: string
};

export function SortDropdown<T extends string>({ options, selected, onValueChange, className }: SortDropdownProps<T>) {
  const selectedOption = options.find(
    option => option.id === selected
  )!;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button
          variant="outline"
          className={cn("justify-between gap-3", className)}
        >
          <div className="flex gap-2">
            <span className="text-muted-foreground">
              Ordenar por:
            </span>

            <span className="font-medium">
              {selectedOption.label}
            </span>
          </div>

          <ChevronDown className="size-4" />
        </Button>
      } />

      <DropdownMenuContent align="end">

        <DropdownMenuRadioGroup
          value={selected}
          onValueChange={onValueChange}
        >

          {options.map(option => (
            <DropdownMenuRadioItem
              key={option.id}
              value={option.id}
            >
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}