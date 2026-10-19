import { Discipline, Task, CalendarEvent, UserProfile } from '../types';

export const DEMO_USER: UserProfile = {
  id: 'demo-user-123',
  name: 'Lucas Ferreira',
  email: 'lucas.estudante@unitask.edu.br',
  course: 'Ciência da Computação',
  university: 'Universidade Federal',
  first_day_of_week: 'monday',
  theme: 'light',
  notify_due_today: true,
  notify_due_tomorrow: true,
  notify_exams: true,
  sound_effects: true,
};

function formatIso(date: Date, hours = 23, minutes = 59): string {
  const d = new Date(date);
  d.setHours(hours, minutes, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDateOnly(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function generateDemoData(userId: string = DEMO_USER.id): {
  disciplines: Discipline[];
  tasks: Task[];
  events: CalendarEvent[];
} {
  const now = new Date();
  
  const addDays = (days: number): Date => {
    const res = new Date(now);
    res.setDate(res.getDate() + days);
    return res;
  };

  const disciplines: Discipline[] = [
    {
      id: 'disc-1',
      user_id: userId,
      name: 'Algoritmos e Estrutura de Dados',
      code: 'CC201',
      teacher: 'Prof. Carlos Eduardo',
      color: '#2563eb', // Blue
      description: 'Estruturas lineares, árvores binárias, grafos e análise assintótica.',
      semester: '3º Semestre',
      created_at: addDays(-30).toISOString(),
    },
    {
      id: 'disc-2',
      user_id: userId,
      name: 'Cálculo Diferencial e Integral I',
      code: 'MAT101',
      teacher: 'Profª. Maria Helena',
      color: '#7c3aed', // Purple
      description: 'Limites, derivadas, regras de derivação e introdução às integrais.',
      semester: '3º Semestre',
      created_at: addDays(-30).toISOString(),
    },
    {
      id: 'disc-3',
      user_id: userId,
      name: 'Engenharia de Software',
      code: 'ES302',
      teacher: 'Prof. Roberto Silva',
      color: '#0891b2', // Cyan
      description: 'Metodologias ágeis, modelagem UML, testes unitários e padrões de projeto.',
      semester: '3º Semestre',
      created_at: addDays(-30).toISOString(),
    },
    {
      id: 'disc-4',
      user_id: userId,
      name: 'Banco de Dados II',
      code: 'BD202',
      teacher: 'Profª. Juliana Albuquerque',
      color: '#059669', // Emerald
      description: 'Modelagem relacional, normalização, consultas SQL complexas e indexação.',
      semester: '3º Semestre',
      created_at: addDays(-30).toISOString(),
    },
    {
      id: 'disc-5',
      user_id: userId,
      name: 'Inteligência Artificial',
      code: 'IA401',
      teacher: 'Prof. Fernando Dias',
      color: '#ea580c', // Orange
      description: 'Busca em espaço de estados, algoritmos genéticos e introdução a redes neurais.',
      semester: '3º Semestre',
      created_at: addDays(-30).toISOString(),
    },
  ];

  const tasks: Task[] = [
    // Overdue task (Atrasada)
    {
      id: 'task-1',
      user_id: userId,
      discipline_id: 'disc-4',
      title: 'Entrega do Diagrama Entidade-Relacionamento',
      description: 'Diagrama conceitual e lógico completo da livraria virtual em PDF com cardinalidades.',
      due_date: formatIso(addDays(-2), 23, 59),
      priority: 'alta',
      status: 'pendente',
      type: 'trabalho',
      created_at: addDays(-10).toISOString(),
    },
    // Due today (Hoje)
    {
      id: 'task-2',
      user_id: userId,
      discipline_id: 'disc-1',
      title: 'Implementação de Árvore AVL em C',
      description: 'Código fonte com testes de rotações à esquerda e direita devidamente comentados.',
      due_date: formatIso(addDays(0), 18, 0),
      priority: 'alta',
      status: 'em_andamento',
      type: 'trabalho',
      created_at: addDays(-7).toISOString(),
    },
    {
      id: 'task-3',
      user_id: userId,
      discipline_id: 'disc-3',
      title: 'Resenha crítica sobre Scrum vs Kanban',
      description: 'Texto de 2 a 3 páginas comparando rituais, métricas e flexibilidade dos dois modelos.',
      due_date: formatIso(addDays(0), 23, 59),
      priority: 'media',
      status: 'pendente',
      type: 'tarefa',
      created_at: addDays(-5).toISOString(),
    },
    // Due tomorrow (Amanhã)
    {
      id: 'task-4',
      user_id: userId,
      discipline_id: 'disc-2',
      title: 'Lista de Exercícios 4: Regra da Cadeia',
      description: 'Exercícios 1 ao 25 da seção 3.4 do livro Stewart.',
      due_date: formatIso(addDays(1), 22, 0),
      priority: 'media',
      status: 'pendente',
      type: 'tarefa',
      created_at: addDays(-4).toISOString(),
    },
    {
      id: 'task-5',
      user_id: userId,
      discipline_id: 'disc-5',
      title: 'Questionário Online: Busca Heurística A*',
      description: 'Questionário de múltipla escolha no AVA sobre funções heurísticas admissíveis.',
      due_date: formatIso(addDays(1), 23, 59),
      priority: 'alta',
      status: 'pendente',
      type: 'tarefa',
      created_at: addDays(-3).toISOString(),
    },
    // Upcoming in 3-5 days
    {
      id: 'task-6',
      user_id: userId,
      discipline_id: 'disc-2',
      title: 'Prova P1: Derivadas e Aplicações',
      description: 'Avaliação presencial cobrindo taxas de variação, máximos e mínimos e otimização.',
      due_date: formatIso(addDays(3), 10, 0),
      priority: 'alta',
      status: 'pendente',
      type: 'prova',
      created_at: addDays(-14).toISOString(),
    },
    {
      id: 'task-7',
      user_id: userId,
      discipline_id: 'disc-3',
      title: 'Apresentação do Projeto de Software',
      description: 'Apresentação de 15 minutos com slides sobre os requisitos e protótipo Figma.',
      due_date: formatIso(addDays(5), 14, 30),
      priority: 'media',
      status: 'pendente',
      type: 'apresentacao',
      created_at: addDays(-12).toISOString(),
    },
    {
      id: 'task-8',
      user_id: userId,
      discipline_id: 'disc-4',
      title: 'Scripts de Criação de Tabelas SQL (DDL)',
      description: 'Script .sql com chaves primárias, estrangeiras e constraints.',
      due_date: formatIso(addDays(7), 23, 59),
      priority: 'baixa',
      status: 'pendente',
      type: 'tarefa',
      created_at: addDays(-2).toISOString(),
    },
    // Completed tasks (for rich stats and history)
    {
      id: 'task-9',
      user_id: userId,
      discipline_id: 'disc-1',
      title: 'Lista de Exercícios 1: Filas e Pilhas',
      description: 'Exercícios práticos de alocação estática e dinâmica.',
      due_date: formatIso(addDays(-6), 23, 59),
      priority: 'media',
      status: 'concluida',
      type: 'tarefa',
      completed_at: addDays(-6).toISOString(),
      created_at: addDays(-16).toISOString(),
    },
    {
      id: 'task-10',
      user_id: userId,
      discipline_id: 'disc-2',
      title: 'Teste rápido: Limites Fundamentais',
      description: 'Mini-teste presencial na sala de aula.',
      due_date: formatIso(addDays(-5), 10, 0),
      priority: 'alta',
      status: 'concluida',
      type: 'prova',
      completed_at: addDays(-5).toISOString(),
      created_at: addDays(-15).toISOString(),
    },
    {
      id: 'task-11',
      user_id: userId,
      discipline_id: 'disc-3',
      title: 'Documento de Especificação de Requisitos (SRS)',
      description: 'Casos de uso e histórias de usuário mapeadas.',
      due_date: formatIso(addDays(-3), 23, 59),
      priority: 'alta',
      status: 'concluida',
      type: 'trabalho',
      completed_at: addDays(-3).toISOString(),
      created_at: addDays(-20).toISOString(),
    },
    {
      id: 'task-12',
      user_id: userId,
      discipline_id: 'disc-5',
      title: 'Instalação do ambiente Python e Jupyter',
      description: 'Configuração do ambiente virtual com NumPy, Pandas e Scikit-learn.',
      due_date: formatIso(addDays(-1), 18, 0),
      priority: 'baixa',
      status: 'concluida',
      type: 'tarefa',
      completed_at: addDays(-1).toISOString(),
      created_at: addDays(-8).toISOString(),
    },
  ];

  const events: CalendarEvent[] = [
    {
      id: 'event-1',
      user_id: userId,
      title: 'Prova P1: Cálculo I',
      date: formatDateOnly(addDays(3)),
      time: '10:00',
      type: 'prova',
      discipline_id: 'disc-2',
      color: '#7c3aed',
      description: 'Sala 302, bloco C. Permitido apenas formulário oficial.',
      created_at: addDays(-14).toISOString(),
    },
    {
      id: 'event-2',
      user_id: userId,
      title: 'Seminário de Metodologias Ágeis',
      date: formatDateOnly(addDays(5)),
      time: '14:30',
      type: 'apresentacao',
      discipline_id: 'disc-3',
      color: '#0891b2',
      description: 'Apresentação do grupo para a turma inteira.',
      created_at: addDays(-12).toISOString(),
    },
    {
      id: 'event-3',
      user_id: userId,
      title: 'Monitoria de Algoritmos (Dúvidas AVL)',
      date: formatDateOnly(addDays(0)),
      time: '16:00',
      type: 'outro',
      discipline_id: 'disc-1',
      color: '#2563eb',
      description: 'Laboratório 4 com o monitor Gabriel.',
      created_at: addDays(-4).toISOString(),
    },
    {
      id: 'event-4',
      user_id: userId,
      title: 'Palestra: Carreira em Inteligência Artificial',
      date: formatDateOnly(addDays(8)),
      time: '19:00',
      type: 'outro',
      color: '#ea580c',
      description: 'Auditório central da universidade.',
      created_at: addDays(-5).toISOString(),
    },
  ];

  return { disciplines, tasks, events };
}
