import { useEffect, useState } from 'react';
import CloseIcon from '../../components/icons/CloseIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import usePageScrollLock from '../../hooks/usePageScrollLock';

const demoOptions = [
    { name: 'Цвет', values: [{ label: 'Коньяк', color: '#a9683e' }, { label: 'Кофе', color: '#51382d' }, { label: 'Чёрный', color: '#262321' }] },
    { name: 'Материал', values: [{ label: 'Натуральная кожа' }, { label: 'Замша' }, { label: 'Текстиль' }] },
    { name: 'Персонализация', values: [{ label: 'Без персонализации' }, { label: 'Инициалы' }, { label: 'Логотип' }] },
];

const demoPhotos = [
    'bg-[linear-gradient(145deg,#b67b55,#5d3828)]',
    'bg-[linear-gradient(145deg,#9e6847,#43291f)]',
    'bg-[linear-gradient(145deg,#765040,#2f201a)]',
    'bg-[linear-gradient(145deg,#55504d,#211f1e)]',
    'bg-[linear-gradient(145deg,#c49775,#674634)]',
];

const demoVariants = [
    ['Коньяк / Кожа / Без персонализации', '6200', '4', 'CITY-KN-01'],
    ['Коньяк / Кожа / Инициалы', '6400', '2', 'CITY-KN-02'],
    ['Кофе / Замша / Без персонализации', '6400', '3', 'CITY-CF-01'],
    ['Кофе / Замша / Логотип', '6600', '1', 'CITY-CF-03'],
    ['Чёрный / Текстиль / Без персонализации', '6200', '6', 'CITY-BL-01'],
    ['Чёрный / Кожа / Инициалы', '6600', '2', 'CITY-BL-02'],
];

const demoCombinationCount = 27;
const combinationLimit = 100;

function Icon({ children, size = 16, className = '' }) {
    return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
}

function PhotoTile({ index, removable = false }) {
    return (
        <div className={`relative h-[66px] w-[54px] shrink-0 overflow-hidden rounded-[8px] border border-[#d9d1cb] ${demoPhotos[index % demoPhotos.length]}`}>
            <i className="absolute inset-[25%] rounded-[35%_35%_18%_18%] border border-white/40 bg-[#39261f]/35" />
            {removable && <button type="button" className="absolute right-[3px] top-[3px] grid h-[19px] w-[19px] place-items-center rounded-full border-0 bg-white/95 text-[#766b63]" aria-label="Убрать фото"><CloseIcon width={11} height={11} /></button>}
            {!removable && <b className="absolute bottom-1 left-1 grid h-[17px] min-w-[17px] place-items-center rounded-[5px] bg-white/90 text-[11px] not-italic">{index + 1}</b>}
        </div>
    );
}

function OptionRow({ option, onDeleteValue }) {
    return (
        <article className="grid grid-cols-[18px_112px_minmax(0,1fr)_30px] items-center gap-3 rounded-[11px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[10px_11px] max-sm:grid-cols-[18px_minmax(0,1fr)_30px]">
            <Icon size={15} className="text-[#aaa19a]"><circle cx="9" cy="5" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="19" r="1" /></Icon>
            <div><small className="block text-[11px] text-[#a19992]">Опция</small><strong className="text-[12px]">{option.name}</strong></div>
            <div className="flex flex-wrap gap-[5px] max-sm:col-start-2">
                {option.values.map((value) => (
                    <button key={value.label} type="button" onClick={() => onDeleteValue(option.name, value.label)} className="inline-flex min-h-[29px] items-center gap-[6px] rounded-full border border-[#ddd5cf] bg-[#f8f4f0] px-[10px] text-[11px] text-[#5d554f]" aria-label={`Удалить значение ${value.label}`}>
                        {value.color && <i className="h-[9px] w-[9px] rounded-full" style={{ backgroundColor: value.color }} />}
                        {value.label}<CloseIcon width={11} height={11} />
                    </button>
                ))}
                <button type="button" className="inline-flex min-h-[29px] items-center gap-[5px] rounded-[7px] border border-dashed border-[#d2aaa0] bg-white px-2 text-[11px] font-bold text-[color:var(--color-accent)]"><PlusIcon size={12} />Добавить значение</button>
            </div>
            <button type="button" className="grid h-[29px] w-[29px] place-items-center rounded-[8px] border border-[#e3d7d0] bg-white text-[#c24820]" aria-label={`Удалить опцию ${option.name}`}><TrashIcon size={14} /></button>
        </article>
    );
}

