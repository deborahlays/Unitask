import React, { useState } from 'react';
import { Task, CalendarEvent } from '../../types';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '../common/Button';

interface CalendarMonthlyProps {
  onSelectDate: (dateStr: string, items: { type: 'task' | 'event'; data: Task | CalendarEvent }[]) => void;
  onQuickAdd: (dateStr: string) => void;
}

export const CalendarMonthly: React.FC<CalendarMonthlyProps> = ({ onSelectDate, onQuickAdd }) => {
  const { tasks, events, getDisciplineById } = useData();
  const { user } = useAuth();

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Month title formatted in pt-BR
  const monthTitle = currentDate.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
  const capitalizedMonthTitle = monthTitle.charAt(0).toUpperCase() + monthTitle.slice(1);

  // Weekdays based on user first_day_of_week
  const firstDayIsMonday = user?.first_day_of_week === 'monday';
  const weekDays = firstDayIsMonday
    ? ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
    : ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  // Days in current month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const offset = firstDayIsMonday ? (firstDayIndex === 0 ? 6 : firstDayIndex - 1) : firstDayIndex;

  // Days from previous month for padding
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Helper to format date string YYYY-MM-DD
  const formatDateKey = (y: number, m: number, d: number) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${y}-${pad(m + 1)}-${pad(d)}`;
  };

  // Index items by date string
  const getItemsForDate = (dateKey: string) => {
    const dayTasks = tasks
      .filter((t) => t.due_date.startsWith(dateKey))
      .map((t) => ({ type: 'task' as const, data: t }));

    const dayEvents = events
      .filter((e) => e.date === dateKey)
      .map((e) => ({ type: 'event' as const, data: e }));

    return [...dayTasks, ...dayEvents];
  };

  const todayStr = formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

  // Build grid cells
  const cells: {
    day: number;
    isCurrentMonth: boolean;
    dateKey: string;
    items: { type: 'task' | 'event'; data: Task | CalendarEvent }[];
  }[] = [];

  // Previous month trailing days
  for (let i = offset - 1; i >= 0; i--) {
    const d = prevMonthDays - i;
    const prevMonthDate = new Date(year, month - 1, d);
    const dateKey = formatDateKey(prevMonthDate.getFullYear(), prevMonthDate.getMonth(), d);
    cells.push({
      day: d,
      isCurrentMonth: false,
      dateKey,
      items: getItemsForDate(dateKey),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dateKey = formatDateKey(year, month, d);
    cells.push({
      day: d,
      isCurrentMonth: true,
      dateKey,
      items: getItemsForDate(dateKey),
    });
  }

  // Next month leading days to complete 35 or 42 cells
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    const nextMonthDate = new Date(year, month + 1, d);
    const dateKey = formatDateKey(nextMonthDate.getFullYear(), nextMonthDate.getMonth(), d);
    cells.push({
      day: d,
      isCurrentMonth: false,
      dateKey,
      items: getItemsForDate(dateKey),
    });
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs">
      {/* Calendar Header Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-blue-600" />
            {capitalizedMonthTitle}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Clique em qualquer dia para ver os compromissos ou adicionar uma atividade.
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hoje
          </Button>
          <div className="flex items-center gap-1 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Mês anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Próximo mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekdays Row */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
        {weekDays.map((name) => (
          <div
            key={name}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 py-1 uppercase tracking-wider"
          >
            {name}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {cells.map((cell, idx) => {
          const isToday = cell.dateKey === todayStr;
          const hasItems = cell.items.length > 0;

          return (
            <div
              key={`${cell.dateKey}-${idx}`}
              onClick={() => onSelectDate(cell.dateKey, cell.items)}
              className={`group min-h-[75px] sm:min-h-[96px] p-1.5 sm:p-2 rounded-xl border transition-all text-left flex flex-col justify-between cursor-pointer relative ${
                !cell.isCurrentMonth
                  ? 'opacity-35 bg-slate-50/50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/40'
                  : isToday
                  ? 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600 shadow-xs'
                  : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-xs'
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday
                      ? 'bg-blue-600 text-white font-bold'
                      : cell.isCurrentMonth
                      ? 'text-slate-700 dark:text-slate-300'
                      : 'text-slate-400 dark:text-slate-600'
                  }`}
                >
                  {cell.day}
                </span>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickAdd(cell.dateKey);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded transition-opacity"
                  title="Adicionar atividade neste dia"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Items chips */}
              <div className="mt-1 space-y-1 overflow-hidden">
                {cell.items.slice(0, 2).map((item, itemIdx) => {
                  if (item.type === 'task') {
                    const task = item.data as Task;
                    const discipline = task.discipline_id ? getDisciplineById(task.discipline_id) : undefined;
                    const isCompleted = task.status === 'concluida';

                    return (
                      <div
                        key={`t-${task.id}-${itemIdx}`}
                        className={`text-[10px] leading-tight px-1.5 py-0.5 rounded truncate font-medium flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 line-through dark:bg-emerald-950/40 dark:text-emerald-400'
                            : task.type === 'prova'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                            : task.type === 'trabalho' || task.type === 'apresentacao'
                            ? 'bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                        title={task.title}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: discipline?.color || '#2563eb' }}
                        />
                        <span className="truncate">{task.title}</span>
                      </div>
                    );
                  } else {
                    const ev = item.data as CalendarEvent;
                    return (
                      <div
                        key={`e-${ev.id}-${itemIdx}`}
                        className="text-[10px] leading-tight px-1.5 py-0.5 rounded truncate font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 flex items-center gap-1"
                        title={ev.title}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: ev.color || '#f59e0b' }}
                        />
                        <span className="truncate">{ev.title}</span>
                      </div>
                    );
                  }
                })}

                {cell.items.length > 2 && (
                  <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 pl-1">
                    +{cell.items.length - 2} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
