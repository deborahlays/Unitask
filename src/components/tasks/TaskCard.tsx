import React, { useState } from 'react';
import { Task } from '../../types';
import { useData } from '../../context/DataContext';
import { PriorityBadge, ActivityTypeBadge, UrgencyBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDateTime, formatRelativeDeadline, hexToRgba } from '../../lib/utils';
import { calculateTaskUrgency } from '../../lib/priority';
import { Check, Edit2, Trash2, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { toggleTaskComplete, deleteTask, getDisciplineById } = useData();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const discipline = task.discipline_id ? getDisciplineById(task.discipline_id) : undefined;
  const isCompleted = task.status === 'concluida';
  const relativeDate = formatRelativeDeadline(task.due_date);
  const urgency = calculateTaskUrgency(task);

  return (
    <>
      <div
        className={`group flex flex-col justify-between p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all duration-200 hover:shadow-md ${
          isCompleted
            ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
            : relativeDate.isOverdue
            ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div>
          {/* Header badges */}
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <div className="flex items-center gap-1.5 flex-wrap">
              {discipline && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1"
                  style={{
                    backgroundColor: hexToRgba(discipline.color, 0.12),
                    color: discipline.color,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: discipline.color }}
                  />
                  {discipline.name}
                </span>
              )}
              <ActivityTypeBadge type={task.type || 'tarefa'} />
            </div>

            <PriorityBadge priority={task.priority} />
          </div>

          {/* Title & Description */}
          <h4
            className={`text-sm font-semibold mb-1 line-clamp-2 ${
              isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-900 dark:text-slate-100'
            }`}
          >
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-3 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Urgency Badge */}
          {!isCompleted && urgency.reason && (
            <div className="mb-3">
              <UrgencyBadge reason={urgency.reason} isOverdue={urgency.isOverdue} />
            </div>
          )}
        </div>

        {/* Footer info & actions */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-auto text-xs">
          <span
            className={`flex items-center gap-1 font-medium ${
              relativeDate.isOverdue
                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                : relativeDate.isToday
                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400'
            }`}
            title={formatDateTime(task.due_date)}
          >
            <Calendar className="w-3.5 h-3.5" />
            {relativeDate.label}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleTaskComplete(task.id)}
              className={`p-1.5 rounded-lg border transition-all ${
                isCompleted
                  ? 'bg-emerald-600 border-emerald-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 hover:border-blue-500'
              }`}
              title={isCompleted ? 'Reabrir tarefa' : 'Concluir tarefa'}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Editar"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
              title="Excluir"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          await deleteTask(task.id);
          setShowConfirmDelete(false);
        }}
        title="Excluir Atividade"
        message={`Deseja realmente excluir "${task.title}"?`}
        confirmLabel="Sim, excluir"
      />
    </>
  );
};
