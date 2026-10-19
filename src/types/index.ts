export type PriorityLevel = 'baixa' | 'media' | 'alta';

export type TaskStatus = 'pendente' | 'em_andamento' | 'concluida';

export type ActivityType = 'tarefa' | 'prova' | 'trabalho' | 'apresentacao' | 'outro';

export interface Discipline {
  id: string;
  user_id?: string;
  name: string;
  code?: string;
  teacher?: string;
  color: string; // Hex color (e.g. #2563eb)
  description?: string;
  semester?: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id?: string;
  discipline_id: string;
  title: string;
  description?: string;
  due_date: string; // ISO 8601 string: YYYY-MM-DDTHH:mm
  priority: PriorityLevel;
  status: TaskStatus;
  type: ActivityType;
  completed_at?: string | null;
  created_at: string;
}

export interface CalendarEvent {
  id: string;
  user_id?: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:mm
  type: ActivityType;
  discipline_id?: string;
  task_id?: string;
  color?: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id?: string;
  title: string;
  message: string;
  type: 'urgent' | 'warning' | 'info' | 'success';
  created_at: string;
  read: boolean;
  link_to?: string;
  task_id?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  course?: string;
  university?: string;
  first_day_of_week: 'sunday' | 'monday';
  theme: 'light' | 'dark' | 'system';
  notify_due_today: boolean;
  notify_due_tomorrow: boolean;
  notify_exams: boolean;
  sound_effects: boolean;
}

export interface PriorityScore {
  score: number;
  reason: string;
  isOverdue: boolean;
  daysRemaining: number;
}
