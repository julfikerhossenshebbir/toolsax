'use client';

import { useState, useCallback, useRef, useEffect, useTransition } from 'react';
import { Search } from 'lucide-react';
import { getAiSuggestions } from '@/app/actions';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Skeleton } from './ui/skeleton';
import { Input } from './ui/input';

interface SearchWithSuggestionsProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function SearchWithSuggestions({ value, onValueChange }: SearchWithSuggestionsProps) {
  
  return (
    <div className="relative w-full max-w-lg mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
            id="search-box"
            type="search"
            value={value}
            onChange={(e) => onValueChange(e.target.value)}
            placeholder="Search for a tool or get inspired..."
            className="w-full pl-12 pr-4 py-3 h-14 text-base rounded-full border-2 bg-card border-border focus:border-primary transition-colors duration-300 shadow-lg"
        />
    </div>
  );
}
