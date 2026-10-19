import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Task } from '../../types';
import { TaskItem } from '../tasks/TaskItem';
import { EmptyState } from '../common/EmptyState';
import { CheckCircle2, Flame, ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

interface TodayPrioritiesProps {
  onEditTask: (task: Task) => void;
  onOpenNewTaskModal: () => void;
}

export const TodayPriorities: React.FC<TodayPrioritiesProps> = ({
  onEditTask,
  onOpenNewTaskModal,
}) => {
  const navigate = useNavigate();
  const { todayPriorities } = useData();

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Flame className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            Prioridades de Hoje
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Ordenadas automaticamente pelo algoritmo inteligente de urgência e prazo.
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/tarefas')}
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          className="text-xs text-blue-600 dark:text-blue-400"
        >
          Ver todas
        </Button>
      </div>

      <div className="space-y-2.5 flex-1">
        {todayPriorities.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="Tudo em dia por aqui!"
            description="Você não possui tarefas urgentes ou atrasadas pendentes no momento. Bom trabalho!"
            actionLabel="+ Adicionar Nova Atividade"
            onAction={onOpenNewTaskModal}
            className="py-6"
          />
        ) : (
          todayPriorities.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              showUrgencyBadge={true}
            />
          ))
        )}
      </div>
    </div>
  );
};
