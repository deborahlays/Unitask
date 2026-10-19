import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { getTimeGreeting, getFormattedCurrentDate } from '../lib/utils';
import { StatCards } from '../components/dashboard/StatCards';
import { TodayPriorities } from '../components/dashboard/TodayPriorities';
import { UpcomingDeadlines } from '../components/dashboard/UpcomingDeadlines';
import { WeeklyProductivityChart } from '../components/dashboard/WeeklyProductivityChart';
import { DisciplineProgressList } from '../components/dashboard/DisciplineProgressList';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { Button } from '../components/common/Button';
import { Plus, Sparkles } from 'lucide-react';
import { Task } from '../types';

export const DashboardPage: React.FC = () => {
  const { user, isDemoMode } = useAuth();
  const { kpiStats } = useData();

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const greeting = getTimeGreeting(user?.name);
  const formattedDate = getFormattedCurrentDate();

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {greeting}
            </h1>
            {isDemoMode && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                <Sparkles className="w-3 h-3" /> Demo
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            {formattedDate} • Você tem{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {kpiStats.pendingTasksCount} {kpiStats.pendingTasksCount === 1 ? 'tarefa pendente' : 'tarefas pendentes'}
            </strong>{' '}
            e{' '}
            <strong className="text-slate-700 dark:text-slate-300">
              {kpiStats.upcomingExamsAndWorksCount} {kpiStats.upcomingExamsAndWorksCount === 1 ? 'avaliação próxima' : 'avaliações próximas'}
            </strong>
            .
          </p>
        </div>

        <Button
          onClick={handleNewTask}
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          className="self-start sm:self-auto shrink-0"
        >
          Nova Tarefa
        </Button>
      </div>

      {/* 1. KPI Stat Cards */}
      <StatCards />

      {/* 2. Today's Urgent Priorities */}
      <TodayPriorities
        onEditTask={handleEditTask}
        onOpenNewTaskModal={handleNewTask}
      />

      {/* 3. Deadlines and Weekly Productivity Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UpcomingDeadlines />
        <WeeklyProductivityChart />
      </div>

      {/* 4. Discipline Progress Overview */}
      <DisciplineProgressList />

      {/* Task Modal for creation / edit */}
      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
