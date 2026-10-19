import React, { useState } from 'react';
import { Task } from '../../types';
import { useData } from '../../context/DataContext';
import { StatusBadge, PriorityBadge, ActivityTypeBadge, UrgencyBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDateTime, formatRelativeDeadline, hexToRgba } from '../../lib/utils';
import { calculateTaskUrgency } from '../../lib/priority';
import { Check, Edit2, Trash2, Calendar, MoreVertical } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  showUrgencyBadge?: boolean;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, showUrgencyBadge = true }) => {
  const { toggleTaskComplete, deleteTask, getDisciplineById } = useData();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const discipline = task.discipline_id ? getDisciplineById(task.discipline_id) : undefined;
  const isCompleted = task.status === 'concluida';
  const relativeDate = formatRelativeDeadline(task.due_date);
  const urgency = calculateTaskUrgency(task);

  return (
    <>
      <div
        className={`group relative flex items-center justify-between p-4 rounded-xl border bg-white dark:bg-slate-900 transition-all duration-200 hover:shadow-sm ${
          isCompleted
            ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 opacity-75'
            : relativeDate.isOverdue
            ? 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10'
            : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
        }`}
      >
        <div className="flex items-start gap-3.5 flex-1 min-w-0 pr-4">
          {/* Checkbox */}
          <button
            type="button"
            onClick={() => toggleTaskComplete(task.id)}
            className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 bg-white dark:bg-slate-800'
            }`}
            title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
          >
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Task Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
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

              {showUrgencyBadge && !isCompleted && urgency.reason && (
                <UrgencyBadge reason={urgency.reason} isOverdue={urgency.isOverdue} />
              )}
            </div>

            <h4
              className={`text-sm font-medium leading-snug transition-all ${
                isCompleted
                  ? 'line-through text-slate-400 dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            {task.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 leading-relaxed">
                {task.description}
              </p>
            )}

            {/* Meta info: Due date, priority */}
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
              <span
                className={`flex items-center gap-1 font-medium ${
                  relativeDate.isOverdue
                    ? 'text-rose-600 dark:text-rose-400 font-semibold'
                    : relativeDate.isToday
                    ? 'text-amber-600 dark:text-amber-400 font-semibold'
                    : ''
                }`}
                title={formatDateTime(task.due_date)}
              >
                <Calendar className="w-3.5 h-3.5" />
                {relativeDate.label}
              </span>

              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Editar atividade"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowConfirmDelete(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            title="Excluir atividade"
          >
            <Trash2 className="w-4 h-4" />
          </button>
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
        message={`Deseja realmente excluir "${task.title}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Sim, excluir"
      />
    </>
  );
};
