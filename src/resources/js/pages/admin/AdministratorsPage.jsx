import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import { csrf, request } from '../../services/api';
import ActionsMenu from '../../components/admin/ActionsMenu';
import PageLoader from '../../components/admin/PageLoader';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Pagination from '../../components/admin/Pagination';
import Loading from '../../components/admin/Loading';
import PlusIcon from '../../components/icons/PlusIcon';
import SearchIcon from '../../components/icons/SearchIcon';
import MoreIcon from '../../components/icons/MoreIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import PencilIcon from '../../components/icons/PencilIcon';
import TrashIcon from '../../components/icons/TrashIcon';

const DEFAULT_PAGE = 1;

export default function AdministratorsPage() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [admins, setAdmins] = useState([]);
    const [meta, setMeta] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [message, setMessage] = useState('');
    const currentSearch = searchParams.get('search') ?? '';
    const [query, setQuery] = useState(currentSearch);
    const [statusChangingId, setStatusChangingId] = useState(null);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openActionsId, setOpenActionsId] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentPage = Number(searchParams.get('page') ?? DEFAULT_PAGE);
    const currentAdminId = Number(window.__SHOPRA_ADMIN_ID__);
    const [availableModulesCount, setAvailableModulesCount] = useState(0);
    const isInitialLoad = useRef(true);

    const loadAdmins = async (page = currentPage, search = currentSearch, initial = false) => {
        if (initial) {
            setIsLoading(true);
        } else {
            setIsSearching(true);
        }
        setMessage('');
        try {
            const params = new URLSearchParams({ page: String(page) });
            if (search) params.set('search', search);
            const payload = await request(`/api/admins?${params.toString()}`);
            setAdmins(payload.data ?? []);
            setMeta(payload.meta ?? null);
            setAvailableModulesCount(payload.available_modules_count ?? 0);
        } catch (error) {
            setMessage(error.message ?? t('administratorsPage.loadError'));
        } finally {
            if (initial) {
                isInitialLoad.current = false;
                setIsLoading(false);
            } else {
                setIsSearching(false);
            }
        }
    };

    useEffect(() => {
        if (!Number.isInteger(currentPage) || currentPage < 1) {
            const params = new URLSearchParams(searchParams);
            params.set('page', String(DEFAULT_PAGE));
            setSearchParams(params, { replace: true });
            return;
        }
        const initial = isInitialLoad.current;
        loadAdmins(currentPage, currentSearch, initial);
    }, [currentPage, currentSearch]);

    useEffect(() => {
        setQuery(currentSearch);
    }, [currentSearch]);

    useEffect(() => {
        if (query === currentSearch) return undefined;

        const timeoutId = window.setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            const search = query.trim();
            if (search) {
                params.set('search', search);
            } else {
                params.delete('search');
            }
            params.set('page', String(DEFAULT_PAGE));
            setSearchParams(params, { replace: true });
        }, 700);

        return () => window.clearTimeout(timeoutId);
    }, [query, currentSearch, searchParams, setSearchParams]);

    useEffect(() => {
        if (!location.state?.message) return;
        setMessage(location.state.message);
        navigate(location.pathname, { replace: true, state: {} });
    }, [location, navigate]);

    const toggleStatus = async (admin) => {
        if (admin.id === currentAdminId || admin.is_super_admin) {
            setMessage(t('administratorsPage.cannotDisableSelf'));
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
            setMessage(t('administratorsPage.statusUpdated', { name: updated.full_name || updated.email }));
        } catch (error) {
            setMessage(error.message ?? t('administratorsPage.statusUpdateError'));
        } finally {
            setStatusChangingId(null);
        }
    };

    const removeAdministrator = async () => {
        if (!adminToDelete) return;
        if (adminToDelete.id === currentAdminId) {
            setMessage(t('administratorsPage.cannotDeleteSelf'));
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
            const params = new URLSearchParams(searchParams);
            params.set('page', String(targetPage));
            setSearchParams(params, { replace: true });
            await loadAdmins(targetPage, currentSearch);
            setMessage(t('administratorsPage.deleted'));
        } catch (error) {
            setMessage(error.message ?? t('administratorsPage.deleteError'));
        } finally {
            setIsDeleting(false);
        }
    };

    const totalPages = meta?.last_page ?? 1;

    const setPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        setSearchParams(params, { replace: true });
    };

    if (isLoading) {
        return <PageLoader />;
    }

    return (
        <>
            <section className="mb-5 flex flex-wrap items-end justify-between gap-6 max-md:items-start">
                <div>
                    <Breadcrumbs className="mb-[3px]" />
                    <h1 className="m-0 text-[32px] font-[760] tracking-[-0.05em] text-[color:var(--color-primary)] max-md:text-[28px]">{t('administratorsPage.title')}</h1>
                    <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">{t('administratorsPage.description')}</p>
                </div>
                <button type="button" className="button button--primary min-h-[46px] whitespace-nowrap px-[18px] max-md:w-full" onClick={() => navigate('/admin/administrators/new')}><PlusIcon />{t('administratorsPage.addAdministrator')}</button>
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
                        <input type="search" className="min-w-0 flex-1 border-0 bg-transparent text-[11px] text-[#514943] outline-none" placeholder={t('administratorsPage.search')} aria-label={t('administratorsPage.search')} value={query} onChange={(event) => setQuery(event.target.value)} />
                    </label>
                </div>
                <div className="grid min-h-[43px] grid-cols-[minmax(230px,1.2fr)_minmax(220px,1fr)_minmax(210px,1fr)_100px_50px] items-center gap-[10px] rounded-t-[16px] bg-[#faf8f6] px-[15px] py-[7px] text-[12px] font-[720] uppercase tracking-[0.04em] text-[#8e8781] max-2xl:hidden">
                    <span>{t('administratorsPage.name')}</span><span>{t('administratorsPage.access')}</span><span>{t('administratorsPage.email')}</span><span>{t('administratorsPage.activity')}</span><span className="sr-only">{t('administratorsPage.actions')}</span>
                </div>

                {isSearching ? <Loading /> : admins.length > 0 ? (
                    <div className="data-list data-list--uniform-typography grid !min-h-0 gap-2 bg-[#faf8f6] !p-2 md:grid-cols-2 2xl:block 2xl:gap-0 2xl:bg-transparent 2xl:!p-0" role="list">
                        {admins.map((admin) => {
                            const isCurrentUser = admin.id === currentAdminId;
                            const displayName = admin.full_name || [admin.first_name, admin.last_name].filter(Boolean).join(' ') || admin.email;
                            const isSuperAdmin = Boolean(admin.is_superadmin);
                            const adminModules = admin.modules ?? [];
                            const hasFullAccess =
                                !isSuperAdmin &&
                                availableModulesCount > 0 &&
                                adminModules.length === availableModulesCount;

                            const modulesNames = adminModules
                                .map((module) => t(`modules.${module.code}`))
                                .join(', ');
                            return (
                                <div className="data-list__item relative !min-h-[152px] !grid-cols-[minmax(0,1fr)_auto] !gap-[9px] !rounded-[10px] !border !p-[12px] max-2xl:!rounded-[10px] 2xl:!min-h-[73px] 2xl:!grid-cols-[minmax(230px,1.2fr)_minmax(220px,1fr)_minmax(210px,1fr)_100px_50px] 2xl:!gap-[10px] 2xl:!rounded-none 2xl:!border-x-0 2xl:!border-b 2xl:!border-t-0 2xl:!px-[15px] 2xl:!py-[7px]" role="listitem" key={admin.id}>
                                    <span className="flex min-w-0 flex-col"><strong className="truncate text-[13px] text-[#312d29]">{displayName}</strong><small className="mt-[3px] text-[11px] text-[#958c85]">{isCurrentUser ? t('administratorsPage.currentUserRole') : t('administratorsPage.administratorRole')}</small></span>
                                    <span className="col-span-2 row-start-2 flex min-w-0 flex-col gap-[4px] max-sm:!col-start-1 max-sm:!row-start-2 2xl:col-span-1 2xl:row-auto">
                                        <span className="flex flex-wrap items-center gap-[4px]">
                                            {isCurrentUser && (
                                                <span className="status-badge status-badge--paid">
                                                    {t('administratorsPage.you')}
                                                </span>
                                            )}

                                            {isSuperAdmin && (
                                                <span className="status-badge status-badge--paid">
                                                    {t('administratorsPage.ownerFullAccess')}
                                                </span>
                                            )}

                                            {!isSuperAdmin && hasFullAccess && (
                                                <span className="status-badge status-badge--paid">
                                                    {t('administratorsPage.fullAccess')}
                                                </span>
                                            )}
                                        </span>

                                        {!isSuperAdmin && !hasFullAccess && (
                                            <>
                                                <strong className="text-[12px]">
                                                    {t('administratorsPage.limitedAccess')}
                                                </strong>

                                                <small className="truncate text-[11px] text-[#958c85]">
                                                    {modulesNames || t('administratorsPage.noAdditionalAccess')}
                                                </small>
                                            </>
                                        )}
                                    </span>
                                    <span className="min-w-0 truncate text-[12px] text-[#5d554f] max-sm:col-start-1 max-sm:row-start-3">{admin.email}</span>
                                    <label className="switch justify-self-end max-sm:col-start-2 max-sm:row-start-3 max-sm:ml-3 max-sm:self-center 2xl:justify-self-start" aria-label={t('administratorsPage.activityLabel', { name: displayName })}>
                                        <input 
                                            className="switch__input" 
                                            type="checkbox" 
                                            checked={Boolean(admin.is_active)} 
                                            onChange={() => toggleStatus(admin)} 
                                            disabled={
                                                statusChangingId === admin.id ||
                                                isCurrentUser ||
                                                isSuperAdmin
                                            } />
                                        <span className="switch__track" />
                                    </label>

                                    {(!isSuperAdmin || isCurrentUser) && (
                                        <div className="relative col-start-2 row-start-1 !w-8 justify-self-end 2xl:col-auto 2xl:row-auto">
                                            <button
                                                className="grid h-8 w-8 place-items-center rounded-lg border-0 bg-transparent text-[#756d67] hover:bg-[#f2ede9]"
                                                type="button"
                                                aria-label={t('administratorsPage.actionsLabel', { name: displayName })}
                                                aria-expanded={openActionsId === admin.id}
                                                onClick={() =>
                                                    setOpenActionsId((id) =>
                                                        id === admin.id ? null : admin.id
                                                    )
                                                }
                                            >
                                                <MoreIcon />
                                            </button>

                                            {openActionsId === admin.id && (
                                                <ActionsMenu
                                                    actions={[
                                                        {
                                                            label: t('administratorsPage.edit'),
                                                            icon: <PencilIcon />,
                                                            onClick: () => navigate(`/admin/administrators/${admin.id}`),
                                                        },
                                                        {
                                                            label: t('administratorsPage.delete'),
                                                            icon: <TrashIcon />,
                                                            variant: 'danger',
                                                            disabled: isCurrentUser,
                                                            onClick: () => {
                                                                setAdminToDelete(admin);
                                                                setMessage('');
                                                            },
                                                        },
                                                    ]}
                                                    onClose={() => setOpenActionsId(null)}
                                                />
                                            )}
                                        </div>
                                    )}

                                </div>
                            );
                        })}
                    </div>
                ) : <div className="min-h-40 bg-[#faf8f6] px-4 py-12 text-center text-[12px] text-[color:var(--color-secondary)]">{query ? t('administratorsPage.noSearchResults') : t('administratorsPage.empty')}</div>}

                <footer className="flex min-h-[60px] items-center justify-end gap-3 px-[15px] py-2.5 text-xs text-[#8d8680]">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </footer>
            </section>

            <ConfirmModal
                isOpen={Boolean(adminToDelete)}
                title={t('administratorsPage.confirmDeleteTitle')}
                message={t('administratorsPage.confirmDeleteMessage', { name: adminToDelete?.full_name || adminToDelete?.email })}
                confirmText={t('administratorsPage.delete')}
                cancelText={t('administratorsPage.cancel')}
                isLoading={isDeleting}
                variant="danger"
                onConfirm={removeAdministrator}
                onClose={() => setAdminToDelete(null)}
            />
        </>
    );
}
