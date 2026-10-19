import { Task, PriorityScore } from '../types';

/**
 * Calculates a transparent urgency score and short human-friendly justification
 * for a task.
 *
 * Higher score = Higher urgency.
 */
export function calculateTaskUrgency(task: Task, referenceDate: Date = new Date()): PriorityScore {
  if (task.status === 'concluida') {
    return {
      score: -1,
      reason: 'Concluída',
      isOverdue: false,
      daysRemaining: 999,
    };
  }

  const due = new Date(task.due_date);
  const now = referenceDate;

  // Day boundaries
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffMs = dueDay.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  const isOverdue = diffDays < 0;

  // Priority weight: alta = 60, media = 30, baixa = 10
  const priorityWeight = task.priority === 'alta' ? 60 : task.priority === 'media' ? 30 : 10;
  
  // Type weight (exams and presentations carry high educational weight)
  const typeWeight = task.type === 'prova' ? 40 : task.type === 'apresentacao' || task.type === 'trabalho' ? 25 : 0;

  let baseScore = 0;
  let reason = '';

  if (isOverdue) {
    const overdueDays = Math.abs(diffDays);
    baseScore = 1500 + overdueDays * 50 + priorityWeight;
    reason = overdueDays === 1 ? 'Atrasada há 1 dia' : `Atrasada há ${overdueDays} dias`;
  } else if (diffDays === 0) {
    baseScore = 1000 + priorityWeight + typeWeight;
    reason = task.priority === 'alta' ? 'Entrega hoje (Prioridade Alta)' : 'Entrega hoje';
  } else if (diffDays === 1) {
    baseScore = 800 + priorityWeight + typeWeight;
    reason = task.priority === 'alta' ? 'Entrega amanhã (Prioridade Alta)' : 'Entrega amanhã';
  } else if (diffDays <= 3) {
    baseScore = 600 - diffDays * 50 + priorityWeight + typeWeight;
    reason = task.type === 'prova' ? `Prova em ${diffDays} dias` : `Prazo em ${diffDays} dias`;
  } else if (diffDays <= 7) {
    baseScore = 400 - diffDays * 20 + priorityWeight + typeWeight;
    reason = task.priority === 'alta' ? 'Prioridade alta nesta semana' : `Prazo em ${diffDays} dias`;
  } else {
    // Distant future
    baseScore = 100 + priorityWeight + typeWeight - Math.min(diffDays, 60);
    reason = task.priority === 'alta' ? 'Prioridade alta' : 'Prazo futuro';
  }

  return {
    score: baseScore,
    reason,
    isOverdue,
    daysRemaining: diffDays,
  };
}

/**
 * Filter and sort pending tasks by smart priority urgency
 */
export function getSortedPriorities(tasks: Task[], limit?: number): (Task & { urgency: PriorityScore })[] {
  const pending = tasks.filter((t) => t.status !== 'concluida');

  const withScores = pending.map((task) => ({
    ...task,
    urgency: calculateTaskUrgency(task),
  }));

  // Sort descending by score
  withScores.sort((a, b) => b.urgency.score - a.urgency.score);

  return limit ? withScores.slice(0, limit) : withScores;
}
