import Breadcrumbs from '../components/admin/Breadcrumbs';

const summaries = [
    { label: 'Все товары', value: '156', detail: 'В каталоге', icon: 'boxes', tone: 'border-[#ddc4b5] bg-[#f9eee7] text-[color:var(--color-accent)]' },
    { label: 'Активные', value: '142', detail: 'Видны покупателям', icon: 'active', tone: 'border-[color:var(--color-border)] bg-[#eef8ee] text-[#2f7c4b]' },
    { label: 'Черновики', value: '6', detail: 'Ждут публикации', icon: 'draft', tone: 'border-[color:var(--color-border)] bg-[#f1eeeb] text-[#6a625b]' },
    { label: 'Мало на складе', value: '8', detail: 'Нужно проверить', icon: 'clock', tone: 'border-[color:var(--color-border)] bg-[#fff3e6] text-[#a75d16]' },
];

const products = [
    { name: 'Кожаный рюкзак FOREST', sku: 'SH-0001', category: 'Рюкзаки', stock: '12 шт.', price: '5 490 ₴', status: 'Активен', statusTone: 'active', gradient: 'linear-gradient(145deg,#abb093,#586048)', detailed: true },
    { name: 'Сумка через плечо ALICE', sku: 'SH-0002', category: 'Сумки', stock: '7 шт.', price: '3 850 ₴', status: 'Активен', statusTone: 'active', gradient: 'linear-gradient(145deg,#d8a16f,#8a4c28)' },
    { name: 'Мессенджер HUNTER', sku: 'SH-0003', category: 'Мессенджеры', stock: '2 шт.', price: '4 690 ₴', status: 'Заканчивается', statusTone: 'low', gradient: 'linear-gradient(145deg,#a17b65,#4c3126)', lowStock: true },
    { name: 'Мини-рюкзак HANNA', sku: 'SH-0004', category: 'Рюкзаки', stock: '5 шт.', price: '3 290 ₴', status: 'Активен', statusTone: 'active', gradient: 'linear-gradient(145deg,#b78380,#613b3b)' },
    { name: 'Сумка для ноутбука RALPH', sku: 'SH-0005', category: 'Для ноутбука', stock: '0 шт.', price: '5 150 ₴', status: 'Черновик', statusTone: 'draft', gradient: 'linear-gradient(145deg,#86939d,#2b3c48)' },
];

const productGrid = 'grid-cols-[25px_minmax(245px,1.6fr)_minmax(100px,.75fr)_80px_95px_105px_34px] max-lg:grid-cols-[24px_minmax(210px,1.4fr)_90px_82px_100px_32px] max-md:grid-cols-[20px_minmax(0,1fr)_auto_31px]';
const productRowGrid = '!grid-cols-[25px_minmax(245px,1.6fr)_minmax(100px,.75fr)_80px_95px_105px_34px] max-lg:!grid-cols-[24px_minmax(210px,1.4fr)_90px_82px_100px_32px] max-md:!grid-cols-[20px_minmax(0,1fr)_auto_31px]';

