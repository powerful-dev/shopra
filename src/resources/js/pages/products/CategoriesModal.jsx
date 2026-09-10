import { useCallback, useEffect, useState } from 'react';
import ActionsMenu from '../../components/admin/ActionsMenu';
import PencilIcon from '../../components/icons/PencilIcon';
import TrashIcon from '../../components/icons/TrashIcon';

const categories = [
    { id: 'backpacks', name: 'Рюкзаки', count: 48, type: 'parent', expanded: true },
    { id: 'city', name: 'Городские', count: 24, type: 'parent', depth: 1, expanded: true },
    { id: 'everyday', name: 'Повседневные', count: 12, type: 'leaf', depth: 2 },
    { id: 'laptop-backpacks', name: 'Для ноутбука', count: 8, type: 'leaf', depth: 2 },
    { id: 'mini', name: 'Мини-рюкзаки', count: 15, type: 'leaf', depth: 1 },
    { id: 'hiking', name: 'Туристические', count: 18, type: 'leaf', depth: 1 },
    { id: 'school', name: 'Школьные', count: 10, type: 'leaf', depth: 1 },
    { id: 'bags', name: 'Сумки', count: 67, type: 'parent', expanded: false },
    { id: 'accessories', name: 'Аксессуары', count: 31, type: 'parent', expanded: false },
    { id: 'new', name: 'Новинки', count: 32, type: 'collection' },
    { id: 'sale', name: 'Распродажа', count: 18, type: 'collection' },
];

