import { useEffect, useRef } from 'react';
import { initStatisticsChart } from './statisticsChart';
import Breadcrumbs from '../components/admin/Breadcrumbs';

export default function AnalyticsPage() {
    const chartRef = useRef(null);

    useEffect(() => {
        const destroy = initStatisticsChart(chartRef.current);

        return () => {
            destroy?.();
        };
    }, []);

    const kpis = [
        {
            type: 'revenue',
            label: 'Выручка',
            value: '27 430 ₴',
            delta: '+8% к прошлому периоду',
            active: true,
            icon: <RevenueIcon />,
            iconClassName: 'bg-[#f9eee7] text-[color:var(--color-accent)]',
        },
        {
            type: 'orders',
            label: 'Заказы',
            value: '8',
            delta: '+9% к прошлому периоду',
            icon: <CartIcon />,
            iconClassName: 'bg-[#eef8ee] text-[#2e8b45]',
        },
        {
            type: 'visits',
            label: 'Посещения',
            value: '246',
            delta: '+14% к прошлому периоду',
            icon: <UsersIcon />,
            iconClassName: 'bg-[#eaf0f8] text-[#42658e]',
        },
    ];

    const productColumns = [
        {
            label: 'Просмотры',
            icon: <EyeIcon />,
        },
        {
            label: 'Избранное',
            icon: <HeartIcon />,
        },
        {
            label: 'В корзину',
            icon: <CartIcon width={13} height={13} />,
        },
        {
            label: 'Продано',
            icon: <BoxIcon />,
        },
        {
            label: 'Выручка',
            icon: <RevenueIcon width={13} height={13} />,
        },
        {
            label: 'Конверсия',
            icon: <PercentIcon width={13} height={13} />,
        },
    ];

    return (
        <>
            <section className="mb-5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                    
                    <Breadcrumbs className="mb-[3px]" />

                    <h1 className="m-0 truncate text-[32px] font-[760] tracking-[-0.05em] max-lg:text-[19px]">
                        Статистика
                    </h1>

                    <p className="mt-[5px] text-[13px] text-[color:var(--color-secondary)]">
                        Продажи, эффективность скидок и популярность товаров за один период.
                    </p>
                </div>
            </section>

            <section
                className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[color:var(--color-border)] bg-white p-3 shadow-[var(--shadow-sm)] max-md:flex-col max-md:items-stretch"
                aria-label="Выбор периода"
            >
                <div
                    className="flex gap-1 rounded-[9px] bg-[#efebe7] p-1 max-sm:overflow-x-auto"
                    data-statistics-periods
                >
                    <PeriodButton
                        value="today"
                        label="Сегодня"
                        active
                    />

                    <PeriodButton
                        value="7"
                        label="7 дней"
                    />

                    <PeriodButton
                        value="30"
                        label="30 дней"
                    />

                    <PeriodButton
                        value="year"
                        label="Этот год"
                    />
                </div>

                <div
                    className="ml-auto flex flex-wrap items-center gap-[6px] max-md:ml-0 max-sm:grid max-sm:grid-cols-[1fr_auto_1fr]"
                    data-custom-period
                >
                    <DateField
                        label="От"
                        value="2026-07-03"
                        dataAttribute="data-date-from"
                    />

                    <i className="text-[11px] not-italic text-[#aaa19a]">
                        —
                    </i>

                    <DateField
                        label="До"
                        value="2026-08-01"
                        dataAttribute="data-date-to"
                    />

                    <button
                        type="button"
                        className="min-h-[38px] rounded-[9px] border border-[color:var(--color-accent)] bg-[color:var(--color-accent)] px-3 text-[11px] font-bold text-white max-sm:col-span-3"
                        data-period="custom"
                        aria-pressed="false"
                    >
                        Показать
                    </button>
                </div>
            </section>

            <section
                className="mb-3 grid grid-cols-2 gap-[10px] xl:grid-cols-4"
                data-statistics-kpis
            >
                {kpis.map((item) => (
                    <KpiCard
                        key={item.type}
                        {...item}
                    />
                ))}

                <article className="flex min-h-[102px] items-center gap-3 rounded-[14px] border border-[color:var(--color-border)] bg-white p-[14px] shadow-[0_8px_26px_rgba(70,47,31,.035)]">
                    <span className="grid h-10 w-10 flex-none place-items-center rounded-[11px] bg-[#f1eeeb] text-[#6a625b]">
                        <PercentIcon />
                    </span>

                    <span className="flex flex-col">
                        <small className="text-[12px] font-bold text-[#6f6862]">
                            Конверсия
                        </small>

                        <strong
                            className="mt-1 text-[23px]"
                            data-kpi="conversion"
                        >
                            3,3%
                        </strong>

                        <em className="mt-1 text-[11px] not-italic text-[#9a938d]">
                            Из посещения в заказ
                        </em>
                    </span>
                </article>
            </section>

            <section className="mb-3 overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                <header className="flex items-end justify-between border-b border-[color:var(--color-border)] px-[18px] py-[15px]">
                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.09em] text-[color:var(--color-accent)]">
                            Динамика
                        </p>

                        <h2
                            className="mb-0 mt-1 text-[20px]"
                            data-chart-title
                        >
                            Выручка
                        </h2>
                    </div>

                    <strong
                        className="text-[18px]"
                        data-chart-total
                    >
                        27 430 ₴
                    </strong>
                </header>

                <div
                    ref={chartRef}
                    className="h-[330px] w-full p-3 max-sm:h-[280px]"
                    role="img"
                    aria-label="График статистики"
                />
            </section>

            <section className="mb-3 overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                <header className="flex min-h-[91px] items-center justify-between gap-[18px] border-b border-[color:var(--color-border)] p-[15px_17px] max-sm:flex-col max-sm:items-start">
                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.09em] text-[color:var(--color-accent)]">
                            Скидки и распродажи
                        </p>

                        <h2 className="mb-0 mt-[3px] text-[16px] font-[760]">
                            Эффективность промо-акций
                        </h2>

                        <p className="mb-0 mt-[2px] text-[11px] text-[color:var(--color-secondary)]">
                            Все распродажи, промокоды и автоматические предложения за выбранный период.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-[10px] bg-[#fff5ee] px-[11px] py-[9px] text-[color:var(--color-accent)] max-sm:w-full">
                        <PromoIcon />

                        <span className="flex flex-col">
                            <small className="text-[11px] text-[#8d8179]">
                                Продажи со скидкой
                            </small>

                            <strong className="mt-px text-[12px] font-bold text-[#5a4f48]">
                                137 960 ₴
                            </strong>
                        </span>
                    </div>
                </header>

                <div
                    className="flex gap-1 overflow-x-auto border-b border-[#eee9e5] p-[8px_10px]"
                    data-promo-filters
                >
                    <PromoFilter
                        value="all"
                        label="Все"
                        active
                    />

                    <PromoFilter
                        value="sale"
                        label="Распродажи"
                    />

                    <PromoFilter
                        value="offer"
                        label="Предложения"
                    />

                    <PromoFilter
                        value="promo"
                        label="Промокоды"
                    />
                </div>

                <div className="overflow-x-auto max-md:overflow-x-visible">
                    <div
                        className="data-list min-w-[790px] !p-0 max-md:min-w-0"
                        role="table"
                        aria-label="Эффективность промо-акций"
                    >
                        <div
                            className="grid min-h-[37px] grid-cols-[38px_minmax(215px,1.4fr)_65px_105px_50px_95px_78px] items-center gap-2 bg-[#faf8f6] px-[15px] text-left text-[11px] font-[720] uppercase tracking-[.04em] text-[#948c85] max-md:hidden"
                            role="row"
                        >
                            <span
                                className="col-span-2"
                                role="columnheader"
                            >
                                Название
                            </span>

                            <span role="columnheader">
                                Скидка
                            </span>

                            <span role="columnheader">
                                Результат
                            </span>

                            <span role="columnheader">
                                Заказы
                            </span>

                            <span role="columnheader">
                                Выручка
                            </span>

                            <span role="columnheader">
                                Статус
                            </span>
                        </div>

                        <div
                            data-promo-rows
                            role="rowgroup"
                        />
                    </div>
                </div>
            </section>

            <section className="mb-8 overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                <header className="flex items-center justify-between gap-4 border-b border-[color:var(--color-border)] p-[15px] max-md:flex-col max-md:items-stretch">
                    <div>
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.09em] text-[color:var(--color-accent)]">
                            Товары
                        </p>

                        <h2 className="mb-0 mt-1 text-[20px] font-[760]">
                            По популярности
                        </h2>

                        <p className="mb-0 mt-1 text-[11px] text-[color:var(--color-secondary)]">
                            Что чаще смотрят, сохраняют и покупают.
                        </p>
                    </div>

                    <div className="flex gap-2 max-sm:flex-col">
                        <label className="flex h-[38px] items-center gap-2 rounded-[9px] border border-[color:var(--color-border)] px-3 focus-within:border-[#c78661]">
                            <SearchIcon />

                            <input
                                className="border-0 bg-transparent text-[11px] outline-none"
                                placeholder="Найти товар…"
                                data-product-search
                            />
                        </label>

                        <select
                            className="form-control h-[38px] rounded-[9px] px-3 text-[11px]"
                            data-product-sort
                            defaultValue="orders"
                        >
                            <option value="orders">
                                По продажам
                            </option>
                            <option value="revenue">
                                По выручке
                            </option>
                            <option value="views">
                                По просмотрам
                            </option>
                            <option value="favorites">
                                По избранному
                            </option>
                        </select>
                    </div>
                </header>

                <div className="overflow-x-auto max-md:overflow-x-visible">
                    <div className="data-list min-w-[940px] !p-0 max-md:min-w-0">
                        <div className="grid min-h-[38px] grid-cols-[24px_45px_minmax(205px,1.5fr)_repeat(4,minmax(70px,.55fr))_minmax(95px,.7fr)_65px] items-center gap-2 bg-[#faf8f6] px-[15px] text-left text-[11px] font-[720] uppercase tracking-[.04em] text-[#948c85] max-md:hidden">
                            <span aria-hidden="true" />
                            <span aria-hidden="true" />

                            <span>
                                Товар
                            </span>

                            {productColumns.map((column) => (
                                <ProductColumn
                                    key={column.label}
                                    {...column}
                                />
                            ))}
                        </div>

                        <div data-product-rows />
                    </div>
                </div>

                <footer className="flex min-h-[55px] items-center justify-between px-4 text-[11px] text-[#8d8680] max-sm:flex-col max-sm:items-start max-sm:justify-center max-sm:gap-2">
                    <span>
                        Показано 5 из 86 товаров
                    </span>

                    <button
                        type="button"
                        className="font-bold text-[color:var(--color-accent)]"
                    >
                        Показать все товары ↗
                    </button>
                </footer>
            </section>
        </>
    );
}

