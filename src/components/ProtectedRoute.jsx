import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

// NOTE: This component is not currently wired into App.jsx (auth is handled
// inline there via AuthProvider + AuthenticatedApp). It's kept available for
// routes that want per-route protection instead. Previously this referenced
// `authChecked` / `checkUserAuth`, which AuthContext never exposed — that
// mismatch meant this component would throw as soon as it was used. Fixed to
// use the real AuthContext API (isLoadingPublicSettings/isLoadingAuth/authError).
export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError } = useAuth();

  if (isLoadingAuth || isLoadingPublicSettings) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  return <Outlet />;
}
