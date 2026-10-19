import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DEMO_USER } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isDemoMode: boolean;
  isSupabaseConnected: boolean;
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'unitask_auth_user';
const LOCAL_STORAGE_DEMO_KEY = 'unitask_is_demo_mode';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);

      const savedDemo = localStorage.getItem(LOCAL_STORAGE_DEMO_KEY) === 'true';

      if (savedDemo) {
        setIsDemoMode(true);
        const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        setUser(savedUser ? JSON.parse(savedUser) : DEMO_USER);
        setIsLoading(false);
        return;
      }

      // Check Supabase if configured
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                name: profile.name || session.user.email?.split('@')[0] || 'Estudante',
                email: profile.email || session.user.email || '',
                course: profile.course || '',
                university: profile.university || '',
                first_day_of_week: profile.first_day_of_week || 'monday',
                theme: profile.theme || 'light',
                notify_due_today: profile.notify_due_today ?? true,
                notify_due_tomorrow: profile.notify_due_tomorrow ?? true,
                notify_exams: profile.notify_exams ?? true,
                sound_effects: profile.sound_effects ?? true,
              });
            } else {
              setUser({
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Estudante',
                email: session.user.email || '',
                first_day_of_week: 'monday',
                theme: 'light',
                notify_due_today: true,
                notify_due_tomorrow: true,
                notify_exams: true,
                sound_effects: true,
              });
            }
          }
        } catch (err) {
          console.warn('Erro ao restaurar sessão Supabase:', err);
        }
      } else {
        // Local mode fallback
        const savedUser = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch {
            localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
          }
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const newUser: UserProfile = {
            id: data.user.id,
            name: profile?.name || data.user.user_metadata?.name || email.split('@')[0],
            email: data.user.email || email,
            course: profile?.course || '',
            university: profile?.university || '',
            first_day_of_week: profile?.first_day_of_week || 'monday',
            theme: profile?.theme || 'light',
            notify_due_today: profile?.notify_due_today ?? true,
            notify_due_tomorrow: profile?.notify_due_tomorrow ?? true,
            notify_exams: profile?.notify_exams ?? true,
            sound_effects: profile?.sound_effects ?? true,
          };

          setUser(newUser);
          setIsDemoMode(false);
          localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, 'false');
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const message = err instanceof Error ? err.message : 'Falha na autenticação';
        return { success: false, error: message };
      }
    }

    // Local authentication (mock / offline)
    const localUser: UserProfile = {
      id: 'local-user-' + Math.random().toString(36).substring(2, 9),
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      course: 'Graduação',
      university: 'Universidade',
      first_day_of_week: 'monday',
      theme: 'light',
      notify_due_today: true,
      notify_due_tomorrow: true,
      notify_exams: true,
      sound_effects: true,
    };

    setUser(localUser);
    setIsDemoMode(false);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
    localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, 'false');
    setIsLoading(false);
    return { success: true };
  };

  const signup = async (name: string, email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (isSupabaseConfigured && supabase && password) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            name,
            email,
            first_day_of_week: 'monday',
            theme: 'light',
            notify_due_today: true,
            notify_due_tomorrow: true,
            notify_exams: true,
            sound_effects: true,
          };

          setUser(newUser);
          setIsDemoMode(false);
          localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, 'false');
          setIsLoading(false);
          return { success: true };
        }
      } catch (err: unknown) {
        setIsLoading(false);
        const message = err instanceof Error ? err.message : 'Falha no cadastro';
        return { success: false, error: message };
      }
    }

    // Local signup
    const localUser: UserProfile = {
      id: 'local-user-' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      course: 'Graduação',
      university: 'Universidade',
      first_day_of_week: 'monday',
      theme: 'light',
      notify_due_today: true,
      notify_due_tomorrow: true,
      notify_exams: true,
      sound_effects: true,
    };

    setUser(localUser);
    setIsDemoMode(false);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
    localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, 'false');
    setIsLoading(false);
    return { success: true };
  };

  const loginAsDemo = () => {
    setIsLoading(true);
    setUser(DEMO_USER);
    setIsDemoMode(true);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(DEMO_USER));
    localStorage.setItem(LOCAL_STORAGE_DEMO_KEY, 'true');
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error('Logout error:', e);
      }
    }
    setUser(null);
    setIsDemoMode(false);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    localStorage.removeItem(LOCAL_STORAGE_DEMO_KEY);
    setIsLoading(false);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));

    if (isSupabaseConfigured && supabase && !isDemoMode) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          name: updated.name,
          email: updated.email,
          course: updated.course,
          university: updated.university,
          first_day_of_week: updated.first_day_of_week,
          theme: updated.theme,
          notify_due_today: updated.notify_due_today,
          notify_due_tomorrow: updated.notify_due_tomorrow,
          notify_exams: updated.notify_exams,
          sound_effects: updated.sound_effects,
        });
      } catch (e) {
        console.error('Erro ao atualizar perfil no Supabase:', e);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isDemoMode,
        isSupabaseConnected: isSupabaseConfigured,
        login,
        signup,
        loginAsDemo,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
