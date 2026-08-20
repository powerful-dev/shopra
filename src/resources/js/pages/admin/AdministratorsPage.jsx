import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import PageContainer from '../../components/admin/PageContainer';
import { csrf, request } from '../../services/api';

const DEFAULT_PAGE = 1;

function paginationItems(current, last) {
    if (last <= 7) return Array.from({ length: last }, (_, index) => index + 1);
    const pages = [1];
    if (current > 3) pages.push('…');
    for (let page = Math.max(2, current - 1); page <= Math.min(last - 1, current + 1); page += 1) pages.push(page);
    if (current < last - 2) pages.push('…');
    pages.push(last);
    return pages;
}

const PlusIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14" /><path d="M12 5v14" /></svg>;
const SearchIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>;
const MoreIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>;
const PencilIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" /><path d="m15 5 4 4" /></svg>;
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>;
const CheckIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg>;

export default function AdministratorsPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [admins, setAdmins] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [query, setQuery] = useState('');
    const [statusChangingId, setStatusChangingId] = useState(null);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openActionsId, setOpenActionsId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = Number(searchParams.get('page') ?? DEFAULT_PAGE);
    const currentAdminId = Number(window.__SHOPRA_ADMIN_ID__);
    const [availableModulesCount, setAvailableModulesCount] = useState(0);

    const loadAdmins = async (page = currentPage) => {
        setIsLoading(true);
        setMessage('');
        try {
            const payload = await request(`/api/admins?page=${page}`);
            setAdmins(payload.data ?? []);
            setMeta(payload.meta ?? null);
            setAvailableModulesCount(payload.available_modules_count ?? 0);
        } catch (error) {
            setMessage(error.message ?? 'Не удалось загрузить администраторов.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!Number.isInteger(currentPage) || currentPage < 1) {
            setSearchParams({ page: String(DEFAULT_PAGE) }, { replace: true });
            return;
        }
        loadAdmins(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (!location.state?.message) return;
        setMessage(location.state.message);
        navigate(location.pathname, { replace: true, state: {} });
    }, [location, navigate]);

    const toggleStatus = async (admin) => {
        if (admin.id === currentAdminId) {
            setMessage('Нельзя отключить собственную учётную запись.');
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
            const updated = response.data;
            setAdmins((items) => items.map((item) => item.id === admin.id ? { ...item, ...updated, is_active: Boolean(updated.is_active) } : item));
            setMessage(`Статус администратора «${updated.full_name || updated.email}» обновлён.`);
        } catch (error) {
            setMessage(error.message ?? 'Не удалось изменить статус администратора.');
        } finally {
            setStatusChangingId(null);
        }
    };

    const removeAdministrator = async () => {
        if (!adminToDelete) return;
        if (adminToDelete.id === currentAdminId) {
            setMessage('Нельзя удалить собственную учётную запись.');
            setAdminToDelete(null);
            return;
        }
        setIsDeleting(true);
        setMessage('');
        try {
            await csrf();
            await request(`/api/admins/${adminToDelete.id}`, { method: 'DELETE' });
            setAdminToDelete(null);
            const targetPage = admins.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            setSearchParams({ page: String(targetPage) }, { replace: true });
            await loadAdmins(targetPage);
            setMessage('Администратор удалён.');
        } catch (error) {
            setMessage(error.message ?? 'Не удалось удалить администратора.');
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = meta?.last_page ?? 1;
    const pages = useMemo(() => paginationItems(currentPage, totalPages), [currentPage, totalPages]);
    const filteredAdmins = useMemo(() => {
        const needle = query.trim().toLocaleLowerCase('ru');
        if (!needle) return admins;
        return admins.filter((admin) => [admin.full_name, admin.first_name, admin.last_name, admin.email]
            .filter(Boolean).some((value) => value.toLocaleLowerCase('ru').includes(needle)));
    }, [admins, query]);

    return (
        <>
            <section className="mb-5 flex flex-wrap items-end justify-between gap-6 max-md:items-start">
                <div>
                    <p className="mb-[3px] text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)]">Команда магазина</p>
                    <h1 className="m-0 text-[32px] font-[760] tracking-[-0.05em] text-[color:var(--color-primary)] max-md:text-[28px]">Администраторы</h1>
                    <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">Управляйте доступом сотрудников к разделам панели администратора.</p>
                </div>
                <button type="button" className="button button--primary min-h-[46px] whitespace-nowrap px-[18px] max-md:w-full" onClick={() => navigate('/admin/administrators/new')}><PlusIcon />Добавить администратора</button>
            </section>

            {message && (
                <div className={`alert alert--success h-[40px] mb-5 py-0 max-lg:col-span-2 max-lg:row-start-2 max-lg:justify-self-end`} role="status" aria-live="polite">
                    <span className="alert__icon"><CheckIcon /></span>
                    <span>{message}</span>
                </div>
            )}

            <section className="overflow-visible rounded-[16px] border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[var(--shadow-sm)]">
                <div className="flex items-center gap-[7px] border-b border-[#eee9e5] p-[11px] max-sm:grid max-sm:grid-cols-1">
                    <label className="flex h-[39px] min-w-0 flex-1 items-center gap-2 rounded-[9px] border border-[color:var(--color-border)] bg-white px-2 text-[#958c85] focus-within:border-[#c78661] focus-within:shadow-[0_0_0_3px_rgba(184,79,24,.06)]">
                        <SearchIcon />
                        <input type="search" className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-[#514943] outline-none" placeholder="Найти по имени или e-mail" aria-label="Найти по имени или e-mail" value={query} onChange={(event) => setQuery(event.target.value)} />
                    </label>
                </div>
                <div className="grid min-h-[43px] grid-cols-[minmax(230px,1.2fr)_minmax(220px,1fr)_minmax(210px,1fr)_100px_50px] items-center gap-[10px] rounded-t-[16px] bg-[#faf8f6] px-[15px] py-[7px] text-[12px] font-[720] uppercase tracking-[0.04em] text-[#8e8781] max-2xl:hidden">
                    <span>Имя</span><span>Доступ</span><span>E-mail</span><span>Активность</span><span className="sr-only">Действия</span>
                </div>

                {isLoading ? <Loading /> : filteredAdmins.length > 0 ? (
                    <div className="data-list data-list--uniform-typography grid !min-h-0 gap-2 bg-[#faf8f6] !p-2 md:grid-cols-2 2xl:block 2xl:gap-0 2xl:bg-transparent 2xl:!p-0" role="list">
                        {filteredAdmins.map((admin) => {
                            const isCurrentUser = admin.id === currentAdminId;
                            const displayName = admin.full_name || [admin.first_name, admin.last_name].filter(Boolean).join(' ') || admin.email;
                            const isSuperAdmin = Boolean(admin.is_superadmin);
                            const adminModules = admin.modules ?? [];
                            const hasFullAccess =
                                !isSuperAdmin &&
                                availableModulesCount > 0 &&
                                adminModules.length === availableModulesCount;

                            const modulesNames = adminModules
                                .map((module) => module.name)
                                .join(', ');
                            return (
                                <div className="data-list__item relative !min-h-[152px] !grid-cols-[minmax(0,1fr)_auto] !gap-[9px] !rounded-[10px] !border !p-[12px] max-2xl:!rounded-[10px] 2xl:!min-h-[73px] 2xl:!grid-cols-[minmax(230px,1.2fr)_minmax(220px,1fr)_minmax(210px,1fr)_100px_50px] 2xl:!gap-[10px] 2xl:!rounded-none 2xl:!border-x-0 2xl:!border-b 2xl:!border-t-0 2xl:!px-[15px] 2xl:!py-[7px]" role="listitem" key={admin.id}>
                                    <span className="flex min-w-0 flex-col"><strong className="truncate text-[13px] text-[#312d29]">{displayName}</strong><small className="mt-[3px] text-[11px] text-[#958c85]">{isCurrentUser ? 'Владелец магазина · текущий аккаунт' : 'Администратор'}</small></span>
                                    <span className="col-span-2 row-start-2 flex min-w-0 flex-col gap-[4px] max-sm:!col-start-1 max-sm:!row-start-2 2xl:col-span-1 2xl:row-auto">
                                        <span className="flex flex-wrap items-center gap-[4px]">
                                            {isCurrentUser && (
                                                <span className="status-badge status-badge--paid">
                                                    Это вы
                                                </span>
                                            )}

                                            {isSuperAdmin && (
                                                <span className="status-badge status-badge--paid">
                                                    Владелец, Полный доступ
                                                </span>
                                            )}

                                            {!isSuperAdmin && hasFullAccess && (
                                                <span className="status-badge status-badge--paid">
                                                    Полный доступ
                                                </span>
                                            )}
                                        </span>

                                        {!isSuperAdmin && !hasFullAccess && (
                                            <>
                                                <strong className="text-[12px]">
                                                    Ограниченный доступ
                                                </strong>

                                                <small className="truncate text-[11px] text-[#958c85]">
                                                    {modulesNames || 'Нет дополнительных доступов'}
                                                </small>
                                            </>
                                        )}
                                    </span>
                                    <span className="min-w-0 truncate text-[12px] text-[#5d554f] max-sm:col-start-1 max-sm:row-start-3">{admin.email}</span>
                                    <label className="switch justify-self-end max-sm:col-start-2 max-sm:row-start-3 max-sm:ml-3 max-sm:self-center 2xl:justify-self-start" aria-label={`Активность ${displayName}`}>
                                        <input className="switch__input" type="checkbox" checked={Boolean(admin.is_active)} onChange={() => toggleStatus(admin)} disabled={statusChangingId === admin.id || isCurrentUser} /><span className="switch__track" />
                                    </label>
                                    <div className="relative col-start-2 row-start-1 !w-8 justify-self-end 2xl:col-auto 2xl:row-auto">
                                        <button className="grid h-8 w-8 place-items-center rounded-lg border-0 bg-transparent text-[#756d67] hover:bg-[#f2ede9]" type="button" aria-label={`Действия ${displayName}`} aria-expanded={openActionsId === admin.id} onClick={() => setOpenActionsId((id) => id === admin.id ? null : admin.id)}><MoreIcon /></button>
                                        {openActionsId === admin.id && <ActionsMenu admin={admin} isCurrentUser={isCurrentUser} navigate={navigate} onDelete={() => { setOpenActionsId(null); setAdminToDelete(admin); setMessage(''); }} />}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : <div className="min-h-40 bg-[#faf8f6] px-4 py-12 text-center text-[12px] text-[color:var(--color-secondary)]">{query ? 'По вашему запросу ничего не найдено.' : 'Пока нет доступных администраторов.'}</div>}
            </section>

            {!isLoading && meta && totalPages > 1 && !query && <nav className="mt-5 flex justify-center" aria-label="Пагинация администраторов"><div className="pagination">
                <button className="pagination__item" type="button" onClick={() => setSearchParams({ page: String(Math.max(1, currentPage - 1)) }, { replace: true })} disabled={currentPage <= 1} aria-label="Предыдущая страница">←</button>
                {pages.map((page, index) => page === '…' ? <span className="grid h-[29px] min-w-[29px] place-items-center text-[12px] text-[color:var(--color-secondary)]" key={`ellipsis-${index}`}>…</span> : <button className={`pagination__item ${page === currentPage ? 'pagination__item--active' : ''}`} type="button" onClick={() => setSearchParams({ page: String(page) }, { replace: true })} key={page}>{page}</button>)}
                <button className="pagination__item" type="button" onClick={() => setSearchParams({ page: String(Math.min(totalPages, currentPage + 1)) }, { replace: true })} disabled={currentPage >= totalPages} aria-label="Следующая страница">→</button>
            </div></nav>}

            {adminToDelete && <DeleteModal admin={adminToDelete} isDeleting={isDeleting} onClose={() => setAdminToDelete(null)} onDelete={removeAdministrator} />}
        </>
    );
}

function Loading() {
    return <div className="flex min-h-40 items-center justify-center bg-[#faf8f6] p-8"><div className="h-7 w-7 animate-spin rounded-full border-2 border-[color:var(--color-border)] border-t-[color:var(--color-accent)]" role="status" aria-label="Загрузка" /></div>;
}

function ActionsMenu({ admin, isCurrentUser, navigate, onDelete }) {
    return <div className="absolute right-0 bottom-[calc(100%+8px)] z-30 min-w-[150px] rounded-2xl border border-[color:var(--color-border)] bg-white p-1.5 shadow-[var(--shadow-md)]">
        <button className="flex w-full items-center gap-2 rounded-[10px] border-0 bg-transparent px-3 py-2 text-left text-[12px] text-[color:var(--color-primary)] hover:bg-[#f7f3f0]" type="button" onClick={() => navigate(`/admin/administrators/${admin.id}`)}><PencilIcon /> Изменить</button>
        <button className="flex w-full items-center gap-2 rounded-[10px] border-0 bg-transparent px-3 py-2 text-left text-[12px] text-[#b7483f] hover:bg-[#f7f3f0] disabled:cursor-not-allowed disabled:opacity-40" type="button" disabled={isCurrentUser} onClick={onDelete}><TrashIcon /> Удалить</button>
    </div>;
}

function DeleteModal({ admin, isDeleting, onClose, onDelete }) {
    return <div className="fixed inset-0 z-[200] grid place-items-center bg-black/40 p-4 backdrop-blur-sm" role="presentation" onMouseDown={onClose}>
        <div className="w-full max-w-md rounded-2xl border border-[color:var(--color-border)] bg-white p-6 shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="delete-admin-title" onMouseDown={(event) => event.stopPropagation()}>
            <h2 id="delete-admin-title" className="m-0 text-xl font-bold">Подтвердите удаление</h2>
            <p className="my-4 text-sm text-[color:var(--color-secondary)]">Удалить администратора {admin.full_name || admin.email}?</p>
            <div className="flex justify-end gap-2"><button className="button button--secondary" type="button" onClick={onClose}>Отмена</button><button className="button border-[#b7483f] bg-[#b7483f] text-white hover:bg-[#9f3e36] disabled:opacity-50" type="button" onClick={onDelete} disabled={isDeleting}>{isDeleting ? 'Удаление…' : 'Удалить'}</button></div>
        </div>
    </div>;
}