export default function ProductsPage() {
    return (
        <>
            <header className="mb-5 flex flex-wrap items-end justify-between gap-6 max-md:items-start">
                <div>
                    <Breadcrumbs className="mb-[3px]" />
                    <h1 className="m-0 text-[32px] font-[760] tracking-[-0.05em] text-[color:var(--color-primary)] max-md:text-[28px]">Товары</h1>
                    <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">Все товары, остатки и цены — в одном месте.</p>
                </div>
                <div className="flex items-center gap-[9px] max-md:grid max-md:w-full max-md:grid-cols-[1fr_1.2fr]">
                    <button type="button" className="button button--secondary min-h-[42px] whitespace-nowrap max-md:w-full"><CategoriesIcon />Категории</button>
                    <button type="button" className="button button--primary min-h-[42px] whitespace-nowrap px-[18px] max-md:w-full"><PlusIcon />Добавить товар</button>
                </div>
            </header>

            <section className="mb-3 grid grid-cols-2 gap-2 sm:gap-2.5 xl:grid-cols-4">
                {summaries.map((summary) => <SummaryCard key={summary.label} {...summary} />)}
            </section>

            <section className="overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[rgba(255,255,255,.95)] shadow-[0_10px_28px_rgba(28,20,12,0.05)]">
                <div className="flex min-h-[70px] items-center gap-[9px] border-b border-[color:var(--color-border)] px-[15px] py-[13px] max-lg:grid max-lg:grid-cols-1">
                    <label className="flex h-[41px] w-[min(390px,42%)] items-center gap-2 rounded-[10px] border border-[color:var(--color-border)] bg-white px-[11px] text-[#8a827b] focus-within:border-[#c77d56] focus-within:shadow-[0_0_0_3px_rgba(184,79,24,.07)] max-lg:w-full">
                        <SearchIcon /><input className="min-w-0 flex-1 border-0 bg-transparent text-[13px] outline-none" type="search" placeholder="Найти товар…" aria-label="Найти товар" />
                    </label>
                    <button type="button" className="button button--outline ml-auto min-h-[41px] whitespace-nowrap border-[#dfc0ac] bg-[#fff8f3] text-[color:var(--color-accent)] hover:border-[color:var(--color-accent)] hover:bg-[#fff3eb] max-lg:ml-0 max-lg:w-full"><CopyIcon />Создать на основе существующего товара</button>
                </div>

                <div className="data-list !p-0">
                    <div className={`grid min-h-[43px] ${productGrid} items-center gap-2.5 bg-[#faf8f6] px-[15px] py-[7px] text-xs font-[720] uppercase tracking-[0.04em] text-[#8e8781] max-lg:[&>*:nth-child(3)]:hidden max-md:hidden`}>
                        <span /><span>Товар</span><span>Категория</span><span>Остаток</span><span>Цена</span><span>Статус</span><span />
                    </div>
                    {products.map((product) => <ProductRow key={product.sku} product={product} />)}
                </div>

                <footer className="flex min-h-[60px] items-center justify-between gap-3 px-[15px] py-2.5 text-xs text-[#8d8680] max-md:flex-col max-md:items-start">
                    <span>Показано 5 из 156 товаров</span>
                    <nav className="pagination max-w-full overflow-x-auto" aria-label="Навигация по страницам">
                        <PaginationButton disabled>Назад</PaginationButton><PaginationButton active>1</PaginationButton><PaginationButton>2</PaginationButton><PaginationButton>3</PaginationButton><span aria-hidden="true">…</span><PaginationButton>16</PaginationButton><PaginationButton>Далее</PaginationButton>
                    </nav>
                </footer>
            </section>
        </>
    );
}

function SummaryCard({ label, value, detail, icon, tone }) {
    const [border, background, color] = tone.split(' ');
    return (
        <article className={`flex min-h-[102px] items-center gap-3 rounded-[14px] border bg-[rgba(255,255,255,.92)] p-3.5 text-left shadow-[0_8px_26px_rgba(70,47,31,.035)] max-sm:min-h-[92px] max-sm:gap-2 max-sm:px-[9px] max-sm:py-[11px] ${border}`}>
            <span className={`grid h-10 w-10 flex-none place-items-center rounded-[11px] max-sm:h-[34px] max-sm:w-[34px] ${background} ${color}`}><SummaryIcon type={icon} /></span>
            <div className="grid min-w-0 flex-1 grid-cols-[1fr_auto] items-end"><small className="text-xs font-bold text-[#6f6862] max-xl:text-[11px]">{label}</small><strong className="row-span-2 self-center text-[25px] tracking-[-0.04em] max-sm:text-[21px]">{value}</strong><em className="mt-1 truncate text-[11px] not-italic text-[#9a938d]">{detail}</em></div>
        </article>
    );
}