export default function CategoriesModal({ isOpen, onClose }) {
    const [openActionsId, setOpenActionsId] = useState(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const closeModal = useCallback(() => {
        setOpenActionsId(null);
        setIsCreateFormOpen(false);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') closeModal();
        };

        document.body.classList.add('modal-open');
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.body.classList.remove('modal-open');
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [closeModal, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="presentation" onMouseDown={closeModal}>
            <section
                className="modal-dialog flex h-[min(820px,calc(100vh-44px))] flex-col bg-[#fbfaf8] max-[620px]:h-full"
                role="dialog"
                aria-modal="true"
                aria-labelledby="categories-modal-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <header className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] bg-white px-7 pb-[18px] pt-[22px] max-[620px]:px-[15px] max-[620px]:pb-[14px] max-[620px]:pt-[17px]">
                    <div className="flex flex-col">
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.12em] text-[color:var(--color-accent)]">Навигация витрины</p>
                        <h2 id="categories-modal-title" className="mb-1 mt-0.5 text-[28px] font-[760] tracking-[-.04em] text-[#312d29] max-[620px]:text-[22px]">Категории магазина</h2>
                        <span className="text-xs text-[#8d857e]">Создавайте разделы каталога, меняйте вложенность и порядок.</span>
                    </div>
                    <button type="button" className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[11px] border border-[color:var(--color-border)] bg-white text-[#706861] hover:text-[color:var(--color-accent)]" onClick={closeModal} aria-label="Закрыть категории">
                        <CloseIcon />
                    </button>
                </header>

                <div className="grid grid-cols-[minmax(260px,1fr)_auto_auto] gap-2.5 px-7 pb-2.5 pt-4 max-[620px]:grid-cols-1 max-[620px]:gap-[7px] max-[620px]:px-[14px] max-[620px]:pb-[9px] max-[620px]:pt-[11px]">
                    <label className="flex h-[46px] items-center gap-[9px] rounded-[10px] border border-[#d8d0ca] bg-white px-[13px] text-[#8f877f]">
                        <SearchIcon />
                        <input className="h-full min-w-0 flex-1 border-0 bg-transparent text-xs text-[#3f3934] outline-none" placeholder="Поиск категорий…" aria-label="Поиск категорий" />
                    </label>
                    <button type="button" className="flex min-h-[46px] items-center justify-center gap-[7px] rounded-[10px] border border-[#d8d0ca] bg-white px-[15px] text-xs font-bold text-[#514943] hover:border-[#dfb79f] hover:bg-[#fff8f3] hover:text-[color:var(--color-accent)]"><SparklesIcon />Предложить структуру</button>
                    <button
                        type="button"
                        className="button button--primary min-h-[46px] justify-center px-[15px]"
                        aria-expanded={isCreateFormOpen}
                        aria-controls="new-category-form"
                        onClick={() => setIsCreateFormOpen((isOpen) => !isOpen)}
                    >
                        <PlusIcon />Новая категория
                    </button>
                </div>

                <div className="mx-7 mb-[13px] flex items-start gap-[9px] rounded-[10px] border border-[#e7d2c4] bg-[#fff3eb] px-[14px] py-3 text-[color:var(--color-accent)] max-[620px]:mx-[14px]">
                    <SparklesIcon />
                    <p className="m-0 flex flex-col">
                        <strong className="text-xs text-[#5c5149]">Редактор структуры каталога</strong>
                        <small className="mt-0.5 text-xs leading-[1.4] text-[#8e8279]">Здесь нет привязки товара: только создание, переименование, удаление и сортировка категорий.</small>
                    </p>
                </div>

                {isCreateFormOpen && (
                    <form
                        id="new-category-form"
                        className="mx-7 mb-[13px] grid grid-cols-2 gap-[9px] rounded-[11px] border border-[color:var(--color-border)] bg-white p-[11px] max-[620px]:mx-[14px] max-[620px]:grid-cols-1"
                        onSubmit={(event) => event.preventDefault()}
                    >
                        <label className="flex min-w-0 flex-col gap-[5px]">
                            <span className="text-xs font-bold text-[#554e48]">Название</span>
                            <input
                                className="h-[38px] w-full rounded-lg border border-[#d8d0ca] bg-white px-[9px] text-xs text-[#312d29] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]"
                                type="text"
                                autoFocus
                                placeholder="Например, Подарки"
                            />
                        </label>
                        <label className="flex min-w-0 flex-col gap-[5px]">
                            <span className="text-xs font-bold text-[#554e48]">Родительская категория</span>
                            <select className="h-[38px] w-full rounded-lg border border-[#d8d0ca] bg-white px-[9px] text-xs text-[#312d29] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]" defaultValue="">
                                <option value="">Без родительской</option>
                                <option value="backpacks">Рюкзаки</option>
                                <option value="city">Рюкзаки → Городские</option>
                                <option value="bags">Сумки</option>
                                <option value="accessories">Аксессуары</option>
                            </select>
                        </label>
                        <div className="col-span-2 flex justify-end gap-2 max-[620px]:col-span-1">
                            <button type="button" className="button button--secondary min-h-[36px]" onClick={() => setIsCreateFormOpen(false)}>Отмена</button>
                            <button type="submit" className="button button--primary min-h-[36px]">Добавить</button>
                        </div>
                    </form>
                )}

                <div className="grid min-h-0 flex-1 grid-cols-[minmax(420px,1.15fr)_minmax(300px,.85fr)] gap-[14px] px-7 pb-[14px] max-[900px]:grid-cols-1 max-[620px]:px-[14px] max-[620px]:pb-2.5">
                    <div className="flex min-h-0 flex-col">
                        <div className="flex items-center justify-between pb-2 text-xs font-bold text-[#5f5751]">
                            <span>Структура каталога</span>
                            <button type="button" className="border-0 bg-transparent p-0 text-xs font-semibold text-[#7f756e]">Развернуть все</button>
                        </div>
                        <div className="category-tree-list rounded-xl border border-[color:var(--color-border)] bg-white p-1" role="tree" aria-label="Структура каталога">
                            {categories.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    isActionsOpen={openActionsId === category.id}
                                    onToggleActions={() => setOpenActionsId((id) => id === category.id ? null : category.id)}
                                    onCloseActions={() => setOpenActionsId(null)}
                                />
                            ))}
                        </div>
                    </div>

                    <aside className="min-h-0 overflow-auto border-l border-[color:var(--color-border)] pl-4 pt-[5px] max-[900px]:hidden">
                        <h3 className="mb-2.5 mt-0 text-[13px]">Как устроены категории</h3>
                        <GuideItem icon={<FolderIcon />} title="Категории формируют меню" text="Покупатель использует их для навигации по каталогу магазина." />
                        <GuideItem icon={<LayersIcon />} title="До трёх уровней вложенности" text="Объединяйте близкие товары, не усложняя структуру витрины." />
                        <GuideItem icon={<SparklesIcon />} title="Подборки дополняют каталог" text="Новинки и распродажа могут находиться рядом с обычными категориями." />
                        <div className="mt-3 rounded-xl border border-[color:var(--color-border)] bg-white p-[13px]">
                            <strong className="block text-xs">Как это выглядит в магазине</strong>
                            <small className="mt-[3px] block text-xs text-[#918880]">Основные разделы отображаются в навигации витрины.</small>
                            <div className="mt-[9px] flex flex-wrap gap-1.5">
                                {['Рюкзаки', 'Сумки', 'Аксессуары', 'Новинки'].map((name) => <span key={name} className="rounded-lg border border-[#ead1c1] bg-[#fff5ee] px-[9px] py-1.5 text-xs font-semibold text-[#8c3510]">{name}</span>)}
                            </div>
                        </div>
                    </aside>
                </div>

                <footer className="flex min-h-[83px] items-center justify-between gap-[18px] border-t border-[color:var(--color-border)] bg-white px-7 py-[11px] max-[620px]:min-h-0 max-[620px]:flex-col max-[620px]:items-stretch max-[620px]:gap-2 max-[620px]:px-[14px] max-[620px]:py-[9px]">
                    <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
                        <span className="text-xs text-[#706860]"><b className="text-[color:var(--color-accent)]">{categories.length}</b> категорий в структуре</span>
                        <small className="text-xs text-[#918880]">Изменения структуры применяются ко всему каталогу.</small>
                    </div>
                    <button type="button" className="button button--primary min-w-28 justify-center max-[620px]:w-full" onClick={closeModal}>Готово</button>
                </footer>
            </section>
        </div>
    );
}

