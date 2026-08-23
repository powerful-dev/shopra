import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as authentication from '../services/auth';
import { ApiError } from '../services/api';
import i18n from '../i18n';

const AuthContext = createContext(null);

async function applyUserLanguage(user) {
    if (user?.admin_language) {
        await i18n.changeLanguage(user.admin_language);
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        authentication.getCurrentUser()
            .then(async (authenticatedUser) => {
                await applyUserLanguage(authenticatedUser);
                setUser(authenticatedUser);
            })
            .catch((error) => {
                if (!(error instanceof ApiError) || error.status !== 401) {
                    console.error('Unable to restore the administrator session.', error);
                }
            })
            .finally(() => setIsLoading(false));
    }, []);

    const value = useMemo(() => ({
        user,
        isLoading,
        login: async (credentials) => {
            const authenticatedUser = await authentication.login(credentials);
            await applyUserLanguage(authenticatedUser);
            setUser(authenticatedUser);
        },
        logout: async () => {
            await authentication.logout();
            setUser(null);
        },
    }), [isLoading, user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider.');
    }

    return context;
}
