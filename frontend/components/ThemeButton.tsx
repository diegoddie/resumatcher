'use client'

import { Moon } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";
import { Sun } from "lucide-react";
import { useTheme } from "next-themes";

function ThemeButton() {
  const { theme, setTheme } = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="py-5 px-5 cursor-pointer"
    >
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeButton;
