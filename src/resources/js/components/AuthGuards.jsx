import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function RequireAuth({ children }) {
    const { isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return children;
    }

    return user ? children : <Navigate to="/admin/login" replace state={{ from: location }} />;
}

export function GuestOnly({ children }) {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return null;
    }

    return user ? <Navigate to="/admin/dashboard" replace /> : children;
}
