import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ActionsMenu from '../../components/admin/ActionsMenu';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import BackIcon from '../../components/icons/BackIcon';
import BoxIcon from '../../components/icons/BoxIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import EyeIcon from '../../components/icons/EyeIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import UploadIcon from '../../components/icons/UploadIcon';
import CloseIcon from '../../components/icons/CloseIcon';
import RocketIcon from '../../components/icons/RocketIcon';
import ChevronIcon from '../../components/icons/ChevronIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import { csrf, request } from '../../services/api';
import useSectionScroll from '../../hooks/useSectionScroll';


const fieldClass = 'h-[43px] w-full rounded-[9px] border border-[#ddd5cf] bg-white px-[11px] text-[13px] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]';

const sectionLinks = [
    ['main', 'Основное', 'box'],
    ['photo', 'Фото', 'photo'],
    ['price', 'Цена и наличие', 'price'],
    ['variants', 'Варианты', 'layers'],
    ['description', 'Описание', 'file'],
    ['features', 'Характеристики', 'sliders'],
    ['delivery', 'Доставка', 'truck'],
    ['seo', 'SEO', 'link'],
];

export default function ProductEditPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;
    const [form, setForm] = useState({ name: '', price: '', old_price: '', quantity: '', status: isNew ? 'draft' : null });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const sectionNavigationRef = useRef(null);
    const sectionRefs = useRef({});
    const scrollToSection = useSectionScroll({ stickyRef: sectionNavigationRef });

    useEffect(() => {
        if (isNew) return undefined;

        let isActive = true;

        request(`/api/products/${id}`)
            .then(({ data: product }) => {
                if (!isActive) return;

                setForm({
                    name: product.name ?? '',
                    price: product.price ?? '',
                    old_price: product.old_price ?? '',
                    quantity: product.quantity ?? '',
                    status: product.status,
                });
            })
            .catch((error) => console.error(error));

        return () => {
            isActive = false;
        };
    }, [id, isNew]);

    const updateField = ({ target }) => {
        setForm((current) => ({ ...current, [target.name]: target.value }));
    };

    const saveProduct = async (status) => {
        setIsSubmitting(true);

        try {
            await csrf();
            const { data: product } = await request(isNew ? '/api/products' : `/api/products/${id}`, {
                method: isNew ? 'POST' : 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...form, old_price: form.old_price || null, status }),
            });

            setForm((current) => ({ ...current, status: product.status }));

            if (isNew) navigate(`/admin/products/${product.id}`, { replace: true });
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const deleteProduct = async () => {
        setIsDeleting(true);

        try {
            await csrf();
            await request(`/api/products/${id}`, { method: 'DELETE' });
            navigate('/admin/products', { replace: true });
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div>
            <Breadcrumbs
                className="mb-5 max-lg:hidden"
                currentLabel={isNew ? 'Новый товар' : form.name}
            />

            <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Link to="/admin/products" className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#615950] max-lg:h-8 max-lg:w-8" aria-label="Вернуться к товарам"><BackIcon /></Link>
                    <div className="min-w-0">
                        <h1 className="m-0 truncate text-[32px] font-[760] tracking-[-0.05em] max-lg:text-[19px]">
                            {isNew ? 'Новый товар' : 'Редактирование товара'}
                        </h1>
                    </div>
                </div>
            </header>

            <nav ref={sectionNavigationRef} className="sticky top-[var(--header-height)] z-20 mb-[13px] flex items-center gap-0.5 overflow-x-auto border-b border-[color:var(--color-border)] bg-[rgba(247,246,243,.95)] py-1 backdrop-blur max-lg:top-[62px] max-sm:-mx-[13px] max-sm:px-[13px]" aria-label="Разделы товара">
                {sectionLinks.map(([id, label, icon], index) => (
                    <button key={id} type="button" className={`flex min-h-[45px] shrink-0 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-2.5 text-[12px] font-[680] ${index === 0 ? 'relative text-[color:var(--color-accent)] after:absolute after:inset-x-2.5 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[color:var(--color-accent)]' : 'text-[#756e67]'}`} onClick={() => scrollToSection(sectionRefs.current[id])}>
                        <span className={`grid h-[25px] w-[25px] place-items-center rounded-lg ${index === 0 ? 'bg-[#f9eee7]' : 'bg-[#f0ebe7]'}`}><SectionIcon type={icon} /></span>{label}
                    </button>
                ))}
            </nav>

            <section className="mb-5 flex items-center gap-4 rounded-[14px] border border-[#eadfd7] bg-[#fffaf6] p-4 max-sm:items-start">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[conic-gradient(var(--color-accent)_40%,#eadfd7_0)]"><span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white text-[11px] font-[760]">40%</span></div>
                <div className="min-w-0 flex-1"><strong className="block text-[13px]">Уже можно продавать</strong><small className="mt-1 block text-[12px] text-[color:var(--color-secondary)]">Заполните ещё 3 раздела, чтобы карточка выглядела убедительнее.</small></div>
                <div className="flex gap-[7px] max-md:hidden">
                    {isNew ? (
                        <StatusActions status={form.status} isNew isSubmitting={isSubmitting} onSave={saveProduct} />
                    ) : form.status && (
                        <>
                            <button className="button button--primary min-h-[39px] min-w-[120px] whitespace-nowrap" type="button" disabled={isSubmitting} onClick={() => saveProduct(form.status)}><SaveIcon />Сохранить</button>
                            <button className="button button--outline min-h-[39px] whitespace-nowrap" type="button"><EyeIcon />Предпросмотр</button>
                            <ActionsMenu
                                ariaLabel={`Действия ${form.name || 'товара'}`}
                                isOpen={isActionsOpen}
                                onToggle={() => setIsActionsOpen((isOpen) => !isOpen)}
                                onClose={() => setIsActionsOpen(false)}
                                actions={[
                                    {
                                        label: 'Перенести в архив',
                                        icon: <BoxIcon />,
                                        disabled: isSubmitting || form.status === 'archived',
                                        onClick: () => saveProduct('archived'),
                                    },
                                    {
                                        label: 'Удалить товар',
                                        icon: <TrashIcon />,
                                        variant: 'danger',
                                        disabled: isDeleting,
                                        onClick: () => setIsDeleteConfirmOpen(true),
                                    },
                                ]}
                            />
                        </>
                    )}
                </div>
            </section>

            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_280px]">
                <form className="space-y-3" aria-label="Данные товара" onSubmit={(event) => event.preventDefault()}>
                    <MainSection sectionRef={(element) => { sectionRefs.current.main = element; }} form={form} onChange={updateField} />
                    <MediaSection sectionRef={(element) => { sectionRefs.current.photo = element; }} />
                    <PriceSection sectionRef={(element) => { sectionRefs.current.price = element; }} form={form} onChange={updateField} />
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.variants = element; }} id="variants" title="Модификации товара" icon="layers" open>
                        <article className="grid min-h-[82px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[12px_13px] max-md:grid-cols-[38px_minmax(0,1fr)]">
                            <span className="grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[#f1ece8] text-[#81766e]"><SectionIcon type="layers" size={18} /></span>
                            <div><strong className="block text-[13px]">Модификации отключены</strong><small className="mt-0.5 block text-[12px] leading-[1.4] text-[#8c837c]">Обычный товар с одной ценой и общим остатком. Цвета, размеры и другие опции добавляются только при необходимости.</small></div>
                            <button type="button" className="button button--primary min-h-9 max-md:col-span-full max-md:w-full"><PlusIcon />Добавить модификации</button>
                        </article>
                    </AccordionSection>
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.description = element; }} id="description" title="Описание" icon="file">
                        <label className="flex flex-col gap-[7px]"><span className="flex items-center justify-between text-[12px] font-bold text-[#554e48]">Описание товара<button type="button" className="inline-flex items-center gap-[5px] rounded-[7px] border-0 bg-[#f9eee7] px-[7px] py-[5px] text-[11px] font-[720] text-[color:var(--color-accent)]">◇ Помочь написать</button></span><textarea className="h-[116px] w-full resize-y rounded-[9px] border border-[#ddd5cf] bg-white p-[11px] text-[13px] leading-normal outline-none" placeholder="Расскажите о товаре" /></label>
                    </AccordionSection>
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.features = element; }} id="features" title="Характеристики" icon="sliders"><Field label="Характеристики товара"><input className={fieldClass} type="text" placeholder="Например: материал — натуральная кожа" /></Field></AccordionSection>
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.delivery = element; }} id="delivery" title="Доставка" icon="truck"><Field label="Группа доставки"><select className={fieldClass} defaultValue="standard"><option value="standard">Стандартная доставка</option><option>Крупногабаритный товар</option><option>Самовывоз</option></select></Field></AccordionSection>
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.seo = element; }} id="seo" title="SEO" icon="link">
                        <Field label="Заголовок для поиска"><input className={fieldClass} type="text" defaultValue="Кожаный рюкзак CITY — купить в Shopra" /></Field>
                        <div className="mt-[13px] rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-3"><small className="text-[11px] text-[color:var(--color-success)]">shopra.store/products/kozhanyy-ryukzak-city</small><strong className="mt-[3px] block text-[12px] text-[#375b8b]">Кожаный рюкзак CITY — купить в Shopra</strong><p className="mt-[3px] text-[11px] text-[#7c746e]">Городской кожаный рюкзак CITY. Доставка по Украине, удобная оплата и гарантия качества.</p></div>
                    </AccordionSection>
                </form>
                <ProductAside />
            </div>

            <ConfirmModal
                isOpen={isDeleteConfirmOpen}
                title="Подтвердите удаление"
                message={`Удалить товар ${form.name || ''}?`}
                confirmText="Удалить"
                cancelText="Отмена"
                isLoading={isDeleting}
                variant="danger"
                onConfirm={deleteProduct}
                onClose={() => setIsDeleteConfirmOpen(false)}
            />

        </div>
    );
}

