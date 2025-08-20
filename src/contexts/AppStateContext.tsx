
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AppStateContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <AppStateContext.Provider value={{ searchQuery, setSearchQuery }}>
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
