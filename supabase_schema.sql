-- ==============================================================================
-- UNITASK — ESQUEMA COMPLETO DO BANCO DE DADOS SUPABASE COM POLÍTICAS RLS
-- ==============================================================================
-- Execute este script no SQL Editor do seu dashboard Supabase para criar
-- todas as tabelas, índices e políticas de segurança Row Level Security (RLS).
-- ==============================================================================

-- 1. TABELA DE PERFIS DE USUÁRIOS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  course TEXT,
  university TEXT,
  first_day_of_week TEXT DEFAULT 'monday',
  theme TEXT DEFAULT 'light',
  notify_due_today BOOLEAN DEFAULT true,
  notify_due_tomorrow BOOLEAN DEFAULT true,
  notify_exams BOOLEAN DEFAULT true,
  sound_effects BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar apenas seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar apenas seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. TABELA DE DISCIPLINAS
CREATE TABLE IF NOT EXISTS public.disciplines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT,
  teacher TEXT,
  color TEXT NOT NULL DEFAULT '#2563eb',
  description TEXT,
  semester TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em disciplines
ALTER TABLE public.disciplines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias disciplinas"
  ON public.disciplines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias disciplinas"
  ON public.disciplines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar suas próprias disciplinas"
  ON public.disciplines FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias disciplinas"
  ON public.disciplines FOR DELETE
  USING (auth.uid() = user_id);

-- 3. TABELA DE TAREFAS (TASKS)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  discipline_id UUID REFERENCES public.disciplines(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('baixa', 'media', 'alta')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida')),
  type TEXT NOT NULL DEFAULT 'tarefa' CHECK (type IN ('tarefa', 'prova', 'trabalho', 'apresentacao', 'outro')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver suas próprias tarefas"
  ON public.tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar suas próprias tarefas"
  ON public.tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar suas próprias tarefas"
  ON public.tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias tarefas"
  ON public.tasks FOR DELETE
  USING (auth.uid() = user_id);

-- 4. TABELA DE EVENTOS DO CALENDÁRIO
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME WITHOUT TIME ZONE,
  type TEXT NOT NULL DEFAULT 'outro' CHECK (type IN ('tarefa', 'prova', 'trabalho', 'apresentacao', 'outro')),
  discipline_id UUID REFERENCES public.disciplines(id) ON DELETE SET NULL,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS em calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus próprios eventos"
  ON public.calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios eventos"
  ON public.calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar seus próprios eventos"
  ON public.calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios eventos"
  ON public.calendar_events FOR DELETE
  USING (auth.uid() = user_id);

-- 5. TRIGGER AUTOMÁTICO PARA CRIAÇÃO DE PERFIL AO REGISTRAR USUÁRIO
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Índices para melhor desempenho em buscas frequentes
CREATE INDEX IF NOT EXISTS idx_tasks_user_status ON public.tasks(user_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON public.tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_disciplines_user ON public.disciplines(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_date ON public.calendar_events(user_id, date);