function StatusActions({ status, isNew, isSubmitting, onSave }) {
    if (!isNew && !status) return null;

    const currentStatus = isNew ? 'draft' : status;
    const nextStatus = status === 'active' ? 'archived' : 'active';
    const saveLabel = isNew ? 'Сохранить черновик' : 'Сохранить';
    const statusLabel = status === 'active' ? 'Перенести в архив' : 'Опубликовать';

    return <>
            <button className="button button--outline min-h-[39px] flex-1 whitespace-nowrap sm:min-w-[120px]" type="button" disabled={isSubmitting} onClick={() => onSave(currentStatus)}><SaveIcon />{saveLabel}</button>
            <button className="button button--primary min-w-[132px] min-h-[39px]" type="button" disabled={isSubmitting} onClick={() => onSave(nextStatus)}>{nextStatus === 'active' && <RocketIcon />}{statusLabel}</button>
        </>;
}

function MainSection({ sectionRef, form, onChange }) {
    return (
        <Card sectionRef={sectionRef} id="main" title="Основное" required>
            <Field label={<>Название товара <b className="text-[color:var(--color-accent)]">*</b></>}>
                <input className={fieldClass} name="name" value={form.name} onChange={onChange} />
            </Field>
            <div className="relative mt-[15px]">
                <div className="mb-[7px] flex items-center justify-between gap-2 text-[12px] font-bold text-[#554e48]">
                    <span>Категория Shopra</span>
                    <em className="rounded-full bg-[#f9eee7] px-[7px] py-1 text-[11px] not-italic text-[color:var(--color-accent)]">Подобрана автоматически</em>
                </div>
                <details className="group">
                    <summary className="grid min-h-[58px] cursor-pointer list-none grid-cols-[34px_minmax(0,1fr)_auto] items-center gap-[9px] rounded-[10px] border border-[#dfc4b3] bg-[linear-gradient(100deg,#fff9f5,#fff)] p-[9px_11px]">
                        <span className="grid h-[31px] w-[31px] place-items-center rounded-[9px] bg-[#f9eee7] text-[color:var(--color-accent)]">◇</span>
                        <span className="flex min-w-0 flex-col">
                            <strong className="text-[12px]">Городские рюкзаки</strong>
                            <small className="mt-0.5 truncate text-[12px] text-[#938a83]">Рюкзаки и сумки → Рюкзаки → Городские рюкзаки</small>
                        </span>
                        <b className="text-[12px] text-[color:var(--color-accent)]">Изменить</b>
                    </summary>
                </details>
                <div className="mt-2 flex items-start gap-2 text-[color:var(--color-accent)]"><span className="shrink-0">◇</span><p><strong className="block text-[11px] text-[#6c635d]">Shopra выбрала категорию по названию товара</strong><small className="mt-0.5 block text-[11px] text-[#99918a]">Никакого опроса: принять вариант можно одним кликом.</small></p></div>
            </div>
            <div className="mt-[17px] border-t border-[#f0ece8] pt-[15px]">
                <div className="mb-[7px] flex items-center justify-between gap-2 text-[12px] font-bold text-[#554e48]"><span>Категории магазина</span><button type="button" className="inline-flex min-h-[36px] items-center gap-[6px] rounded-[9px] border border-[#dfc0ac] bg-[#fff8f3] px-[11px] text-[12px] font-[700] text-[color:var(--color-accent)]"><SectionIcon type="folder" />Управление категориями</button></div>
                <p className="mb-[9px] text-[12px] text-[#958d86]">Эти разделы покупатель увидит в каталоге вашего магазина.</p>
                <div className="flex flex-wrap gap-1.5">{['Городские', 'Новинки', 'Распродажа'].map((label) => <button key={label} type="button" className="flex min-h-[29px] items-center gap-1 rounded-lg border border-[#dfd6d0] bg-[#faf8f6] px-[9px] text-[12px] font-[650] text-[#5d554f]">{label}<CloseIcon /></button>)}<button type="button" className="flex min-h-[29px] items-center gap-1 rounded-lg border border-dashed border-[#dfd6d0] bg-white px-[9px] text-[12px] font-[650] text-[color:var(--color-accent)]"><PlusIcon />Добавить</button></div>
            </div>
        </Card>
    );
}

