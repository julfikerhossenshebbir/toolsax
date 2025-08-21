
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppStateContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  return (
    <AppStateContext.Provider value={{ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }}>
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
