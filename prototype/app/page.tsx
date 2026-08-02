"use client";

import {
  BadgePercent,
  Bell,
  Box,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  CircleHelp,
  CreditCard,
  ExternalLink,
  Eye,
  Globe2,
  Home,
  Menu,
  Package,
  Palette,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  Store,
  Truck,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AppearanceEditor } from "./appearance-editor";
import { DeliveryPage } from "./delivery-page";
import { DiscountsPage } from "./discounts-page";
import { OrdersPage } from "./orders-page";
import { PaymentPage } from "./payment-page";
import { ProductsPage } from "./products-page";
import { StatisticsPage } from "./statistics-page";

type IconType = typeof Home;

type NavItem = {
  label: string;
  icon: IconType;
};

type SetupTask = {
  id: string;
  label: string;
  description: string;
  icon: IconType;
  optional?: boolean;
};

const navItems: NavItem[] = [
  { label: "Главная", icon: Home },
  { label: "Внешний вид магазина", icon: Palette },
  { label: "Товары", icon: Box },
  { label: "Заказы", icon: ShoppingCart },
  { label: "Пользователи", icon: Users },
  { label: "Доставка", icon: Truck },
  { label: "Оплата", icon: CreditCard },
  { label: "Скидки и распродажи", icon: BadgePercent },
  { label: "Статистика", icon: ChartNoAxesCombined },
  { label: "Домен", icon: Globe2 },
  { label: "Настройки", icon: Settings },
];

const setupTasks: SetupTask[] = [
  {
    id: "product",
    label: "Добавить первый товар",
    description: "Товар опубликован",
    icon: Box,
  },
  {
    id: "delivery",
    label: "Настроить доставку",
    description: "Способ доставки добавлен",
    icon: Truck,
  },
  {
    id: "payment",
    label: "Добавить способ оплаты",
    description: "Принимайте оплату от покупателей",
    icon: CreditCard,
  },
  {
    id: "appearance",
    label: "Настроить внешний вид",
    description: "Логотип, цвета и баннер магазина",
    icon: Palette,
  },
  {
    id: "domain",
    label: "Подключить домен",
    description: "Собственный адрес магазина",
    icon: Globe2,
    optional: true,
  },
];

const moduleCopy: Record<string, { title: string; text: string }> = {
  "Внешний вид магазина": {
    title: "Внешний вид магазина",
    text: "Логотип, цвета, шрифты, баннер и блоки витрины — всё в одном месте.",
  },
  Товары: {
    title: "Товары",
    text: "Добавляйте товары, варианты, остатки и цены без лишних настроек.",
  },
  Заказы: {
    title: "Заказы",
    text: "Обрабатывайте новые заказы и отслеживайте их статусы.",
  },
  Пользователи: {
    title: "Пользователи",
    text: "Покупатели, их контакты и история заказов — в одном понятном разделе.",
  },
  Доставка: {
    title: "Доставка",
    text: "Настройте способы, стоимость и зоны доставки.",
  },
  Оплата: {
    title: "Оплата",
    text: "Подключите удобные способы оплаты для покупателей.",
  },
  "Скидки и распродажи": {
    title: "Скидки и распродажи",
    text: "Создавайте промокоды и запускайте акции за пару кликов.",
  },
  Статистика: {
    title: "Статистика",
    text: "Следите за продажами, заказами и динамикой магазина.",
  },
  Домен: {
    title: "Домен",
    text: "Подключите собственный адрес магазина.",
  },
  Настройки: {
    title: "Настройки",
    text: "Основные данные магазина, уведомления и доступы.",
  },
};

const orders = [
  {
    id: "#1024",
    customer: "Анна Смирнова",
    time: "2 мин. назад",
    total: "3 520 ₴",
    status: "Новый",
    tone: "new",
  },
  {
    id: "#1023",
    customer: "Дмитрий Коваленко",
    time: "15 мин. назад",
    total: "5 890 ₴",
    status: "Оплачен",
    tone: "paid",
  },
  {
    id: "#1022",
    customer: "Ольга Петрова",
    time: "1 ч. назад",
    total: "2 450 ₴",
    status: "В обработке",
    tone: "process",
  },
  {
    id: "#1021",
    customer: "Сергей Иванов",
    time: "2 ч. назад",
    total: "7 100 ₴",
    status: "Доставлен",
    tone: "delivered",
  },
  {
    id: "#1020",
    customer: "Елена Васильева",
    time: "3 ч. назад",
    total: "4 300 ₴",
    status: "Новый",
    tone: "new",
  },
];

