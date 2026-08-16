import { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../components/admin/PageContainer';
import { csrf, request } from '../services/api';

const DEFAULT_PAGE = 1;

function buildPaginationItems(currentPage, lastPage) {
    const pages = [];

    if (lastPage <= 7) {
        for (let page = 1; page <= lastPage; page += 1) {
            pages.push(page);
        }

        return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
        pages.push('…');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(lastPage - 1, currentPage + 1);

    for (let page = start; page <= end; page += 1) {
        pages.push(page);
    }

    if (currentPage < lastPage - 2) {
        pages.push('…');
    }

    pages.push(lastPage);

    return pages;
}

export default function AdministratorsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [admins, setAdmins] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [formErrors, setFormErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusChangingId, setStatusChangingId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);

    const currentPage = Number(searchParams.get('page') ?? DEFAULT_PAGE);
    const navigate = useNavigate();
    const location = useLocation();

    const loadAdmins = async (page = currentPage) => {
        setIsLoading(true);
        setMessage('');

        try {
            const payload = await request(`/api/admins?page=${page}`);
            setAdmins(payload.data ?? []);
            setMeta(payload.meta ?? null);
        } catch (error) {
            setMessage(error.message ?? 'Unable to load administrators.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!Number.isInteger(currentPage) || currentPage < 1) {
            setSearchParams({ page: DEFAULT_PAGE.toString() }, { replace: true });
            return;
        }

        loadAdmins(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (location.state && location.state.message) {
            setMessage(location.state.message);
            // clear navigation state
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location]);

    // Editing moved to a dedicated page (AdminEditPage)

    const openDeleteModal = (admin) => {
        setAdminToDelete(admin);
        setMessage('');
    };

    const closeDeleteModal = () => {
        setAdminToDelete(null);
    };

    

    const toggleStatus = async (admin) => {
        if (admin.id === Number(window.__SHOPRA_ADMIN_ID__)) {
            setMessage('You cannot disable your own account.');
            return;
        }

        setStatusChangingId(admin.id);
        setMessage('');

        try {
            await csrf();
            const response = await request(`/api/admins/${admin.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !admin.is_active }),
            });

            const updatedAdmin = response.data;

            setAdmins((currentAdmins) => currentAdmins.map((item) => (
                item.id === admin.id ? { ...item, ...updatedAdmin, is_active: Boolean(updatedAdmin.is_active) } : item
            )));
            setMessage(`Status updated for “${updatedAdmin.full_name || updatedAdmin.email}”.`);
        } catch (error) {
            setMessage(error.message ?? 'Unable to update activity status.');
        } finally {
            setStatusChangingId(null);
        }
    };

    const removeAdministrator = async () => {
        if (!adminToDelete) {
            return;
        }

        if (adminToDelete.id === Number(window.__SHOPRA_ADMIN_ID__)) {
            setMessage('You cannot delete your own account.');
            closeDeleteModal();
            return;
        }

        setIsDeleting(true);
        setMessage('');

        try {
            await csrf();
            await request(`/api/admins/${adminToDelete.id}`, { method: 'DELETE' });

            closeDeleteModal();
            const targetPage = admins.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            setSearchParams({ page: targetPage.toString() }, { replace: true });
            await loadAdmins(targetPage);
            setMessage('Administrator removed.');
        } catch (error) {
            setMessage(error.message ?? 'Unable to delete the administrator.');
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = meta?.last_page ?? 1;
    const paginationItems = useMemo(() => buildPaginationItems(currentPage, totalPages), [currentPage, totalPages]);

    return (
        <PageContainer>

            <header class="shopra-hero">
                <div>
                    <p class="shopra-eyebrow">Shopra · Управление командой</p>
                    <h1>Администраторы</h1>
                    <p>Управляйте администраторами магазина, их учетными записями и уровнем доступа.</p>
                </div>
                <div>
                    <button type="button" className="shopra-button" onClick={() => navigate('/admin/administrators/new')}>Добавить администратора</button>
                </div>
            </header>


            <section className="shopra-dashboard-card">

                {isLoading ? (
                    <div className="flex justify-center p-8">
                        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-accent)]" role="status" aria-label="Загрузка" />
                    </div>
                ) : admins.length > 0 ? (
                    <div className="shopra-admin-list">
                        <div className="shopra-admin-list-head">
                            <div className="shopra-admin-list-name">Имя</div>
                            <div className="shopra-admin-list-meta">Доступ</div>
                            <div className="shopra-admin-list-email">Email</div>
                            <div className="shopra-admin-list-status">Активность</div>
                            <div className="shopra-admin-list-actions">Действия</div>
                        </div>
                        {admins.map((admin) => {
                            const isCurrentUser = admin.id === Number(window.__SHOPRA_ADMIN_ID__);
                            const displayName = [admin.first_name, admin.last_name].filter(Boolean).join(' ').trim() || admin.email;

                            return (
                                <div className="shopra-admin-list-row" key={admin.id}>
                                    <div className="shopra-admin-list-name">
                                        <strong>{displayName}</strong>
                                        <small>{isCurrentUser ? 'Текущий аккаунт' : 'Администратор'}</small>
                                    </div>
                                    <div className="shopra-admin-list-meta">
                                        <strong>{isCurrentUser ? 'Полный доступ' : 'Ограниченный доступ'}</strong>
                                        <small>{isCurrentUser ? 'Вы активны в системе' : 'Управляет доступом'}</small>
                                    </div>
                                    <div className="shopra-admin-list-email">{admin.email}</div>
                                    <div className="shopra-admin-list-status">
                                        <button
                                            type="button"
                                            className={`shopra-switch ${admin.is_active ? 'active' : ''}`}
                                            aria-pressed={admin.is_active}
                                            aria-label={admin.is_active ? 'Отключить администратора' : 'Включить администратора'}
                                            onClick={() => toggleStatus(admin)}
                                            disabled={statusChangingId === admin.id || isCurrentUser}
                                        >
                                            <span></span>
                                        </button>

                                    </div>
                                    <div className="shopra-admin-list-actions">
                                        <button className="rounded-lg border border-[color:var(--color-border)] bg-white px-3 py-2 text-xs font-semibold" type="button" onClick={() => navigate(`/admin/administrators/${admin.id}`)}>
                                            Редактировать
                                        </button>
                                        <button className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={() => openDeleteModal(admin)} disabled={isCurrentUser}>
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="shopra-admin-empty">
                        <p className="mb-0">Пока нет доступных администраторов.</p>
                    </div>
                )}

                {!isLoading && meta && totalPages > 1 && (
                    <ul className="mt-6 flex list-none justify-center gap-1 p-0">
                        <li>
                            <button type="button" onClick={() => setSearchParams({ page: Math.max(1, currentPage - 1).toString() }, { replace: true })} disabled={currentPage <= 1}>
                                ←
                            </button>
                        </li>
                        {paginationItems.map((page, index) => (
                            <li key={`${page}-${index}`}>
                                {page === '…' ? <span>{page}</span> : (
                                    <button type="button" className={page === currentPage ? 'bg-[var(--color-accent)] text-white' : ''} onClick={() => setSearchParams({ page: page.toString() }, { replace: true })}>
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}
                        <li>
                            <button type="button" onClick={() => setSearchParams({ page: Math.min(totalPages, currentPage + 1).toString() }, { replace: true })} disabled={currentPage >= totalPages}>
                                →
                            </button>
                        </li>
                    </ul>
                )}
            </section>

            {/* Edit form moved to a dedicated page: /admin/administrators/new or /admin/administrators/:id */}

            {adminToDelete && <div className="fixed inset-0 z-[200] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={closeDeleteModal}>
                <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="delete-admin-title" onMouseDown={(event) => event.stopPropagation()}>
                    <h2 id="delete-admin-title" className="m-0 text-xl font-bold">Подтвердите удаление</h2>
                    <p className="my-4 text-sm text-[color:var(--color-secondary)]">{`Удалить администратора ${adminToDelete.first_name} ${adminToDelete.last_name}?`}</p>
                    <div className="flex justify-end gap-2">
                        <button className="rounded-lg border border-[color:var(--color-border)] bg-white px-4 py-2 text-sm font-semibold" type="button" onClick={closeDeleteModal}>Отмена</button>
                        <button className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" type="button" onClick={removeAdministrator} disabled={isDeleting}>{isDeleting ? 'Удаление…' : 'Удалить'}</button>
                    </div>
                </div>
            </div>}
        </PageContainer>
    );
}
