"use client";

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored) {
        setIsDark(stored === 'dark');
        document.documentElement.classList.toggle('dark', stored === 'dark');
      } else {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDark(prefersDark);
        document.documentElement.classList.toggle('dark', prefersDark);
      }
    } catch (e) {
      // ignore (server or restricted storage)
    }
  }, []);

  const toggle = () => {
    try {
      const next = !isDark;
      setIsDark(next);
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch (e) {
      console.warn('Unable to persist theme preference', e);
    }
  };

  return (
    <Button
      variant="ghost"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="h-10 w-10 p-0"
    >
      {isDark ? <Sun className="w-5 h-5 text-brand-text-primary" /> : <Moon className="w-5 h-5 text-brand-text-primary" />}
    </Button>
  );
}