function ProductRow({ product }) {
    const status = product.statusTone === 'active' ? 'bg-[#eef8ee] text-[#2f7c4b]' : product.statusTone === 'low' ? 'bg-[#fff2e4] text-[#a95b12]' : 'bg-[#f0edeb] text-[#6c655f]';
    return (
        <div className={`data-list__item !min-h-[73px] ${productRowGrid} !gap-[10px] !rounded-none !px-[15px] !py-[7px] max-lg:[&>*:nth-child(3)]:hidden max-md:!min-h-[86px] max-md:!gap-2 max-md:!px-[10px] max-md:!py-2 max-md:[&>*:nth-child(4)]:hidden max-md:[&>*:nth-child(5)]:hidden`}>
            <input className="h-4 w-4 accent-[color:var(--color-accent)]" type="checkbox" aria-label={`Выбрать ${product.name}`} />
            <button className="flex min-w-0 items-center gap-[11px] border-0 bg-transparent p-0 text-left" type="button">
                <ProductThumb product={product} />
                <span className="flex min-w-0 flex-col"><strong className="truncate text-[13px] text-[#312d29] max-md:text-xs">{product.name}</strong><small className="mt-[3px] text-xs text-[#9d9690]">SKU: {product.sku}</small></span>
            </button>
            <span className="text-xs">{product.category}</span><span className={`text-xs ${product.lowStock ? 'font-[720] text-[#a95b12]' : ''}`}>{product.stock}</span><strong className="text-[13px] text-[#312d29]">{product.price}</strong>
            <span className={`inline-flex w-fit items-center gap-[5px] rounded-full px-2 py-[5px] text-xs font-[720] before:h-[5px] before:w-[5px] before:rounded-full before:bg-current before:content-[''] max-md:col-start-3 ${status}`}>{product.status}</span>
            <button type="button" className="grid h-8 w-8 place-items-center rounded-lg border-0 bg-transparent text-[#756d67] hover:bg-[#f2ede9] max-md:col-start-4" aria-label={`Действия ${product.name}`}><MoreIcon /></button>
        </div>
    );
}

function ProductThumb({ product }) {
    return <span className="relative grid h-[51px] w-12 flex-none place-items-center overflow-hidden rounded-lg" style={{ background: product.gradient }}><i className="relative h-[54%] w-[61%] rounded-[39%_39%_18%_18%] border border-[rgba(255,255,255,.42)] bg-[rgba(73,42,25,.33)] shadow-[0_8px_15px_rgba(41,24,15,.23)]">{product.detailed && <><b className="absolute -top-[31%] left-[24%] h-[42%] w-[52%] rounded-t-full border-2 border-b-0 border-[rgba(255,255,255,.38)]" /><em className="absolute left-[44%] top-[47%] h-[18%] w-[12%] rounded-sm bg-[rgba(245,204,147,.67)]" /></>}</i></span>;
}

function PaginationButton({ children, active = false, disabled = false }) { return <button type="button" disabled={disabled} aria-current={active ? 'page' : undefined} className={`pagination__item${active ? ' pagination__item--active' : ''}`}>{children}</button>; }

const svgProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };
function CategoriesIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" {...svgProps}><path d="M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1ZM20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1ZM3 5a2 2 0 0 0 2 2h3M3 3v13a2 2 0 0 0 2 2h3" /></svg>; }
function PlusIcon() { return <svg width="18" height="18" viewBox="0 0 24 24" {...svgProps}><path d="M5 12h14M12 5v14" /></svg>; }
function SearchIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" {...svgProps}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>; }
function CopyIcon() { return <svg width="15" height="15" viewBox="0 0 24 24" {...svgProps}><rect width="14" height="14" x="8" y="8" rx="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>; }
function MoreIcon() { return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>; }
function SummaryIcon({ type }) {
    if (type === 'boxes') return <svg width="18" height="18" viewBox="0 0 24 24" {...svgProps}><path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42ZM7 16.5l-4.74-2.85M7 16.5l5-3M7 16.5v5.17M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3ZM17 16.5l-5-3M17 16.5l4.74-2.85M17 16.5v5.17M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8ZM12 8 7.26 5.15M12 8l4.74-2.85M12 13.5V8" /></svg>;
    if (type === 'active') return <svg width="18" height="18" viewBox="0 0 24 24" {...svgProps}><path d="m16 16 2 2 4-4M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14M7.5 4.27l9 5.15M3.29 7 12 12l8.71-5M12 22V12" /></svg>;
    if (type === 'draft') return <svg width="18" height="18" viewBox="0 0 24 24" {...svgProps}><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7ZM14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8" /></svg>;
    return <svg width="18" height="18" viewBox="0 0 24 24" {...svgProps}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4.5.01" /></svg>;
}
