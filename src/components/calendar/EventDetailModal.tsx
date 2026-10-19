import React, { useState } from 'react';
import { CalendarEvent, Task } from '../../types';
import { useData } from '../../context/DataContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ActivityTypeBadge, PriorityBadge, StatusBadge } from '../common/Badge';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { formatDate, formatDateTime } from '../../lib/utils';
import { Calendar, Clock, BookOpen, Trash2, Edit2, Plus, Check } from 'lucide-react';

interface EventDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string; // YYYY-MM-DD
  itemsOnDate: { type: 'task' | 'event'; data: Task | CalendarEvent }[];
  onOpenNewTaskModal: (date: string) => void;
  onEditTask: (task: Task) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  itemsOnDate,
  onOpenNewTaskModal,
  onEditTask,
}) => {
  const { getDisciplineById, toggleTaskComplete, deleteEvent } = useData();
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  const formattedDate = formatDate(selectedDate);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Compromissos de ${formattedDate}`}
        description="Visualize e gerencie os prazos e eventos agendados para este dia."
        maxWidth="md"
      >
        <div className="space-y-4">
          {itemsOnDate.length === 0 ? (
            <div className="py-8 text-center text-slate-500 dark:text-slate-400">
              <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm">Nenhum compromisso agendado para esta data.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {itemsOnDate.map((item, idx) => {
                if (item.type === 'task') {
                  const task = item.data as Task;
                  const discipline = task.discipline_id ? getDisciplineById(task.discipline_id) : undefined;
                  const isCompleted = task.status === 'concluida';

                  return (
                    <div
                      key={`task-${task.id}-${idx}`}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <button
                          type="button"
                          onClick={() => toggleTaskComplete(task.id)}
                          className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 cursor-pointer ${
                            isCompleted
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                          }`}
                        >
                          {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <ActivityTypeBadge type={task.type || 'tarefa'} />
                            <PriorityBadge priority={task.priority} />
                            {discipline && (
                              <span
                                className="text-xs font-semibold px-2 py-0.5 rounded-md"
                                style={{
                                  backgroundColor: `${discipline.color}20`,
                                  color: discipline.color,
                                }}
                              >
                                {discipline.name}
                              </span>
                            )}
                          </div>

                          <h5
                            className={`text-sm font-medium ${
                              isCompleted
                                ? 'line-through text-slate-400 dark:text-slate-500'
                                : 'text-slate-900 dark:text-slate-100'
                            }`}
                          >
                            {task.title}
                          </h5>

                          {task.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Horário: {task.due_date.includes('T') ? task.due_date.split('T')[1].substring(0, 5) : '23:59'}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onClose();
                          onEditTask(task);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                        title="Editar"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                } else {
                  // Calendar Event
                  const event = item.data as CalendarEvent;
                  const discipline = event.discipline_id ? getDisciplineById(event.discipline_id) : undefined;

                  return (
                    <div
                      key={`event-${event.id}-${idx}`}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <ActivityTypeBadge type={event.type} />
                          {discipline && (
                            <span
                              className="text-xs font-semibold px-2 py-0.5 rounded-md"
                              style={{
                                backgroundColor: `${discipline.color}20`,
                                color: discipline.color,
                              }}
                            >
                              {discipline.name}
                            </span>
                          )}
                        </div>

                        <h5 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {event.title}
                        </h5>

                        {event.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            {event.description}
                          </p>
                        )}

                        {event.time && (
                          <div className="flex items-center gap-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => setEventToDelete(event)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                        title="Excluir evento"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                }
              })}
            </div>
          )}

          {/* Quick action button to add item on this specific date */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
            >
              Fechar
            </Button>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => {
                onClose();
                onOpenNewTaskModal(selectedDate);
              }}
            >
              Adicionar atividade nesta data
            </Button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onConfirm={async () => {
          if (eventToDelete) {
            await deleteEvent(eventToDelete.id);
            setEventToDelete(null);
          }
        }}
        title="Excluir Evento"
        message={`Deseja excluir o evento "${eventToDelete?.title || ''}"?`}
        confirmLabel="Sim, excluir"
      />
    </>
  );
};
