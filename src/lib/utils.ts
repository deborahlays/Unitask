import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import confetti from 'canvas-confetti';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date or YYYY-MM-DD into Brazilian standard DD/MM/AAAA
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const parts = dateString.split('T')[0].split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      return `${day}/${month}/${year}`;
    }
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateString || '';
  }
}

/**
 * Format date and time to DD/MM/AAAA às HH:mm
 */
export function formatDateTime(dateString?: string | null): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const dateFormatted = d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const timeFormatted = d.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${dateFormatted} às ${timeFormatted}`;
  } catch {
    return dateString || '';
  }
}

/**
 * Friendly relative date label in pt-BR
 */
export function formatRelativeDeadline(dateString: string): { label: string; isOverdue: boolean; isToday: boolean } {
  try {
    const target = new Date(dateString);
    const now = new Date();
    
    // Normalize to date boundaries for day comparison
    const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffMs = targetDay.getTime() - today.getTime();
    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const absDays = Math.abs(diffDays);
      return {
        label: absDays === 1 ? 'Atrasada há 1 dia' : `Atrasada há ${absDays} dias`,
        isOverdue: true,
        isToday: false,
      };
    }
    if (diffDays === 0) {
      const timePart = dateString.includes('T') ? ` às ${target.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` : '';
      return {
        label: `Hoje${timePart}`,
        isOverdue: false,
        isToday: true,
      };
    }
    if (diffDays === 1) {
      return {
        label: 'Amanhã',
        isOverdue: false,
        isToday: false,
      };
    }
    if (diffDays <= 7) {
      const weekday = target.toLocaleDateString('pt-BR', { weekday: 'long' });
      return {
        label: weekday.charAt(0).toUpperCase() + weekday.slice(1),
        isOverdue: false,
        isToday: false,
      };
    }

    return {
      label: formatDate(dateString),
      isOverdue: false,
      isToday: false,
    };
  } catch {
    return { label: formatDate(dateString), isOverdue: false, isToday: false };
  }
}

/**
 * Get greeting based on time of day
 */
export function getTimeGreeting(userName?: string): string {
  const hour = new Date().getHours();
  let greet = 'Olá';
  if (hour >= 5 && hour < 12) {
    greet = 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    greet = 'Boa tarde';
  } else {
    greet = 'Boa noite';
  }
  return userName ? `${greet}, ${userName}!` : `${greet}, estudante!`;
}

/**
 * Current date banner formatted nicely in pt-BR
 */
export function getFormattedCurrentDate(): string {
  const now = new Date();
  const formatted = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

/**
 * Fire celebration confetti when user completes a task
 */
export function fireConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
    });
  } catch (e) {
    // Non-critical if canvas-confetti fails
    console.debug('Confetti trigger skipped', e);
  }
}

/**
 * Hex to rgba helper for badge backgrounds
 */
export function hexToRgba(hex: string, alpha: number = 0.15): string {
  const cleaned = hex.replace('#', '');
  if (cleaned.length === 3) {
    const r = parseInt(cleaned[0] + cleaned[0], 16);
    const g = parseInt(cleaned[1] + cleaned[1], 16);
    const b = parseInt(cleaned[2] + cleaned[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  if (cleaned.length === 6) {
    const r = parseInt(cleaned.substring(0, 2), 16);
    const g = parseInt(cleaned.substring(2, 4), 16);
    const b = parseInt(cleaned.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(37, 99, 235, ${alpha})`;
}