const todayData = [2, 4, 3, 7, 5, 9, 8, 11, 13];
const weekData = [4, 7, 15, 11, 17, 13, 12, 16, 27];
const monthData = [7, 11, 9, 16, 13, 19, 17, 22, 20, 28, 25, 31];

function ShopraLogo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand" aria-label="Shopra">
      <span className="brand-mark">
        <ShoppingBag size={19} strokeWidth={1.8} />
        <span>S</span>
      </span>
      {!compact && <span className="brand-name">Shopra</span>}
    </div>
  );
}

function SideNavigation({
  active,
  onSelect,
}: {
  active: string;
  onSelect: (label: string) => void;
}) {
  return (
    <nav className="side-nav uk-nav uk-nav-default" aria-label="Главная навигация">
      {navItems.map(({ label, icon: Icon }) => (
        <button
          type="button"
          className={active === label ? "nav-item is-active" : "nav-item"}
          onClick={() => onSelect(label)}
          key={label}
        >
          <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
          <span>{label}</span>
          {label === "Заказы" && <b className="nav-badge">8</b>}
        </button>
      ))}
    </nav>
  );
}

function DashboardChart({ period }: { period: "today" | "7" | "30" }) {
  const data = period === "today" ? todayData : period === "7" ? weekData : monthData;
  const points = useMemo(() => {
    const max = Math.max(...data);
    return data
      .map((value, index) => {
        const x = 18 + (index * 462) / (data.length - 1);
        const y = 190 - (value / max) * 150;
        return `${x},${y}`;
      })
      .join(" ");
  }, [data]);

  return (
    <div className="chart-wrap">
      <div className="chart-y">
        <span>30K ₴</span>
        <span>20K ₴</span>
        <span>10K ₴</span>
        <span>0 ₴</span>
      </div>
      <svg
        className="sales-chart"
        viewBox="0 0 500 220"
        role="img"
        aria-label={period === "today" ? "График продаж за сегодня" : `График продаж за ${period} дней`}
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c55a1d" stopOpacity=".2" />
            <stop offset="100%" stopColor="#c55a1d" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="18" y1="40" x2="480" y2="40" className="chart-grid" />
        <line x1="18" y1="90" x2="480" y2="90" className="chart-grid" />
        <line x1="18" y1="140" x2="480" y2="140" className="chart-grid" />
        <line x1="18" y1="190" x2="480" y2="190" className="chart-grid" />
        <polygon points={`18,190 ${points} 480,190`} fill="url(#chartFill)" />
        <polyline points={points} className="chart-line" />
        {data.map((value, index) => {
          const max = Math.max(...data);
          const x = 18 + (index * 462) / (data.length - 1);
          const y = 190 - (value / max) * 150;
          return (
            <circle key={`${x}-${value}`} cx={x} cy={y} r="4" className="chart-dot">
              <title>{`${value} 000 ₴`}</title>
            </circle>
          );
        })}
      </svg>
      <div className="chart-labels">
        {(period === "today"
          ? ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "Сейчас"]
          : period === "7"
            ? ["26 июл.", "27 июл.", "28 июл.", "29 июл.", "30 июл.", "31 июл.", "1 авг."]
            : ["3 июл.", "8 июл.", "13 июл.", "18 июл.", "23 июл.", "28 июл.", "1 авг."]
        ).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="chart-callout">
        <span>{period === "today" ? "Сейчас" : "1 августа"}</span>
        <strong>{period === "today" ? "13 780 ₴" : period === "7" ? "27 430 ₴" : "31 240 ₴"}</strong>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [active, setActive] = useState("Главная");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modal, setModal] = useState<string | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [setupDone, setSetupDone] = useState<string[]>(["product", "delivery"]);
  const [pendingSetupId, setPendingSetupId] = useState<string | null>(null);
  const [startProductCreation, setStartProductCreation] = useState(false);

  const requiredSetupTasks = setupTasks.filter((task) => !task.optional);
  const completedRequiredTasks = requiredSetupTasks.filter((task) =>
    setupDone.includes(task.id),
  ).length;
  const setupPercent = Math.round(
    (completedRequiredTasks / requiredSetupTasks.length) * 100,
  );
  const nextSetupTask =
    setupTasks.find((task) => !setupDone.includes(task.id) && !task.optional) ??
    setupTasks.find((task) => !setupDone.includes(task.id));
  const visibleSetupTasks = setupOpen
    ? setupTasks
    : nextSetupTask
      ? [nextSetupTask]
      : setupTasks.slice(0, 1);

  const selectNavigation = (label: string) => {
    setActive(label);
    if (label !== "Товары") setStartProductCreation(false);
    setDrawerOpen(false);
  };

  const openProductCreation = () => {
    setStartProductCreation(true);
    setActive("Товары");
  };

  const closeActionModal = () => {
    setModal(null);
    setPendingSetupId(null);
  };

  const completeAction = () => {
    if (pendingSetupId && !setupDone.includes(pendingSetupId)) {
      setSetupDone((current) => [...current, pendingSetupId]);
    }
    closeActionModal();
  };

  const isDashboard = active === "Главная";
  const currentModule = moduleCopy[active];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <ShopraLogo />
        </div>
        <SideNavigation active={active} onSelect={selectNavigation} />
        <div className="sidebar-bottom">
          <button type="button" className="profile-card">
            <span className="avatar">И</span>
            <span className="profile-copy">
              <strong>Иван Иванов</strong>
              <small>Владелец магазина</small>
            </span>
            <ChevronDown size={16} />
          </button>
          <div className="setup-mini">
            <span>
              <Sparkles size={15} />
              Магазин готов
            </span>
            <strong>{setupPercent}%</strong>
            <div
              className="progress-track"
              role="progressbar"
              aria-label="Готовность магазина"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={setupPercent}
            >
              <i style={{ width: `${setupPercent}%` }} />
            </div>
          </div>
        </div>
      </aside>

      <header className="mobile-bar">
        <button
          type="button"
          className="icon-button"
          aria-label="Открыть меню"
          onClick={() => setDrawerOpen(true)}
        >
          <Menu size={22} />
        </button>
        <ShopraLogo />
        <button
          type="button"
          className="icon-button"
          aria-label="Уведомления"
          onClick={() => setNotificationsOpen((open) => !open)}
        >
          <Bell size={20} />
          <i className="notify-dot" />
        </button>
      </header>

      {drawerOpen && (
        <div className="mobile-overlay" role="presentation" onClick={() => setDrawerOpen(false)}>
          <aside
            className="mobile-drawer uk-animation-slide-left-small"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-head">
              <ShopraLogo />
              <button
                type="button"
                className="icon-button"
                aria-label="Закрыть меню"
                onClick={() => setDrawerOpen(false)}
              >
                <X size={21} />
              </button>
            </div>
            <SideNavigation active={active} onSelect={selectNavigation} />
          </aside>
        </div>
      )}

      <section className="workspace">
        <div className="topbar uk-flex uk-flex-between uk-flex-middle">
          <div className="mobile-title">Панель управления</div>
          <div className="top-actions">
            {searchOpen ? (
              <label className="search-field uk-animation-slide-right-small">
                <Search size={17} />
                <input autoFocus aria-label="Поиск" placeholder="Найти заказ или товар…" />
                <button type="button" onClick={() => setSearchOpen(false)} aria-label="Закрыть поиск">
                  <X size={15} />
                </button>
              </label>
            ) : (
              <button
                type="button"
                className="icon-button"
                aria-label="Поиск"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={20} />
              </button>
            )}
            <div className="notification-wrap">
              <button
                type="button"
                className="icon-button"
                aria-label="Уведомления"
                onClick={() => setNotificationsOpen((open) => !open)}
              >
                <Bell size={20} />
                <i className="notify-dot" />
              </button>
              {notificationsOpen && (
                <div className="notification-popover uk-card uk-card-default uk-animation-slide-top-small">
                  <div className="popover-title">
                    <strong>Уведомления</strong>
                    <span>2 новых</span>
                  </div>
                  <button type="button">
                    <span className="notice-icon notice-order">
                      <ShoppingBag size={17} />
                    </span>
                    <span>
                      <strong>Новый заказ #1024</strong>
                      <small>Анна Смирнова · 3 520 ₴</small>
                    </span>
                  </button>
                  <button type="button">
                    <span className="notice-icon notice-stock">
                      <Box size={17} />
                    </span>
                    <span>
                      <strong>Заканчивается товар</strong>
                      <small>Кожаная сумка Forest · 2 шт.</small>
                    </span>
                  </button>
                </div>
              )}
            </div>
            <button type="button" className="help-button" aria-label="Помощь">
              <CircleHelp size={20} />
            </button>
          </div>
        </div>

        {isDashboard ? (
          <>
            <section className="welcome-row">
              <div>
                <p className="eyebrow">Суббота, 1 августа</p>
                <h1>Доброе утро, Иван! <span>👋</span></h1>
                <p>Вот что происходит в вашем магазине сегодня.</p>
              </div>
              <div className="welcome-actions">
                <button type="button" className="preview-button uk-button" onClick={() => setModal("Витрина магазина")}>
                  <Eye size={17} />
                  Посмотреть магазин
                  <ExternalLink size={14} />
                </button>
                <span className="today-date">
                  <CalendarDays size={17} />
                  Сегодня, 1 августа 2026 г.
                </span>
              </div>
            </section>

            <section className="metrics-grid">
              <article className="metric-card uk-card uk-card-default">
                <span className="metric-icon copper"><ShoppingBag size={21} /></span>
                <div>
                  <small>Новые заказы</small>
                  <strong>12</strong>
                  <p>+3 за сегодня</p>
                </div>
              </article>
              <article className="metric-card uk-card uk-card-default">
                <span className="metric-icon green"><ChartNoAxesCombined size={21} /></span>
                <div>
                  <small>Продажи за сегодня</small>
                  <strong>24 560 ₴</strong>
                  <p className="positive">+18% к вчера</p>
                </div>
              </article>
              <article className="metric-card uk-card uk-card-default">
                <span className="metric-icon blue"><Package size={21} /></span>
                <div>
                  <small>Заказы в обработке</small>
                  <strong>28</strong>
                  <button type="button" onClick={() => selectNavigation("Заказы")}>Смотреть</button>
                </div>
              </article>
              <article className="metric-card uk-card uk-card-default">
                <span className="metric-icon sand"><Box size={21} /></span>
                <div>
                  <small>Товары</small>
                  <strong>156</strong>
                  <button type="button" onClick={() => selectNavigation("Товары")}>Смотреть</button>
                </div>
              </article>
            </section>

            <section className="content-grid">
              <article className="panel orders-panel uk-card uk-card-default">
                <div className="panel-head">
                  <div>
                    <p className="panel-kicker">В реальном времени</p>
                    <h2>Последние заказы</h2>
                  </div>
                  <button type="button" className="text-link" onClick={() => selectNavigation("Заказы")}>
                    Все заказы
                  </button>
                </div>
                <div className="orders-list">
                  {orders.map((order) => (
                    <button
                      type="button"
                      className="order-row"
                      key={order.id}
                      onClick={() => setModal(`Заказ ${order.id}`)}
                    >
                      <span className="order-id">{order.id}</span>
                      <span className="customer">
                        <strong>{order.customer}</strong>
                        <small>{order.time}</small>
                      </span>
                      <strong className="order-total">{order.total}</strong>
                      <span className={`status ${order.tone}`}>{order.status}</span>
                      <ChevronDown className="order-chevron" size={16} />
                    </button>
                  ))}
                </div>
              </article>

              <article className="panel chart-panel uk-card uk-card-default">
                <div className="panel-head">
                  <div>
                    <p className="panel-kicker">Сегодня, 1 августа</p>
                    <h2>Продажи за сегодня</h2>
                  </div>
                </div>
                <DashboardChart period="today" />
              </article>
            </section>

            <section className="bottom-grid">
              <article className="quick-panel panel uk-card uk-card-default">
                <div className="panel-head compact">
                  <div>
                    <p className="panel-kicker">Без лишних шагов</p>
                    <h2>Быстрые действия</h2>
                  </div>
                </div>
                <div className="quick-actions">
                  {[
                    { label: "Добавить товар", icon: Plus },
                    { label: "Создать акцию", icon: BadgePercent },
                    { label: "Добавить доставку", icon: Truck },
                    { label: "Настроить оплату", icon: CreditCard },
                    { label: "Подключить домен", icon: Globe2 },
                  ].map(({ label, icon: Icon }) => (
                    <button
                      type="button"
                      key={label}
                      className="quick-button uk-button"
                      onClick={() => label === "Добавить товар" ? openProductCreation() : setModal(label)}
                    >
                      <span><Icon size={18} /></span>
                      {label}
                    </button>
                  ))}
                </div>
              </article>

              <article className="setup-card">
                <div className="setup-card-top">
                  <span><Store size={18} /></span>
                  <p>Старт магазина</p>
                  <strong>{setupPercent}%</strong>
                </div>
                <h2>
                  {setupPercent === 100
                    ? "Магазин готов к продажам"
                    : "Осталось совсем немного"}
                </h2>
                <div
                  className="progress-track large"
                  role="progressbar"
                  aria-label="Прогресс запуска магазина"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={setupPercent}
                >
                  <i style={{ width: `${setupPercent}%` }} />
                </div>
                <div className="setup-list">
                  {visibleSetupTasks.map((task) => {
                    const TaskIcon = task.icon;
                    const isDone = setupDone.includes(task.id);

                    return (
                      <button
                        type="button"
                        className={`setup-step${isDone ? " is-done" : ""}`}
                        disabled={isDone}
                        onClick={() => {
                          setPendingSetupId(task.id);
                          setModal(task.label);
                        }}
                        key={task.id}
                      >
                        <span className="check-circle">
                          {isDone ? <Check size={14} /> : <TaskIcon size={14} />}
                        </span>
                        <span className="setup-step-copy">
                          <strong>{task.label}</strong>
                          <small>
                            {task.description}
                            {task.optional && <em>Необязательно</em>}
                          </small>
                        </span>
                        {!isDone && <ChevronDown className="setup-step-arrow" size={15} />}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  className="setup-toggle"
                  aria-expanded={setupOpen}
                  onClick={() => setSetupOpen((open) => !open)}
                >
                  {setupOpen ? "Свернуть список" : `Все шаги (${setupTasks.length})`}
                  <ChevronDown className={setupOpen ? "is-open" : ""} size={15} />
                </button>
              </article>
            </section>
          </>
        ) : active === "Внешний вид магазина" ? (
          <AppearanceEditor />
        ) : active === "Товары" ? (
          <ProductsPage startCreating={startProductCreation} />
        ) : active === "Заказы" ? (
          <OrdersPage />
        ) : active === "Доставка" ? (
          <DeliveryPage />
        ) : active === "Оплата" ? (
          <PaymentPage />
        ) : active === "Скидки и распродажи" ? (
          <DiscountsPage />
        ) : active === "Статистика" ? (
          <StatisticsPage />
        ) : active === "Настройки" ? (
          <section className="module-page shopra-settings uk-animation-fade">
            <div className="module-hero">
              <div>
                <p className="eyebrow">Shopra · Панель управления</p>
                <h1>Настройки</h1>
                <p>Основные данные магазина и дополнительные инструменты.</p>
              </div>
            </div>
            <div className="shopra-settings-list">
              <button type="button" onClick={() => setModal("Основные настройки")}>
                <span><Settings size={18} /></span>
                <p><strong>Основные настройки</strong><small>Название магазина, контакты и уведомления</small></p>
                <ChevronDown size={15} />
              </button>
              <button type="button" onClick={() => setModal("Доступы сотрудников")}>
                <span><Store size={18} /></span>
                <p><strong>Доступы сотрудников</strong><small>Роли и права команды</small></p>
                <ChevronDown size={15} />
              </button>
              <button className="product-templates" type="button" onClick={() => setModal("Шаблоны товаров")}>
                <span><Box size={18} /></span>
                <p>
                  <strong>Шаблоны товаров</strong>
                  <small>Дополнительный инструмент для больших каталогов — не участвует в обычном добавлении товара</small>
                </p>
                <ChevronDown size={15} />
              </button>
            </div>
          </section>
        ) : (
          <section className="module-page uk-animation-fade">
            <div className="module-hero">
              <div>
                <p className="eyebrow">Shopra · Панель управления</p>
                <h1>{currentModule?.title ?? active}</h1>
                <p>{currentModule?.text}</p>
              </div>
              <button type="button" className="primary-button uk-button" onClick={() => setModal(`Добавить · ${active}`)}>
                <Plus size={17} />
                Добавить
              </button>
            </div>
            <div className="module-content">
              <span className="module-illustration">
                {(() => {
                  const ItemIcon = navItems.find((item) => item.label === active)?.icon ?? Store;
                  return <ItemIcon size={42} />;
                })()}
              </span>
              <h2>{active} — просто и понятно</h2>
              <p>
                Здесь будет рабочая область раздела. Навигация и состояния уже готовы для подключения к Laravel.
              </p>
              <button type="button" className="secondary-button uk-button" onClick={() => selectNavigation("Главная")}>
                Вернуться на главную
              </button>
            </div>
          </section>
        )}
      </section>

      {modal && (
        <div className="modal-backdrop" role="presentation" onClick={closeActionModal}>
          <section
            className="action-modal uk-card uk-card-default uk-animation-slide-top-small"
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button type="button" className="modal-close icon-button" aria-label="Закрыть" onClick={closeActionModal}>
              <X size={20} />
            </button>
            <span className="modal-icon"><Sparkles size={23} /></span>
            <p className="eyebrow">Быстрое действие</p>
            <h2 id="action-modal-title">{modal}</h2>
            <p>
              Интерфейс действия готов. На следующем этапе здесь можно подключить форму и данные Laravel.
            </p>
            <div className="modal-actions">
              <button type="button" className="secondary-button uk-button" onClick={closeActionModal}>Отмена</button>
              <button type="button" className="primary-button uk-button" onClick={completeAction}>
                Продолжить
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
