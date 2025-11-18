import { twMerge } from 'tailwind-merge';
import clsx, { type ClassValue } from 'clsx';

/**
 * Custom class name merger that ensures user-supplied classes
 * (passed later in the component or template) always override defaults.
 *
 * Example:
 *   cn('bg-primary', userClass) → userClass wins if conflicts exist.
 */
export function cn(...inputs: ClassValue[]) {
  const classes = clsx(inputs).split(' ').filter(Boolean);

  return twMerge(classes.join(' '));
}
