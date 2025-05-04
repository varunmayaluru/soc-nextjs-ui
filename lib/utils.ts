import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Add a CSS variable fallback helper
export function cssVar(name: string, fallback?: string) {
  return `var(${name}${fallback ? `, ${fallback}` : ""})`
}
