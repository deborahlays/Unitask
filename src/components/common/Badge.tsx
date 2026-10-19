import React from 'react';
import { cn } from '../../lib/utils';
import { PriorityLevel, TaskStatus, ActivityType } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, BookOpen, FileText, Presentation, Calendar, Award } from 'lucide-react';

export const StatusBadge: React.FC<{ status: TaskStatus; className?: string }> = ({ status, className }) => {
  const configs = {
    concluida: {
      label: 'Concluída',
      icon: CheckCircle2,
      styles: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    },
    em_andamento: {
      label: 'Em andamento',
      icon: Clock,
      styles: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    },
    pendente: {
      label: 'Pendente',
      icon: Clock,
      styles: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
    },
  };

  const config = configs[status] || configs.pendente;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
        config.styles,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: PriorityLevel; className?: string }> = ({ priority, className }) => {
  const configs = {
    alta: {
      label: 'Alta',
      styles: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
      dotColor: 'bg-rose-500',
    },
    media: {
      label: 'Média',
      styles: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
      dotColor: 'bg-amber-500',
    },
    baixa: {
      label: 'Baixa',
      styles: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
      dotColor: 'bg-slate-400',
    },
  };

  const config = configs[priority] || configs.baixa;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border',
        config.styles,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', config.dotColor)} />
      <span>{config.label}</span>
    </span>
  );
};

export const ActivityTypeBadge: React.FC<{ type: ActivityType; className?: string }> = ({ type, className }) => {
  const configs = {
    prova: {
      label: 'Prova',
      icon: Award,
      styles: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800',
    },
    trabalho: {
      label: 'Trabalho',
      icon: FileText,
      styles: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800',
    },
    apresentacao: {
      label: 'Apresentação',
      icon: Presentation,
      styles: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800',
    },
    tarefa: {
      label: 'Tarefa',
      icon: BookOpen,
      styles: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/80 dark:text-slate-300 dark:border-slate-700',
    },
    outro: {
      label: 'Evento',
      icon: Calendar,
      styles: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-800',
    },
  };

  const config = configs[type] || configs.tarefa;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
        config.styles,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      <span>{config.label}</span>
    </span>
  );
};

export const UrgencyBadge: React.FC<{ reason: string; isOverdue?: boolean; className?: string }> = ({
  reason,
  isOverdue = false,
  className,
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border',
        isOverdue
          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 animate-pulse'
          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
        className
      )}
    >
      <AlertTriangle className="w-3 h-3 shrink-0" />
      <span>{reason}</span>
    </span>
  );
};
