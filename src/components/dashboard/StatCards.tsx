import React from 'react';
import { useData } from '../../context/DataContext';
import { CheckCircle2, Clock, Award, BookOpen, AlertCircle } from 'lucide-react';

export const StatCards: React.FC = () => {
  const { kpiStats } = useData();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Tarefas Pendentes */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tarefas Pendentes
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {kpiStats.pendingTasksCount}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            {kpiStats.overdueTasksCount > 0 ? (
              <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {kpiStats.overdueTasksCount} {kpiStats.overdueTasksCount === 1 ? 'atrasada' : 'atrasadas'}
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                Nenhum prazo atrasado
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Tarefas Concluídas */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tarefas Concluídas
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {kpiStats.completedTasksCount}
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {kpiStats.completionRate}%
            </span>
            <span>de taxa de conclusão geral</span>
          </div>
        </div>
      </div>

      {/* 3. Provas e Trabalhos Próximos */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Provas e Trabalhos
          </span>
          <div className="w-9 h-9 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {kpiStats.upcomingExamsAndWorksCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Nos próximos 14 dias
          </div>
        </div>
      </div>

      {/* 4. Disciplinas Cadastradas */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Disciplinas Ativas
          </span>
          <div className="w-9 h-9 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            {kpiStats.disciplinesCount}
          </div>
          <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Grade curricular do semestre
          </div>
        </div>
      </div>
    </div>
  );
};
