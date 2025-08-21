
'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import ReactCountryFlag from 'react-country-flag';
import { getName } from 'country-list';


const countries = Object.entries(require('country-list').getNameList()).map(([code, name]) => ({
  value: code.toUpperCase(),
  label: name,
}));

interface CountrySelectProps {
  onValueChange: (value: string) => void;
  defaultValue?: string;
}

export function CountrySelect({ onValueChange, defaultValue }: CountrySelectProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue || '');

  const handleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue;
    setValue(newValue);
    onValueChange(newValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          {value ? (
            <div className="flex items-center gap-2">
              <ReactCountryFlag countryCode={value} svg style={{ width: '1.5em', height: '1.5em' }} />
              {getName(value)}
            </div>
          ) : (
            'Select country...'
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countries.map((country) => (
                <CommandItem key={country.value} value={country.label} onSelect={() => handleSelect(country.value)}>
                  <Check className={cn('mr-2 h-4 w-4', value === country.value ? 'opacity-100' : 'opacity-0')} />
                  <div className="flex items-center gap-2">
                    <ReactCountryFlag countryCode={country.value} svg style={{ width: '1.5em', height: '1.5em' }} />
                    {country.label}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
