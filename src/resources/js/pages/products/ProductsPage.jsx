import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ActionsMenu from '../../components/admin/ActionsMenu';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import Pagination from '../../components/admin/Pagination';
import ProductStatusBadge from '../../components/admin/ProductStatusBadge';
import SearchField from '../../components/admin/SearchField';
import SearchableSelect from '../../components/admin/SearchableSelect';
import Skeleton from '../../components/admin/Skeleton';
import Summary from '../../components/admin/Summary';
import { csrf, request } from '../../services/api';
import { getShopGroups } from '../../services/shopGroups';
import CategoriesIcon from "../../components/icons/CategoriesIcon";
import PlusIcon from "../../components/icons/PlusIcon";
import CopyIcon from "../../components/icons/CopyIcon";
import PencilIcon from '../../components/icons/PencilIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import AllProductsIcon from '../../components/icons/AllProductsIcon';
import ActiveProductsIcon from '../../components/icons/ActiveProductsIcon';
import DraftProductsIcon from '../../components/icons/DraftProductsIcon';
import LowStockProductsIcon from '../../components/icons/LowStockProductsIcon';
import CategoriesModal from './CategoriesModal';

const productThumbs = [
    { gradient: 'linear-gradient(145deg,#abb093,#586048)', detailed: true },
    { gradient: 'linear-gradient(145deg,#d8a16f,#8a4c28)' },
    { gradient: 'linear-gradient(145deg,#a17b65,#4c3126)' },
    { gradient: 'linear-gradient(145deg,#b78380,#613b3b)' },
    { gradient: 'linear-gradient(145deg,#86939d,#2b3c48)' },
];

const DEFAULT_PAGE = 1;
const DEFAULT_SKELETON_ROW_COUNT = 15;

