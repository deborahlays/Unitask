import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { GraduationCap, Sparkles, Mail, Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginAsDemo, isSupabaseConnected } = useAuth();
  const { success, error: toastError } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setPasswordError('');

    if (!email.trim() || !email.includes('@')) {
      setEmailError('Informe um e-mail válido');
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setIsLoading(true);

    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      success('Bem-vindo ao UniTask!', 'Login realizado com sucesso.');
      navigate('/');
    } else {
      toastError('Falha no login', res.error || 'Credenciais inválidas. Verifique seu e-mail e senha.');
    }
  };

  const handleDemoAccess = () => {
    loginAsDemo();
    success('Modo Demonstração carregado!', 'Explore todas as funcionalidades com dados realistas.');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center items-center p-4 transition-colors">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-500/30 mb-4">
            <GraduationCap className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Uni<span className="text-blue-600">Task</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Plataforma de Organização Acadêmica
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-left space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Acesse sua conta
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Entre com suas credenciais para visualizar suas matérias e prazos.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail universitário ou pessoal"
              type="email"
              placeholder="exemplo@universidade.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              leftIcon={<Mail className="w-4 h-4" />}
              autoFocus
            />

            <Input
              label="Senha"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={isLoading}
            >
              Entrar no UniTask
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-white dark:bg-slate-900 px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              ou
            </span>
          </div>

          {/* 1-Click Demo Login */}
          <button
            type="button"
            onClick={handleDemoAccess}
            className="w-full py-2.5 px-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/60 dark:bg-blue-950/30 hover:bg-blue-100/60 text-blue-800 dark:text-blue-300 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Explorar com Conta de Demonstração
          </button>

          {/* Registration link */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2">
            Ainda não tem conta?{' '}
            <Link
              to="/cadastro"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Cadastre-se gratuitamente
            </Link>
          </p>
        </div>

        {/* Footer database status pill */}
        <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>
            {isSupabaseConnected
              ? 'Supabase Cloud Database integrado com políticas RLS'
              : 'Executando em modo local seguro com sincronização imediata'}
          </span>
        </div>
      </div>
    </div>
  );
};
