import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Merges tailwind classes intelligently
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats backend dates consistently
 */
export function formatDate(date, pattern = 'MMM dd, yyyy HH:mm') {
  if (!date) return '-';
  try {
    return format(new Date(date), pattern);
  } catch (e) {
    return date;
  }
}

/**
 * Currency formatter
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
