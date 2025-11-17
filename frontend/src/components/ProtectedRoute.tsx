import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { token } = useAuthStore();
  const storedToken = localStorage.getItem('token');

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