function PeriodButton({
    value,
    label,
    active = false,
}) {
    return (
        <button
            type="button"
            className={[
                'min-h-[34px] flex-none rounded-[7px] px-3 text-[11px] font-bold',
                active
                    ? 'bg-white text-[color:var(--color-accent)] shadow-[0_2px_7px_rgba(59,40,28,.08)]'
                    : 'text-[#756c65]',
            ].join(' ')}
            data-period={value}
            aria-pressed={active}
        >
            {label}
        </button>
    );
}

function DateField({
    label,
    value,
    dataAttribute,
}) {
    const dataProps = {
        [dataAttribute]: true,
    };

    return (
        <label className="flex h-[38px] min-w-0 items-center gap-[6px] rounded-[9px] border border-[color:var(--color-border)] bg-white px-2 focus-within:border-[#c78661]">
            <span className="text-[11px] font-bold text-[#918880]">
                {label}
            </span>

            <input
                className="min-w-0 w-[112px] border-0 bg-transparent p-0 text-[11px] text-[#4e4741] outline-none max-sm:w-full"
                type="date"
                defaultValue={value}
                {...dataProps}
            />
        </label>
    );
}

function KpiCard({
    type,
    label,
    value,
    delta,
    icon,
    iconClassName,
    active = false,
}) {
    return (
        <button
            type="button"
            className={[
                'flex min-h-[102px] items-center gap-3 rounded-[14px] border p-[14px] text-left shadow-[0_8px_26px_rgba(70,47,31,.035)]',
                active
                    ? 'border-[#d7a88e] bg-[#fffaf7]'
                    : 'border-[color:var(--color-border)] bg-white',
            ].join(' ')}
            data-metric={type}
            aria-pressed={active}
        >
            <span
                className={`grid h-10 w-10 flex-none place-items-center rounded-[11px] ${iconClassName}`}
            >
                {icon}
            </span>

            <span className="flex min-w-0 flex-col">
                <small className="text-[12px] font-bold text-[#6f6862]">
                    {label}
                </small>

                <strong
                    className="mt-1 text-[23px] tracking-[-.04em]"
                    data-kpi={type}
                >
                    {value}
                </strong>

                <em
                    className={[
                        'mt-1 text-[11px] not-italic',
                        active
                            ? 'text-[color:var(--color-success)]'
                            : 'text-[#9a938d]',
                    ].join(' ')}
                    {...(active ? { 'data-kpi-delta': true } : {})}
                >
                    {delta}
                </em>
            </span>
        </button>
    );
}

