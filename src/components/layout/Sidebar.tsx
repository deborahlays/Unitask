import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  GraduationCap,
  Sparkles,
} from 'lucide-react';
import { Button } from '../common/Button';

interface SidebarProps {
  onOpenQuickTask: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onOpenQuickTask }) => {
  const { user, isDemoMode } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Minhas tarefas', path: '/tarefas', icon: CheckSquare },
    { label: 'Calendário', path: '/calendario', icon: Calendar },
    { label: 'Disciplinas', path: '/disciplinas', icon: BookOpen },
    { label: 'Estatísticas', path: '/estatisticas', icon: BarChart3 },
    { label: 'Configurações', path: '/configuracoes', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sticky top-0 shrink-0 select-none">
      {/* Brand Logo Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/80 justify-between">
        <NavLink to="/" className="flex items-center gap-2.5 text-decoration-none">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
            <GraduationCap className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Uni<span className="text-blue-600">Task</span>
            </span>
          </div>
        </NavLink>
      </div>

      {/* Demo Pill Notice */}
      {isDemoMode && (
        <div className="mx-4 mt-3 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <div className="text-[11px] text-amber-800 dark:text-amber-300 font-medium leading-tight">
            Modo Demonstração ativo
          </div>
        </div>
      )}

      {/* Fast Action Quick Task Button */}
      <div className="px-4 pt-4">
        <Button
          onClick={onOpenQuickTask}
          className="w-full shadow-sm shadow-blue-500/20"
          size="md"
          leftIcon={<Plus className="w-4 h-4 stroke-[2.5]" />}
        >
          Nova Tarefa
        </Button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 stroke-[2]" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* User Mini Card Footer */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800/80">
        <NavLink
          to="/configuracoes"
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm shrink-0 border border-blue-200 dark:border-blue-800">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user?.name || 'Estudante'}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
              {user?.course || user?.email || 'Graduação'}
            </p>
          </div>
        </NavLink>
      </div>
    </aside>
  );
};
