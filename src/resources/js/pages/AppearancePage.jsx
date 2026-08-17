import { useState } from 'react';
import '../../../resources/scss/admin/pages/appearance.scss';
import StyleElementsModal from '../modals/Appearance/StyleElementsModal';
import FooterSettingsModal from '../modals/Appearance/FooterSettingsModal';
import FooterPageModal from '../modals/Appearance/FooterPageModal';
import AddWidgetModal from '../modals/Appearance/AddWidgetModal';
import LowerBannerModal from '../modals/Appearance/LowerBannerModal';
import HandmadeModal from '../modals/Appearance/HandmadeModal';
import ShowcaseModal from '../modals/Appearance/ShowcaseModal';
import HeroBannerModal from '../modals/Appearance/HeroBannerModal';
import StoreHeaderModal from '../modals/Appearance/StoreHeaderModal';
import TopBannerModal from '../modals/Appearance/TopBannerModal';



export default function AppearancePage() {

    const [activeModal, setActiveModal] = useState(null);

    const modalComponents = {
        'style-elements': StyleElementsModal,
        'footer-settings': FooterSettingsModal,
        'footer-page': FooterPageModal,
        'add-widget': AddWidgetModal,
        'lower-banner': LowerBannerModal,
        'handmade': HandmadeModal,
        'showcase': ShowcaseModal,
        'hero-banner': HeroBannerModal,
        'store-header': StoreHeaderModal,
        'top-banner': TopBannerModal,
    };

    const ActiveModal = activeModal
        ? modalComponents[activeModal]
        : null;

    const openModal = (modalId) => {
        setActiveModal(modalId);
    };

    const closeModal = () => {
        setActiveModal(null);
    };

    return (
        <>
            <header className="mb-5 flex items-end justify-between gap-6 max-[1180px]:flex-col max-[1180px]:items-start">
                <div>

                    <p className="mb-[3px] text-[11px] font-[760] uppercase tracking-[0.09em] text-[color:var(--color-accent)]">Магазин · Внешний вид</p>

                    <h1 className="mb-[5px] mt-1 text-[32px] font-[760] tracking-[-0.05em]">
                        Внешний вид магазина
                    </h1>

                    <p className="m-0 text-[13px] text-[color:var(--muted)]">
                        Настройте внешний вид и главную страницу прямо здесь —
                        без переходов между разделами.
                    </p>
                </div>

                <div className="flex items-center gap-2 max-[1180px]:w-full max-[1180px]:justify-end max-[760px]:grid max-[760px]:grid-cols-2">
                    <button className="inline-flex min-h-10 items-center justify-center gap-[6px] rounded-[10px] border border-[color:var(--line-strong)] bg-white px-[14px] py-0 text-xs font-bold">
                        Предпросмотр
                    </button>

                    <button className="inline-flex min-h-10 items-center justify-center gap-[6px] rounded-[10px] border border-[color:var(--accent)] bg-[color:var(--accent)] px-[14px] py-0 text-xs font-bold text-white">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-save"
                        >
                            <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
                            <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
                            <path d="M7 3v4a1 1 0 0 0 1 1h7" />
                        </svg>

                        Сохранить
                    </button>
                </div>
            </header>

            <button
                type="button"
                className="style-card theme-copper"
                data-modal-trigger
                aria-haspopup="dialog"
                onClick={() => setActiveModal('style-elements')}
            >
                <span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="21"
                        height="21"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-palette"
                    >
                        <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                        <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                        <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                        <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />

                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                    </svg>
                </span>

                <div>
                    <b>Цвета и стиль элементов</b>
                    <small>
                        Палитра, шрифты и форма кнопок, карточек и полей
                    </small>
                </div>

                <i />
                <i />
                <i />

                <strong>Редакционный · Скруглённые</strong>

                <em>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-pencil"
                    >
                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                        <path d="m15 5 4 4" />
                    </svg>

                    Настроить
                </em>
            </button>

            <div className="overflow-hidden rounded-[17px] border border-[color:var(--line)] bg-[#ebe9e6] shadow-[0_14px_45px_rgba(57,41,31,0.07)]">
                <div className="grid h-[53px] grid-cols-[1fr_auto_1fr] items-center border-b border-[#dfdbd7] bg-white px-[14px] max-[760px]:grid-cols-[1fr_auto]">
                    <span className="text-xs font-bold text-[#6d6863]">
                        Главная страница
                    </span>

                    <div className="flex rounded-[9px] border border-[color:var(--line)] bg-[#faf9f7] p-[3px]">
                        <button
                            type="button"
                            className="grid h-[31px] w-[31px] place-items-center rounded-[7px] border-0 bg-[#f3eee9] p-0 text-[color:var(--accent-dark)]"
                            data-preview-device="desktop"
                            aria-label="Предпросмотр для компьютера"
                            aria-pressed="true"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-monitor"
                            >
                                <rect
                                    width="20"
                                    height="14"
                                    x="2"
                                    y="3"
                                    rx="2"
                                />
                                <line x1="8" x2="16" y1="21" y2="21" />
                                <line x1="12" x2="12" y1="17" y2="21" />
                            </svg>
                        </button>

                        <button
                            type="button"
                            className="grid h-[31px] w-[31px] place-items-center rounded-[7px] border-0 bg-transparent p-0 text-[#6e6863]"
                            data-preview-device="mobile"
                            aria-label="Предпросмотр для телефона"
                            aria-pressed="false"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-smartphone"
                            >
                                <rect
                                    width="14"
                                    height="20"
                                    x="5"
                                    y="2"
                                    rx="2"
                                    ry="2"
                                />
                                <path d="M12 18h.01" />
                            </svg>
                        </button>
                    </div>

                    <small className="justify-self-end text-[11px] text-[#887f77] max-[760px]:hidden">
                        Нажмите на блок, чтобы изменить
                    </small>
                </div>

                <div className="max-h-[calc(100vh-220px)] min-h-[680px] overflow-auto bg-[#e8e6e3] p-[21px] max-[760px]:min-h-[620px] max-[760px]:p-[11px]">
                    <div
                        className="store-preview desktop theme-copper corners-round font-editorial"
                        data-store-preview
                    >
                        <div className="store-top">
                            Бесплатная доставка от 2 500 ₴

                            <button
                                type="button"
                                className="ae-edit"
                                onClick={() => setActiveModal('top-banner')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                >
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                    <path d="m15 5 4 4" />
                                </svg>

                                Изменить
                            </button>
                        </div>

                        <header className="store-header header-layout-left search-compact">
                            <button
                                type="button"
                                className="ae-edit"
                                onClick={() => setActiveModal('store-header')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                >
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                    <path d="m15 5 4 4" />
                                </svg>

                                Настроить шапку
                            </button>

                            <div className="header-row">
                                <div className="store-logo">
                                    <small>ATELIER</small>
                                    <b>No. 7</b>
                                </div>

                                <a>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="13"
                                        height="13"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-phone"
                                    >
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>

                                    +380 67 123 45 67
                                </a>

                                <label>
                                    Поиск товаров

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-search"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>
                                </label>

                                <span className="header-actions">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-heart desktop-action"
                                    >
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="17"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-user-round desktop-action"
                                    >
                                        <circle cx="12" cy="8" r="5" />
                                        <path d="M20 21a8 8 0 0 0-16 0" />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="17"
                                        height="17"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-shopping-bag desktop-action"
                                    >
                                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                        <path d="M3 6h18" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-search mobile-header-icon"
                                    >
                                        <circle cx="11" cy="11" r="8" />
                                        <path d="m21 21-4.3-4.3" />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-user-round mobile-header-icon"
                                    >
                                        <circle cx="12" cy="8" r="5" />
                                        <path d="M20 21a8 8 0 0 0-16 0" />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-shopping-bag mobile-header-icon"
                                    >
                                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                        <path d="M3 6h18" />
                                        <path d="M16 10a4 4 0 0 1-8 0" />
                                    </svg>

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="18"
                                        height="18"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-menu mobile-header-icon"
                                    >
                                        <line x1="4" x2="20" y1="12" y2="12" />
                                        <line x1="4" x2="20" y1="6" y2="6" />
                                        <line x1="4" x2="20" y1="18" y2="18" />
                                    </svg>
                                </span>
                            </div>

                            <nav>
                                <a>Каталог</a>
                                <a>Новинки</a>
                                <a>Сумки</a>
                                <a>Рюкзаки</a>
                                <a>Аксессуары</a>
                            </nav>
                        </header>

                        <section className="store-hero">
                            <button
                                type="button"
                                className="ae-edit"
                                onClick={() => setActiveModal('hero-banner')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                >
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                    <path d="m15 5 4 4" />
                                </svg>

                                Настроить баннер
                            </button>

                            <div>
                                <small>Новая коллекция · 2026</small>

                                <h2>
                                    Кожа, которая живёт вместе с вами
                                </h2>

                                <p>
                                    Сумки и аксессуары ручной работы для города
                                    и путешествий.
                                </p>

                                <span>
                                    <button>Смотреть коллекцию</button>
                                    <button>О мастерской</button>
                                </span>
                            </div>

                            <aside>
                                <i />
                                <b />

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="56"
                                    height="56"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-shopping-bag"
                                >
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </aside>

                            <em>
                                <i />
                                <i />
                                <i />
                            </em>
                        </section>

                        <section className="store-widget store-showcase showcase-grid">
                            <div className="store-tools">
                                <button
                                    type="button"
                                    className="store-tool-drag"
                                    title="Перетащить виджет"
                                    aria-label="Перетащить виджет"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-grip-vertical"
                                    >
                                        <circle cx="9" cy="12" r="1" />
                                        <circle cx="9" cy="5" r="1" />
                                        <circle cx="9" cy="19" r="1" />
                                        <circle cx="15" cy="12" r="1" />
                                        <circle cx="15" cy="5" r="1" />
                                        <circle cx="15" cy="19" r="1" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    title="Поднять выше"
                                    aria-label="Поднять выше"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-up"
                                    >
                                        <path d="m5 12 7-7 7 7" />
                                        <path d="M12 19V5" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    title="Опустить ниже"
                                    aria-label="Опустить ниже"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-arrow-down"
                                    >
                                        <path d="M12 5v14" />
                                        <path d="m19 12-7 7-7-7" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    title="Настроить"
                                    aria-label="Настроить"
                                    onClick={() => setActiveModal('showcase')}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="14"
                                        height="14"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-pencil"
                                    >
                                        <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                        <path d="m15 5 4 4" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    title="Удалить"
                                    aria-label="Удалить"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="15"
                                        height="15"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="lucide lucide-trash2"
                                    >
                                        <path d="M3 6h18" />
                                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                        <line
                                            x1="10"
                                            x2="10"
                                            y1="11"
                                            y2="17"
                                        />
                                        <line
                                            x1="14"
                                            x2="14"
                                            y1="11"
                                            y2="17"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <header>
                                <div>
                                    <small>Выбор покупателей</small>
                                    <h3>Популярные товары</h3>
                                </div>

                                <a>Смотреть все</a>
                            </header>

                            <div className="showcase-products">
                                <div className="product-grid">
                                    <Product
                                        name="Сумка Moss"
                                        price="3 290 ₴"
                                        photoClass="green"
                                    />

                                    <Product
                                        name="Рюкзак Bruno"
                                        price="4 890 ₴"
                                        photoClass="brown"
                                    />

                                    <Product
                                        name="Кошелёк Mini"
                                        price="1 290 ₴"
                                        photoClass="wine"
                                    />

                                    <Product
                                        name="Сумка Terra"
                                        price="3 790 ₴"
                                        photoClass="sand"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="store-widget store-text">
                            <WidgetTools
                                modalId="handmade"
                                onOpenModal={openModal}
                            />

                            <small>Ручная работа</small>

                            <h3>
                                Вещи, которые становятся только лучше со временем
                            </h3>

                            <p>
                                Мы работаем с натуральной кожей и собираем каждое
                                изделие вручную — спокойно, точно и с вниманием
                                к деталям.
                            </p>

                            <button>
                                Узнать о мастерской
                            </button>
                        </section>

                        <section
                            className="store-widget store-banner"
                            style={{
                                '--banner-text-color': '#ffffff',
                            }}
                        >
                            <WidgetTools
                                modalId="lower-banner"
                                onOpenModal={openModal}
                            />

                            <div>
                                <small>Новая коллекция</small>

                                <h3>
                                    Город. Дорога. Свобода.
                                </h3>

                                <p>
                                    Лаконичные формы для каждого дня.
                                </p>

                                <button>
                                    Смотреть коллекцию
                                </button>
                            </div>

                            <span>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="52"
                                    height="52"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-shopping-bag"
                                >
                                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                                    <path d="M3 6h18" />
                                    <path d="M16 10a4 4 0 0 1-8 0" />
                                </svg>
                            </span>
                        </section>

                        <button
                            type="button"
                            className="add-widget"
                            onClick={() => setActiveModal('add-widget')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-plus"
                            >
                                <path d="M5 12h14" />
                                <path d="M12 5v14" />
                            </svg>

                            Добавить виджет
                        </button>

                        <footer className="store-footer">
                            <button
                                type="button"
                                className="ae-edit"
                                data-modal-trigger
                                aria-haspopup="dialog"
                                onClick={() => setActiveModal('footer-settings')}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-pencil"
                                >
                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                    <path d="m15 5 4 4" />
                                </svg>

                                Настроить низ сайта
                            </button>

                            <div>
                                <div className="store-logo">
                                    <small>ATELIER</small>
                                    <b>No. 7</b>
                                </div>

                                <section>
                                    <b>Страницы магазина</b>
                                    <a>Доставка и оплата</a>
                                    <a>Возврат и обмен</a>
                                    <a>Договор оферты</a>
                                </section>

                                <section>
                                    <b>Ещё</b>
                                    <a>О нас</a>
                                    <a>Контакты</a>
                                    <a>Конфиденциальность</a>
                                </section>

                                <section>
                                    <b>Мы в соцсетях</b>

                                    <span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-instagram"
                                        >
                                            <rect
                                                width="20"
                                                height="20"
                                                x="2"
                                                y="2"
                                                rx="5"
                                                ry="5"
                                            />
                                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                            <line
                                                x1="17.5"
                                                x2="17.51"
                                                y1="6.5"
                                                y2="6.5"
                                            />
                                        </svg>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-facebook"
                                        >
                                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                                        </svg>

                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="lucide lucide-youtube"
                                        >
                                            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                                            <path d="m10 15 5-3-5-3z" />
                                        </svg>
                                    </span>
                                </section>
                            </div>

                            <p>
                                <span>
                                    © 2026 ATELIER No. 7
                                </span>

                                <span>
                                    Магазин работает на Shopra
                                </span>
                            </p>
                        </footer>
                    </div>
                </div>
            </div>

            {ActiveModal && (
                <ActiveModal
                    onClose={closeModal}
                />
            )}
            
        </>
    );
}

function Product({
    name,
    price,
    photoClass,
}) {
    return (
        <article>
            <div className={`product-photo ${photoClass}`}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="27"
                    height="27"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-shopping-bag"
                >
                    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                    <path d="M3 6h18" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>

                <button
                    type="button"
                    aria-label={`Добавить ${name} в избранное`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-heart"
                    >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                </button>
            </div>

            <p>{name}</p>
            <b>{price}</b>
        </article>
    );
}

function WidgetTools({
    modalId,
    onOpenModal,
}) {
    return (
        <div className="store-tools">
            <button
                type="button"
                className="store-tool-drag"
                title="Перетащить виджет"
                aria-label="Перетащить виджет"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-grip-vertical"
                >
                    <circle cx="9" cy="12" r="1" />
                    <circle cx="9" cy="5" r="1" />
                    <circle cx="9" cy="19" r="1" />
                    <circle cx="15" cy="12" r="1" />
                    <circle cx="15" cy="5" r="1" />
                    <circle cx="15" cy="19" r="1" />
                </svg>
            </button>

            <button
                type="button"
                title="Поднять выше"
                aria-label="Поднять выше"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-up"
                >
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                </svg>
            </button>

            <button
                type="button"
                title="Опустить ниже"
                aria-label="Опустить ниже"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-down"
                >
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                </svg>
            </button>

            <button
                type="button"
                title="Настроить"
                aria-label="Настроить"
                onClick={() => onOpenModal(modalId)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-pencil"
                >
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                </svg>
            </button>

            <button
                type="button"
                title="Удалить"
                aria-label="Удалить"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-trash2"
                >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    <line
                        x1="10"
                        x2="10"
                        y1="11"
                        y2="17"
                    />
                    <line
                        x1="14"
                        x2="14"
                        y1="11"
                        y2="17"
                    />
                </svg>
            </button>
        </div>
    );
}