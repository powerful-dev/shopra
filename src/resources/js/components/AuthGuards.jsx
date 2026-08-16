import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoadingScreen() {
    return <div className="flex min-h-screen items-center justify-center text-sm text-[color:var(--color-secondary)]">Loading…</div>;
}

export function RequireAuth({ children }) {
    const { isLoading, user } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return user ? children : <Navigate to="/admin/login" replace state={{ from: location }} />;
}

export function GuestOnly({ children }) {
    const { isLoading, user } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    return user ? <Navigate to="/admin/dashboard" replace /> : children;
}
