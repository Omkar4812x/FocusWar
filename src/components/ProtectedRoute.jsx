import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/useAuth';
import Spinner from './Spinner';

/**
 * Wraps a route with auth protection.
 * - If auth is still loading → shows spinner
 * - If not authenticated → redirects to /login
 * - If authenticated → renders children
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <Spinner size="lg" />
        <span>Loading...</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
