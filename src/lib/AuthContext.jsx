import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { appParams } from '@/lib/app-params';

const AuthContext = createContext();

export const MOCK_ACCOUNTS = [
  {
    id: 'usr_owner',
    email: 'owner@staffroom.demo',
    password: 'Demo@123',
    full_name: 'Alex Vance',
    first_name: 'Alex',
    last_name: 'Vance',
    role: 'System Owner',
    department: 'Executive',
    job_title: 'Chief Executive Officer',
    organization_id: 'org_staffroom_main',
    is_active: true,
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  },
  {
    id: 'usr_admin',
    email: 'admin@acmecorp.demo',
    password: 'Demo@123',
    full_name: 'Sarah Jenkins',
    first_name: 'Sarah',
    last_name: 'Jenkins',
    role: 'admin',
    department: 'HR',
    job_title: 'HR Director',
    organization_id: 'org_acme_corp',
    is_active: true,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  },
  {
    id: 'usr_hr',
    email: 'hr.admin@acmecorp.demo',
    password: 'Demo@123',
    full_name: 'Michael Chen',
    first_name: 'Michael',
    last_name: 'Chen',
    role: 'Department Admin',
    department: 'People Operations',
    job_title: 'HR Manager',
    organization_id: 'org_acme_corp',
    is_active: true,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  },
  {
    id: 'usr_staff',
    email: 'staff@acmecorp.demo',
    password: 'Demo@123',
    full_name: 'Elena Rostova',
    first_name: 'Elena',
    last_name: 'Rostova',
    role: 'Staff Member',
    department: 'Engineering',
    job_title: 'Senior Frontend Developer',
    organization_id: 'org_acme_corp',
    is_active: true,
    avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  },
];

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState({ id: appParams.appId || 'staffroom-app' });

  // Get stored or local custom accounts
  const getAccounts = useCallback(() => {
    try {
      const stored = localStorage.getItem('staffroom_registered_users');
      const custom = stored ? JSON.parse(stored) : [];
      return [...MOCK_ACCOUNTS, ...custom];
    } catch {
      return MOCK_ACCOUNTS;
    }
  }, []);

  // Construct complete profile object from Supabase auth user or local user
  const mapUserProfile = useCallback(async (authUser, fallbackLocalUser = null) => {
    if (!authUser) return null;

    let profileData = null;

    // Try fetching profile from Supabase database if connected
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (!error && data) {
        profileData = data;
      }
    } catch {
      // Supabase query error ignored, fallback to metadata/local
    }

    const meta = authUser.user_metadata || {};
    const accounts = getAccounts();
    const matchedAccount = accounts.find(a => a.email.toLowerCase() === (authUser.email || '').toLowerCase()) || fallbackLocalUser;

    const full_name = profileData?.full_name || meta.full_name || matchedAccount?.full_name || authUser.email?.split('@')[0] || 'Staff Member';
    const nameParts = full_name.split(' ');

    return {
      id: authUser.id || matchedAccount?.id || `usr_${Date.now()}`,
      email: authUser.email || matchedAccount?.email || '',
      full_name,
      first_name: profileData?.first_name || meta.first_name || nameParts[0] || 'Staff',
      last_name: profileData?.last_name || meta.last_name || nameParts.slice(1).join(' ') || '',
      role: profileData?.role || meta.role || matchedAccount?.role || 'Staff Member',
      department: profileData?.department || meta.department || matchedAccount?.department || 'General',
      job_title: profileData?.job_title || meta.job_title || matchedAccount?.job_title || 'Team Member',
      organization_id: profileData?.organization_id || meta.organization_id || matchedAccount?.organization_id || 'org_staffroom_main',
      is_active: profileData?.is_active ?? meta.is_active ?? matchedAccount?.is_active ?? true,
      avatar_url: profileData?.avatar_url || meta.avatar_url || matchedAccount?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      created_at: authUser.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }, [getAccounts]);

  // Handle active session verification & subscription
  useEffect(() => {
    let isMounted = true;

    const initSession = async () => {
      setIsLoadingAuth(true);
      try {
        // Check current Supabase session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Supabase auth session error:', error.message);
        }

        if (currentSession?.user) {
          const mappedUser = await mapUserProfile(currentSession.user);
          if (isMounted) {
            if (mappedUser.is_active === false) {
              setAuthError({ type: 'account_deactivated', message: 'Your account has been deactivated.' });
              setIsAuthenticated(false);
              setUser(null);
              setSession(null);
            } else {
              setSession(currentSession);
              setUser(mappedUser);
              setIsAuthenticated(true);
              setAuthError(null);
              localStorage.setItem('staffroom_user', JSON.stringify(mappedUser));
              localStorage.setItem('staffroom_auth', 'true');
            }
          }
        } else {
          // Check local persistent session if Supabase isn't active
          const storedUser = localStorage.getItem('staffroom_user');
          const storedAuth = localStorage.getItem('staffroom_auth') === 'true';

          if (storedAuth && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            if (parsedUser.is_active === false) {
              setAuthError({ type: 'account_deactivated', message: 'Your account has been deactivated.' });
              setIsAuthenticated(false);
              setUser(null);
            } else {
              setUser(parsedUser);
              setIsAuthenticated(true);
              setAuthError(null);
            }
          } else {
            setUser(null);
            setIsAuthenticated(false);
            localStorage.setItem('staffroom_auth', 'false');
          }
        }
      } catch (err) {
        console.warn('Auth initialization error:', err);
      } finally {
        if (isMounted) {
          setIsLoadingAuth(false);
        }
      }
    };

    initSession();

    // Listen for auth changes (token refresh, sign in, sign out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
        if (newSession?.user) {
          const mappedUser = await mapUserProfile(newSession.user);
          if (mappedUser.is_active === false) {
            setAuthError({ type: 'account_deactivated', message: 'Your account has been deactivated.' });
            setIsAuthenticated(false);
            setUser(null);
            setSession(null);
          } else {
            setSession(newSession);
            setUser(mappedUser);
            setIsAuthenticated(true);
            setAuthError(null);
            localStorage.setItem('staffroom_user', JSON.stringify(mappedUser));
            localStorage.setItem('staffroom_auth', 'true');
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        localStorage.setItem('staffroom_auth', 'false');
        localStorage.removeItem('staffroom_user');
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [mapUserProfile]);

  // Sign in with credentials
  const signIn = async (email, password) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const cleanEmail = (email || '').toLowerCase().trim();

    try {
      // First attempt Supabase authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      if (!error && data?.user) {
        const mappedUser = await mapUserProfile(data.user);
        if (mappedUser.is_active === false) {
          setIsLoadingAuth(false);
          return { error: { message: 'Your account has been deactivated. Please contact your administrator.' } };
        }

        setSession(data.session);
        setUser(mappedUser);
        setIsAuthenticated(true);
        localStorage.setItem('staffroom_user', JSON.stringify(mappedUser));
        localStorage.setItem('staffroom_auth', 'true');
        setIsLoadingAuth(false);
        return { error: null, user: mappedUser };
      }

      // If Supabase authentication fails due to unconfigured instance or missing user in remote database,
      // verify against verified local accounts registry safely
      const accounts = getAccounts();
      const foundAccount = accounts.find(a => a.email.toLowerCase().trim() === cleanEmail);

      if (!foundAccount) {
        setIsLoadingAuth(false);
        return { error: { message: 'Invalid email or password. Please check your credentials.' } };
      }

      if (foundAccount.password && foundAccount.password !== password) {
        setIsLoadingAuth(false);
        return { error: { message: 'Incorrect password. Please try again.' } };
      }

      if (foundAccount.is_active === false) {
        setIsLoadingAuth(false);
        return { error: { message: 'Account is deactivated. Please contact HR or System Administrator.' } };
      }

      const sessionUser = { ...foundAccount };
      delete sessionUser.password;

      setUser(sessionUser);
      setIsAuthenticated(true);
      localStorage.setItem('staffroom_user', JSON.stringify(sessionUser));
      localStorage.setItem('staffroom_auth', 'true');
      setIsLoadingAuth(false);

      return { error: null, user: sessionUser };
    } catch (err) {
      setIsLoadingAuth(false);
      return { error: { message: err.message || 'An error occurred during sign in.' } };
    }
  };

  // Sign up new account
  const signUp = async ({ email, password, full_name, role = 'Staff Member', department = 'General', job_title = 'Team Member' }) => {
    setIsLoadingAuth(true);
    setAuthError(null);

    const cleanEmail = (email || '').toLowerCase().trim();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name,
            role,
            department,
            job_title,
          },
        },
      });

      if (!error && data?.user) {
        const mappedUser = await mapUserProfile(data.user);
        setSession(data.session);
        setUser(mappedUser);
        setIsAuthenticated(true);
        localStorage.setItem('staffroom_user', JSON.stringify(mappedUser));
        localStorage.setItem('staffroom_auth', 'true');
        setIsLoadingAuth(false);
        return { error: null, user: mappedUser };
      }

      // Fallback local registration
      const accounts = getAccounts();
      const existing = accounts.find(a => a.email.toLowerCase().trim() === cleanEmail);

      if (existing) {
        setIsLoadingAuth(false);
        return { error: { message: 'An account with this email address already exists.' } };
      }

      const nameParts = (full_name || '').trim().split(' ');
      const newUser = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        password,
        full_name: full_name.trim(),
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        role: role || 'Staff Member',
        department: department || 'General',
        job_title: job_title || 'Team Member',
        organization_id: 'org_staffroom_main',
        is_active: true,
        avatar_url: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150`,
      };

      try {
        const customUsers = JSON.parse(localStorage.getItem('staffroom_registered_users') || '[]');
        customUsers.push(newUser);
        localStorage.setItem('staffroom_registered_users', JSON.stringify(customUsers));
      } catch {}

      const sessionUser = { ...newUser };
      delete sessionUser.password;

      setUser(sessionUser);
      setIsAuthenticated(true);
      localStorage.setItem('staffroom_user', JSON.stringify(sessionUser));
      localStorage.setItem('staffroom_auth', 'true');
      setIsLoadingAuth(false);

      return { error: null, user: sessionUser };
    } catch (err) {
      setIsLoadingAuth(false);
      return { error: { message: err.message || 'Failed to create account.' } };
    }
  };

  // Password Reset for Email
  const resetPasswordForEmail = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/Login?reset=true`,
      });

      if (error && !error.message.includes('fetch')) {
        return { error };
      }
      return { error: null, message: 'Password reset link sent to your work email address.' };
    } catch (err) {
      return { error: { message: err.message || 'Failed to send password reset email.' } };
    }
  };

  // Update password for recovery
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error };
      return { error: null, message: 'Password updated successfully.' };
    } catch (err) {
      return { error: { message: err.message || 'Failed to update password.' } };
    }
  };

  // SSO Login Helpers
  const signInWithOAuth = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/Dashboard`,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: { message: err.message || `SSO login with ${provider} failed.` } };
    }
  };

  const signInWithSSO = async (domain) => {
    try {
      const { error } = await supabase.auth.signInWithSSO({
        domain,
        options: {
          redirectTo: `${window.location.origin}/Dashboard`,
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (err) {
      return { error: { message: err.message || 'Enterprise SSO login failed.' } };
    }
  };

  // Logout / SignOut
  const logout = async () => {
    setIsLoadingAuth(true);
    try {
      await supabase.auth.signOut();
    } catch {}
    setUser(null);
    setSession(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.setItem('staffroom_auth', 'false');
    localStorage.removeItem('staffroom_user');
    setIsLoadingAuth(false);
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (currentSession?.user) {
        const mapped = await mapUserProfile(currentSession.user, user);
        setUser(mapped);
        localStorage.setItem('staffroom_user', JSON.stringify(mapped));
      }
    } catch {}
  };

  const profile = user ? {
    ...user,
    role: user.role || 'Staff Member',
    full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Staff User',
    email: user.email || 'user@staffroom.internal',
  } : null;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading: isLoadingAuth,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      logout,
      signOut: logout,
      signIn,
      signUp,
      resetPasswordForEmail,
      updatePassword,
      signInWithOAuth,
      signInWithSSO,
      refreshProfile,
      navigateToLogin: logout,
      checkAppState: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


