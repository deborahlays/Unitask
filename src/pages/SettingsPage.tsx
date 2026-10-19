import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import {
  Settings,
  User,
  Moon,
  Sun,
  Calendar,
  Bell,
  Database,
  LogOut,
  Sparkles,
  Download,
  Trash2,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isDemoMode, isSupabaseConnected, updateProfile, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { loadDemoData, clearAllData, exportDataJson } = useData();
  const { success } = useToast();

  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [course, setCourse] = useState(user?.course || '');
  const [university, setUniversity] = useState(user?.university || '');
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<'monday' | 'sunday'>(
    user?.first_day_of_week || 'monday'
  );

  // Notification toggles
  const [notifyDueToday, setNotifyDueToday] = useState(user?.notify_due_today ?? true);
  const [notifyDueTomorrow, setNotifyDueTomorrow] = useState(user?.notify_due_tomorrow ?? true);
  const [notifyExams, setNotifyExams] = useState(user?.notify_exams ?? true);
  const [soundEffects, setSoundEffects] = useState(user?.sound_effects ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDemoConfirm, setShowDemoConfirm] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      name: name.trim(),
      course: course.trim(),
      university: university.trim(),
      first_day_of_week: firstDayOfWeek,
      notify_due_today: notifyDueToday,
      notify_due_tomorrow: notifyDueTomorrow,
      notify_exams: notifyExams,
      sound_effects: soundEffects,
    });
    setIsSaving(false);
    success('Preferências salvas!', 'Suas alterações foram atualizadas com sucesso.');
  };

  const handleExport = () => {
    const dataStr = exportDataJson();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unitask_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    success('Backup exportado!', 'O arquivo JSON foi baixado.');
  };

  return (
    <div className="space-y-8 text-left max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-6 h-6 text-blue-600" />
          Configurações do Usuário
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Gerencie seu perfil, aparência, notificações e preferências de persistência.
        </p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-6">
        {/* 1. Perfil do Estudante */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Perfil Acadêmico
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome Completo *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome de exibição"
              required
            />
            <Input
              label="E-mail"
              value={email}
              disabled
              helperText="E-mail principal associado à sua conta."
            />
            <Input
              label="Curso de Graduação"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="Ex: Engenharia de Software, Medicina..."
            />
            <Input
              label="Instituição de Ensino"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              placeholder="Ex: USP, UFRJ, UNICAMP, PUC..."
            />
          </div>
        </div>

        {/* 2. Aparência e Calendário */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sun className="w-5 h-5 text-amber-500" />
            Aparência e Preferências Visuais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Theme switcher */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Tema da Interface
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'light', label: 'Claro', icon: Sun },
                  { id: 'dark', label: 'Escuro', icon: Moon },
                  { id: 'system', label: 'Sistema', icon: Settings },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTheme(item.id as 'light' | 'dark' | 'system')}
                      className={`p-3 rounded-xl border text-center font-medium text-xs flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                        theme === item.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 font-semibold shadow-xs'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* First day of week */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Primeiro dia da semana no calendário
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'monday', label: 'Segunda-feira' },
                  { id: 'sunday', label: 'Domingo' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFirstDayOfWeek(item.id as 'monday' | 'sunday')}
                    className={`p-3 rounded-xl border text-center font-medium text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      firstDayOfWeek === item.id
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-700 font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Notificações e Alertas */}
        <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            Notificações e Lembretes Internos
          </h2>

          <div className="space-y-3">
            {[
              {
                id: 'notify-today',
                title: 'Alertas de tarefas com vencimento hoje',
                desc: 'Receba avisos na central de notificações no dia da entrega.',
                checked: notifyDueToday,
                onChange: setNotifyDueToday,
              },
              {
                id: 'notify-tomorrow',
                title: 'Lembretes de tarefas com vencimento amanhã',
                desc: 'Avisos prévios de 24 horas para se planejar.',
                checked: notifyDueTomorrow,
                onChange: setNotifyDueTomorrow,
              },
              {
                id: 'notify-exams',
                title: 'Avisos de provas e exames próximos',
                desc: 'Alertas destacados para provas marcadas nos próximos 4 dias.',
                checked: notifyExams,
                onChange: setNotifyExams,
              },
              {
                id: 'sound-effects',
                title: 'Efeitos visuais e confetes ao concluir tarefas',
                desc: 'Animações celebrativas para estimular a produtividade acadêmica.',
                checked: soundEffects,
                onChange: setSoundEffects,
              },
            ].map((pref) => (
              <label
                key={pref.id}
                className="flex items-start justify-between gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/80 transition-colors"
              >
                <div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {pref.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {pref.desc}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={pref.checked}
                  onChange={(e) => pref.onChange(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 mt-1 cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <Button type="submit" isLoading={isSaving} size="md">
            Salvar Alterações
          </Button>
        </div>
      </form>

      {/* 4. Gerenciamento de Dados e Demonstração */}
      <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-blue-600" />
          Gerenciamento de Dados e Demonstração
        </h2>

        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>
            {isSupabaseConnected
              ? 'Conectado com Supabase (Segurança RLS ativa por usuário).'
              : 'Modo Local / Offline ativo (Dados armazenados com segurança no navegador).'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Reload Demo Data */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Sparkles className="w-4 h-4 text-amber-500" />}
            onClick={() => setShowDemoConfirm(true)}
          >
            Carregar Dados Demo
          </Button>

          {/* Export JSON */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={handleExport}
          >
            Exportar Backup JSON
          </Button>

          {/* Clear All */}
          <Button
            type="button"
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={() => setShowClearConfirm(true)}
          >
            Limpar Todos os Dados
          </Button>
        </div>
      </div>

      {/* 5. Encerrar Sessão */}
      <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-950/60 bg-rose-50/20 dark:bg-rose-950/10 flex items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-rose-900 dark:text-rose-200">
            Encerrar Sessão
          </h4>
          <p className="text-xs text-rose-700 dark:text-rose-400 mt-0.5">
            Desconectar sua conta com segurança deste dispositivo.
          </p>
        </div>

        <Button
          variant="danger"
          size="sm"
          leftIcon={<LogOut className="w-4 h-4" />}
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
        >
          Sair da Conta
        </Button>
      </div>

      {/* Confirmation Modals */}
      <ConfirmDialog
        isOpen={showDemoConfirm}
        onClose={() => setShowDemoConfirm(false)}
        onConfirm={() => {
          loadDemoData();
          setShowDemoConfirm(false);
        }}
        title="Carregar Dados de Demonstração"
        message="Deseja repovoar o sistema com disciplinas, tarefas e notas simuladas para apresentação acadêmica? Seus dados atuais serão substituídos pelo modelo."
        confirmLabel="Sim, carregar demo"
        isDangerous={false}
      />

      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={() => {
          clearAllData();
          setShowClearConfirm(false);
        }}
        title="Limpar todos os dados"
        message="Tem certeza que deseja apagar todas as disciplinas, tarefas e eventos? Esta ação é irreversível."
        confirmLabel="Sim, apagar tudo"
        isDangerous={true}
      />
    </div>
  );
};