function MediaSection({ sectionRef }) {
    const photos = ['bg-[linear-gradient(145deg,#d9ae84,#8d512b)]', 'bg-[linear-gradient(145deg,#c99a70,#714226)]', 'bg-[linear-gradient(145deg,#937565,#4c3328)]'];
    return <Card sectionRef={sectionRef} id="photo" title="Фото и видео" required><div className="flex flex-wrap gap-2">{photos.map((background, index) => <div key={background} className={`relative h-[178px] w-[139px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] ${background} max-sm:h-[153px] max-sm:w-[119px]`}>{index === 0 && <span className="absolute bottom-[5px] right-[5px] rounded-[5px] bg-white/90 px-[5px] py-[3px] text-[11px] font-[750] text-[#9b3f14]">Главное</span>}<i className="absolute inset-[24%] rounded-[36%_36%_18%_18%] border border-white/40 bg-[#62391f]/50" /></div>)}<label className="flex h-[178px] w-[139px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[#f8f5f2] text-[color:var(--color-accent)] max-sm:h-[153px] max-sm:w-[119px]"><input className="sr-only" type="file" accept="image/*" multiple /><UploadIcon /><strong className="mt-1.5 text-[11px] text-[#5d554f]">Добавить</strong><small className="text-[11px] text-[#98918a]">фото или видео</small></label></div><p className="mt-2 text-[12px] text-[#9c948e]">Перетащите фото, чтобы изменить порядок. Можно добавить ещё 17 фото и 2 видео.</p></Card>;
}

