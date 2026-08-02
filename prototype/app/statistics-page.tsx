"use client";

import {
  ArrowUpRight,
  BadgePercent,
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  Heart,
  Package,
  Percent,
  Search,
  ShoppingCart,
  Tag,
  TrendingUp,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

type Period = "today" | "7" | "30" | "year" | "custom";
type Metric = "revenue" | "orders" | "visits";
type PromotionFilter = "all" | "sale" | "offer" | "promo";
type ProductSort = "orders" | "views" | "favorites" | "revenue";

const periodSummary = {
  today: { revenue: "27 430 ₴", orders: "8", visits: "246", conversion: "3,3%", delta: "+8%", label: "Сегодня, 1 августа" },
  "7": { revenue: "126 480 ₴", orders: "37", visits: "1 420", conversion: "2,6%", delta: "+12%", label: "26 июля — 1 августа" },
  "30": { revenue: "492 760 ₴", orders: "142", visits: "5 890", conversion: "2,4%", delta: "+18%", label: "3 июля — 1 августа" },
  year: { revenue: "3 842 900 ₴", orders: "1 086", visits: "46 240", conversion: "2,3%", delta: "+31%", label: "1 января — 1 августа" },
  custom: { revenue: "492 760 ₴", orders: "142", visits: "5 890", conversion: "2,4%", delta: "+18%", label: "Выбранный период" },
} as const;

const chartSeries: Record<Period, Record<Metric, number[]>> = {
  today: { revenue: [2.1, 2.8, 3.4, 3.1, 4.2, 3.7, 4.6, 2.2, 1.33], orders: [0, 1, 1, 1, 2, 1, 1, 1, 0], visits: [14, 21, 25, 31, 36, 39, 34, 28, 18] },
  "7": { revenue: [15, 21, 18, 17, 23, 20, 12.48], orders: [4, 6, 5, 5, 7, 6, 4], visits: [170, 245, 220, 205, 248, 225, 107] },
  "30": { revenue: [34.2, 41.8, 38.5, 44.1, 39.6, 48.3, 42.9, 51.7, 45.6, 49.9, 39.7, 16.46], orders: [9, 11, 10, 12, 11, 14, 12, 15, 13, 14, 15, 6], visits: [390, 480, 450, 520, 470, 570, 530, 600, 550, 580, 630, 120] },
  year: { revenue: [480, 530, 505, 575, 610, 660, 482.9], orders: [135, 148, 142, 160, 170, 183, 148], visits: [5950, 6400, 6100, 6800, 7200, 7600, 6190] },
  custom: { revenue: [34.2, 41.8, 38.5, 44.1, 39.6, 48.3, 42.9, 51.7, 45.6, 49.9, 39.7, 16.46], orders: [9, 11, 10, 12, 11, 14, 12, 15, 13, 14, 15, 6], visits: [390, 480, 450, 520, 470, 570, 530, 600, 550, 580, 630, 120] },
};

const campaigns = [
  { id: "summer", name: "Летняя распродажа", kind: "sale" as const, type: "Распродажа", detail: "Выбранные модификации", discount: "−20%", reach: "86 покупок", orders: 34, revenue: "38 420 ₴", status: "Активна" },
  { id: "cart", name: "Брошенная корзина", kind: "offer" as const, type: "Автопредложение", detail: "Отправлено 78", discount: "−15%", reach: "15,4% конверсия", orders: 12, revenue: "15 980 ₴", status: "Активно" },
  { id: "favorite", name: "После добавления в избранное", kind: "offer" as const, type: "Автопредложение", detail: "Отправлено 202", discount: "−10%", reach: "8,9% конверсия", orders: 18, revenue: "22 240 ₴", status: "Активно" },
  { id: "repeat", name: "Для тех, кто уже покупал", kind: "offer" as const, type: "Автопредложение", detail: "Отправлено 20", discount: "−15%", reach: "30% конверсия", orders: 6, revenue: "8 940 ₴", status: "Активно" },
  { id: "welcome", name: "WELCOME10", kind: "promo" as const, type: "Промокод", detail: "Использован 41 раз", discount: "−10%", reach: "41 использование", orders: 41, revenue: "52 380 ₴", status: "Активен" },
];

const popularProducts = [
  { id: "forest", name: "Кожаный рюкзак FOREST", category: "Рюкзаки", tone: "olive", views: 1284, favorites: 146, carts: 58, orders: 31, revenue: 170190, conversion: "2,4%" },
  { id: "alice", name: "Сумка через плечо ALICE", category: "Сумки", tone: "cognac", views: 1086, favorites: 128, carts: 47, orders: 27, revenue: 103950, conversion: "2,5%" },
  { id: "hunter", name: "Мессенджер HUNTER", category: "Мессенджеры", tone: "coffee", views: 842, favorites: 91, carts: 36, orders: 22, revenue: 103180, conversion: "2,6%" },
  { id: "hanna", name: "Мини-рюкзак HANNA", category: "Рюкзаки", tone: "wine", views: 718, favorites: 84, carts: 29, orders: 18, revenue: 59220, conversion: "2,5%" },
  { id: "ralph", name: "Сумка для ноутбука RALPH", category: "Для ноутбука", tone: "navy", views: 602, favorites: 52, carts: 21, orders: 12, revenue: 61800, conversion: "2,0%" },
];

const money = (value: number) => `${new Intl.NumberFormat("ru-RU").format(value)} ₴`;

type ChartLabel = { short: string; long: string };

const shortDate = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short", timeZone: "UTC" });
const longDate = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

function dateLabels(from: string, to: string, count: number): ChartLabel[] {
  const start = new Date(`${from}T00:00:00Z`);
  const end = new Date(`${to}T00:00:00Z`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return Array.from({ length: count }, (_, index) => ({ short: `${index + 1}`, long: `Точка ${index + 1}` }));
  const range = end.getTime() - start.getTime();
  return Array.from({ length: count }, (_, index) => {
    const date = new Date(start.getTime() + (range * index) / Math.max(1, count - 1));
    return { short: shortDate.format(date).replace(" г.", ""), long: longDate.format(date).replace(" г.", "") };
  });
}

function labelsFor(period: Period, count: number, dateFrom: string, dateTo: string): ChartLabel[] {
  if (period === "today") return ["09:00", "10:30", "12:00", "13:30", "15:00", "16:30", "18:00", "19:30", "Сейчас"].map((time) => ({ short: time, long: `1 августа 2026, ${time.toLowerCase()}` }));
  if (period === "7") return dateLabels("2026-07-26", "2026-08-01", count);
  if (period === "30") return dateLabels("2026-07-03", "2026-08-01", count);
  if (period === "year") return ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль"].map((month) => ({ short: month.slice(0, 3), long: `${month} 2026` }));
  return dateLabels(dateFrom, dateTo, count);
}

function niceScale(maxValue: number) {
  const roughStep = maxValue / 4;
  const power = 10 ** Math.floor(Math.log10(Math.max(roughStep, 1)));
  const normalized = roughStep / power;
  const step = (normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 2.5 ? 2.5 : normalized <= 5 ? 5 : 10) * power;
  const max = Math.ceil(maxValue / step) * step;
  return { max, ticks: Array.from({ length: Math.round(max / step) + 1 }, (_, index) => index * step) };
}

function AnalyticsChart({ period, metric, dateFrom, dateTo }: { period: Period; metric: Metric; dateFrom: string; dateTo: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const data = chartSeries[period][metric];
  const labels = labelsFor(period, data.length, dateFrom, dateTo);
  const width = 720;
  const height = 258;
  const plot = { left: 46, right: 704, top: 18, bottom: 214 };
  const scale = niceScale(Math.max(...data));
  const x = (index: number) => plot.left + (index * (plot.right - plot.left)) / Math.max(1, data.length - 1);
  const y = (value: number) => plot.bottom - (value / scale.max) * (plot.bottom - plot.top);
  const points = data.map((value, index) => `${x(index)},${y(value)}`).join(" ");
  const formatValue = (value: number, compact = false) => {
    if (metric === "revenue") return compact ? `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 1 }).format(value)} тыс.` : `${new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 }).format(value * 1000)} ₴`;
    return new Intl.NumberFormat("ru-RU", { notation: compact && value >= 1000 ? "compact" : "standard", maximumFractionDigits: 1 }).format(value);
  };
  const metricLabel = metric === "revenue" ? "Выручка" : metric === "orders" ? "Заказы" : "Посещения";
  const hasPartialPoint = period === "today" || period === "7" || period === "30" || (period === "custom" && dateTo === "2026-08-01");
  const activeX = activeIndex === null ? 0 : x(activeIndex);
  const activeY = activeIndex === null ? 0 : y(data[activeIndex]);
  const tooltipWidth = 155;
  const tooltipX = Math.max(plot.left, Math.min(plot.right - tooltipWidth, activeX - tooltipWidth / 2));
  const tooltipY = Math.max(plot.top + 5, activeY - 67);
  const labelStep = data.length <= 7 ? 1 : 2;

  return (
    <div className="sa-chart-wrap">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={`${metricLabel} по датам за выбранный период`}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") setActiveIndex(null);
        }}
        onPointerLeave={() => setActiveIndex(null)}
      >
        {scale.ticks.map((tick) => {
          const tickY = y(tick);
          return <g className="sa-chart-grid" key={tick}><line x1={plot.left} y1={tickY} x2={plot.right} y2={tickY} /><text x={plot.left - 10} y={tickY + 3} textAnchor="end">{formatValue(tick, true)}</text></g>;
        })}
        <line className="sa-chart-axis" x1={plot.left} y1={plot.top} x2={plot.left} y2={plot.bottom} />
        <line className="sa-chart-axis" x1={plot.left} y1={plot.bottom} x2={plot.right} y2={plot.bottom} />
        <polyline className="sa-chart-line" points={points} />
        {data.map((value, index) => (
          <g className={`sa-chart-point ${hasPartialPoint && index === data.length - 1 ? "partial" : ""}`} key={`${index}-${value}`}>
            <circle className="sa-chart-dot" cx={x(index)} cy={y(value)} r={activeIndex === index ? 5 : 3.5} />
            <circle
              className="sa-chart-hit"
              cx={x(index)}
              cy={y(value)}
              r="15"
              tabIndex={0}
              role="button"
              aria-label={`${labels[index].long}: ${formatValue(value)}`}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setActiveIndex(index);
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setActiveIndex(null);
              }}
              onPointerDown={(event) => {
                if (event.pointerType !== "mouse") {
                  event.stopPropagation();
                  setActiveIndex((current) => current === index ? null : index);
                }
              }}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(null)}
            />
          </g>
        ))}
        {labels.map((label, index) => (index % labelStep === 0 || index === labels.length - 1) && <text className={`sa-chart-x-label ${index > 0 && index < labels.length - 1 && index % (labelStep * 2) !== 0 ? "secondary" : ""}`} x={x(index)} y={239} textAnchor={index === 0 ? "start" : index === labels.length - 1 ? "end" : "middle"} key={`${label.short}-${index}`}>{label.short}</text>)}
        {activeIndex !== null && <g className="sa-chart-tooltip" pointerEvents="none">
          <line x1={activeX} y1={plot.top} x2={activeX} y2={plot.bottom} />
          <rect x={tooltipX} y={tooltipY} width={tooltipWidth} height="52" rx="7" />
          <text className="date" x={tooltipX + 11} y={tooltipY + 18}>{labels[activeIndex].long}</text>
          <text className="value" x={tooltipX + 11} y={tooltipY + 39}>{metricLabel}: {formatValue(data[activeIndex])}</text>
        </g>}
      </svg>
      {hasPartialPoint && <p className="sa-chart-note"><span />Последняя точка — данные за неполный текущий день</p>}
    </div>
  );
}

