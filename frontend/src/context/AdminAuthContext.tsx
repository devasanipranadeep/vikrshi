'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getBrowserClient } from '@/lib/supabase/client';
import { AdminRole } from '@/types';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  avatar?: string;
}

interface AdminAuthContextType {
  isAuthenticated: boolean;
  user: AdminUser | null;
  role: AdminRole;
  isSuperAdmin: boolean;
  isFullAdmin: boolean;
  login: (emailOrPin: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  quickLogin: () => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const DEMO_ADMIN: AdminUser = {
  id: 'demo-admin',
  name: 'Vikrshi Admin',
  email: 'admin@vikrshi.com',
  role: 'admin',
  isActive: true,
  avatar: '/logo-full.png',
};

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check Supabase session on mount
  useEffect(() => {
    let isMounted = true;
    const supabase = getBrowserClient();

    async function checkSession() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile && profile.is_active) {
            if (isMounted) {
              setUser({
                id: session.user.id,
                name: profile.full_name || session.user.email?.split('@')[0] || 'Admin',
                email: session.user.email || '',
                role: profile.role || 'admin',
                isActive: profile.is_active,
              });
              setIsAuthenticated(true);
            }
            return;
          }
        }

        // Check fallback localStorage session
        const savedAuth = localStorage.getItem('vikrshi_admin_auth');
        if (savedAuth === 'true' && isMounted) {
          setIsAuthenticated(true);
          setUser(DEMO_ADMIN);
        }
      } catch (e) {
        console.warn('Error reading admin session:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    checkSession();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile && profile.is_active) {
          setUser({
            id: session.user.id,
            name: profile.full_name,
            email: session.user.email || '',
            role: profile.role,
            isActive: profile.is_active,
          });
          setIsAuthenticated(true);
        }
      } else if (event === 'SIGNED_OUT') {
        const localAuth = localStorage.getItem('vikrshi_admin_auth');
        if (!localAuth) {
          setIsAuthenticated(false);
          setUser(null);
        }
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (emailOrPin: string, password?: string) => {
    const cleanInput = emailOrPin.trim();

    // 1. Check local PIN fallback (5678) or demo password for fast development
    if (cleanInput === '5678' || (cleanInput.toLowerCase() === 'admin@vikrshi.com' && password === 'vikrshi2026')) {
      setIsAuthenticated(true);
      setUser(DEMO_ADMIN);
      localStorage.setItem('vikrshi_admin_auth', 'true');
      return { success: true };
    }

    // 2. Real Supabase Authentication
    const supabase = getBrowserClient();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanInput,
        password: password || '',
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'User account not found' };
      }

      // 3. Verify Profile and Active Status
      const { data: profile, error: profError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profError || !profile) {
        // If profile doesn't exist yet, auto-create as centralized admin
        const { data: newProf } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            full_name: data.user.email?.split('@')[0] || 'Admin',
            role: 'admin',
            is_active: true,
          })
          .select()
          .single();

        if (newProf) {
          setUser({
            id: data.user.id,
            name: newProf.full_name,
            email: data.user.email || '',
            role: newProf.role,
            isActive: newProf.is_active,
          });
          setIsAuthenticated(true);
          return { success: true };
        }

        return { success: false, error: 'No admin profile configured for this user.' };
      }

      if (!profile.is_active) {
        await supabase.auth.signOut();
        return { success: false, error: 'This admin account has been deactivated.' };
      }

      setUser({
        id: data.user.id,
        name: profile.full_name,
        email: data.user.email || '',
        role: profile.role,
        isActive: profile.is_active,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Authentication failed. Please verify credentials.',
      };
    }
  };

  const quickLogin = () => {
    setIsAuthenticated(true);
    setUser(DEMO_ADMIN);
    localStorage.setItem('vikrshi_admin_auth', 'true');
  };

  const logout = async () => {
    setIsAuthenticated(false);
    setUser(null);
    try {
      localStorage.removeItem('vikrshi_admin_auth');
      const supabase = getBrowserClient();
      await supabase.auth.signOut();
    } catch (e) {
      console.warn('Sign out error:', e);
    }
  };

  const role = user?.role || 'admin';
  const isSuperAdmin = true;
  const isFullAdmin = true;

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        user,
        role,
        isSuperAdmin,
        isFullAdmin,
        login,
        quickLogin,
        logout,
        isLoading,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}
