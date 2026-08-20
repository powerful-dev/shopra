import { useModules } from '../../hooks/useModules';

export default function RequireModule({ code, children }) {
    const { loading, hasModule } = useModules();

    if (loading) {
        return null;
    }

    if (!hasModule(code)) {
        return (
            <div className="rounded-[16px] border border-[color:var(--color-border)] bg-white p-6">
                <h1 className="m-0 text-[24px] font-[760]">
                    Доступ запрещён
                </h1>

                <p className="mt-2 text-[color:var(--color-secondary)]">
                    У вас нет доступа к этому разделу.
                </p>
            </div>
        );
    }

    return children;
}