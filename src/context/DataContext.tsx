import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Discipline, Task, CalendarEvent, AppNotification, PriorityScore } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { generateDemoData } from '../lib/mockData';
import { calculateTaskUrgency, getSortedPriorities } from '../lib/priority';
import { fireConfetti } from '../lib/utils';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface DisciplineStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  percentage: number;
}

interface DataContextType {
  disciplines: Discipline[];
  tasks: Task[];
  events: CalendarEvent[];
  notifications: AppNotification[];
  isLoadingData: boolean;

  // Disciplines
  addDiscipline: (data: Omit<Discipline, 'id' | 'created_at'>) => Promise<Discipline>;
  updateDiscipline: (id: string, updates: Partial<Discipline>) => Promise<void>;
  deleteDiscipline: (id: string) => Promise<void>;
  getDisciplineById: (id: string) => Discipline | undefined;
  getDisciplineStats: (id: string) => DisciplineStats;

  // Tasks
  addTask: (data: Omit<Task, 'id' | 'created_at'>) => Promise<Task>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  getTaskById: (id: string) => Task | undefined;

  // Calendar Events
  addEvent: (data: Omit<CalendarEvent, 'id' | 'created_at'>) => Promise<CalendarEvent>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  unreadNotificationsCount: number;

  // Calculations & Analytics
  todayPriorities: (Task & { urgency: PriorityScore })[];
  upcomingDeadlines: Task[];
  kpiStats: {
    pendingTasksCount: number;
    completedTasksCount: number;
    upcomingExamsAndWorksCount: number;
    disciplinesCount: number;
    overdueTasksCount: number;
    completionRate: number;
  };

