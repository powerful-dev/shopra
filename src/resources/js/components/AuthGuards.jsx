import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function LoadingScreen() {
    return <div className="uk-flex uk-flex-center uk-flex-middle uk-height-viewport uk-text-muted">Loading…</div>;
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
