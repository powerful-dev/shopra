import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import PageContainer from '../components/admin/PageContainer';
import { csrf, request } from '../services/api';
import UIkit from 'uikit';

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
    const deleteModalRef = useRef(null);

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
        if (deleteModalRef.current) {
            UIkit.modal(deleteModalRef.current).show();
        }
    };

    const closeDeleteModal = () => {
        if (deleteModalRef.current) {
            UIkit.modal(deleteModalRef.current).hide();
        }
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


            <section className="shopra-dashboard-card uk-card uk-card-default">

                {isLoading ? (
                    <div className="uk-flex uk-flex-center uk-padding">
                        <div uk-spinner="ratio: 1.2" />
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
                                        <button className="uk-button uk-button-small uk-button-default" type="button" onClick={() => navigate(`/admin/administrators/${admin.id}`)}>
                                            Редактировать
                                        </button>
                                        <button className="uk-button uk-button-small uk-button-danger" type="button" onClick={() => openDeleteModal(admin)} disabled={isCurrentUser}>
                                            Удалить
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="shopra-admin-empty">
                        <p className="uk-margin-remove-bottom">Пока нет доступных администраторов.</p>
                    </div>
                )}

                {!isLoading && meta && totalPages > 1 && (
                    <ul className="uk-pagination uk-flex-center uk-margin-medium-top">
                        <li className={currentPage <= 1 ? 'uk-disabled' : ''}>
                            <button type="button" onClick={() => setSearchParams({ page: Math.max(1, currentPage - 1).toString() }, { replace: true })} disabled={currentPage <= 1}>
                                ←
                            </button>
                        </li>
                        {paginationItems.map((page, index) => (
                            <li key={`${page}-${index}`} className={page === currentPage ? 'uk-active' : ''}>
                                {page === '…' ? <span>{page}</span> : (
                                    <button type="button" onClick={() => setSearchParams({ page: page.toString() }, { replace: true })}>
                                        {page}
                                    </button>
                                )}
                            </li>
                        ))}
                        <li className={currentPage >= totalPages ? 'uk-disabled' : ''}>
                            <button type="button" onClick={() => setSearchParams({ page: Math.min(totalPages, currentPage + 1).toString() }, { replace: true })} disabled={currentPage >= totalPages}>
                                →
                            </button>
                        </li>
                    </ul>
                )}
            </section>

            {/* Edit form moved to a dedicated page: /admin/administrators/new or /admin/administrators/:id */}

            <div ref={deleteModalRef} id="delete-admin-modal" uk-modal="true">
                <div className="uk-modal-dialog uk-modal-body">
                    <h2 className="uk-modal-title">Подтвердите удаление</h2>
                    <p>{adminToDelete ? `Удалить администратора ${adminToDelete.first_name} ${adminToDelete.last_name}?` : 'Удалить администратора?'}</p>
                    <div className="uk-flex uk-flex-right">
                        <button className="uk-button uk-button-default uk-modal-close" type="button" onClick={closeDeleteModal}>Отмена</button>
                        <button className="uk-button uk-button-danger uk-margin-small-left" type="button" onClick={removeAdministrator} disabled={isDeleting}>{isDeleting ? 'Удаление…' : 'Удалить'}</button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
