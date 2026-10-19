import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { formatRelativeDeadline, formatDateTime } from '../../lib/utils';
import { ActivityTypeBadge, PriorityBadge } from '../common/Badge';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

export const UpcomingDeadlines: React.FC = () => {
  const navigate = useNavigate();
  const { upcomingDeadlines, getDisciplineById } = useData();

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Próximos Prazos
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Cronograma das suas próximas entregas acadêmicas.
          </p>
        </div>

        <button
          onClick={() => navigate('/tarefas')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
        >
          Ver todas <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {upcomingDeadlines.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            Nenhuma tarefa pendente com prazo cadastrado.
          </div>
        ) : (
          upcomingDeadlines.map((task) => {
            const discipline = task.discipline_id ? getDisciplineById(task.discipline_id) : undefined;
            const deadline = formatRelativeDeadline(task.due_date);

            return (
              <div
                key={task.id}
                onClick={() => navigate('/tarefas')}
                className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: discipline?.color || '#3b82f6' }}
                    title={discipline?.name || 'Sem disciplina'}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
                      {discipline && <span>{discipline.name}</span>}
                      {discipline && <span>•</span>}
                      <ActivityTypeBadge type={task.type || 'tarefa'} />
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                      deadline.isOverdue
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                        : deadline.isToday
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                    title={formatDateTime(task.due_date)}
                  >
                    <Calendar className="w-3 h-3" />
                    {deadline.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
