import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Discipline } from '../../types';
import { useData } from '../../context/DataContext';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatRelativeDeadline, hexToRgba } from '../../lib/utils';
import { BookOpen, User, Calendar, Edit2, Trash2, ChevronRight, CheckCircle2 } from 'lucide-react';

interface DisciplineCardProps {
  discipline: Discipline;
  onEdit: (discipline: Discipline) => void;
}

export const DisciplineCard: React.FC<DisciplineCardProps> = ({ discipline, onEdit }) => {
  const navigate = useNavigate();
  const { getDisciplineStats, tasks, deleteDiscipline } = useData();
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const stats = getDisciplineStats(discipline.id);

  // Find next upcoming deadline for this discipline
  const upcomingTask = tasks
    .filter((t) => t.discipline_id === discipline.id && t.status !== 'concluida')
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

  const nextDeadline = upcomingTask ? formatRelativeDeadline(upcomingTask.due_date) : null;

  return (
    <>
      <div
        onClick={() => navigate(`/disciplinas/${discipline.id}`)}
        className="group relative flex flex-col justify-between p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 cursor-pointer text-left"
      >
        <div>
          {/* Top color indicator and badge */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-xs shrink-0"
                style={{ backgroundColor: discipline.color }}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                  {discipline.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                  {discipline.code && <span>{discipline.code}</span>}
                  {discipline.code && discipline.semester && <span>•</span>}
                  {discipline.semester && <span>{discipline.semester}</span>}
                </div>
              </div>
            </div>

            {/* Quick Actions (Prevent card navigation) */}
            <div
              className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onEdit(discipline)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Editar disciplina"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowConfirmDelete(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Excluir disciplina"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Teacher and description */}
          {discipline.teacher && (
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400 mb-2">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>{discipline.teacher}</span>
            </div>
          )}

          {discipline.description && (
            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
              {discipline.description}
            </p>
          )}
        </div>

        {/* Progress & Stats Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-auto">
          {stats.total > 0 ? (
            <div>
              <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">
                  Progresso ({stats.completed}/{stats.total} concluídas)
                </span>
                <span
                  className="font-semibold"
                  style={{ color: stats.percentage === 100 ? '#10b981' : discipline.color }}
                >
                  {stats.percentage}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${stats.percentage}%`,
                    backgroundColor: stats.percentage === 100 ? '#10b981' : discipline.color,
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span className="italic">Nenhuma tarefa cadastrada</span>
            </div>
          )}

          {/* Upcoming deadline footer */}
          <div className="flex items-center justify-between mt-3 text-xs">
            {upcomingTask && nextDeadline ? (
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  nextDeadline.isOverdue
                    ? 'text-rose-600 dark:text-rose-400'
                    : nextDeadline.isToday
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>Próximo prazo: {nextDeadline.label}</span>
              </span>
            ) : (
              <span className="text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Sem pendências
              </span>
            )}

            <span className="inline-flex items-center text-blue-600 dark:text-blue-400 font-medium group-hover:translate-x-0.5 transition-transform">
              Ver detalhes <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={async () => {
          await deleteDiscipline(discipline.id);
          setShowConfirmDelete(false);
        }}
        title="Excluir Disciplina"
        message={`Deseja realmente remover a disciplina "${discipline.name}"? As tarefas vinculadas continuarão existindo sem disciplina.`}
        confirmLabel="Sim, excluir"
      />
    </>
  );
};
