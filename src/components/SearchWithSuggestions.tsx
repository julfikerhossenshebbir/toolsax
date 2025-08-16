'use client';

import { useState, useCallback, useRef, useEffect, useTransition } from 'react';
import { Search } from 'lucide-react';
import { getAiSuggestions } from '@/app/actions';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Skeleton } from './ui/skeleton';

interface SearchWithSuggestionsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchWithSuggestions({ value, onValueChange }: SearchWithSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback((query: string) => {
    startTransition(async () => {
      const result = await getAiSuggestions(query);
      setSuggestions(result);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleFocus = () => {
    setIsOpen(true);
    if (!value && suggestions.length === 0) {
      fetchSuggestions('');
    }
  };
  
  const handleInputChange = (query: string) => {
    onValueChange(query)
    if (query.length > 2) {
        fetchSuggestions(query)
    } else {
        setSuggestions([])
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    onValueChange(suggestion);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={commandRef}>
      <Command shouldFilter={false} className="overflow-visible bg-transparent">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <CommandInput
            id="search-box"
            ref={inputRef}
            value={value}
            onValueChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={() => setIsOpen(value.length > 0 && suggestions.length > 0)}
            placeholder="Search for a tool or get inspired..."
            className="w-full pl-12 pr-4 py-3 h-14 text-base rounded-full border-2 border-border focus:border-primary transition-colors duration-300 shadow-lg"
          />
        </div>
        {isOpen && (
          <div className="absolute top-full mt-2 w-full z-10">
            <CommandList className="rounded-lg border bg-background shadow-lg">
              {isPending && suggestions.length === 0 ? (
                <div className="p-4 space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-2/3" />
                </div>
              ) : (
                <>
                  {suggestions.length === 0 && value && <CommandEmpty>No results found.</CommandEmpty>}
                  <CommandGroup heading={suggestions.length > 0 ? "Suggestions" : ""}>
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={suggestion}
                        onSelect={() => handleSelectSuggestion(suggestion)}
                        value={suggestion}
                        className="cursor-pointer"
                      >
                        {suggestion}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </div>
        )}
      </Command>
    </div>
  );
}