function CategoryRow({ category, isActionsOpen, onToggleActions, onCloseActions }) {
    return (
        <div className={`category-tree-row category-tree-row--depth-${category.depth ?? 0}`} role="treeitem" aria-level={(category.depth ?? 0) + 1} aria-expanded={category.type === 'parent' ? category.expanded : undefined}>
            <span className="grid place-items-center text-[#b0a8a1]" title="Перетащить"><GripIcon /></span>
            {category.type === 'parent' ? <button type="button" className="tree-toggle" aria-label={`${category.expanded ? 'Свернуть' : 'Развернуть'} ${category.name}`} aria-expanded={category.expanded}><ChevronIcon /></button> : <span />}
            <span />
            <span className={`grid h-6 w-6 place-items-center rounded-[7px] ${category.type === 'parent' ? 'bg-[#fff0e7] text-[color:var(--color-accent)]' : category.type === 'collection' ? 'bg-[#fff6e6] text-[#c67a18]' : 'bg-[#f0f4f6] text-[#667986]'}`}>
                {category.type === 'collection' ? <SparklesIcon /> : <FolderIcon />}
            </span>
            <strong className="truncate text-xs text-[#403a35]">{category.name}</strong>
            <small className="min-w-[30px] rounded-full bg-[#f2efec] px-[7px] py-1 text-center text-xs text-[#8e857e]">{category.count}</small>
            <ActionsMenu
                className="!w-7"
                ariaLabel={`Действия: ${category.name}`}
                isOpen={isActionsOpen}
                onToggle={onToggleActions}
                onClose={onCloseActions}
                actions={[
                    { label: 'Переименовать', icon: <PencilIcon /> },
                    { label: 'Удалить', icon: <TrashIcon />, variant: 'danger' },
                ]}
            />
        </div>
    );
}

function GuideItem({ icon, title, text }) {
    return <p className="mb-3 flex items-start gap-[9px] text-[color:var(--color-accent)]">{icon}<span className="flex flex-col"><strong className="text-xs text-[#544c46]">{title}</strong><small className="mt-0.5 text-xs leading-[1.4] text-[#918880]">{text}</small></span></p>;
}

const Svg = ({ children, size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const CloseIcon = () => <Svg size={19}><path d="M18 6 6 18M6 6l12 12" /></Svg>;
const SearchIcon = () => <Svg size={17}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>;
const PlusIcon = () => <Svg size={15}><path d="M5 12h14M12 5v14" /></Svg>;
const SparklesIcon = () => <Svg size={15}><path d="m12 3-1.4 4.2a2 2 0 0 1-1.3 1.3L5 10l4.3 1.5a2 2 0 0 1 1.3 1.3L12 17l1.4-4.2a2 2 0 0 1 1.3-1.3L19 10l-4.3-1.5a2 2 0 0 1-1.3-1.3L12 3Z" /></Svg>;
const GripIcon = () => <Svg size={15}><circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" /></Svg>;
const ChevronIcon = () => <Svg size={15}><path d="m9 18 6-6-6-6" /></Svg>;
const FolderIcon = () => <Svg size={14}><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></Svg>;
const LayersIcon = () => <Svg size={15}><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></Svg>;
