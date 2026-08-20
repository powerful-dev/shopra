import { createContext, useContext, useEffect, useState } from 'react';
import { request } from '../services/api';

const ModulesContext = createContext(null);

export function ModulesProvider({ children }) {
    const [modules, setModules] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await request('/api/me/modules');

                setModules(data);

                console.table(data);
            } catch (error) {
                console.error('Не удалось загрузить модули:', error);
                setModules([]);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const hasModule = (code) => {
        return modules.some((module) => module.code === code);
    };

    return (
        <ModulesContext.Provider value={{ modules, loading, hasModule }}>
            {children}
        </ModulesContext.Provider>
    );
}

export function useModules() {
    return useContext(ModulesContext);
}