function PromoFilter({
    value,
    label,
    active = false,
}) {
    return (
        <button
            type="button"
            className={[
                'px-3 py-2 text-[11px] font-bold',
                active
                    ? 'rounded-[7px] border border-[#e3c0ab] bg-[#fff6f0] text-[color:var(--color-accent)]'
                    : 'text-[#7d746d]',
            ].join(' ')}
            data-promo={value}
        >
            {label}
        </button>
    );
}

function ProductColumn({
    label,
    icon,
}) {
    return (
        <div
            className="popover !w-auto"
            data-popover
            data-popover-placement="bottom"
        >
            <button
                type="button"
                className="popover__trigger flex items-center justify-start gap-1 text-left"
                data-popover-trigger
                aria-label={label}
            >
                {icon}

                <span className="max-[1399px]:hidden">
                    {label}
                </span>
            </button>

            <div
                className="popover__content !min-w-max !rounded-lg !px-2 !py-1 text-[11px] normal-case tracking-normal"
                data-popover-content
                hidden
            >
                {label}
            </div>
        </div>
    );
}

function RevenueIcon({
    width = 19,
    height = 19,
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 7h6v6" />
            <path d="m22 7-8.5 8.5-5-5L2 17" />
        </svg>
    );
}

function CartIcon({
    width = 19,
    height = 19,
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    );
}

function UsersIcon() {
    return (
        <svg
            width="19"
            height="19"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function PercentIcon({
    width = 19,
    height = 19,
}) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="19" x2="5" y1="5" y2="19" />
            <circle cx="6.5" cy="6.5" r="2.5" />
            <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
    );
}

function PromoIcon() {
    return (
        <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
            <path d="m15 9-6 6" />
            <path d="M9 9h.01" />
            <path d="M15 15h.01" />
        </svg>
    );
}

function SearchIcon() {
    return (
        <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    );
}

function EyeIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    );
}

function BoxIcon() {
    return (
        <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
            <path d="m3.3 7 8.7 5 8.7-5M12 22V12" />
        </svg>
    );
}