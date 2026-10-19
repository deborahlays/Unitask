import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

export const WeeklyProductivityChart: React.FC = () => {
  const { tasks } = useData();

  // Compute tasks completed in the last 7 days
  const chartData = useMemo(() => {
    const days: { day: string; fullDate: string; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      const pad = (n: number) => String(n).padStart(2, '0');
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

      const weekday = d.toLocaleDateString('pt-BR', { weekday: 'short' });
      const capitalized = weekday.charAt(0).toUpperCase() + weekday.slice(1, 3);

      // Count tasks with completed_at on that day
      const count = tasks.filter((t) => {
        if (t.status !== 'concluida') return false;
        const completionDate = t.completed_at ? t.completed_at.split('T')[0] : t.due_date.split('T')[0];
        return completionDate === dateKey;
      }).length;

      days.push({
        day: capitalized,
        fullDate: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`,
        count,
      });
    }

    return days;
  }, [tasks]);

  const totalCompletedInWeek = chartData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Produtividade Semanal
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Tarefas concluídas nos últimos 7 dias.
          </p>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
            {totalCompletedInWeek}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">
            {totalCompletedInWeek === 1 ? 'concluída' : 'concluídas'}
          </span>
        </div>
      </div>

      <div className="h-52 w-full pt-2">
        {totalCompletedInWeek === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Nenhuma tarefa concluída nos últimos 7 dias
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
              Marque suas atividades como concluídas para acompanhar seu ritmo de estudos!
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3 shadow-lg">
                        <p className="font-semibold">{data.day} ({data.fullDate})</p>
                        <p className="text-blue-300">{data.count} {data.count === 1 ? 'tarefa concluída' : 'tarefas concluídas'}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
