import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  PieChart as PieIcon,
  BookOpen,
} from 'lucide-react';
import { EmptyState } from '../common/EmptyState';
import { useNavigate } from 'react-router-dom';

export const StatisticsPage: React.FC = () => {
  const navigate = useNavigate();
  const { tasks, disciplines, kpiStats } = useData();

  // 1. Completion by day for the last 14 days
  const dailyCompletedData = useMemo(() => {
    const data: { dateLabel: string; count: number }[] = [];
    const now = new Date();

    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);

      const pad = (n: number) => String(n).padStart(2, '0');
      const dateKey = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

      const count = tasks.filter((t) => {
        if (t.status !== 'concluida') return false;
        const completionDate = t.completed_at ? t.completed_at.split('T')[0] : t.due_date.split('T')[0];
        return completionDate === dateKey;
      }).length;

      data.push({
        dateLabel: `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`,
        count,
      });
    }

    return data;
  }, [tasks]);

  // 2. Distribution by discipline
  const disciplineDistributionData = useMemo(() => {
    const map = new Map<string, { name: string; count: number; color: string }>();

    disciplines.forEach((d) => {
      map.set(d.id, { name: d.name, count: 0, color: d.color });
    });

    let noDisciplineCount = 0;

    tasks.forEach((t) => {
      if (t.discipline_id && map.has(t.discipline_id)) {
        map.get(t.discipline_id)!.count += 1;
      } else {
        noDisciplineCount += 1;
      }
    });

    const result = Array.from(map.values()).filter((item) => item.count > 0);

    if (noDisciplineCount > 0) {
      result.push({
        name: 'Geral / Sem matéria',
        count: noDisciplineCount,
        color: '#64748b',
      });
    }

    return result;
  }, [tasks, disciplines]);

  // 3. Status Breakdown (Concluídas, Pendentes, Atrasadas)
  const statusBreakdownData = useMemo(() => {
    const now = new Date();
    const completed = tasks.filter((t) => t.status === 'concluida').length;
    const pendingNonOverdue = tasks.filter((t) => t.status !== 'concluida' && new Date(t.due_date) >= now).length;
    const overdue = tasks.filter((t) => t.status !== 'concluida' && new Date(t.due_date) < now).length;

    return [
      { name: 'Concluídas', value: completed, color: '#10b981' },
      { name: 'Pendentes em dia', value: pendingNonOverdue, color: '#3b82f6' },
      { name: 'Atrasadas', value: overdue, color: '#f43f5e' },
    ].filter((item) => item.value > 0);
  }, [tasks]);

  // 4. Productivity Evolution Over Time (Cumulative Completed Tasks)
  const cumulativeProductivityData = useMemo(() => {
    let runningTotal = 0;
    return dailyCompletedData.map((d) => {
      runningTotal += d.count;
      return {
        dateLabel: d.dateLabel,
        total: runningTotal,
      };
    });
  }, [dailyCompletedData]);

  if (tasks.length === 0) {
    return (
      <div className="space-y-6 text-left">
        <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Estatísticas e Produtividade
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Análises reais sobre seus hábitos de estudo e taxa de entrega.
          </p>
        </div>

        <EmptyState
          icon={BarChart3}
          title="Sem dados suficientes para estatísticas"
          description="Você ainda não cadastrou nenhuma atividade. Crie suas primeiras matérias e tarefas para visualizar relatórios detalhados de produtividade."
          actionLabel="+ Cadastrar Primeira Tarefa"
          onAction={() => navigate('/tarefas')}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          Estatísticas e Produtividade
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Métricas reais calculadas a partir de todas as suas tarefas e disciplinas cadastradas.
        </p>
      </div>

      {/* Top Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total de Tarefas</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {tasks.length}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Taxa de Conclusão</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {kpiStats.completionRate}%
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Pendentes</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            {kpiStats.pendingTasksCount}
          </div>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Atrasadas</span>
          <div
            className={`text-2xl font-bold mt-1 ${
              kpiStats.overdueTasksCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
            }`}
          >
            {kpiStats.overdueTasksCount}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Tarefas Concluídas por Dia (Últimos 14 dias) */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              Tarefas Concluídas (Últimos 14 Dias)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Volume de atividades entregues dia a dia.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyCompletedData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-lg py-1 px-2.5">
                          <p className="font-semibold">{d.dateLabel}</p>
                          <p className="text-emerald-300">{d.count} tarefas concluídas</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Distribuição por Disciplina */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              Distribuição de Tarefas por Disciplina
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Proporção de carga horária e atividades por matéria.
            </p>
          </div>

          <div className="h-64 w-full">
            {disciplineDistributionData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 italic">
                Nenhuma tarefa vinculada a disciplinas.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disciplineDistributionData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {disciplineDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const d = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3">
                            <p className="font-semibold">{d.name}</p>
                            <p style={{ color: d.color }}>{d.count} {d.count === 1 ? 'atividade' : 'atividades'}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Evolução Acumulada de Produtividade */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Evolução da Produtividade no Período
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Crescimento cumulativo de tarefas entregues.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulativeProductivityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="productivityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                <XAxis dataKey="dateLabel" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-lg py-1 px-2.5">
                          <p className="font-semibold">{d.dateLabel}</p>
                          <p className="text-blue-300">{d.total} tarefas acumuladas</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="#2563eb"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#productivityGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Taxa e Status Geral */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-indigo-500" />
              Taxa de Conclusão e Estado das Tarefas
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Equilíbrio entre tarefas concluídas, pendentes e em atraso.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {statusBreakdownData.map((entry, index) => (
                    <Cell key={`cell-status-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-lg py-1.5 px-3">
                          <p className="font-semibold">{d.name}</p>
                          <p style={{ color: d.color }}>{d.value} {d.value === 1 ? 'tarefa' : 'tarefas'}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
