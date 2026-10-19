import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Task } from '../types';
import { TaskFilters, TaskFilterState } from '../components/tasks/TaskFilters';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { Plus, CheckSquare, Search } from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks } = useData();
  const [searchParams] = useSearchParams();

  const [filters, setFilters] = useState<TaskFilterState>({
    search: searchParams.get('q') || '',
    status: 'todas',
    priority: 'todas',
    disciplineId: '',
    type: 'todos',
    sortBy: 'due_date_asc',
    viewMode: 'list',
  });

  // Sync search param if URL changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null) {
      setFilters((prev) => ({ ...prev, search: q }));
    }
  }, [searchParams]);

  const [modalOpen, setModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setModalOpen(true);
  };

  const handleNewTask = () => {
    setTaskToEdit(null);
    setModalOpen(true);
  };

  // Filter & Sort Logic
  const filteredTasks = useMemo(() => {
    const now = new Date();

    return tasks
      .filter((task) => {
        // Search
        if (filters.search) {
          const q = filters.search.toLowerCase();
          const matchTitle = task.title.toLowerCase().includes(q);
          const matchDesc = task.description ? task.description.toLowerCase().includes(q) : false;
          if (!matchTitle && !matchDesc) return false;
        }

        // Status
        if (filters.status === 'atrasadas') {
          if (task.status === 'concluida') return false;
          const isOverdue = new Date(task.due_date) < now;
          if (!isOverdue) return false;
        } else if (filters.status !== 'todas') {
          if (task.status !== filters.status) return false;
        }

        // Priority
        if (filters.priority !== 'todas') {
          if (task.priority !== filters.priority) return false;
        }

        // Discipline
        if (filters.disciplineId) {
          if (task.discipline_id !== filters.disciplineId) return false;
        }

        // Type
        if (filters.type !== 'todos') {
          if (task.type !== filters.type) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filters.sortBy === 'due_date_asc') {
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        }
        if (filters.sortBy === 'due_date_desc') {
          return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
        }
        if (filters.sortBy === 'priority') {
          const weight = { alta: 3, media: 2, baixa: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (filters.sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [tasks, filters]);

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-6 h-6 text-blue-600" />
            Minhas Tarefas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Gerencie todas as suas atividades, trabalhos e prazos em um só lugar.
          </p>
        </div>

        <Button
          onClick={handleNewTask}
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          className="self-start sm:self-auto shrink-0"
        >
          Nova Atividade
        </Button>
      </div>

      {/* Filter and Control Toolbar */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <TaskFilters
          filters={filters}
          onChange={setFilters}
          totalFiltered={filteredTasks.length}
        />
      </div>

      {/* Tasks List or Cards View */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nenhuma atividade encontrada"
          description={
            tasks.length === 0
              ? 'Você ainda não possui atividades cadastradas. Que tal adicionar a primeira agora?'
              : 'Nenhuma tarefa corresponde aos filtros aplicados. Tente ajustar os termos de busca ou filtros.'
          }
          actionLabel="+ Criar Atividade"
          onAction={handleNewTask}
        />
      ) : filters.viewMode === 'list' ? (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={handleEditTask}
              showUrgencyBadge={true}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      {/* Form Modal */}
      <TaskFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
