"use client";

import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = [
    { value: "system", icon: Monitor, label: "System theme" },
    { value: "light", icon: Sun, label: "Light theme" },
    { value: "dark", icon: Moon, label: "Dark theme" },
  ];

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <fieldset className="flex items-center rounded-md border border-border bg-background p-1">
        <legend className="sr-only">Select a display theme</legend>
        {themes.map(({ value, icon: Icon, label }) => (
          <label
            key={value}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-all duration-200 text-muted-foreground"
          >
            <input
              type="radio"
              name="theme"
              value={value}
              checked={false}
              onChange={() => {}}
              className="sr-only"
              aria-label={label}
              disabled
            />
            <Icon className="h-4 w-4" />
          </label>
        ))}
      </fieldset>
    );
  }

  return (
    <fieldset className="flex items-center rounded-md border border-border bg-background p-1">
      <legend className="sr-only">Select a display theme</legend>
      {themes.map(({ value, icon: Icon, label }) => {
        const isActive = theme === value;
        return (
          <label
            key={value}
            className="flex h-7 w-7 cursor-pointer items-center justify-center rounded transition-all duration-200 hover:bg-accent hover:text-accent-foreground"
          >
            <input
              type="radio"
              name="theme"
              value={value}
              checked={isActive}
              onChange={() => setTheme(value)}
              className="sr-only"
              aria-label={label}
            />
            <Icon
              className={`h-4 w-4 transition-colors duration-200 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            />
          </label>
        );
      })}
    </fieldset>
  );
}
