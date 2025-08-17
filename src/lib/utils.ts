import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const colorPalette = [
  { bg: '#fee2e2', text: '#ef4444' }, // Red
  { bg: '#ffedd5', text: '#f97316' }, // Orange
  { bg: '#dcfce7', text: '#22c55e' }, // Green
  { bg: '#dbeafe', text: '#3b82f6' }, // Blue
  { bg: '#e0e7ff', text: '#6366f1' }, // Indigo
  { bg: '#ede9fe', text: '#8b5cf6' }, // Purple
  { bg: '#fce7f3', text: '#ec4899' }, // Pink
  { bg: '#d1fae5', text: '#10b981' }, // Emerald
  { bg: '#cffafe', text: '#06b6d4' }, // Cyan
  { bg: '#e0f2fe', text: '#0ea5e9' }, // Sky
];

export function getColorByIndex(index: number) {
  return colorPalette[index % colorPalette.length];
}
