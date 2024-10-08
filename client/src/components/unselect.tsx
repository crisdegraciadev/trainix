import { cn } from '@/lib/utils';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

type UnselectProps = {
  options: { label: string; value: string }[];
  defaultValue?: string;
  onChange: (value?: string) => void;
};

export default function Unselect({
  options,
  defaultValue,
  onChange,
}: UnselectProps) {
  const [open, setOpen] = useState(false);
  const [option, setOption] = useState(defaultValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between text-sm font-normal"
        >
          {option ? (
            options.find((val) => val.value === option)?.label
          ) : (
            <span className=" text-muted-foreground">Select value</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] max-h-[--radix-popover-content-available-height] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((val) => (
                <CommandItem
                  key={val.label}
                  value={val.value}
                  onSelect={(currentValue) => {
                    const newOption =
                      currentValue === option ? undefined : currentValue;
                    setOption(newOption);
                    setOpen(false);
                    onChange(newOption);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      val.value === option ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {val.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
