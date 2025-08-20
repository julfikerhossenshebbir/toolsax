
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

const DEFAULT_COLOR = 'violet';
const DEFAULT_RADIUS = 0.5;
const DEFAULT_FONT_SIZE = 16;


interface CustomThemeContextType {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  radius: number;
  setRadius: (radius: number) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  resetTheme: () => void;
}

const CustomThemeContext = React.createContext<CustomThemeContextType | undefined>(undefined);

export function CustomThemeProvider({ children, ...props }: ThemeProviderProps) {
  const { theme } = useTheme()
  const [primaryColor, setPrimaryColor] = React.useState(DEFAULT_COLOR);
  const [radius, setRadius] = React.useState(DEFAULT_RADIUS);
  const [fontSize, setFontSize] = React.useState(DEFAULT_FONT_SIZE);

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

  const resetTheme = () => {
    setPrimaryColor(DEFAULT_COLOR);
    setRadius(DEFAULT_RADIUS);
    setFontSize(DEFAULT_FONT_SIZE);
    localStorage.removeItem('theme-primary-color');
    localStorage.removeItem('theme-radius');
    localStorage.removeItem('theme-font-size');
  };

  React.useEffect(() => {
    document.body.style.setProperty('--radius', `${radius}rem`);
    document.documentElement.style.fontSize = `${fontSize}px`;

    const isDark = theme === 'dark';

    const colors: {[key: string]: {light: string, dark: string}} = {
      neutral: { light: '240 10% 3.9%', dark: '0 0% 98%' },
      slate: { light: '215 28% 47%', dark: '215 14% 65%' },
      stone: { light: '25 15% 35%', dark: '25 8% 65%' },
      gray: { light: '220 9% 46%', dark: '215 10% 65%' },
      zinc: { light: '224 14% 40%', dark: '220 10% 68%' },
      red: { light: '0 84.2% 60.2%', dark: '0 80% 65%' },
      orange: { light: '25.3 93.2% 54.9%', dark: '25.3 90% 60%' },
      green: { light: '142.1 76.2% 36.3%', dark: '142.1 65% 50%' },
      blue: { light: '221 83% 53%', dark: '221 83% 65%' },
      indigo: { light: '243 75% 59%', dark: '243 75% 70%' },
      purple: { light: '262 84% 60%', dark: '262 84% 75%' },
      pink: { light: '336 84% 60%', dark: '336 84% 75%' },
      violet: { light: '256 79% 56%', dark: '256 79% 70%'},

      neutral_foreground: { light: '0 0% 98%', dark: '240 10% 3.9%' },
      slate_foreground: { light: '0 0% 98%', dark: '215 28% 15%' },
      stone_foreground: { light: '0 0% 98%', dark: '25 15% 15%' },
      gray_foreground: { light: '0 0% 98%', dark: '220 9% 15%' },
      zinc_foreground: { light: '0 0% 98%', dark: '224 14% 15%' },
      red_foreground: { light: '0 0% 98%', dark: '0 85.7% 97.3%' },
      orange_foreground: { light: '24 9.8% 10%', dark: '20 14.3% 4.1%' },
      green_foreground: { light: '144.9 80.4% 97.3%', dark: '144.9 80.4% 97.3%' },
      blue_foreground: { light: '0 0% 98%', dark: '221 83% 20%' },
      indigo_foreground: { light: '0 0% 98%', dark: '243 75% 25%' },
      purple_foreground: { light: '0 0% 98%', dark: '262 84% 25%' },
      pink_foreground: { light: '0 0% 98%', dark: '336 84% 25%' },
      violet_foreground: { light: '0 0% 98%', dark: '256 79% 25%' },
    };
    
    const selectedColor = colors[primaryColor] || colors.neutral;
    const primaryValue = isDark ? selectedColor.dark : selectedColor.light;
    const primaryForegroundValue = isDark ? (colors[`${primaryColor}_foreground` as keyof typeof colors]?.dark || colors.neutral_foreground.dark) : (colors[`${primaryColor}_foreground` as keyof typeof colors]?.light || colors.neutral_foreground.light);
    
    document.documentElement.style.setProperty('--primary', primaryValue);
    document.documentElement.style.setProperty('--primary-foreground', primaryForegroundValue);

  }, [primaryColor, radius, fontSize, theme]);


  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem {...props}>
        <CustomThemeContext.Provider value={{ primaryColor, setPrimaryColor: handleSetPrimaryColor, radius, setRadius: handleSetRadius, fontSize, setFontSize: handleSetFontSize, resetTheme }}>
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
