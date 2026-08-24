import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/admin/Breadcrumbs';
import Loading from '../components/admin/Loading';
import Pagination from '../components/admin/Pagination';
import ProductStatusBadge from '../components/admin/ProductStatusBadge';
import SearchField from '../components/admin/SearchField';
import Summary from '../components/admin/Summary';
import { request } from '../services/api';
import CategoriesIcon from "../components/icons/CategoriesIcon";
import PlusIcon from "../components/icons/PlusIcon";
import CopyIcon from "../components/icons/CopyIcon";
import MoreIcon from "../components/icons/MoreIcon";
import AllProductsIcon from '../components/icons/AllProductsIcon';
import ActiveProductsIcon from '../components/icons/ActiveProductsIcon';
import DraftProductsIcon from '../components/icons/DraftProductsIcon';
import LowStockProductsIcon from '../components/icons/LowStockProductsIcon';

const productThumbs = [
    { gradient: 'linear-gradient(145deg,#abb093,#586048)', detailed: true },
    { gradient: 'linear-gradient(145deg,#d8a16f,#8a4c28)' },
    { gradient: 'linear-gradient(145deg,#a17b65,#4c3126)' },
    { gradient: 'linear-gradient(145deg,#b78380,#613b3b)' },
    { gradient: 'linear-gradient(145deg,#86939d,#2b3c48)' },
];

const DEFAULT_PAGE = 1;

export default function ProductsPage() {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [meta, setMeta] = useState(null);
    const [summary, setSummary] = useState({ total: 0, active: 0, draft: 0, low_stock: 0 });
    const [isSearching, setIsSearching] = useState(true);
    const currentSearch = searchParams.get('search') ?? '';
    const currentStatus = searchParams.get('status') ?? '';
    const currentStock = searchParams.get('stock') ?? '';
    const currentPage = Number(searchParams.get('page') ?? DEFAULT_PAGE);
    const currentParams = searchParams.toString();
    const selectedSummary = currentStatus === 'active' || currentStatus === 'draft'
        ? currentStatus
        : currentStock === 'low' ? 'low' : 'all';

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
    }, [currentPage, currentParams]);

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

    const setPage = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', String(page));
        setSearchParams(params, { replace: true });
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
                    <button type="button" className="button button--secondary min-h-[42px] whitespace-nowrap max-md:w-full"><CategoriesIcon />{t('common.categories')}</button>
                    <button type="button" className="button button--primary min-h-[42px] whitespace-nowrap px-[18px] max-md:w-full"><PlusIcon />{t('productsPage.addProduct')}</button>
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
                    <button type="button" className="button button--outline ml-auto min-h-[41px] whitespace-nowrap border-[#dfc0ac] bg-[#fff8f3] text-[color:var(--color-accent)] hover:border-[color:var(--color-accent)] hover:bg-[#fff3eb] max-lg:ml-0 max-lg:w-full"><CopyIcon />{t('productsPage.copyExisting')}</button>
                </div>

                <div className="data-list !p-0">
                    <div className="products-list__header min-h-[43px] items-center gap-2.5 bg-[#faf8f6] px-[15px] py-[7px] text-xs font-[720] uppercase tracking-[0.04em] text-[#8e8781]">
                        <span /><span>{t('common.product')}</span><span>{t('common.categories')}</span><span>{t('common.stock')}</span><span>{t('common.price')}</span><span>{t('common.status')}</span><span />
                    </div>
                    {isSearching ? <Loading /> : products.map((product, index) => <ProductRow key={product.id} product={product} index={index} />)}
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
        </>
    );
}

function ProductRow({ product, index }) {
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
            <button type="button" className="grid h-8 w-8 place-items-center rounded-lg border-0 bg-transparent text-[#756d67] hover:bg-[#f2ede9] max-md:col-start-4" aria-label={t('productsPage.productActions', { name: product.name })}><MoreIcon /></button>
        </div>
    );
}

function ProductThumb({ product }) {
    return <span className="relative grid h-[51px] w-12 flex-none place-items-center overflow-hidden rounded-lg" style={{ background: product.gradient }}><i className="relative h-[54%] w-[61%] rounded-[39%_39%_18%_18%] border border-[rgba(255,255,255,.42)] bg-[rgba(73,42,25,.33)] shadow-[0_8px_15px_rgba(41,24,15,.23)]">{product.detailed && <><b className="absolute -top-[31%] left-[24%] h-[42%] w-[52%] rounded-t-full border-2 border-b-0 border-[rgba(255,255,255,.38)]" /><em className="absolute left-[44%] top-[47%] h-[18%] w-[12%] rounded-sm bg-[rgba(245,204,147,.67)]" /></>}</i></span>;
}
