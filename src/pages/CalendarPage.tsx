import React, { useState } from 'react';
import { Task, CalendarEvent } from '../types';
import { CalendarMonthly } from '../components/calendar/CalendarMonthly';
import { CalendarWeekly } from '../components/calendar/CalendarWeekly';
import { EventDetailModal } from '../components/calendar/EventDetailModal';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Button } from '../components/common/Button';

export const CalendarPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'monthly' | 'weekly'>('monthly');

  // Selected date modal state
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<{ type: 'task' | 'event'; data: Task | CalendarEvent }[]>([]);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // New/Edit task modal state
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [initialTaskDate, setInitialTaskDate] = useState<string>('');

  const handleSelectDate = (
    dateStr: string,
    items: { type: 'task' | 'event'; data: Task | CalendarEvent }[]
  ) => {
    setSelectedDate(dateStr);
    setSelectedItems(items);
    setDetailModalOpen(true);
  };

  const handleQuickAdd = (dateStr: string) => {
    setTaskToEdit(null);
    setInitialTaskDate(dateStr);
    setTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
            Calendário Acadêmico
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Acompanhe provas, entregas de trabalhos e compromissos semanais ou mensais.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* View mode switcher */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setViewMode('weekly')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                viewMode === 'weekly'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Semana
            </button>
          </div>

          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => handleQuickAdd(new Date().toISOString().split('T')[0])}
          >
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Main Calendar View */}
      {viewMode === 'monthly' ? (
        <CalendarMonthly
          onSelectDate={handleSelectDate}
          onQuickAdd={handleQuickAdd}
        />
      ) : (
        <CalendarWeekly
          onSelectDate={handleSelectDate}
          onQuickAdd={handleQuickAdd}
          onEditTask={handleEditTask}
        />
      )}

      {/* Date Details Modal */}
      <EventDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        selectedDate={selectedDate}
        itemsOnDate={selectedItems}
        onOpenNewTaskModal={handleQuickAdd}
        onEditTask={handleEditTask}
      />

      {/* Create / Edit Task Modal */}
      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        initialDate={initialTaskDate}
      />
    </div>
  );
};
