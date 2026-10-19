import React, { useState, useEffect } from 'react';
import { Task, PriorityLevel, TaskStatus, ActivityType } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  initialDisciplineId?: string;
  initialDate?: string;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  initialDisciplineId,
  initialDate,
}) => {
  const { disciplines, addTask, updateTask } = useData();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [disciplineId, setDisciplineId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [priority, setPriority] = useState<PriorityLevel>('media');
  const [status, setStatus] = useState<TaskStatus>('pendente');
  const [type, setType] = useState<ActivityType>('tarefa');

  const [errorTitle, setErrorTitle] = useState('');
  const [errorDate, setErrorDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDisciplineId(taskToEdit.discipline_id || '');
      if (taskToEdit.due_date.includes('T')) {
        const [d, t] = taskToEdit.due_date.split('T');
        setDueDate(d);
        setDueTime(t.substring(0, 5));
      } else {
        setDueDate(taskToEdit.due_date);
        setDueTime('23:59');
      }
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setType(taskToEdit.type || 'tarefa');
    } else {
      setTitle('');
      setDescription('');
      setDisciplineId(initialDisciplineId || (disciplines[0]?.id ?? ''));
      
      const defaultDate = initialDate || new Date().toISOString().split('T')[0];
      setDueDate(defaultDate);
      setDueTime('23:59');
      setPriority('media');
      setStatus('pendente');
      setType('tarefa');
    }
    setErrorTitle('');
    setErrorDate('');
  }, [taskToEdit, isOpen, initialDisciplineId, initialDate, disciplines]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorTitle('');
    setErrorDate('');

    if (!title.trim()) {
      setErrorTitle('O título da atividade é obrigatório');
      return;
    }

    if (!dueDate) {
      setErrorDate('A data de entrega é obrigatória');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullIsoDate = `${dueDate}T${dueTime || '23:59'}:00`;

      if (taskToEdit) {
        await updateTask(taskToEdit.id, {
          title: title.trim(),
          description: description.trim(),
          discipline_id: disciplineId,
          due_date: fullIsoDate,
          priority,
          status,
          type,
        });
      } else {
        await addTask({
          title: title.trim(),
          description: description.trim(),
          discipline_id: disciplineId,
          due_date: fullIsoDate,
          priority,
          status,
          type,
        });
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Editar Atividade' : 'Nova Atividade Acadêmica'}
      description={
        taskToEdit
          ? 'Atualize as informações do seu compromisso.'
          : 'Cadastre uma tarefa, prova, trabalho ou apresentação.'
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <Input
          label="Título da atividade *"
          placeholder="Ex: Trabalho prático de Grafos, Prova P1..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errorTitle}
          autoFocus
        />

        {/* Activity Type Selection */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Tipo de Atividade
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'tarefa', label: 'Tarefa' },
              { id: 'prova', label: 'Prova' },
              { id: 'trabalho', label: 'Trabalho' },
              { id: 'apresentacao', label: 'Apresentação' },
              { id: 'outro', label: 'Outro' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as ActivityType)}
                className={`py-1.5 px-2 text-xs rounded-xl border text-center font-medium transition-all ${
                  type === item.id
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-700 font-semibold shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Discipline Selection */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Disciplina Relacionada
          </label>
          <select
            value={disciplineId}
            onChange={(e) => setDisciplineId(e.target.value)}
            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          >
            <option value="">Sem disciplina vinculada</option>
            {disciplines.map((disc) => (
              <option key={disc.id} value={disc.id}>
                {disc.name} {disc.code ? `(${disc.code})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Data de Entrega *"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            error={errorDate}
          />
          <Input
            label="Horário Limite"
            type="time"
            value={dueTime}
            onChange={(e) => setDueTime(e.target.value)}
          />
        </div>

        {/* Priority & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Nível de Prioridade
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['baixa', 'media', 'alta'] as PriorityLevel[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 text-xs rounded-xl border text-center font-medium capitalize transition-all ${
                    priority === p
                      ? p === 'alta'
                        ? 'bg-rose-50 border-rose-300 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 font-semibold'
                        : p === 'media'
                        ? 'bg-amber-50 border-amber-300 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800 font-semibold'
                        : 'bg-slate-100 border-slate-300 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Status da Atividade
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluida">Concluída</option>
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Descrição ou Observações (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Detalhes, capítulos do livro, links ou orientações do professor..."
            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        {/* Footer buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {taskToEdit ? 'Salvar Alterações' : 'Criar Atividade'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
