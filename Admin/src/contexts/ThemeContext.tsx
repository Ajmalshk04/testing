import React, { createContext, useContext } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import type { ReactNode } from 'react';

interface ThemeContextType {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  resolvedTheme: string | undefined;
  systemTheme: string | undefined;
  themes: string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem 
      disableTransitionOnChange
      themes={['light', 'dark', 'system']}
      storageKey="admin-dashboard-theme"
    >
      <ThemeContextWrapper>
        {children}
      </ThemeContextWrapper>
    </NextThemesProvider>
  );
};

const ThemeContextWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const themeProps = useTheme();

  return (
    <ThemeContext.Provider value={themeProps}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};

// Re-export useTheme for convenience
export { useTheme };