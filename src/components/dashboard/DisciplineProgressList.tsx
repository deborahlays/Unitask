import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { BookOpen, ChevronRight } from 'lucide-react';

export const DisciplineProgressList: React.FC = () => {
  const navigate = useNavigate();
  const { disciplines, getDisciplineStats } = useData();

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Progresso por Disciplina
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Taxa de conclusão de atividades em cada matéria.
          </p>
        </div>

        <button
          onClick={() => navigate('/disciplinas')}
          className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
        >
          Ver todas <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4 flex-1">
        {disciplines.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            Nenhuma disciplina cadastrada ainda.
          </div>
        ) : (
          disciplines.slice(0, 5).map((discipline) => {
            const stats = getDisciplineStats(discipline.id);

            return (
              <div
                key={discipline.id}
                onClick={() => navigate(`/disciplinas/${discipline.id}`)}
                className="group cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: discipline.color }}
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 transition-colors">
                      {discipline.name}
                    </span>
                  </div>

                  {stats.total > 0 ? (
                    <span className="text-slate-500 dark:text-slate-400 shrink-0 font-medium">
                      {stats.completed}/{stats.total} ({stats.percentage}%)
                    </span>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 italic shrink-0 text-[11px]">
                      Sem tarefas
                    </span>
                  )}
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  {stats.total > 0 && (
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${stats.percentage}%`,
                        backgroundColor: stats.percentage === 100 ? '#10b981' : discipline.color,
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
