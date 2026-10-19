import React from 'react';
import { useData } from '../../context/DataContext';
import { Search, LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react';
import { PriorityLevel, TaskStatus, ActivityType } from '../../types';

export interface TaskFilterState {
  search: string;
  status: TaskStatus | 'todas' | 'atrasadas';
  priority: PriorityLevel | 'todas';
  disciplineId: string;
  type: ActivityType | 'todos';
  sortBy: 'due_date_asc' | 'due_date_desc' | 'priority' | 'title';
  viewMode: 'list' | 'cards';
}

interface TaskFiltersProps {
  filters: TaskFilterState;
  onChange: (filters: TaskFilterState) => void;
  totalFiltered: number;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onChange, totalFiltered }) => {
  const { disciplines } = useData();

  const handleUpdate = (updates: Partial<TaskFilterState>) => {
    onChange({ ...filters, ...updates });
  };

  const hasActiveFilters =
    filters.search !== '' ||
    filters.status !== 'todas' ||
    filters.priority !== 'todas' ||
    filters.disciplineId !== '' ||
    filters.type !== 'todos';

  const resetFilters = () => {
    onChange({
      ...filters,
      search: '',
      status: 'todas',
      priority: 'todas',
      disciplineId: '',
      type: 'todos',
    });
  };

  return (
    <div className="space-y-3">
      {/* Search & Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Pesquisar por título ou descrição..."
            value={filters.search}
            onChange={(e) => handleUpdate({ search: e.target.value })}
            className="w-full text-sm pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              onClick={() => handleUpdate({ search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Switcher & Sort */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Sort */}
          <select
            value={filters.sortBy}
            onChange={(e) => handleUpdate({ sortBy: e.target.value as TaskFilterState['sortBy'] })}
            className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="due_date_asc">Prazo: Mais próximo</option>
            <option value="due_date_desc">Prazo: Mais distante</option>
            <option value="priority">Maior prioridade</option>
            <option value="title">Título (A-Z)</option>
          </select>

          {/* View switcher (List vs Cards) */}
          <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-0.5">
            <button
              onClick={() => handleUpdate({ viewMode: 'list' })}
              className={`p-1.5 rounded-lg transition-colors ${
                filters.viewMode === 'list'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Visualização em lista"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleUpdate({ viewMode: 'cards' })}
              className={`p-1.5 rounded-lg transition-colors ${
                filters.viewMode === 'cards'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
              }`}
              title="Visualização em cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Pills / Selects */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        {/* Status Pills */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-xl">
          {[
            { id: 'todas', label: 'Todas' },
            { id: 'pendente', label: 'Pendentes' },
            { id: 'em_andamento', label: 'Em andamento' },
            { id: 'concluida', label: 'Concluídas' },
            { id: 'atrasadas', label: 'Atrasadas' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleUpdate({ status: tab.id as TaskFilterState['status'] })}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                filters.status === tab.id
                  ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => handleUpdate({ priority: e.target.value as TaskFilterState['priority'] })}
          className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-1.5 px-2.5 focus:outline-none"
        >
          <option value="todas">Prioridade: Todas</option>
          <option value="alta">Alta prioridade</option>
          <option value="media">Média prioridade</option>
          <option value="baixa">Baixa prioridade</option>
        </select>

        {/* Discipline Filter */}
        <select
          value={filters.disciplineId}
          onChange={(e) => handleUpdate({ disciplineId: e.target.value })}
          className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-1.5 px-2.5 focus:outline-none max-w-[160px] truncate"
        >
          <option value="">Disciplina: Todas</option>
          {disciplines.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        {/* Type Filter */}
        <select
          value={filters.type}
          onChange={(e) => handleUpdate({ type: e.target.value as TaskFilterState['type'] })}
          className="text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 py-1.5 px-2.5 focus:outline-none"
        >
          <option value="todos">Tipo: Todos</option>
          <option value="tarefa">Tarefa</option>
          <option value="prova">Prova</option>
          <option value="trabalho">Trabalho</option>
          <option value="apresentacao">Apresentação</option>
          <option value="outro">Outro</option>
        </select>

        {/* Clear filters pill */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline px-2 py-1"
          >
            <X className="w-3.5 h-3.5" />
            Limpar filtros
          </button>
        )}

        <span className="ml-auto text-xs text-slate-400">
          {totalFiltered} {totalFiltered === 1 ? 'atividade' : 'atividades'}
        </span>
      </div>
    </div>
  );
};