  // Demo & Reset
  loadDemoData: () => void;
  clearAllData: () => void;
  exportDataJson: () => string;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isDemoMode } = useAuth();
  const { success, error: toastError } = useToast();

  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Storage keys based on user id
  const storagePrefix = user ? `unitask_${user.id}_` : 'unitask_guest_';
  const DISC_KEY = `${storagePrefix}disciplines`;
  const TASKS_KEY = `${storagePrefix}tasks`;
  const EVENTS_KEY = `${storagePrefix}events`;
  const READ_NOTIFS_KEY = `${storagePrefix}read_notifications`;

  // Initial load
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) {
        setDisciplines([]);
        setTasks([]);
        setEvents([]);
        setIsLoadingData(false);
        return;
      }

      setIsLoadingData(true);

      // Demo mode loads fresh dynamic demo dataset
      if (isDemoMode) {
        const savedDisc = localStorage.getItem(DISC_KEY);
        const savedTasks = localStorage.getItem(TASKS_KEY);
        const savedEvents = localStorage.getItem(EVENTS_KEY);

        if (savedDisc && savedTasks) {
          try {
            setDisciplines(JSON.parse(savedDisc));
            setTasks(JSON.parse(savedTasks));
            setEvents(savedEvents ? JSON.parse(savedEvents) : []);
          } catch {
            const demo = generateDemoData(user.id);
            setDisciplines(demo.disciplines);
            setTasks(demo.tasks);
            setEvents(demo.events);
          }
        } else {
          const demo = generateDemoData(user.id);
          setDisciplines(demo.disciplines);
          setTasks(demo.tasks);
          setEvents(demo.events);
          localStorage.setItem(DISC_KEY, JSON.stringify(demo.disciplines));
          localStorage.setItem(TASKS_KEY, JSON.stringify(demo.tasks));
          localStorage.setItem(EVENTS_KEY, JSON.stringify(demo.events));
        }

        const savedRead = localStorage.getItem(READ_NOTIFS_KEY);
        if (savedRead) setReadNotificationIds(JSON.parse(savedRead));

        setIsLoadingData(false);
        return;
      }

      // Supabase load if connected
      if (isSupabaseConfigured && supabase) {
        try {
          const [discRes, taskRes, eventRes] = await Promise.all([
            supabase.from('disciplines').select('*').order('created_at', { ascending: false }),
            supabase.from('tasks').select('*').order('due_date', { ascending: true }),
            supabase.from('calendar_events').select('*').order('date', { ascending: true }),
          ]);

          if (discRes.data) setDisciplines(discRes.data as Discipline[]);
          if (taskRes.data) setTasks(taskRes.data as Task[]);
          if (eventRes.data) setEvents(eventRes.data as CalendarEvent[]);
        } catch (err) {
          console.error('Erro ao buscar dados do Supabase:', err);
        }
      } else {
        // Local storage load
        const savedDisc = localStorage.getItem(DISC_KEY);
        const savedTasks = localStorage.getItem(TASKS_KEY);
        const savedEvents = localStorage.getItem(EVENTS_KEY);

        if (savedDisc) {
          try {
            setDisciplines(JSON.parse(savedDisc));
          } catch {
            setDisciplines([]);
          }
        } else {
          // If first time regular user, provide initial sample
          const demo = generateDemoData(user.id);
          setDisciplines(demo.disciplines);
          setTasks(demo.tasks);
          setEvents(demo.events);
          localStorage.setItem(DISC_KEY, JSON.stringify(demo.disciplines));
          localStorage.setItem(TASKS_KEY, JSON.stringify(demo.tasks));
          localStorage.setItem(EVENTS_KEY, JSON.stringify(demo.events));
        }

        if (savedTasks) {
          try {
            setTasks(JSON.parse(savedTasks));
          } catch {
            setTasks([]);
          }
        }

        if (savedEvents) {
          try {
            setEvents(JSON.parse(savedEvents));
          } catch {
            setEvents([]);
          }
        }
      }

      const savedRead = localStorage.getItem(READ_NOTIFS_KEY);
      if (savedRead) {
        try {
          setReadNotificationIds(JSON.parse(savedRead));
        } catch {
          setReadNotificationIds([]);
        }
      }

      setIsLoadingData(false);
    };

    loadUserData();
  }, [user, isDemoMode, DISC_KEY, TASKS_KEY, EVENTS_KEY, READ_NOTIFS_KEY]);

  // Persist to localStorage helpers
  const saveDisciplinesLocal = (data: Discipline[]) => {
    setDisciplines(data);
    localStorage.setItem(DISC_KEY, JSON.stringify(data));
  };

  const saveTasksLocal = (data: Task[]) => {
    setTasks(data);
    localStorage.setItem(TASKS_KEY, JSON.stringify(data));
  };

  const saveEventsLocal = (data: CalendarEvent[]) => {
    setEvents(data);
    localStorage.setItem(EVENTS_KEY, JSON.stringify(data));
  };

  // --- DISCIPLINE ACTIONS ---
  const addDiscipline = async (data: Omit<Discipline, 'id' | 'created_at'>): Promise<Discipline> => {
    const newDiscipline: Discipline = {
      ...data,
      id: 'disc-' + Math.random().toString(36).substring(2, 9),
      user_id: user?.id,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase && !isDemoMode && user) {
      try {
        const { data: inserted, error } = await supabase
          .from('disciplines')
          .insert({
            user_id: user.id,
            name: data.name,
            code: data.code,
            teacher: data.teacher,
            color: data.color,
            description: data.description,
            semester: data.semester,
          })
          .select()
          .single();

        if (error) throw error;
        if (inserted) {
          const fresh = [inserted as Discipline, ...disciplines];
          saveDisciplinesLocal(fresh);
          success('Disciplina cadastrada!', `A disciplina "${data.name}" foi adicionada.`);
          return inserted as Discipline;
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao cadastrar';
        toastError('Erro ao cadastrar disciplina', message);
      }
    }

    const updated = [newDiscipline, ...disciplines];
    saveDisciplinesLocal(updated);
    success('Disciplina cadastrada!', `A disciplina "${data.name}" foi adicionada.`);
    return newDiscipline;
  };

  const updateDiscipline = async (id: string, updates: Partial<Discipline>): Promise<void> => {
    const updated = disciplines.map((d) => (d.id === id ? { ...d, ...updates } : d));
    saveDisciplinesLocal(updated);

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('disciplines').update(updates).eq('id', id);
      } catch (e) {
        console.error('Erro ao atualizar disciplina no Supabase:', e);
      }
    }
    success('Disciplina atualizada com sucesso!');
  };

  const deleteDiscipline = async (id: string): Promise<void> => {
    const disc = disciplines.find((d) => d.id === id);
    const updated = disciplines.filter((d) => d.id !== id);
    saveDisciplinesLocal(updated);

    // Also update tasks related to this discipline to avoid broken refs
    const updatedTasks = tasks.map((t) => (t.discipline_id === id ? { ...t, discipline_id: '' } : t));
    saveTasksLocal(updatedTasks);

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('disciplines').delete().eq('id', id);
      } catch (e) {
        console.error('Erro ao excluir disciplina no Supabase:', e);
      }
    }
    success('Disciplina excluída', `A disciplina "${disc?.name || ''}" foi removida.`);
  };

  const getDisciplineById = useCallback((id: string) => disciplines.find((d) => d.id === id), [disciplines]);

  const getDisciplineStats = useCallback(
    (id: string): DisciplineStats => {
      const discTasks = tasks.filter((t) => t.discipline_id === id);
      const total = discTasks.length;
      if (total === 0) {
        return { total: 0, completed: 0, pending: 0, overdue: 0, percentage: 0 };
      }

      const completed = discTasks.filter((t) => t.status === 'concluida').length;
      const pendingTasks = discTasks.filter((t) => t.status !== 'concluida');
      const now = new Date();
      const overdue = pendingTasks.filter((t) => new Date(t.due_date) < now).length;
      const percentage = Math.round((completed / total) * 100);

      return {
        total,
        completed,
        pending: pendingTasks.length,
        overdue,
        percentage,
      };
    },
    [tasks]
  );

  // --- TASK ACTIONS ---
  const addTask = async (data: Omit<Task, 'id' | 'created_at'>): Promise<Task> => {
    const newTask: Task = {
      ...data,
      id: 'task-' + Math.random().toString(36).substring(2, 9),
      user_id: user?.id,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase && !isDemoMode && user) {
      try {
        const { data: inserted, error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            discipline_id: data.discipline_id || null,
            title: data.title,
            description: data.description,
            due_date: data.due_date,
            priority: data.priority,
            status: data.status,
            type: data.type,
          })
          .select()
          .single();

        if (error) throw error;
        if (inserted) {
          const fresh = [inserted as Task, ...tasks];
          saveTasksLocal(fresh);
          success('Tarefa adicionada!', `"${data.title}" foi salva com sucesso.`);
          return inserted as Task;
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao cadastrar';
        toastError('Erro ao cadastrar tarefa', message);
      }
    }

    const updated = [newTask, ...tasks];
    saveTasksLocal(updated);
    success('Tarefa adicionada!', `"${data.title}" foi salva com sucesso.`);
    return newTask;
  };

  const updateTask = async (id: string, updates: Partial<Task>): Promise<void> => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTasksLocal(updated);

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('tasks').update(updates).eq('id', id);
      } catch (e) {
        console.error('Erro ao atualizar tarefa no Supabase:', e);
      }
    }
    success('Tarefa atualizada com sucesso!');
  };

  const deleteTask = async (id: string): Promise<void> => {
    const taskToDelete = tasks.find((t) => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);
    saveTasksLocal(updated);

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('tasks').delete().eq('id', id);
      } catch (e) {
        console.error('Erro ao excluir tarefa no Supabase:', e);
      }
    }
    success('Tarefa excluída', `"${taskToDelete?.title || ''}" foi removida.`);
  };

  const toggleTaskComplete = async (id: string): Promise<void> => {
    const target = tasks.find((t) => t.id === id);
    if (!target) return;

    const willBeCompleted = target.status !== 'concluida';
    const updates: Partial<Task> = {
      status: willBeCompleted ? 'concluida' : 'pendente',
      completed_at: willBeCompleted ? new Date().toISOString() : null,
    };

    const updated = tasks.map((t) => (t.id === id ? { ...t, ...updates } : t));
    saveTasksLocal(updated);

    if (willBeCompleted) {
      fireConfetti();
      success('Parabéns!', `Você concluiu "${target.title}".`);
    } else {
      success('Status atualizado', `"${target.title}" voltou para pendente.`);
    }

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('tasks').update(updates).eq('id', id);
      } catch (e) {
        console.error('Erro ao alterar status no Supabase:', e);
      }
    }
  };

  const getTaskById = useCallback((id: string) => tasks.find((t) => t.id === id), [tasks]);

  // --- CALENDAR EVENT ACTIONS ---
  const addEvent = async (data: Omit<CalendarEvent, 'id' | 'created_at'>): Promise<CalendarEvent> => {
    const newEvent: CalendarEvent = {
      ...data,
      id: 'event-' + Math.random().toString(36).substring(2, 9),
      user_id: user?.id,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase && !isDemoMode && user) {
      try {
        const { data: inserted, error } = await supabase
          .from('calendar_events')
          .insert({
            user_id: user.id,
            title: data.title,
            description: data.description,
            date: data.date,
            time: data.time || null,
            type: data.type,
            discipline_id: data.discipline_id || null,
            task_id: data.task_id || null,
            color: data.color || null,
          })
          .select()
          .single();

        if (error) throw error;
        if (inserted) {
          const fresh = [inserted as CalendarEvent, ...events];
          saveEventsLocal(fresh);
          success('Evento agendado!', `"${data.title}" foi adicionado ao calendário.`);
          return inserted as CalendarEvent;
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Erro ao cadastrar';
        toastError('Erro ao agendar evento', message);
      }
    }

    const updated = [newEvent, ...events];
    saveEventsLocal(updated);
    success('Evento agendado!', `"${data.title}" foi adicionado ao calendário.`);
    return newEvent;
  };

  const updateEvent = async (id: string, updates: Partial<CalendarEvent>): Promise<void> => {
    const updated = events.map((e) => (e.id === id ? { ...e, ...updates } : e));
    saveEventsLocal(updated);

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('calendar_events').update(updates).eq('id', id);
      } catch (e) {
        console.error('Erro ao atualizar evento no Supabase:', e);
      }
    }
    success('Evento atualizado!');
  };

  const deleteEvent = async (id: string): Promise<void> => {
    const target = events.find((e) => e.id === id);
    const updated = events.filter((e) => e.id !== id);
    saveEventsLocal(updated);

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('calendar_events').delete().eq('id', id);
      } catch (e) {
        console.error('Erro ao excluir evento no Supabase:', e);
      }
    }
    success('Evento excluído', `"${target?.title || ''}" foi removido.`);
  };

  // --- DYNAMIC NOTIFICATIONS ---
  const notifications: AppNotification[] = useMemo(() => {
    const items: AppNotification[] = [];
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;

    tasks.forEach((task) => {
      if (task.status === 'concluida') return;

      const taskDateOnly = task.due_date.split('T')[0];
      const dueDate = new Date(task.due_date);

      if (dueDate < now && taskDateOnly !== todayStr) {
        items.push({
          id: `notif-overdue-${task.id}`,
          title: 'Tarefa Atrasada!',
          message: `"${task.title}" venceu e precisa da sua atenção.`,
          type: 'urgent',
          created_at: task.due_date,
          read: readNotificationIds.includes(`notif-overdue-${task.id}`),
          link_to: '/tarefas',
          task_id: task.id,
        });
      } else if (taskDateOnly === todayStr) {
        items.push({
          id: `notif-today-${task.id}`,
          title: 'Prazo Hoje!',
          message: `"${task.title}" vence hoje. Não esqueça de entregar.`,
          type: 'warning',
          created_at: new Date().toISOString(),
          read: readNotificationIds.includes(`notif-today-${task.id}`),
          link_to: '/tarefas',
          task_id: task.id,
        });
      } else if (taskDateOnly === tomorrowStr) {
        items.push({
          id: `notif-tomorrow-${task.id}`,
          title: 'Prazo Amanhã',
          message: `"${task.title}" vence amanhã.`,
          type: 'info',
          created_at: new Date().toISOString(),
          read: readNotificationIds.includes(`notif-tomorrow-${task.id}`),
          link_to: '/tarefas',
          task_id: task.id,
        });
      }

      if (task.type === 'prova' && dueDate >= now) {
        const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays > 0 && diffDays <= 4) {
          items.push({
            id: `notif-exam-${task.id}`,
            title: 'Prova se aproximando!',
            message: `A prova "${task.title}" será em ${diffDays} dias. Revise os conteúdos!`,
            type: 'warning',
            created_at: new Date().toISOString(),
            read: readNotificationIds.includes(`notif-exam-${task.id}`),
            link_to: '/calendario',
            task_id: task.id,
          });
        }
      }
    });

    return items;
  }, [tasks, readNotificationIds]);

  const markNotificationRead = (id: string) => {
    if (!readNotificationIds.includes(id)) {
      const updated = [...readNotificationIds, id];
      setReadNotificationIds(updated);
      localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(updated));
    }
  };

  const markAllNotificationsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds(allIds);
    localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(allIds));
    success('Notificações marcadas como lidas');
  };

  const clearNotifications = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotificationIds(allIds);
    localStorage.setItem(READ_NOTIFS_KEY, JSON.stringify(allIds));
  };

  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // --- TODAY PRIORITIES ---
  const todayPriorities = useMemo(() => {
    return getSortedPriorities(tasks, 5);
  }, [tasks]);

  // --- UPCOMING DEADLINES ---
  const upcomingDeadlines = useMemo(() => {
    const pending = tasks.filter((t) => t.status !== 'concluida');
    return [...pending].sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime()).slice(0, 6);
  }, [tasks]);

  // --- KPI STATS ---
  const kpiStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.status === 'concluida');
    const pendingTasks = tasks.filter((t) => t.status !== 'concluida');
    const now = new Date();

    const overdueTasks = pendingTasks.filter((t) => new Date(t.due_date) < now);

    // Upcoming exams and works in the next 14 days
    const next14Days = new Date();
    next14Days.setDate(next14Days.getDate() + 14);

    const upcomingExamsAndWorks = tasks.filter((t) => {
      if (t.status === 'concluida') return false;
      if (t.type !== 'prova' && t.type !== 'trabalho' && t.type !== 'apresentacao') return false;
      const d = new Date(t.due_date);
      return d >= now && d <= next14Days;
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

    return {
      pendingTasksCount: pendingTasks.length,
      completedTasksCount: completedTasks.length,
      upcomingExamsAndWorksCount: upcomingExamsAndWorks.length,
      disciplinesCount: disciplines.length,
      overdueTasksCount: overdueTasks.length,
      completionRate,
    };
  }, [tasks, disciplines]);

  // --- DEMO / RESET ACTIONS ---
  const loadDemoData = () => {
    if (!user) return;
    const demo = generateDemoData(user.id);
    saveDisciplinesLocal(demo.disciplines);
    saveTasksLocal(demo.tasks);
    saveEventsLocal(demo.events);
    setReadNotificationIds([]);
    localStorage.removeItem(READ_NOTIFS_KEY);
    success('Dados de demonstração carregados!', 'Disciplinas, tarefas e eventos foram preenchidos.');
  };

  const clearAllData = () => {
    saveDisciplinesLocal([]);
    saveTasksLocal([]);
    saveEventsLocal([]);
    setReadNotificationIds([]);
    localStorage.removeItem(READ_NOTIFS_KEY);
    success('Dados limpos', 'Todas as suas informações locais foram removidas.');
  };

  const exportDataJson = () => {
    const payload = {
      user: { name: user?.name, email: user?.email },
      disciplines,
      tasks,
      events,
      exported_at: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  };

  return (
    <DataContext.Provider
      value={{
        disciplines,
        tasks,
        events,
        notifications,
        isLoadingData,
        addDiscipline,
        updateDiscipline,
        deleteDiscipline,
        getDisciplineById,
        getDisciplineStats,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskComplete,
        getTaskById,
        addEvent,
        updateEvent,
        deleteEvent,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotifications,
        unreadNotificationsCount,
        todayPriorities,
        upcomingDeadlines,
        kpiStats,
        loadDemoData,
        clearAllData,
        exportDataJson,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData deve ser usado dentro de um DataProvider');
  }
  return context;
};
