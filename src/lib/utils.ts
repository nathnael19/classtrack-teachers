import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a 24h time string (HH:mm) into Ethiopian local time.
 * Ethiopian time is shifted by 6 hours.
 * 7:00 AM (standard) -> 1:00 (local morning)
 * 7:00 PM (standard) -> 1:00 (local night)
 */
export function formatEthiopianTime(timeStr: string): string {
  if (!timeStr) return '';
  
  // Handle HH:mm:ss or HH:mm
  const [hours, minutes] = timeStr.split(':').map(Number);
  
  let etHours = hours - 6;
  if (etHours <= 0) etHours += 12;
  if (etHours > 12) etHours -= 12;
  
  const period = (hours >= 6 && hours < 18) ? 'Day' : 'Night';
  
  return `${etHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}