export function StatisticsPage() {
  const [period, setPeriod] = useState<Period>("30");
  const [metric, setMetric] = useState<Metric>("revenue");
  const [promotionFilter, setPromotionFilter] = useState<PromotionFilter>("all");
  const [productSort, setProductSort] = useState<ProductSort>("orders");
  const [dateFrom, setDateFrom] = useState("2026-07-03");
  const [dateTo, setDateTo] = useState("2026-08-01");

  const summary = periodSummary[period];
  const filteredCampaigns = campaigns.filter((campaign) => promotionFilter === "all" || campaign.kind === promotionFilter);
  const sortedProducts = useMemo(() => [...popularProducts].sort((a, b) => b[productSort] - a[productSort]), [productSort]);

  return (
    <section className="sa-page uk-animation-fade">
      <header className="sa-head">
        <div><p className="eyebrow">Аналитика магазина</p><h1>Статистика</h1><p>Продажи, эффективность скидок и популярность товаров за один период.</p></div>
        <div className="sa-period-label"><CalendarDays size={17} /><span><small>Выбранный период</small><strong>{period === "custom" ? `${dateFrom.split("-").reverse().join(".")} — ${dateTo.split("-").reverse().join(".")}` : summary.label}</strong></span></div>
      </header>

      <section className="sa-date-panel" aria-label="Выбор периода">
        <div className="sa-presets">
          {(["today", "7", "30", "year"] as Period[]).map((value) => <button type="button" className={period === value ? "active" : ""} onClick={() => setPeriod(value)} key={value}>{value === "today" ? "Сегодня" : value === "7" ? "7 дней" : value === "30" ? "30 дней" : "Этот год"}</button>)}
        </div>
        <div className="sa-custom-dates"><label><span>С</span><input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} /></label><i>—</i><label><span>По</span><input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} /></label><button type="button" onClick={() => setPeriod("custom")}>Показать</button></div>
      </section>

      <div className="sa-kpis">
        <button type="button" className={metric === "revenue" ? "active" : ""} onClick={() => setMetric("revenue")}><span><TrendingUp size={19} /></span><p><small>Выручка</small><strong>{summary.revenue}</strong><em>{summary.delta} к прошлому периоду</em></p></button>
        <button type="button" className={metric === "orders" ? "active" : ""} onClick={() => setMetric("orders")}><span><ShoppingCart size={19} /></span><p><small>Заказы</small><strong>{summary.orders}</strong><em>+9% к прошлому периоду</em></p></button>
        <button type="button" className={metric === "visits" ? "active" : ""} onClick={() => setMetric("visits")}><span><Users size={19} /></span><p><small>Посещения</small><strong>{summary.visits}</strong><em>+14% к прошлому периоду</em></p></button>
        <article><span><Percent size={19} /></span><p><small>Конверсия</small><strong>{summary.conversion}</strong><em>Из посещения в заказ</em></p></article>
      </div>

      <section className="sa-chart-card">
        <header><div><p className="eyebrow">Динамика</p><h2>{metric === "revenue" ? "Выручка" : metric === "orders" ? "Заказы" : "Посещения"}</h2></div><strong>{metric === "revenue" ? summary.revenue : metric === "orders" ? `${summary.orders} заказов` : `${summary.visits} посещений`}</strong></header>
        <AnalyticsChart period={period} metric={metric} dateFrom={dateFrom} dateTo={dateTo} />
      </section>

      <section className="sa-section">
        <header className="sa-section-head"><div><p className="eyebrow">Скидки и распродажи</p><h2>Эффективность промоакций</h2><p>Все распродажи, промокоды и автоматические предложения за выбранный период.</p></div><div className="sa-promo-total"><BadgePercent size={18} /><span><small>Продажи со скидкой</small><strong>137 960 ₴</strong></span></div></header>
        <div className="sa-filter-tabs" role="group" aria-label="Фильтр промоакций">
          {(["all", "sale", "offer", "promo"] as PromotionFilter[]).map((value) => <button type="button" className={promotionFilter === value ? "active" : ""} onClick={() => setPromotionFilter(value)} key={value}>{value === "all" ? "Все" : value === "sale" ? "Распродажи" : value === "offer" ? "Предложения" : "Промокоды"}</button>)}
        </div>
        <div className="sa-campaigns">
          <div className="sa-campaign-head"><span>Название</span><span>Скидка</span><span>Результат</span><span>Заказы</span><span>Выручка</span><span>Статус</span></div>
          {filteredCampaigns.map((campaign) => <article key={campaign.id}><span className={`sa-campaign-icon ${campaign.kind}`}>{campaign.kind === "sale" ? <BadgePercent size={17} /> : campaign.kind === "offer" ? <Heart size={17} /> : <Tag size={17} />}</span><p><strong>{campaign.name}</strong><small>{campaign.type} · {campaign.detail}</small></p><b>{campaign.discount}</b><span className="sa-result">{campaign.reach}</span><span>{campaign.orders}</span><strong>{campaign.revenue}</strong><em><Check size={12} /> {campaign.status}</em></article>)}
        </div>
      </section>

      <section className="sa-section sa-products-section">
        <header className="sa-section-head"><div><p className="eyebrow">Товары</p><h2>По популярности</h2><p>Что чаще смотрят, сохраняют и покупают.</p></div><div className="sa-product-tools"><label><Search size={15} /><input placeholder="Найти товар…" /></label><label className="sa-sort"><select value={productSort} onChange={(event) => setProductSort(event.target.value as ProductSort)}><option value="orders">По продажам</option><option value="revenue">По выручке</option><option value="views">По просмотрам</option><option value="favorites">По избранному</option></select><ChevronDown size={14} /></label></div></header>
        <div className="sa-product-table">
          <div className="sa-product-head"><span>Товар</span><span><Eye size={13} /> Просмотры</span><span><Heart size={13} /> Избранное</span><span><ShoppingCart size={13} /> В корзину</span><span>Продано</span><span>Выручка</span><span>Конверсия</span></div>
          {sortedProducts.map((product, index) => <article key={product.id}><b className="sa-rank">{index + 1}</b><span className={`sa-product-art ${product.tone}`}><i><b /><em /></i></span><p><strong>{product.name}</strong><small>{product.category}</small></p><span data-label="Просмотры">{new Intl.NumberFormat("ru-RU").format(product.views)}</span><span data-label="Избранное">{product.favorites}</span><span data-label="В корзину">{product.carts}</span><strong data-label="Продано">{product.orders}</strong><b data-label="Выручка">{money(product.revenue)}</b><em data-label="Конверсия">{product.conversion}</em></article>)}
        </div>
        <footer className="sa-products-foot"><span><Package size={14} /> Показано 5 из 86 товаров</span><button type="button">Показать все товары <ArrowUpRight size={14} /></button></footer>
      </section>
    </section>
  );
}
