import { cn } from "@/lib/utils";
import { CheckIcon, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Separator } from "./ui/separator";

type Props = {
  title: string;
  onChange: (values: string[]) => void;
  defaultValues?: string[];
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
};

export function MultiSelect({ title, options, defaultValues, onChange }: Props) {
  const [selectedOptions, setSelectedOptions] = useState(new Set<string>(defaultValues));

  const SelectedValuesOverview = () => {
    if (selectedOptions.size === 0) {
      return null;
    }

    return (
      <>
        <Separator orientation="vertical" className="mx-2 h-4" />
        <div className="space-x-1 flex">
          {selectedOptions.size > 2 ? (
            <Badge variant="secondary" className="rounded-sm px-1 font-normal">
              {selectedOptions.size} selected
            </Badge>
          ) : (
            options
              .filter((option) => selectedOptions.has(option.value))
              .map((option) => (
                <Badge variant="secondary" key={option.value} className="rounded-sm px-1 font-normal">
                  {option.label}
                </Badge>
              ))
          )}
        </div>
      </>
    );
  };

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex h-10 w-full hover:bg-white">
          <div className="flex w-full justify-between ">
            <div className="flex items-center">
              <span className="text-muted-foreground text-sm">{title}</span>
              <SelectedValuesOverview />
            </div>
            <div>
              <ChevronDown className="w-4 h-4 text-muted-foreground opacity-50" />{" "}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0" align="start">
        <Command>
          <CommandInput placeholder={title} />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedOptions.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedOptions.delete(option.value);
                      } else {
                        selectedOptions.add(option.value);
                      }
                      const filterOptions = Array.from(selectedOptions);
                      setSelectedOptions(new Set(filterOptions));
                      onChange(filterOptions);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary text-primary-foreground" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedOptions.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => setSelectedOptions(new Set())} className="justify-center text-center">
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
