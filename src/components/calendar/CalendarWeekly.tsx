import React, { useState } from 'react';
import { Task, CalendarEvent } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Check, Plus } from 'lucide-react';
import { Button } from '../common/Button';
import { ActivityTypeBadge, PriorityBadge } from '../common/Badge';

interface CalendarWeeklyProps {
  onSelectDate: (dateStr: string, items: { type: 'task' | 'event'; data: Task | CalendarEvent }[]) => void;
  onQuickAdd: (dateStr: string) => void;
  onEditTask: (task: Task) => void;
}

export const CalendarWeekly: React.FC<CalendarWeeklyProps> = ({
  onSelectDate,
  onQuickAdd,
  onEditTask,
}) => {
  const { tasks, events, getDisciplineById, toggleTaskComplete } = useData();
  const { user } = useAuth();

  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const now = new Date();
    const day = now.getDay();
    const firstDayIsMonday = user?.first_day_of_week === 'monday';
    const diff = firstDayIsMonday ? (day === 0 ? -6 : 1 - day) : -day;
    const start = new Date(now);
    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    return start;
  });

  const prevWeek = () => {
    const prev = new Date(currentWeekStart);
    prev.setDate(prev.getDate() - 7);
    setCurrentWeekStart(prev);
  };

  const nextWeek = () => {
    const next = new Date(currentWeekStart);
    next.setDate(next.getDate() + 7);
    setCurrentWeekStart(next);
  };

  const goToThisWeek = () => {
    const now = new Date();
    const day = now.getDay();
    const firstDayIsMonday = user?.first_day_of_week === 'monday';
    const diff = firstDayIsMonday ? (day === 0 ? -6 : 1 - day) : -day;
    const start = new Date(now);
    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    setCurrentWeekStart(start);
  };

  const pad = (n: number) => String(n).padStart(2, '0');
  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

  const todayKey = formatDateKey(new Date());

  // Generate 7 days
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(currentWeekStart);
    d.setDate(d.getDate() + i);
    const dateKey = formatDateKey(d);

    const dayTasks = tasks
      .filter((t) => t.due_date.startsWith(dateKey))
      .map((t) => ({ type: 'task' as const, data: t }));

    const dayEvents = events
      .filter((e) => e.date === dateKey)
      .map((e) => ({ type: 'event' as const, data: e }));

    return {
      date: d,
      dateKey,
      items: [...dayTasks, ...dayEvents],
      isToday: dateKey === todayKey,
    };
  });

  // Title range (e.g., "19 a 25 de Outubro de 2026")
  const startDate = weekDays[0].date;
  const endDate = weekDays[6].date;
  const title = `${startDate.getDate()} de ${startDate.toLocaleDateString('pt-BR', { month: 'short' })} — ${endDate.getDate()} de ${endDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}`;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            Semana: {title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Visão detalhada dos seus compromissos para cada dia da semana.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <Button variant="outline" size="sm" onClick={goToThisWeek}>
            Esta Semana
          </Button>
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
            <button
              onClick={prevWeek}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Semana anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextWeek}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Próxima semana"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 7 Days Columns */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((col) => {
          const weekdayName = col.date.toLocaleDateString('pt-BR', { weekday: 'short' });
          const dayNumber = col.date.getDate();

          return (
            <div
              key={col.dateKey}
              className={`flex flex-col rounded-xl border p-3 min-h-[300px] transition-all ${
                col.isToday
                  ? 'border-blue-400 dark:border-blue-600 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60'
              }`}
            >
              {/* Column Day Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                    {weekdayName}
                  </span>
                  <div
                    className={`text-lg font-bold ${
                      col.isToday ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {dayNumber}
                  </div>
                </div>

                <button
                  onClick={() => onQuickAdd(col.dateKey)}
                  className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-colors"
                  title="Adicionar compromisso neste dia"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Day Items List */}
              <div className="space-y-2 flex-1 overflow-y-auto max-h-[420px]">
                {col.items.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-3 text-xs text-slate-400 dark:text-slate-500 italic">
                    Sem atividades
                  </div>
                ) : (
                  col.items.map((item, idx) => {
                    if (item.type === 'task') {
                      const task = item.data as Task;
                      const discipline = task.discipline_id ? getDisciplineById(task.discipline_id) : undefined;
                      const isCompleted = task.status === 'concluida';

                      return (
                        <div
                          key={`task-${task.id}-${idx}`}
                          onClick={() => onSelectDate(col.dateKey, col.items)}
                          className={`p-2 rounded-lg border text-left cursor-pointer transition-all hover:shadow-xs ${
                            isCompleted
                              ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span
                              className="text-[10px] font-semibold px-1.5 py-0.2 rounded truncate max-w-[80px]"
                              style={{
                                backgroundColor: discipline ? `${discipline.color}20` : '#e2e8f0',
                                color: discipline?.color || '#475569',
                              }}
                            >
                              {discipline?.name || 'Geral'}
                            </span>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleTaskComplete(task.id);
                              }}
                              className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                                isCompleted
                                  ? 'bg-emerald-600 border-emerald-600 text-white'
                                  : 'border-slate-300 dark:border-slate-600'
                              }`}
                            >
                              {isCompleted && <Check className="w-3 h-3 stroke-[3]" />}
                            </button>
                          </div>

                          <h6
                            className={`text-xs font-semibold leading-tight line-clamp-2 ${
                              isCompleted
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </h6>

                          <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-500 dark:text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {task.due_date.includes('T') ? task.due_date.split('T')[1].substring(0, 5) : '23:59'}
                            </span>
                          </div>
                        </div>
                      );
                    } else {
                      const ev = item.data as CalendarEvent;
                      return (
                        <div
                          key={`ev-${ev.id}-${idx}`}
                          onClick={() => onSelectDate(col.dateKey, col.items)}
                          className="p-2 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-left cursor-pointer transition-all"
                        >
                          <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400 uppercase">
                            Evento
                          </span>
                          <h6 className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                            {ev.title}
                          </h6>
                          {ev.time && (
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-500">
                              <Clock className="w-3 h-3" />
                              <span>{ev.time}</span>
                            </div>
                          )}
                        </div>
                      );
                    }
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
