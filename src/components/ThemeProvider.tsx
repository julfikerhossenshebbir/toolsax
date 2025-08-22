
'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';
import { useAuth } from '@/contexts/AuthContext';
import { getUserThemeSettings, saveUserThemeSettings } from '@/lib/firebase';

const DEFAULT_COLOR = 'violet';
const DEFAULT_RADIUS = 0.5;
const DEFAULT_FONT_SIZE = 15;


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
  const { user } = useAuth();

  const [primaryColor, setPrimaryColor] = React.useState(DEFAULT_COLOR);
  const [radius, setRadius] = React.useState(DEFAULT_RADIUS);
  const [fontSize, setFontSize] = React.useState(DEFAULT_FONT_SIZE);

  React.useEffect(() => {
    const loadSettings = async () => {
      if (user) {
        // User is logged in, load from Firebase
        const dbSettings = await getUserThemeSettings(user.uid);
        if (dbSettings) {
          setPrimaryColor(dbSettings.primaryColor || DEFAULT_COLOR);
          setRadius(dbSettings.radius ?? DEFAULT_RADIUS);
          setFontSize(dbSettings.fontSize ?? DEFAULT_FONT_SIZE);
          return;
        }
      }
      // User is not logged in or has no settings, load from localStorage
      const savedColor = localStorage.getItem('theme-primary-color');
      const savedRadius = localStorage.getItem('theme-radius');
      const savedFontSize = localStorage.getItem('theme-font-size');
      if (savedColor) setPrimaryColor(savedColor);
      if (savedRadius) setRadius(parseFloat(savedRadius));
      if (savedFontSize) setFontSize(parseInt(savedFontSize, 10));
    };
    
    loadSettings();
  }, [user]);

  const handleSetPrimaryColor = (color: string) => {
    setPrimaryColor(color);
    localStorage.setItem('theme-primary-color', color);
    if(user) saveUserThemeSettings(user.uid, { primaryColor: color });
  };

  const handleSetRadius = (newRadius: number) => {
    setRadius(newRadius);
    localStorage.setItem('theme-radius', newRadius.toString());
    if(user) saveUserThemeSettings(user.uid, { radius: newRadius });
  };

  const handleSetFontSize = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem('theme-font-size', newSize.toString());
    if(user) saveUserThemeSettings(user.uid, { fontSize: newSize });
  };

  const resetTheme = () => {
    const defaultSettings = {
        primaryColor: DEFAULT_COLOR,
        radius: DEFAULT_RADIUS,
        fontSize: DEFAULT_FONT_SIZE,
    };
    setPrimaryColor(DEFAULT_COLOR);
    setRadius(DEFAULT_RADIUS);
    setFontSize(DEFAULT_FONT_SIZE);
    
    localStorage.removeItem('theme-primary-color');
    localStorage.removeItem('theme-radius');
    localStorage.removeItem('theme-font-size');
    if(user) saveUserThemeSettings(user.uid, defaultSettings);
  };

  React.useEffect(() => {
    document.body.style.setProperty('--radius', `${radius}rem`);
    document.documentElement.style.fontSize = `${fontSize}px`;

    const isDark = theme === 'dark';

    const colors: {[key: string]: {light: string, dark: string}} = {
      violet: { light: '262 84% 60%', dark: '262 84% 75%' },
      red: { light: '0 84.2% 60.2%', dark: '0 80% 65%' },
      rose: { light: '346.8 93.2% 57.1%', dark: '346.8 90% 65%' },
      orange: { light: '25.3 93.2% 54.9%', dark: '25.3 90% 60%' },
      green: { light: '142.1 76.2% 36.3%', dark: '142.1 65% 50%' },
      blue: { light: '221 83% 53%', dark: '221 83% 65%' },
      yellow: { light: '47.9 95.8% 53.1%', dark: '47.9 90% 60%' },

      violet_foreground: { light: '0 0% 98%', dark: '262 84% 25%' },
      red_foreground: { light: '0 0% 98%', dark: '0 85.7% 97.3%' },
      rose_foreground: { light: '0 0% 98%', dark: '346.8 85.7% 97.3%' },
      orange_foreground: { light: '24 9.8% 10%', dark: '20 14.3% 4.1%' },
      green_foreground: { light: '144.9 80.4% 97.3%', dark: '144.9 80.4% 97.3%' },
      blue_foreground: { light: '0 0% 98%', dark: '221 83% 20%' },
      yellow_foreground: { light: '24 9.8% 10%', dark: '48 9.8% 10%' },
    };
    
    const selectedColor = colors[primaryColor] || colors.violet;
    const primaryValue = isDark ? selectedColor.dark : selectedColor.light;
    const primaryForegroundValue = isDark ? (colors[`${primaryColor}_foreground` as keyof typeof colors]?.dark || colors.violet_foreground.dark) : (colors[`${primaryColor}_foreground` as keyof typeof colors]?.light || colors.violet_foreground.light);
    
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
