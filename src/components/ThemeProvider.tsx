'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

interface CustomThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

const CustomThemeContext = React.createContext<CustomThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme } = useTheme()
  const [primaryColor, setPrimaryColor] = React.useState('neutral');
  const [radius, setRadius] = React.useState(0.5);
  const [fontSize, setFontSize] = React.useState(16);

  React.useEffect(() => {
    const savedColor = localStorage.getItem('theme-primary-color');
    const savedRadius = localStorage.getItem('theme-radius');
    const savedFontSize = localStorage.getItem('theme-font-size');
    if (savedColor) setPrimaryColor(savedColor);
    if (savedRadius) setRadius(parseFloat(savedRadius));
    if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));
  }, []);

  const handleSetPrimaryColor = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem('theme-primary-color', color);
  };

  const handleSetRadius = (newRadius: number) => {
    setRadius(newRadius);
    localStorage.setItem('theme-radius', newRadius.toString());
  };

  const handleSetFontSize = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('theme-font-size', newSize.toString());
  };
  
  React.useEffect(() => {
    document.body.style.setProperty('--radius', `${radius}rem`);
    document.documentElement.style.fontSize = `${fontSize}px`;

    const isDark = theme === 'dark';

    const colors: {[key: string]: {light: string, dark: string}} = {
      neutral: { light: '240 10% 3.9%', dark: '0 0% 98%' },
      neutral_foreground: { light: '0 0% 98%', dark: '240 10% 3.9%' },
      red: { light: '0 84.2% 60.2%', dark: '0 72.2% 50.6%' },
      red_foreground: { light: '0 0% 98%', dark: '0 85.7% 97.3%' },
      orange: { light: '25.3 93.2% 54.9%', dark: '24.6 95% 53.1%' },
      orange_foreground: { light: '24 9.8% 10%', dark: '20 14.3% 4.1%' },
      green: { light: '142.1 76.2% 36.3%', dark: '142.1 70.6% 45.3%' },
      green_foreground: { light: '144.9 80.4% 97.3%', dark: '144.9 80.4% 97.3%' },
    };

    const selectedColor = colors[primaryColor] || colors.neutral;
    const primaryValue = isDark ? selectedColor.dark : selectedColor.light;
    const primaryForegroundValue = isDark ? (colors[`${primaryColor}_foreground`]?.dark || colors.neutral_foreground.dark) : (colors[`${primaryColor}_foreground`]?.light || colors.neutral_foreground.light);
    
    document.documentElement.style.setProperty('--primary', primaryValue);
    document.documentElement.style.setProperty('--primary-foreground', primaryForegroundValue);

  }, [primaryColor, radius, fontSize, theme]);


  return (
    <NextThemesProvider {...props}>
        <CustomThemeContext.Provider value={{ primaryColor, setPrimaryColor: handleSetPrimaryColor, radius, setRadius: handleSetRadius, fontSize, setFontSize: handleSetFontSize }}>
            {children}
        </CustomThemeContext.Provider>
    </NextThemesProvider>
  );
}

export function useThemeSettings() {
  const context = React.useContext(CustomThemeContext);
  if (context === undefined) {
    throw new Error('useThemeSettings must be used within a CustomThemeProvider');
  }
  return context;
}