export default function ProductsPage() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [summary, setSummary] = useState({ total: 0, active: 0, draft: 0, low_stock: 0 });
    const [isSearching, setIsSearching] = useState(true);
    const [productToDelete, setProductToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [openActionsId, setOpenActionsId] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const navigate = useNavigate();
    const currentSearch = searchParams.get('search') ?? '';
    const currentStatus = searchParams.get('status') ?? '';
    const currentStock = searchParams.get('stock') ?? '';
    const currentCategoryParam = searchParams.get('category_id') ?? '';
    const currentCategoryId = /^\d+$/.test(currentCategoryParam) ? Number(currentCategoryParam) : '';
    const currentPage = Number(searchParams.get('page') ?? DEFAULT_PAGE);
    const currentParams = searchParams.toString();
    const selectedSummary = currentStatus === 'active' || currentStatus === 'draft'
        ? currentStatus
        : currentStock === 'low' ? 'low' : 'all';

    useEffect(() => {
        const controller = new AbortController();

        getShopGroups({ signal: controller.signal })
            .then((groups) => {
                if (!controller.signal.aborted) {
                    setCategoryOptions(buildCategoryOptions(groups));
                }
            })
            .catch((error) => {
                if (!controller.signal.aborted) console.error('Unable to load product categories.', error);
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!Number.isInteger(currentPage) || currentPage < 1) {
            const params = new URLSearchParams(searchParams);
            params.set('page', String(DEFAULT_PAGE));
            setSearchParams(params, { replace: true });
            return undefined;
        }

        let isActive = true;
        const params = new URLSearchParams(currentParams);
        params.set('page', String(currentPage));
        setIsSearching(true);

        request(`/api/products?${params.toString()}`)
            .then(({ data, meta: paginationMeta, summary: summaryData }) => {
                if (isActive) {
                    setProducts(data);
                    setMeta(paginationMeta);
                    setSummary(summaryData);
                }
            })
            .catch((error) => console.error(error))
            .finally(() => {
                if (isActive) setIsSearching(false);
            });

        return () => {
            isActive = false;
        };
    }, [currentPage, currentParams, reloadKey]);

    const setSearch = (search) => {
        const params = new URLSearchParams(searchParams);
        if (search) {
            params.set('search', search);
        } else {
            params.delete('search');
        }
        params.set('page', String(DEFAULT_PAGE));
        setSearchParams(params, { replace: true });
    };

    const setSummaryFilter = (filter, value) => {
        const params = new URLSearchParams(searchParams);

        params.delete('status');
        params.delete('stock');

        if (filter) {
            params.set(filter, value);
        }

        params.set('page', String(DEFAULT_PAGE));
        setSearchParams(params, { replace: true });
    };

    const setCategory = (categoryId) => {
        const params = new URLSearchParams(searchParams);
        if (categoryId === '') {
            params.delete('category_id');
        } else {
            params.set('category_id', String(categoryId));
        }
        params.set('page', String(DEFAULT_PAGE));
        setSearchParams(params, { replace: true });
    };

    const setPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        setSearchParams(params, { replace: true });
    };

    const removeProduct = async () => {
        if (!productToDelete) return;

        setIsDeleting(true);

        try {
            await csrf();
            await request(`/api/products/${productToDelete.id}`, { method: 'DELETE' });
            setProductToDelete(null);

            const targetPage = products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;

            if (targetPage !== currentPage) {
                const params = new URLSearchParams(searchParams);
                params.set('page', String(targetPage));
                setSearchParams(params, { replace: true });
            } else {
                setReloadKey((value) => value + 1);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <header className="mb-5 flex flex-wrap items-end justify-between gap-6 max-md:items-start">
                <div>
                    <Breadcrumbs className="mb-[3px]" />
                    <h1 className="m-0 text-[32px] font-[760] tracking-[-0.05em] text-[color:var(--color-primary)] max-md:text-[28px]">{t('productsPage.title')}</h1>
                    <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">{t('productsPage.description')}</p>
                </div>
                <div className="flex items-center gap-[9px] max-md:grid max-md:w-full max-md:grid-cols-[1fr_1.2fr]">
                    <button type="button" className="button button--secondary min-h-[42px] whitespace-nowrap max-md:w-full" onClick={() => setIsCategoriesOpen(true)}><CategoriesIcon />{t('common.categories')}</button>
                    <button type="button" className="button button--primary min-h-[42px] whitespace-nowrap px-[18px] max-md:w-full" onClick={() => navigate('/admin/products/new')}><PlusIcon />{t('productsPage.addProduct')}</button>
                </div>
            </header>

            <section className="mb-3 grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-4">
                <Summary icon={<AllProductsIcon />} className="border-[#ddc4b5]" iconClassName="bg-[#f9eee7] text-[color:var(--color-accent)]" active={selectedSummary === 'all'} onClick={() => setSummaryFilter()}>
                    <small className="text-xs font-bold text-[#6f6862] max-xl:text-[11px]">{t('productsPage.summary.all')}</small>
                    <strong className="row-span-2 self-center text-[25px] tracking-[-0.04em] max-sm:text-[21px]">{summary.total}</strong>
                    <em className="mt-1 truncate text-[11px] not-italic text-[#9a938d]">{t('productsPage.summary.catalog')}</em>
                </Summary>
                <Summary icon={<ActiveProductsIcon />} className="border-[color:var(--color-border)]" iconClassName="bg-[#eef8ee] text-[#2f7c4b]" active={selectedSummary === 'active'} onClick={() => setSummaryFilter('status', 'active')}>
                    <small className="text-xs font-bold text-[#6f6862] max-xl:text-[11px]">{t('productsPage.summary.active')}</small>
                    <strong className="row-span-2 self-center text-[25px] tracking-[-0.04em] max-sm:text-[21px]">{summary.active}</strong>
                    <em className="mt-1 truncate text-[11px] not-italic text-[#9a938d]">{t('productsPage.summary.visible')}</em>
                </Summary>
                <Summary icon={<DraftProductsIcon />} className="border-[color:var(--color-border)]" iconClassName="bg-[#f1eeeb] text-[#6a625b]" active={selectedSummary === 'draft'} onClick={() => setSummaryFilter('status', 'draft')}>
                    <small className="text-xs font-bold text-[#6f6862] max-xl:text-[11px]">{t('productsPage.summary.drafts')}</small>
                    <strong className="row-span-2 self-center text-[25px] tracking-[-0.04em] max-sm:text-[21px]">{summary.draft}</strong>
                    <em className="mt-1 truncate text-[11px] not-italic text-[#9a938d]">{t('productsPage.summary.awaiting')}</em>
                </Summary>
                <Summary icon={<LowStockProductsIcon />} className="border-[color:var(--color-border)]" iconClassName="bg-[#fff3e6] text-[#a75d16]" active={selectedSummary === 'low'} onClick={() => setSummaryFilter('stock', 'low')}>
                    <small className="text-xs font-bold text-[#6f6862] max-xl:text-[11px]">{t('productsPage.summary.lowStock')}</small>
                    <strong className="row-span-2 self-center text-[25px] tracking-[-0.04em] max-sm:text-[21px]">{summary.low_stock}</strong>
                    <em className="mt-1 truncate text-[11px] not-italic text-[#9a938d]">{t('productsPage.summary.check')}</em>
                </Summary>
            </section>

            <section className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[0_10px_28px_rgba(28,20,12,0.05)]">
                <div className="flex min-h-[70px] items-center gap-[9px] border-b border-[color:var(--color-border)] px-[15px] py-[13px] max-lg:grid max-lg:grid-cols-1">
                    <SearchField
                        value={currentSearch}
                        onSearch={setSearch}
                        placeholder={t('productsPage.searchPlaceholder')}
                        ariaLabel={t('productsPage.searchLabel')}
                        className="flex h-[41px] w-[min(390px,42%)] items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-white px-[11px] text-[#8a827b] focus-within:border-[#c77d56] focus-within:shadow-[0_0_0_3px_rgba(184,79,24,.07)] max-lg:w-full"
                        inputClassName="min-w-0 flex-1 border-0 bg-transparent text-[13px] outline-none"
                    />
                    <SearchableSelect
                        className="w-[240px] max-lg:w-full"
                        options={[{ value: '', label: t('productsPage.categoryFilter.all') }, ...categoryOptions]}
                        value={currentCategoryId}
                        onChange={setCategory}
                        placeholder={t('productsPage.categoryFilter.placeholder')}
                        searchPlaceholder={t('productsPage.categoryFilter.searchPlaceholder')}
                        ariaLabel={t('productsPage.categoryFilter.placeholder')}
                    />
                    <button type="button" className="button button--outline ml-auto min-h-[41px] whitespace-nowrap border-[#dfc0ac] bg-[#fff8f3] text-[color:var(--color-accent)] hover:border-[color:var(--color-accent)] hover:bg-[#fff3eb] max-lg:ml-0 max-lg:w-full"><CopyIcon />{t('productsPage.copyExisting')}</button>
                </div>

                <div className="data-list !p-0" aria-busy={isSearching}>
                    <div className="products-list__header min-h-[43px] items-center gap-2.5 bg-[#faf8f6] px-[15px] py-[7px] text-xs font-[720] uppercase tracking-[0.04em] text-[#8e8781]">
                        <span /><span>{t('common.product')}</span><span>{t('common.categories')}</span><span>{t('common.stock')}</span><span>{t('common.price')}</span><span>{t('common.status')}</span><span />
                    </div>
                    {isSearching ? <ProductsListSkeleton rowCount={products.length || meta?.per_page || DEFAULT_SKELETON_ROW_COUNT} label={t('productsPage.loading')} /> : products.map((product, index) => (
                        <ProductRow
                            key={product.id}
                            product={product}
                            index={index}
                            isActionsOpen={openActionsId === product.id}
                            onToggleActions={() => setOpenActionsId((id) => id === product.id ? null : product.id)}
                            onCloseActions={() => setOpenActionsId(null)}
                            onEdit={() => navigate(`/admin/products/${product.id}`)}
                            onDelete={() => setProductToDelete(product)}
                        />
                    ))}
                </div>

                <footer className="flex min-h-[60px] items-center justify-between gap-3 px-[15px] py-2.5 text-xs text-[#8d8680] max-md:flex-col max-md:items-start">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={meta?.last_page ?? 1}
                        from={meta?.from ?? 0}
                        to={meta?.to ?? 0}
                        total={meta?.total ?? 0}
                        onPageChange={setPage}
                    />
                </footer>
            </section>

            <ConfirmModal
                isOpen={Boolean(productToDelete)}
                title={t('productsPage.confirmDeleteTitle')}
                message={t('productsPage.confirmDeleteMessage', { name: productToDelete?.name })}
                confirmText={t('productsPage.delete')}
                cancelText={t('productsPage.cancel')}
                isLoading={isDeleting}
                variant="danger"
                onConfirm={removeProduct}
                onClose={() => setProductToDelete(null)}
            />
            <CategoriesModal isOpen={isCategoriesOpen} onClose={() => setIsCategoriesOpen(false)} />
        </>
    );
}

function buildCategoryOptions(groups) {
    const ids = new Set(groups.map((group) => group.id));
    const children = new Map();

    for (const group of groups) {
        const parentId = ids.has(group.parent_id) ? group.parent_id : null;
        if (!children.has(parentId)) children.set(parentId, []);
        children.get(parentId).push(group);
    }

    const options = [];
    const visited = new Set();
    const visit = (group, path = []) => {
        if (visited.has(group.id)) return;
        visited.add(group.id);

        const names = [...path, group.name];
        options.push({ value: group.id, label: names.join(' → ') });
        for (const child of children.get(group.id) ?? []) visit(child, names);
    };

    for (const group of children.get(null) ?? []) visit(group);
    // Preserve categories even if legacy data contains a missing parent or cycle.
    for (const group of groups) visit(group);

    return options;
}

function ProductsListSkeleton({ rowCount, label }) {
    const nameWidths = ['w-[58%]', 'w-[46%]', 'w-[67%]', 'w-[52%]', 'w-[61%]'];
    const categoryWidths = ['w-[68px]', 'w-[54px]', 'w-[82px]', 'w-[62px]'];

    return (
        <>
            <span className="sr-only" role="status">{label}</span>
            {Array.from({ length: rowCount }, (_, index) => (
                <div className="data-list__item products-list__row pointer-events-none" aria-hidden="true" key={index}>
                    <Skeleton className="h-4 w-4 rounded-[4px]" />
                    <span className="flex min-w-0 items-center gap-[11px]">
                        <Skeleton className="h-[51px] w-12 flex-none rounded-lg" />
                        <span className="flex min-w-0 flex-1 flex-col">
                            <Skeleton className={`h-[13px] max-w-[210px] ${nameWidths[index % nameWidths.length]}`} />
                            <Skeleton className="mt-[7px] h-3 w-[76px]" />
                        </span>
                    </span>
                    <Skeleton className={`h-3 ${categoryWidths[index % categoryWidths.length]}`} />
                    <Skeleton className="h-3 w-[44px]" />
                    <Skeleton className="h-[13px] w-[68px]" />
                    <Skeleton className="h-[26px] w-[82px] rounded-full max-md:col-start-3" />
                    <Skeleton className="h-8 w-8 rounded-lg max-md:col-start-4" />
                </div>
            ))}
        </>
    );
}

function ProductRow({ product, index, isActionsOpen, onToggleActions, onCloseActions, onEdit, onDelete }) {
    const { t } = useTranslation();
    const thumb = productThumbs[index % productThumbs.length];
    const categories = product.categories.map((category) => category.name).join(', ');
    const lowStock = product.quantity > 0 && product.quantity <= 3;
    const price = `${Number(product.price).toLocaleString('uk-UA')} ₴`;
    const unitShortName = product.unit?.is_system
        ? (product.unit.code ? t(`shopUnits.${product.unit.code}.shortName`) : '')
        : (product.unit?.short_name ?? '');

    return (
        <div className="data-list__item products-list__row">
            <input className="h-4 w-4 accent-[color:var(--color-accent)]" type="checkbox" aria-label={t('productsPage.selectProduct', { name: product.name })} />
            <button className="flex min-w-0 items-center gap-[11px] border-0 bg-transparent p-0 text-left" type="button">
                <ProductThumb product={thumb} />
                <span className="flex min-w-0 flex-col"><strong className="truncate text-[13px] text-[#312d29] max-md:text-xs">{product.name}</strong>
                <small className="mt-[3px] text-xs text-[#9d9690]">{product.sku}</small></span>
            </button>
            <span className="text-xs">{categories}</span>
            <span className={`text-xs ${lowStock ? 'font-[720] text-[#a95b12]' : ''}`}>{product.quantity}{unitShortName ? ` ${unitShortName}` : ''}</span>
            <strong className="text-[13px] text-[#312d29]">{price}</strong>
            <ProductStatusBadge status={product.status} />
            <ActionsMenu
                className="max-md:col-start-4"
                ariaLabel={t('productsPage.productActions', { name: product.name })}
                isOpen={isActionsOpen}
                onToggle={onToggleActions}
                actions={[
                    { label: t('productsPage.edit'), icon: <PencilIcon />, onClick: onEdit },
                    { label: t('productsPage.delete'), icon: <TrashIcon />, variant: 'danger', onClick: onDelete },
                ]}
                onClose={onCloseActions}
            />
        </div>
    );
}

function ProductThumb({ product }) {
    return <span className="relative grid h-[51px] w-12 flex-none place-items-center overflow-hidden rounded-lg" style={{ background: product.gradient }}><i className="relative h-[54%] w-[61%] rounded-[39%_39%_18%_18%] border border-[rgba(255,255,255,.42)] bg-[rgba(73,42,25,.33)] shadow-[0_8px_15px_rgba(41,24,15,.23)]">{product.detailed && <><b className="absolute -top-[31%] left-[24%] h-[42%] w-[52%] rounded-t-full border-2 border-b-0 border-[rgba(255,255,255,.38)]" /><em className="absolute left-[44%] top-[47%] h-[18%] w-[12%] rounded-sm bg-[rgba(245,204,147,.67)]" /></>}</i></span>;
}
