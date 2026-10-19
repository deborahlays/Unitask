import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Task, Discipline } from '../types';
import { TaskItem } from '../components/tasks/TaskItem';
import { TaskFormModal } from '../components/tasks/TaskFormModal';
import { DisciplineFormModal } from '../components/disciplines/DisciplineFormModal';
import { EmptyState } from '../common/EmptyState';
import { Button } from '../common/Button';
import { hexToRgba } from '../lib/utils';
import {
  ArrowLeft,
  BookOpen,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Edit2,
  Award,
} from 'lucide-react';

export const DisciplineDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getDisciplineById, getDisciplineStats, tasks } = useData();

  const discipline = id ? getDisciplineById(id) : undefined;
  const stats = id ? getDisciplineStats(id) : { total: 0, completed: 0, pending: 0, overdue: 0, percentage: 0 };

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [editDiscModalOpen, setEditDiscModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'todas' | 'pendente' | 'concluida'>('todas');

  if (!discipline) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Disciplina não encontrada
        </h2>
        <p className="text-sm text-slate-500">
          A matéria que você tentou acessar não existe ou foi removida.
        </p>
        <Button onClick={() => navigate('/disciplinas')} variant="outline">
          Voltar para disciplinas
        </Button>
      </div>
    );
  }

  const disciplineTasks = tasks.filter((t) => t.discipline_id === discipline.id);

  const filteredTasks = disciplineTasks.filter((t) => {
    if (statusFilter === 'todas') return true;
    return t.status === statusFilter;
  });

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/disciplinas')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para todas as disciplinas
        </button>
      </div>

      {/* Hero Header Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs relative overflow-hidden">
        {/* Color accent line */}
        <div
          className="absolute top-0 left-0 right-0 h-1.5"
          style={{ backgroundColor: discipline.color }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0"
              style={{ backgroundColor: discipline.color }}
            >
              <BookOpen className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {discipline.name}
                </h1>
                {discipline.code && (
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {discipline.code}
                  </span>
                )}
                {discipline.semester && (
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                    {discipline.semester}
                  </span>
                )}
              </div>

              {discipline.teacher && (
                <p className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-1.5 mt-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  Docente: {discipline.teacher}
                </p>
              )}

              {discipline.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  {discipline.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center shrink-0">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit2 className="w-3.5 h-3.5" />}
              onClick={() => setEditDiscModalOpen(true)}
            >
              Editar Matéria
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
              onClick={handleNewTask}
            >
              Adicionar Tarefa
            </Button>
          </div>
        </div>
      </div>

      {/* Indicators Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Total de Atividades</span>
          <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            {stats.total}
          </div>
        </div>

        {/* Concluídas */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Concluídas</span>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-5 h-5" />
            {stats.completed}
          </div>
        </div>

        {/* Pendentes */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Pendentes</span>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1.5">
            <Clock className="w-5 h-5" />
            {stats.pending}
          </div>
        </div>

        {/* Atrasadas */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400">Atrasadas</span>
          <div
            className={`text-2xl font-bold mt-1 flex items-center gap-1.5 ${
              stats.overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-400'
            }`}
          >
            <AlertCircle className="w-5 h-5" />
            {stats.overdue}
          </div>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between text-xs font-semibold mb-2">
          <span className="text-slate-700 dark:text-slate-300">
            Progresso Geral da Disciplina
          </span>
          {stats.total > 0 ? (
            <span style={{ color: stats.percentage === 100 ? '#10b981' : discipline.color }}>
              {stats.percentage}% concluído
            </span>
          ) : (
            <span className="text-slate-400 italic">Sem dados suficientes</span>
          )}
        </div>

        {stats.total > 0 ? (
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${stats.percentage}%`,
                backgroundColor: stats.percentage === 100 ? '#10b981' : discipline.color,
              }}
            />
          </div>
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 italic mt-1">
            Cadastre a primeira atividade para calcular a taxa de progresso desta disciplina.
          </p>
        )}
      </div>

      {/* Tasks Section for this discipline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Atividades da Disciplina ({filteredTasks.length})
          </h3>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-xs">
            {(['todas', 'pendente', 'concluida'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1 rounded-lg font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {s === 'todas' ? 'Todas' : s === 'pendente' ? 'Pendentes' : 'Concluídas'}
              </button>
            ))}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="Nenhuma atividade nesta disciplina"
            description="Você ainda não cadastrou tarefas ou provas para esta matéria."
            actionLabel="+ Cadastrar Tarefa para esta Matéria"
            onAction={handleNewTask}
          />
        ) : (
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
        )}
      </div>

      {/* Task Creation Modal */}
      <TaskFormModal
        isOpen={taskModalOpen}
        onClose={() => {
          setTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
        initialDisciplineId={discipline.id}
      />

      {/* Discipline Edit Modal */}
      <DisciplineFormModal
        isOpen={editDiscModalOpen}
        onClose={() => setEditDiscModalOpen(false)}
        disciplineToEdit={discipline}
      />
    </div>
  );
};
