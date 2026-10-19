import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Discipline } from '../types';
import { DisciplineCard } from '../components/disciplines/DisciplineCard';
import { DisciplineFormModal } from '../components/disciplines/DisciplineFormModal';
import { EmptyState } from '../components/common/EmptyState';
import { Button } from '../components/common/Button';
import { BookOpen, Plus } from 'lucide-react';

export const DisciplinesPage: React.FC = () => {
  const { disciplines } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [disciplineToEdit, setDisciplineToEdit] = useState<Discipline | null>(null);

  const handleEdit = (discipline: Discipline) => {
    setDisciplineToEdit(discipline);
    setModalOpen(true);
  };

  const handleNew = () => {
    setDisciplineToEdit(null);
    setModalOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-blue-600" />
            Minhas Disciplinas
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Organize suas matérias do semestre acadêmico e monitore seu desempenho em cada uma.
          </p>
        </div>

        <Button
          onClick={handleNew}
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
          className="self-start sm:self-auto shrink-0"
        >
          Nova Disciplina
        </Button>
      </div>

      {/* Grid of Disciplines */}
      {disciplines.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhuma disciplina cadastrada"
          description="Cadastre as matérias que você está cursando neste semestre para associar tarefas, provas e acompanhar seu progresso."
          actionLabel="+ Cadastrar Disciplina"
          onAction={handleNew}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {disciplines.map((disc) => (
            <DisciplineCard
              key={disc.id}
              discipline={disc}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Modal Form */}
      <DisciplineFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setDisciplineToEdit(null);
        }}
        disciplineToEdit={disciplineToEdit}
      />
    </div>
  );
};
