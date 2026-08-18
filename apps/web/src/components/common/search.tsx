import { SearchIcon } from "lucide-react";
import { InputGroup, InputGroupInput, InputGroupAddon } from "../ui/input-group";

type SearchProps = {
  placeholder: string,

  value: string,
  onValueChange: (input: string) => void
}

export function Search({ placeholder, value, onValueChange }: SearchProps) {
  return (
    <InputGroup>
      <InputGroupInput 
        placeholder={placeholder} 
        value={value}
        onChange={event => onValueChange(event.target.value)}
        className="py-1.5 max-md:text-sm"
      />
      <InputGroupAddon>
        <SearchIcon className="ml-1 text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  )
}