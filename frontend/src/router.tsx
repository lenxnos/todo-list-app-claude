import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/shared/context/auth.context';
import { ProtectedRoute } from '@/shared/components/protected-route';
import { Layout } from '@/shared/components/layout';
import { LoginPage } from '@/features/auth/pages/login.page';
import { RegisterPage } from '@/features/auth/pages/register.page';
import { ForgotPasswordPage } from '@/features/auth/pages/forgot-password.page';
import { ResetPasswordPage } from '@/features/auth/pages/reset-password.page';
import { TodosPage } from '@/features/todos/pages/todos.page';

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/" replace />;

  return <>{children}</>;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/" element={<TodosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
