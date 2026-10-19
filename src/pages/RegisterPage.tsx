import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { GraduationCap, Mail, Lock, User, Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, loginAsDemo } = useAuth();
  const { success, error: toastError } = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (!name.trim()) {
      setNameError('Informe seu nome');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setEmailError('Informe um e-mail válido');
      return;
    }

    if (!password || password.length < 6) {
      setPasswordError('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('As senhas não coincidem');
      return;
    }

    setIsLoading(true);

    const res = await signup(name.trim(), email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      success('Conta criada com sucesso!', 'Bem-vindo ao UniTask.');
      navigate('/');
    } else {
      toastError('Erro ao cadastrar', res.error || 'Não foi possível completar o cadastro.');
    }
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
            Crie sua conta acadêmica gratuita
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-6 sm:p-8 text-left space-y-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Cadastrar Estudante
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Comece a organizar suas matérias, tarefas e provas hoje mesmo.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nome Completo *"
              placeholder="Ex: Lucas Ferreira"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameError}
              leftIcon={<User className="w-4 h-4" />}
              autoFocus
            />

            <Input
              label="E-mail *"
              type="email"
              placeholder="seu.email@faculdade.edu.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Senha *"
              type="password"
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Input
              label="Confirmar Senha *"
              type="password"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={confirmPasswordError}
              leftIcon={<Lock className="w-4 h-4" />}
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="md"
              isLoading={isLoading}
            >
              Criar Minha Conta
            </Button>
          </form>

          {/* Demo shortcut */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                loginAsDemo();
                navigate('/');
              }}
              className="text-xs text-amber-700 dark:text-amber-400 font-medium hover:underline inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ou prefiro testar com dados de demonstração
            </button>
          </div>

          {/* Login link */}
          <p className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            Já tem uma conta?{' '}
            <Link
              to="/login"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