function PriceSection({ sectionRef, form, onChange }) {
    return <Card sectionRef={sectionRef} id="price" title="Цена и наличие" required bodyClassName="grid grid-cols-3 gap-3 p-[15px_17px_17px] max-md:grid-cols-1 max-sm:p-[13px]"><PriceField label="Цена" name="price" value={form.price} onChange={onChange} suffix="грн" required /><PriceField label="Старая цена" name="old_price" value={form.old_price} onChange={onChange} suffix="грн" /><PriceField label="Количество" name="quantity" value={form.quantity} onChange={onChange} suffix="шт" required /><label className="col-span-full flex items-center gap-[7px] text-[12px] text-[#6d655e]"><input className="h-[14px] w-[14px] accent-[color:var(--color-accent)]" type="checkbox" defaultChecked />Показывать остаток на витрине</label></Card>;
}

function ProductAside() {
    return (
        <aside className="space-y-4 xl:sticky xl:top-[calc(var(--header-height)+24px)]">
            <section className="rounded-[16px] border border-[color:var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
                <h2 className="mb-3 text-[13px] font-[750]">Что улучшить</h2>
                <div className="space-y-1 text-[12px]">{['Варианты', 'Описание', 'Характеристики', 'Доставка', 'SEO', 'Видео'].map((label) =>
                    <button key={label} className="flex min-h-[30px] w-full items-center gap-[7px] border-0 bg-transparent p-0 text-left text-[#625a54]" type="button">
                        <span className="grid h-[18px] w-[18px] place-items-center rounded-full border border-[#d8d0ca] text-[#837a73]"><PlusIcon width={12} height={12} /></span>
                        {label}<span className="ml-auto grid h-[18px] w-[18px] place-items-center rounded-full border border-[#d8d0ca] text-[#8b837d]"><CloseIcon /></span>
                    </button>)}
                </div>
            </section>

            <section className="overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)]">
                <header className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
                    <h2 className="text-[13px] font-[750]">Предпросмотр</h2><EyeIcon /></header>
                    <div className="p-4">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[linear-gradient(145deg,#d9ae84,#8d512b)]">
                            <div className="absolute inset-x-[30%] bottom-[18%] top-[24%] rounded-[38%_38%_17%_17%] border border-white/40 bg-[#62391f]/50" />
                        </div>
                        <div className="mt-[7px] grid grid-cols-5 gap-1">
                            <span className="relative aspect-square overflow-hidden rounded-[5px] bg-[linear-gradient(145deg,#d9ae84,#8d512b)]" />
                            <span className="relative aspect-square overflow-hidden rounded-[5px] bg-[linear-gradient(145deg,#c99a70,#714226)]" />
                            <button type="button" className="grid aspect-square place-items-center rounded-[5px] border border-[color:var(--color-border)] bg-white p-0 text-[#766e67]"><PlusIcon /></button>
                        </div>
                        <small className="mt-4 block text-[10px] uppercase tracking-[.06em] text-[#9a938d]">Городские рюкзаки</small>
                        <strong className="mt-1 block text-[13px]">Кожаный рюкзак CITY</strong>
                        <b className="mt-2 block text-[15px]">6 200 грн</b>
                        <span className="mt-[7px] inline-flex items-center gap-[5px] rounded-[7px] bg-[#f7f2ee] px-[7px] py-[5px] text-[11px] font-[680] text-[#736960]">
                            <i className="h-[9px] w-[9px] rounded-full bg-[#a9683e]" />По умолчанию: Коньяк
                        </span>
                    </div>
            </section>

            <div className="flex gap-3 rounded-[13px] border border-[#eadfd7] bg-[#fffaf6] p-3 text-[11px] text-[#70675f]">
                <span className="text-[color:var(--color-accent)]">◇</span><p><strong className="block text-[#3d3732]">Ничего лишнего</strong>
                <span className="mt-1 block">Основного уже достаточно. Остальное можно заполнить позже.</span></p>
            </div>
        </aside>);
}

function Card({ sectionRef, id, title, required, children, bodyClassName = 'p-[15px_17px_17px] max-sm:p-[13px]' }) {
    return <section ref={sectionRef} id={id} className="rounded-[14px] border border-[color:var(--color-border)] bg-white shadow-[0_7px_24px_rgba(70,47,31,.03)]"><header className="flex min-h-[48px] items-center gap-[9px] border-b border-[#f0ece8] px-[17px]"><h2 className="text-[15px] font-[740]">{title}</h2>{required && <em className="rounded-full bg-[color:var(--color-success-soft)] px-[7px] py-1 text-[11px] font-[720] not-italic text-[color:var(--color-success)]">Обязательно</em>}</header><div className={bodyClassName}>{children}</div></section>;
}

function AccordionSection({ sectionRef, id, title, icon, children, open = false }) {
    return <details ref={sectionRef} id={id} className="accordion" open={open}><summary className="accordion__summary"><span className="accordion__icon"><SectionIcon type={icon} /></span><strong className="accordion__title">{title}</strong><em className="accordion__badge">Необязательно</em><ChevronIcon /></summary><div className="accordion__body">{children}</div></details>;
}

function Field({ label, children }) { return <label className="flex flex-col gap-[7px]"><span className="text-[12px] font-bold text-[#554e48]">{label}</span>{children}</label>; }
function PriceField({ label, name, value, onChange, suffix, required }) { return <Field label={<>{label} {required && <b className="text-[color:var(--color-accent)]">*</b>}</>}><span className="relative"><input className={`${fieldClass} pr-11 font-bold`} name={name} value={value} onChange={onChange} /><b className="absolute right-[11px] top-1/2 -translate-y-1/2 text-[11px] text-[#8d857f]">{suffix}</b></span></Field>; }

function SectionIcon({ type, size = 14 }) {
    const paths = { box: 'm16 16 2 2 4-4M21 10V8l-9-6-9 6v8l9 6 3-1', photo: 'M16 5h6M19 2v6M21 12v7H3V3h10M3 17l6-6 4 4 3-3 5 5', price: 'M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8M12 18V6', layers: 'm2 7 10-5 10 5-10 5L2 7m0 5 10 5 10-5M2 17l10 5 10-5', file: 'M15 2H6v20h14V7l-5-5zm-1 0v6h6M8 13h8M8 17h8', sliders: 'M20 7h-9M14 17H5M17 14v6M7 4v6', truck: 'M14 18V4H2v14h3m10 0H9m10 0h3v-5l-4-5h-4m3 12a2 2 0 100-4 2 2 0 000 4zM7 20a2 2 0 100-4 2 2 0 000 4z', link: 'M9 17H7A5 5 0 017 7h2m6 0h2a5 5 0 010 10h-2M8 12h8', folder: 'M3 5v14h18V8h-9l-2-3H3' };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}
