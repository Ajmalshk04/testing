"use client";

import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'minimal' | 'compact';
  showLabel?: boolean;
  align?: 'center' | 'end' | 'start';
  className?: string;
}

export function ThemeToggle({
  variant = 'default',
  showLabel = false,
  align = 'end',
  className
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const getCurrentIcon = () => {
    if (theme === 'system') {
      return <Monitor className="h-4 w-4" />;
    }
    
    if (resolvedTheme === 'dark') {
      return <Moon className="h-4 w-4" />;
    }
    
    return <Sun className="h-4 w-4" />;
  };

  const getCurrentLabel = () => {
    if (theme === 'system') return 'System';
    if (resolvedTheme === 'dark') return 'Dark';
    return 'Light';
  };

  if (variant === 'minimal') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme);
              }}
              className={cn(
                "h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground",
                className
              )}
            >
              {getCurrentIcon()}
              <span className="sr-only">Toggle theme</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Switch to {resolvedTheme === 'dark' ? 'light' : 'dark'} mode</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (variant === 'compact') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
          setTheme(nextTheme);
        }}
        className={cn(
          "h-8 px-2 gap-2 hover:bg-accent hover:text-accent-foreground",
          className
        )}
      >
        {getCurrentIcon()}
        {showLabel && (
          <span className="text-xs font-medium">{getCurrentLabel()}</span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground",
            showLabel && "w-auto px-3 gap-2",
            className
          )}
        >
          {getCurrentIcon()}
          {showLabel && (
            <span className="text-sm font-medium">{getCurrentLabel()}</span>
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="w-40">
        <DropdownMenuItem 
          onClick={() => setTheme('light')}
          className="gap-2 cursor-pointer"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === 'light' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')}
          className="gap-2 cursor-pointer"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === 'dark' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')}
          className="gap-2 cursor-pointer"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === 'system' && (
            <div className="ml-auto h-2 w-2 rounded-full bg-primary" />
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Quick toggle hook for programmatic use
export function useThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const toggleTheme = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const setLightTheme = () => setTheme('light');
  const setDarkTheme = () => setTheme('dark');
  const setSystemTheme = () => setTheme('system');

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    setLightTheme,
    setDarkTheme,
    setSystemTheme,
    setTheme
  };
}