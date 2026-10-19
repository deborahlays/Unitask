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
  X,
  GraduationCap,
  Sparkles,
  Plus,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickTask: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose, onOpenQuickTask }) => {
  const { user, isDemoMode } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Minhas tarefas', path: '/tarefas', icon: CheckSquare },
    { label: 'Calendário', path: '/calendario', icon: Calendar },
    { label: 'Disciplinas', path: '/disciplinas', icon: BookOpen },
    { label: 'Estatísticas', path: '/estatisticas', icon: BarChart3 },
    { label: 'Configurações', path: '/configuracoes', icon: Settings },
  ];

  const bottomBarItems = [
    { label: 'Início', path: '/', icon: LayoutDashboard },
    { label: 'Tarefas', path: '/tarefas', icon: CheckSquare },
    { label: 'Calendário', path: '/calendario', icon: Calendar },
    { label: 'Disciplinas', path: '/disciplinas', icon: BookOpen },
    { label: 'Mais', path: '/configuracoes', icon: Settings },
  ];

  return (
    <>
      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={onClose}
          />

          {/* Drawer content */}
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 shadow-2xl z-10 flex flex-col animate-in slide-in-from-left duration-200">
            {/* Header */}
            <div className="h-16 px-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-lg font-bold text-slate-900 dark:text-white">
                  Uni<span className="text-blue-600">Task</span>
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isDemoMode && (
              <div className="mx-4 mt-3 p-2 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                  Modo Demonstração ativo
                </span>
              </div>
            )}

            {/* Quick Task in Drawer */}
            <div className="p-4">
              <button
                onClick={() => {
                  onClose();
                  onOpenQuickTask();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nova Tarefa
              </button>
            </div>

            {/* Nav list */}
            <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                    {user?.name || 'Estudante'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Fixed Bar for easy navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-lg">
        {bottomBarItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-3 rounded-xl text-[10px] font-medium transition-colors ${
                  isActive
                    ? 'text-blue-600 dark:text-blue-400 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};
