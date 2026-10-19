import React, { useState, useEffect } from 'react';
import { Discipline } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { Check } from 'lucide-react';

interface DisciplineFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  disciplineToEdit?: Discipline | null;
}

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#7c3aed', // Purple
  '#0891b2', // Cyan
  '#059669', // Emerald
  '#ea580c', // Orange
  '#e11d48', // Rose
  '#4f46e5', // Indigo
  '#d97706', // Amber
  '#0d9488', // Teal
];

export const DisciplineFormModal: React.FC<DisciplineFormModalProps> = ({
  isOpen,
  onClose,
  disciplineToEdit,
}) => {
  const { addDiscipline, updateDiscipline } = useData();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [teacher, setTeacher] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');

  const [errorName, setErrorName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (disciplineToEdit) {
      setName(disciplineToEdit.name);
      setCode(disciplineToEdit.code || '');
      setTeacher(disciplineToEdit.teacher || '');
      setColor(disciplineToEdit.color || PRESET_COLORS[0]);
      setSemester(disciplineToEdit.semester || '');
      setDescription(disciplineToEdit.description || '');
    } else {
      setName('');
      setCode('');
      setTeacher('');
      setColor(PRESET_COLORS[0]);
      setSemester('');
      setDescription('');
    }
    setErrorName('');
  }, [disciplineToEdit, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorName('');

    if (!name.trim()) {
      setErrorName('O nome da disciplina é obrigatório');
      return;
    }

    setIsSubmitting(true);

    try {
      if (disciplineToEdit) {
        await updateDiscipline(disciplineToEdit.id, {
          name: name.trim(),
          code: code.trim(),
          teacher: teacher.trim(),
          color,
          semester: semester.trim(),
          description: description.trim(),
        });
      } else {
        await addDiscipline({
          name: name.trim(),
          code: code.trim(),
          teacher: teacher.trim(),
          color,
          semester: semester.trim(),
          description: description.trim(),
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
      title={disciplineToEdit ? 'Editar Disciplina' : 'Nova Disciplina'}
      description="Organize suas matérias do semestre acadêmico."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nome da disciplina *"
          placeholder="Ex: Cálculo I, Inteligência Artificial..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errorName}
          autoFocus
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Código da matéria"
            placeholder="Ex: MAT101, CC201"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Input
            label="Semestre / Período"
            placeholder="Ex: 3º Semestre, 2026.1"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
        </div>

        <Input
          label="Professor(a)"
          placeholder="Nome do docente"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
        />

        {/* Color Picker */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Cor de identificação
          </label>
          <div className="flex items-center gap-2 flex-wrap pt-1">
            {PRESET_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                style={{ backgroundColor: c }}
                aria-label={`Cor ${c}`}
              >
                {color === c && <Check className="w-4 h-4 text-white stroke-[3]" />}
              </button>
            ))}
            <div className="flex items-center gap-2 ml-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                title="Escolher cor personalizada"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 text-left">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Ementa ou anotações (opcional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Horários das aulas, sala, critérios de avaliação..."
            className="w-full text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-3 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {disciplineToEdit ? 'Salvar Alterações' : 'Criar Disciplina'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