function RecommendationPanel({ onClose }) {
    const recommendations = [
        ['Цвет', 'Популярные цвета для кожаных рюкзаков', 'Добавлено'],
        ['Размер изделия', 'Размерная сетка для сумок и рюкзаков', 'Мини, стандартный, большой'],
        ['Материал', 'Материалы, подходящие для этой категории', 'Добавлено'],
        ['Персонализация', 'Готовые варианты персонализации', 'Добавлено'],
    ];

    return (
        <section className="rounded-[12px] border border-[#dfb596] bg-[linear-gradient(120deg,#fff8f3,#fff)] p-[13px] shadow-[0_12px_30px_rgba(80,49,29,.06)]">
            <header className="mb-[11px] flex items-start justify-between gap-3">
                <div className="flex items-start gap-[9px]"><span className="grid h-[31px] w-[31px] shrink-0 place-items-center rounded-[9px] bg-[#f9eee7] text-[color:var(--color-accent)]"><Icon size={15}><path d="M12 3l1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3zM5 15l.7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15z" /></Icon></span><p className="m-0 flex flex-col"><strong className="text-[13px]">Для категории «Городские рюкзаки»</strong><small className="mt-[3px] text-[12px] text-[#8e857e]">Добавьте только то, что действительно нужно этому товару.</small></p></div>
                <button type="button" onClick={onClose} className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-[8px] border border-[#e2d8d1] bg-white text-[#847a73]" aria-label="Скрыть рекомендации"><CloseIcon width={15} height={15} /></button>
            </header>
            <div className="grid grid-cols-2 gap-[7px] max-sm:grid-cols-1">
                {recommendations.map(([name, description, status], index) => <button key={name} type="button" disabled={status === 'Добавлено'} className="grid min-h-[70px] grid-cols-[30px_minmax(0,1fr)] items-center gap-x-[9px] rounded-[10px] border border-[#ddd5cf] bg-white p-[10px] text-left text-[#544c46] disabled:bg-[#f6f3f0] disabled:opacity-70"><span className={`row-span-2 grid h-[30px] w-[30px] place-items-center rounded-[8px] ${status === 'Добавлено' ? 'bg-[#e9f4ec] text-[#3c8354]' : 'bg-[#f9eee7] text-[color:var(--color-accent)]'}`}>{status === 'Добавлено' ? <Icon size={14}><path d="m20 6-11 11-5-5" /></Icon> : <PlusIcon size={14} />}</span><p className="m-0 min-w-0"><strong className="block text-[12px]">{name}</strong><small className="block truncate text-[11px] text-[#8f867f]">{description}</small></p><em className="col-start-2 truncate text-[11px] not-italic text-[#a06745]">{status}</em></button>)}
            </div>
            <form className="mt-[10px] grid grid-cols-[minmax(180px,1fr)_minmax(150px,1fr)_minmax(140px,.8fr)_auto] items-end gap-[8px] border-t border-[#eaded6] pt-[10px] max-md:grid-cols-1" onSubmit={(event) => event.preventDefault()}>
                <div><strong className="block text-[12px]">Нет нужной опции?</strong><small className="text-[11px] text-[#91877f]">Создайте свою — она сохранится только в этом товаре.</small></div>
                <input className="h-[38px] rounded-[8px] border border-[#d8d0ca] px-[10px] text-[12px] outline-none" placeholder="Например, Фурнитура" aria-label="Название опции" />
                <input className="h-[38px] rounded-[8px] border border-[#d8d0ca] px-[10px] text-[12px] outline-none" placeholder="Первое значение" aria-label="Первое значение" />
                <button type="submit" className="button button--primary min-h-[38px]"><PlusIcon size={14} />Создать</button>
            </form>
        </section>
    );
}

function PhotosSection({ mainColor, onMainColorChange }) {
    const colors = [{ name: 'Коньяк', color: '#a9683e', photos: [0, 1] }, { name: 'Кофе', color: '#51382d', photos: [2, 3] }, { name: 'Чёрный', color: '#262321', photos: [] }];
    return (
        <section className="overflow-hidden rounded-[13px] border border-[color:var(--color-border)] bg-white">
            <header className="grid min-h-[76px] grid-cols-[minmax(0,1fr)_220px] items-center gap-4 border-b border-[color:var(--color-border)] bg-[linear-gradient(100deg,#fff8f3,#fff)] px-[16px] py-3 max-sm:grid-cols-1">
                <div className="flex items-start gap-[10px]"><span className="grid h-[36px] w-[36px] shrink-0 place-items-center rounded-[10px] bg-[#f9eee7] text-[color:var(--color-accent)]"><Icon size={18}><rect x="3" y="3" width="14" height="18" rx="2" /><path d="m3 16 4-4 3 3 3-3 4 4M20 5v6M17 8h6" /></Icon></span><p className="m-0"><strong className="block text-[13px]">Фотографии вариантов</strong><small className="mt-[3px] block max-w-[520px] text-[12px] leading-[1.45] text-[#8d847d]">Покупатель увидит фотографии выбранного цвета, а не одну картинку на все варианты.</small></p></div>
                <label className="flex flex-col gap-1"><span className="text-[11px] font-bold text-[#716861]">Фото меняются по</span><select className="h-[40px] rounded-[9px] border border-[#d8d0ca] bg-white px-[10px] text-[12px] font-bold"><option>Цвет</option><option>Материал</option></select></label>
            </header>
            <div className="mx-[14px] mt-3 grid grid-cols-[40px_minmax(0,1fr)_220px] items-center gap-[11px] rounded-[11px] border border-[#e4cdbf] bg-[#fff9f5] p-[12px] max-sm:grid-cols-[38px_minmax(0,1fr)]"><span className="grid h-[40px] w-[40px] place-items-center rounded-[10px] bg-white text-[color:var(--color-accent)]"><Icon size={18} className="fill-current"><path d="m12 2.5 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.5-.9 3-6Z" /></Icon></span><p className="m-0"><strong className="block text-[12px]">Основное значение</strong><small className="mt-[3px] block text-[11px] text-[#877d75]">Оно и его фотографии показываются покупателю первыми.</small></p><label className="flex flex-col gap-1 max-sm:col-span-full"><span className="text-[11px] font-bold text-[#716861]">Показывать первым</span><select value={mainColor} onChange={(event) => onMainColorChange(event.target.value)} className="h-[40px] rounded-[9px] border border-[#d8d0ca] bg-white px-[10px] text-[12px] font-bold">{colors.map(({ name }) => <option key={name}>{name}</option>)}</select></label></div>
            <div className="mt-3 grid grid-cols-[minmax(190px,.7fr)_minmax(0,1.3fr)_auto] items-center gap-3 border-y border-[color:var(--color-border)] bg-[#faf8f6] px-[16px] py-3 max-md:grid-cols-1"><div><strong className="block text-[12px]">Общая галерея товара</strong><small className="mt-[3px] block text-[11px] text-[#8f867f]">Загрузите фото один раз и распределите по значениям.</small></div><div className="flex gap-[7px] overflow-x-auto">{demoPhotos.map((_, index) => <PhotoTile key={index} index={index} />)}</div><div className="flex gap-2 text-[11px]"><span className="rounded-full bg-[#eaf4ec] px-2 py-1 font-bold text-[#3c8354]">Фото назначено: 4</span><span className="rounded-full bg-[#fff0e7] px-2 py-1 font-bold text-[color:var(--color-accent)]">Фото не назначено: 1</span></div></div>
            <div className="flex flex-col gap-[9px] p-[13px_14px]">
                {colors.map((item) => <article key={item.name} className={`rounded-[11px] border p-[11px] ${mainColor === item.name ? 'border-[#dcae92] bg-[#fffaf7]' : 'border-[color:var(--color-border)] bg-[#fcfbfa]'}`}><header className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><i className="h-[14px] w-[14px] rounded-full border-2 border-white shadow-[0_0_0_1px_#d6cec8]" style={{ backgroundColor: item.color }} /><span><strong className="block text-[12px]">{item.name}</strong><small className="text-[11px] text-[#928981]">{item.photos.length ? `${item.photos.length} фото` : 'Фотографии не распределены'}</small></span></div><button type="button" onClick={() => onMainColorChange(item.name)} className={`inline-flex min-h-[30px] items-center gap-[5px] rounded-[8px] px-2 text-[11px] font-bold ${mainColor === item.name ? 'border border-[#c4531c] bg-[#fff4ec] text-[color:var(--color-accent)]' : 'border border-transparent bg-transparent text-[#8d837b]'}`}><Icon size={13} className={mainColor === item.name ? 'fill-current' : ''}><path d="m12 2.5 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1-5.9 3.1 1.1-6.5-4.7-4.6 6.5-.9 3-6Z" /></Icon>{mainColor === item.name ? 'Основное значение' : 'Сделать основным'}</button></header><div className="mt-[9px] flex min-h-[66px] gap-[7px] overflow-x-auto">{item.photos.length ? item.photos.map((index) => <PhotoTile key={index} index={index} removable />) : <p className="m-0 inline-flex min-w-[170px] items-center justify-center rounded-[8px] border border-dashed border-[#d9d0c9] px-3 text-[11px] text-[#958b83]">Фото не назначены</p>}<button type="button" className="inline-flex min-w-[118px] items-center justify-center gap-[6px] rounded-[8px] border border-dashed border-[#d0b09d] bg-white px-[10px] text-[11px] font-bold text-[color:var(--color-accent)]"><PlusIcon size={13} />Добавить фото</button></div></article>)}
            </div>
        </section>
    );
}

function VariantsSection({ separatePrices, onTogglePrices }) {
    const [selected, setSelected] = useState([]);
    const [activeVariants, setActiveVariants] = useState(() => demoVariants.map(() => true));
    const allSelected = selected.length === demoVariants.length;
    const toggleRow = (index) => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    const toggleActive = (index) => setActiveVariants((current) => current.map((isActive, itemIndex) => itemIndex === index ? !isActive : isActive));

    return (
        <>
            <section className="grid grid-cols-[48px_minmax(0,1fr)_minmax(190px,240px)] items-center gap-3 rounded-[12px] border border-[#e0b292] bg-[#fffaf7] p-[14px_16px] max-sm:grid-cols-[48px_minmax(0,1fr)]">
                <button type="button" className="switch-control switch-control--strong" role="switch" aria-checked={separatePrices} onClick={onTogglePrices} aria-label="Использовать отдельные цены"><i aria-hidden="true"><Icon size={14}><path d="m20 6-11 11-5-5" /></Icon></i></button><div><strong className="block text-[13px]">Цены отличаются для разных вариантов</strong><small className="mt-[3px] block text-[12px] text-[#8c837c]">Выберите опцию, которая влияет на цену.</small></div><label className="flex flex-col gap-[5px] max-sm:col-span-full"><span className="text-[11px] font-bold text-[#716861]">Цена зависит от</span><select disabled={!separatePrices} className="h-[40px] rounded-[9px] border border-[#d8d0ca] bg-white px-[11px] text-[12px] font-bold disabled:bg-[#f1eeeb] disabled:text-[#9a918a]"><option>Цвет</option><option>Материал</option><option>Вся комбинация</option></select></label>
            </section>
            {demoCombinationCount >= combinationLimit && <div className="flex items-start gap-2 rounded-[10px] border border-[#ebc8a6] bg-[#fff8ed] p-[11px_13px] text-[#7c5228]"><Icon size={17} className="mt-0.5 shrink-0"><path d="M12 9v4M12 17h.01" /><path d="M10.3 3.4 2.6 17a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.4a2 2 0 0 0-3.4 0Z" /></Icon><p className="m-0 text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#5d4430]">Достигнут лимит: {demoCombinationCount} из {combinationLimit} комбинаций</strong>Удалите лишние значения опций, чтобы создать новые комбинации.</p></div>}
            <section className="overflow-hidden rounded-[12px] border border-[color:var(--color-border)] bg-white">
                <header className="flex min-h-[58px] items-center justify-between gap-3 border-b border-[color:var(--color-border)] bg-[#faf8f6] px-[12px]"><div><div className="flex items-center gap-2"><strong className="text-[13px]">Модификации</strong><span className="rounded-full bg-[#eee9e5] px-2 py-1 text-[10px] font-bold text-[#746b64]">{demoCombinationCount} комбинаций</span></div><small className="text-[11px] text-[#978f88]">Ниже показаны демонстрационные комбинации.</small></div><button type="button" className="min-h-[32px] rounded-[8px] border border-[#d8d0ca] bg-white px-[10px] text-[12px] font-bold text-[color:var(--color-accent)]">Изменить все</button></header>
                {selected.length > 0 && <div className="flex min-h-[46px] items-center gap-2 border-b border-[#ead6ca] bg-[#fff7f1] px-[12px] text-[11px]"><strong className="mr-auto text-[12px]">Выбрано: {selected.length}</strong><button type="button" className="rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 font-bold">Изменить цену</button><button type="button" className="rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 font-bold">Изменить остаток</button><button type="button" className="rounded-[7px] border border-[#e1b9ad] bg-white px-2 py-1.5 font-bold text-[#a6402b]">Отключить</button></div>}
                <div className="overflow-x-auto"><div className="min-w-[820px]"><div className="grid min-h-[34px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] bg-[#f7f4f1] px-[10px] text-[10px] font-bold uppercase text-[#918981]"><input type="checkbox" className="checkbox-control" checked={allSelected} onChange={() => setSelected(allSelected ? [] : demoVariants.map((_, index) => index))} aria-label="Выбрать все" /><span>Модификация</span><span>Цена</span><span>Остаток</span><span>SKU</span><span>Активна</span></div>{demoVariants.map((variant, index) => <div key={variant[3]} className="grid min-h-[50px] grid-cols-[34px_minmax(250px,1.5fr)_120px_100px_130px_70px] items-center gap-[8px] border-t border-[#f0ece8] px-[10px]"><input type="checkbox" className="checkbox-control" checked={selected.includes(index)} onChange={() => toggleRow(index)} aria-label={`Выбрать ${variant[0]}`} /><strong className="truncate text-[11px]"><i className="mr-2 inline-block h-[9px] w-[9px] rounded-full bg-[#a9683e]" />{variant[0]}</strong><label className="relative"><input className="h-[32px] w-full rounded-[7px] border border-[color:var(--color-border)] px-2 pr-9 text-[11px] disabled:bg-[#f2efec]" defaultValue={variant[1]} disabled={!separatePrices} /><b className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] text-[#9a928b]">UAH</b></label><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" defaultValue={variant[2]} /><input className="h-[32px] rounded-[7px] border border-[color:var(--color-border)] px-2 text-[11px]" defaultValue={variant[3]} /><label className="switch" aria-label={`Активность ${variant[0]}`}><input className="switch__input" type="checkbox" checked={activeVariants[index]} onChange={() => toggleActive(index)} /><span className="switch__track" /></label></div>)}</div></div>
            </section>
        </>
    );
}

export default function ProductVariantsModal({ isOpen, onClose }) {
    const [showRecommendations, setShowRecommendations] = useState(false);
    const [separatePrices, setSeparatePrices] = useState(true);
    const [mainColor, setMainColor] = useState('Коньяк');
    const [deleteWarning, setDeleteWarning] = useState(null);
    usePageScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen) return;

        setShowRecommendations(demoOptions.length === 0);
        setDeleteWarning(null);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;
        const handleKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="presentation" onMouseDown={onClose}>
            <section className="modal-dialog flex h-[min(900px,calc(100vh-40px))] !w-[min(1380px,100%)] flex-col bg-[#fbfaf8] max-sm:h-full max-sm:!w-full" role="dialog" aria-modal="true" aria-labelledby="variant-manager-title" onMouseDown={(event) => event.stopPropagation()}>
                <header className="flex shrink-0 items-start justify-between gap-[18px] border-b border-[color:var(--color-border)] bg-white px-7 pb-[18px] pt-5 max-sm:px-4"><div><small className="text-[11px] font-bold uppercase tracking-[.05em] text-[color:var(--color-accent)]">Товар · Дополнительные настройки</small><h2 id="variant-manager-title" className="mb-1 mt-[3px] text-[28px] font-[770] tracking-[-.045em] text-[#252525] max-sm:text-[22px]">Модификации товара</h2><p className="m-0 text-[12px] text-[#887f78]">Опции, фотографии, цены и остатки собраны отдельно, чтобы основная карточка оставалась простой.</p></div><button type="button" className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#716861]" onClick={onClose} aria-label="Закрыть модификации"><CloseIcon width={20} height={20} /></button></header>
                <div className="min-h-0 flex-1 overflow-y-auto px-7 py-[20px] max-sm:px-[14px]"><div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3"><div><strong className="block text-[13px]">Опции товара</strong><small className="text-[12px] text-[#968e87]">Shopra предлагает готовые варианты по категории товара.</small></div><button type="button" className="button button--secondary min-h-[40px] shrink-0" onClick={() => setShowRecommendations((current) => !current)} aria-expanded={showRecommendations}><PlusIcon size={15} />Добавить опцию</button></div>
                    {showRecommendations && <RecommendationPanel onClose={() => setShowRecommendations(false)} />}
                    {demoOptions.map((option) => <OptionRow key={option.name} option={option} onDeleteValue={(optionName, valueName) => setDeleteWarning({ optionName, valueName })} />)}
                    {deleteWarning && <div className="flex items-start gap-3 rounded-[10px] border border-[#e5c3bd] bg-[#fff7f5] p-[11px_13px] text-[#a6402b]" role="alert"><TrashIcon /><p className="m-0 flex-1 text-[11px] leading-[1.45]"><strong className="block text-[12px] text-[#633b33]">Значение «{deleteWarning.valueName}» связано с модификациями</strong>Модификации с этим значением опции «{deleteWarning.optionName}» будут удалены вместе с ним.</p><div className="flex shrink-0 gap-2 max-sm:flex-col"><button type="button" className="rounded-[7px] border border-[#d9c9bf] bg-white px-2 py-1.5 text-[11px] font-bold text-[#5d554f]" onClick={() => setDeleteWarning(null)}>Отмена</button><button type="button" className="rounded-[7px] border border-[#d79d8e] bg-white px-2 py-1.5 text-[11px] font-bold text-[#a6402b]" onClick={() => setDeleteWarning(null)}>Удалить значение</button></div></div>}
                    <PhotosSection mainColor={mainColor} onMainColorChange={setMainColor} />
                    <VariantsSection separatePrices={separatePrices} onTogglePrices={() => setSeparatePrices((current) => !current)} />
                </div></div>
                <footer className="flex min-h-[76px] shrink-0 items-center gap-3 border-t border-[color:var(--color-border)] bg-white px-7 py-[11px] max-sm:grid max-sm:grid-cols-2 max-sm:px-[14px]"><div className="flex flex-1 flex-col max-sm:col-span-full"><span className="text-[12px] font-bold">3 опции · 9 значений</span><small className="text-[11px] text-[#928981]">Модификации появятся в карточке товара только после сохранения.</small></div><button type="button" className="button button--secondary min-h-[42px] justify-center" onClick={onClose}>Закрыть</button><button type="button" className="button button--primary min-h-[42px] justify-center" onClick={onClose}><SaveIcon size={16} />Сохранить модификации</button></footer>
            </section>
        </div>
    );
}
