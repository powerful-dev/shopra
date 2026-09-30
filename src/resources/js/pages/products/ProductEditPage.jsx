import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { appName } from '../../adminConfig';
import ActionsMenu from '../../components/admin/ActionsMenu';
import Alert from '../../components/admin/Alert';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import ImageLightbox from '../../components/admin/ImageLightbox';
import { MediaDeleteButton, MediaDragHandle } from '../../components/admin/MediaCardControls';
import RichTextEditor from '../../components/admin/RichTextEditor';
import SearchableSelect from '../../components/admin/SearchableSelect';
import BackIcon from '../../components/icons/BackIcon';
import BoxIcon from '../../components/icons/BoxIcon';
import CategoriesIcon from '../../components/icons/CategoriesIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import EyeIcon from '../../components/icons/EyeIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import UploadIcon from '../../components/icons/UploadIcon';
import CloseIcon from '../../components/icons/CloseIcon';
import RocketIcon from '../../components/icons/RocketIcon';
import ChevronIcon from '../../components/icons/ChevronIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import { csrf, request } from '../../services/api';
import { getShopGroups } from '../../services/shopGroups';
import { addShopItemCategory, deleteShopItemCategory, deleteShopItemMedia, getShopItemMediaConfig, reorderShopItemMedia, uploadShopItemMedia } from '../../services/shopItems';
import useFileDropZone from '../../hooks/useFileDropZone';
import useSectionScroll from '../../hooks/useSectionScroll';
import { formatMediaExtensions } from '../../utils/media';
import { buildShopGroupOptions } from '../../utils/shopGroups';
import CategoriesModal from './CategoriesModal';


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
    const [form, setForm] = useState({ name: '', price: '', old_price: '', quantity: '', description: '', shop_group_id: null, status: isNew ? 'draft' : null });
    const [shopGroupOptions, setShopGroupOptions] = useState([]);
    const [isShopGroupsLoading, setIsShopGroupsLoading] = useState(true);
    const [shopGroupsLoadError, setShopGroupsLoadError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [media, setMedia] = useState([]);
    const [productCategories, setProductCategories] = useState([]);
    const [isCategorySelectOpen, setIsCategorySelectOpen] = useState(false);
    const [categoryToAddId, setCategoryToAddId] = useState(null);
    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [categoryAddError, setCategoryAddError] = useState('');
    const [deletingCategoryIds, setDeletingCategoryIds] = useState([]);
    const [categoryDeleteError, setCategoryDeleteError] = useState('');
    const [isMediaLoading, setIsMediaLoading] = useState(!isNew);
    const [mediaLoadError, setMediaLoadError] = useState('');
    const sectionNavigationRef = useRef(null);
    const sectionRefs = useRef({});
    const shopGroupsRequestRef = useRef(null);
    const productCategoriesRequestRef = useRef(null);
    const productCreationPromiseRef = useRef(null);
    const createdProductIdRef = useRef(isNew ? null : id);
    const skipProductLoadIdRef = useRef(null);
    const scrollToSection = useSectionScroll({ stickyRef: sectionNavigationRef });

    const refreshShopGroupOptions = useCallback(() => {
        shopGroupsRequestRef.current?.abort();
        const controller = new AbortController();
        shopGroupsRequestRef.current = controller;
        setIsShopGroupsLoading(true);
        setShopGroupsLoadError('');

        return getShopGroups({ signal: controller.signal })
            .then((groups) => {
                if (!controller.signal.aborted) {
                    setShopGroupOptions([
                        { value: null, label: 'Без категории' },
                        ...buildShopGroupOptions(groups),
                    ]);
                    setForm((current) => current.shop_group_id === null || groups.some((group) => group.id === current.shop_group_id)
                        ? current
                        : { ...current, shop_group_id: null });
                }
            })
            .catch((error) => {
                if (!controller.signal.aborted) {
                    console.error('Unable to load Shopra categories.', error);
                    setShopGroupsLoadError('Не удалось загрузить категории Shopra.');
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsShopGroupsLoading(false);
                    if (shopGroupsRequestRef.current === controller) shopGroupsRequestRef.current = null;
                }
            });
    }, []);

    useEffect(() => {
        refreshShopGroupOptions();

        return () => shopGroupsRequestRef.current?.abort();
    }, [refreshShopGroupOptions]);

    const refreshProductCategories = useCallback(() => {
        const productId = createdProductIdRef.current;

        if (!productId) return Promise.resolve();

        productCategoriesRequestRef.current?.abort();
        const controller = new AbortController();
        productCategoriesRequestRef.current = controller;

        return request(`/api/products/${productId}`, { signal: controller.signal })
            .then(({ data: product }) => {
                if (!controller.signal.aborted) setProductCategories(product.categories ?? []);
            })
            .catch((error) => {
                if (!controller.signal.aborted) console.error('Unable to refresh product categories.', error);
            })
            .finally(() => {
                if (productCategoriesRequestRef.current === controller) {
                    productCategoriesRequestRef.current = null;
                }
            });
    }, []);

    const handleCategoriesChanged = useCallback(() => {
        refreshShopGroupOptions();
        refreshProductCategories();
    }, [refreshProductCategories, refreshShopGroupOptions]);

    useEffect(() => () => productCategoriesRequestRef.current?.abort(), []);

    useEffect(() => {
        if (isNew) {
            createdProductIdRef.current = null;
            setMedia([]);
            setProductCategories([]);
            setDeletingCategoryIds([]);
            setCategoryDeleteError('');
            setIsMediaLoading(false);
            setMediaLoadError('');

            return undefined;
        }

        createdProductIdRef.current = id;

        if (skipProductLoadIdRef.current === String(id)) {
            skipProductLoadIdRef.current = null;
            setIsMediaLoading(false);
            setMediaLoadError('');

            return undefined;
        }

        let isActive = true;
        setIsMediaLoading(true);
        setMediaLoadError('');
        setMedia([]);
        setProductCategories([]);
        setDeletingCategoryIds([]);
        setCategoryDeleteError('');

        request(`/api/products/${id}`)
            .then(({ data: product }) => {
                if (!isActive) return;

                setForm({
                    name: product.name ?? '',
                    price: product.price ?? '',
                    old_price: product.old_price ?? '',
                    quantity: product.quantity ?? '',
                    description: product.description ?? '',
                    shop_group_id: product.shop_group_id ?? null,
                    status: product.status,
                });
                setMedia(product.media ?? []);
                setProductCategories(product.categories ?? []);
            })
            .catch((error) => {
                console.error(error);

                if (isActive) setMediaLoadError('Не удалось загрузить медиафайлы товара.');
            })
            .finally(() => {
                if (isActive) setIsMediaLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [id, isNew]);

    const updateField = ({ target }) => {
        setForm((current) => ({ ...current, [target.name]: target.value }));
    };

    const createProduct = (status, useDraftDefaults = false) => {
        if (createdProductIdRef.current) {
            return Promise.resolve({ id: createdProductIdRef.current, status: form.status ?? status });
        }

        if (productCreationPromiseRef.current) return productCreationPromiseRef.current;

        const payload = {
            ...form,
            name: form.name.trim() || null,
            price: useDraftDefaults && form.price === '' ? 0 : form.price,
            old_price: form.old_price || null,
            quantity: useDraftDefaults && form.quantity === '' ? 0 : form.quantity,
            status,
        };
        let creationPromise;

        creationPromise = (async () => {
            await csrf();
            const { data: product } = await request('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            createdProductIdRef.current = product.id;
            skipProductLoadIdRef.current = String(product.id);
            setForm((current) => ({ ...current, status: product.status }));
            navigate(`/admin/products/${product.id}`, { replace: true });

            return product;
        })().finally(() => {
            if (productCreationPromiseRef.current === creationPromise) {
                productCreationPromiseRef.current = null;
            }
        });

        productCreationPromiseRef.current = creationPromise;

        return creationPromise;
    };

    const ensureProductForMedia = async () => {
        if (createdProductIdRef.current) return createdProductIdRef.current;

        setIsSubmitting(true);

        try {
            const product = await createProduct('draft', true);

            return product.id;
        } finally {
            setIsSubmitting(false);
        }
    };

    const saveProduct = async (status) => {
        setIsSubmitting(true);

        try {
            let product;

            if (isNew) {
                product = await createProduct(status);
            } else {
                await csrf();
                ({ data: product } = await request(`/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...form, name: form.name.trim() || null, old_price: form.old_price || null, status }),
                }));

                setForm((current) => ({ ...current, status: product.status }));
            }
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

    const detachProductCategory = async (categoryId) => {
        const productId = createdProductIdRef.current;
        if (!productId || deletingCategoryIds.includes(categoryId)) return;

        setDeletingCategoryIds((current) => [...current, categoryId]);
        setCategoryDeleteError('');

        try {
            await deleteShopItemCategory(productId, categoryId);
            setProductCategories((current) => current.filter((category) => category.id !== categoryId));
        } catch (error) {
            console.error(error);
            setCategoryDeleteError('Не удалось убрать товар из категории.');
        } finally {
            setDeletingCategoryIds((current) => current.filter((id) => id !== categoryId));
        }
    };

    const attachProductCategory = async (categoryId) => {
        if (categoryId === null || isAddingCategory) return;

        setCategoryToAddId(categoryId);
        setIsAddingCategory(true);
        setCategoryAddError('');

        try {
            const productId = await ensureProductForMedia();
            const product = await addShopItemCategory(productId, categoryId);
            setProductCategories(product.categories ?? []);
        } catch (error) {
            console.error(error);
            setCategoryAddError('Не удалось добавить товар в категорию.');
        } finally {
            setCategoryToAddId(null);
            setIsAddingCategory(false);
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

            <nav ref={sectionNavigationRef} className="sticky top-[var(--header-height)] z-30 mb-[13px] flex items-center gap-0.5 overflow-x-auto border-b border-[color:var(--color-border)] bg-[rgba(247,246,243,.95)] py-1 backdrop-blur max-lg:top-[62px] max-sm:-mx-[13px] max-sm:px-[13px]" aria-label="Разделы товара">
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
                    <MainSection
                        sectionRef={(element) => { sectionRefs.current.main = element; }}
                        form={form}
                        productCategories={productCategories}
                        isCategorySelectOpen={isCategorySelectOpen}
                        categoryToAddId={categoryToAddId}
                        isAddingCategory={isAddingCategory}
                        categoryAddError={categoryAddError}
                        deletingCategoryIds={deletingCategoryIds}
                        categoryDeleteError={categoryDeleteError}
                        shopGroupOptions={shopGroupOptions}
                        isShopGroupsLoading={isShopGroupsLoading}
                        shopGroupsLoadError={shopGroupsLoadError}
                        onChange={updateField}
                        onShopGroupChange={(shopGroupId) => setForm((current) => ({ ...current, shop_group_id: shopGroupId }))}
                        onDeleteCategory={detachProductCategory}
                        onAddCategory={attachProductCategory}
                        onToggleCategorySelect={() => setIsCategorySelectOpen((isOpen) => !isOpen)}
                        onOpenCategories={() => setIsCategoriesOpen(true)}
                    />
                    <MediaSection
                        sectionRef={(element) => { sectionRefs.current.photo = element; }}
                        productId={id}
                        isNew={isNew}
                        media={media}
                        isLoading={isMediaLoading}
                        loadError={mediaLoadError}
                        resolveProductId={ensureProductForMedia}
                        onMediaUploaded={(uploadedMedia) => {
                            setMedia((current) => [...current, uploadedMedia]
                                .sort((left, right) => left.sort_order - right.sort_order || left.id - right.id));
                        }}
                        onMediaOrderChanged={setMedia}
                    />
                    <PriceSection sectionRef={(element) => { sectionRefs.current.price = element; }} form={form} onChange={updateField} />
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.variants = element; }} id="variants" title="Модификации товара" icon="layers" open>
                        <article className="grid min-h-[82px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[12px_13px] max-md:grid-cols-[38px_minmax(0,1fr)]">
                            <span className="grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[#f1ece8] text-[#81766e]"><SectionIcon type="layers" size={18} /></span>
                            <div><strong className="block text-[13px]">Модификации отключены</strong><small className="mt-0.5 block text-[12px] leading-[1.4] text-[#8c837c]">Обычный товар с одной ценой и общим остатком. Цвета, размеры и другие опции добавляются только при необходимости.</small></div>
                            <button type="button" className="button button--primary min-h-9 max-md:col-span-full max-md:w-full"><PlusIcon />Добавить модификации</button>
                        </article>
                    </AccordionSection>
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.description = element; }} id="description" title="Описание" icon="file">
                        <label className="flex flex-col gap-[7px]">
                            <span className="flex items-center justify-between text-[12px] font-bold text-[#554e48]">Описание товара</span>
                            <RichTextEditor
                                instanceKey="product-description"
                                value={form.description}
                                onChange={(description) => setForm((current) => ({ ...current, description }))}
                                disabled={isSubmitting}
                            />
                        </label>
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
            <CategoriesModal
                isOpen={isCategoriesOpen}
                onClose={() => setIsCategoriesOpen(false)}
                onCategoriesChanged={handleCategoriesChanged}
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

function MainSection({ sectionRef, form, productCategories, isCategorySelectOpen, categoryToAddId, isAddingCategory, categoryAddError, deletingCategoryIds, categoryDeleteError, shopGroupOptions, isShopGroupsLoading, shopGroupsLoadError, onChange, onShopGroupChange, onAddCategory, onDeleteCategory, onToggleCategorySelect, onOpenCategories }) {
    const appCategoryLabel = `Категория ${appName}`;
    const productCategoryIds = new Set(productCategories.map((category) => category.id));
    const primaryCategoryOption = form.shop_group_id === null
        ? null
        : shopGroupOptions.find((option) => option.value === form.shop_group_id);
    const primaryCategory = primaryCategoryOption
        ? { id: primaryCategoryOption.value, name: primaryCategoryOption.name ?? primaryCategoryOption.label }
        : null;
    const visibleProductCategories = primaryCategory
        ? [primaryCategory, ...productCategories.filter((category) => category.id !== primaryCategory.id)]
        : productCategories;

    if (primaryCategory) productCategoryIds.add(primaryCategory.id);

    const productCategoryOptions = shopGroupOptions
        .filter((option) => option.value !== null)
        .map((option) => {
            const isAlreadyAdded = productCategoryIds.has(option.value);

            return {
                ...option,
                disabled: isAddingCategory || isAlreadyAdded,
                showCheck: isAlreadyAdded,
            };
        });

    return (
        <Card sectionRef={sectionRef} id="main" title="Основное" required>
            <Field label={<>Название товара <b className="text-[color:var(--color-accent)]">*</b></>}>
                <input className={fieldClass} name="name" value={form.name} onChange={onChange} />
            </Field>
            <div className="relative mt-[15px]">
                <div className="mb-[7px] text-[12px] font-bold text-[#554e48]">{appCategoryLabel}</div>
                <SearchableSelect
                    name="group_id"
                    className="searchable-select--product-category w-full"
                    options={shopGroupOptions}
                    value={form.shop_group_id}
                    onChange={onShopGroupChange}
                    placeholder={isShopGroupsLoading ? 'Загрузка категорий…' : 'Без категории'}
                    searchPlaceholder="Поиск категории"
                    emptyMessage="Категории не найдены"
                    ariaLabel={appCategoryLabel}
                    disabled={isShopGroupsLoading || Boolean(shopGroupsLoadError)}
                    ariaBusy={isShopGroupsLoading}
                />
                {shopGroupsLoadError && <p className="mt-1.5 text-[12px] text-[#8d857e]" role="alert">{shopGroupsLoadError}</p>}
            </div>
            <div className="mt-[17px] border-t border-[#f0ece8] pt-[15px]">
                <div className="mb-[7px] flex items-center justify-between gap-2 text-[12px] font-bold text-[#554e48]"><span>Категории магазина</span><button type="button" className="inline-flex min-h-[36px] cursor-pointer items-center gap-[6px] rounded-[9px] border border-[#dfc0ac] bg-[#fff8f3] px-[11px] text-[12px] font-[700] text-[color:var(--color-accent)]" onClick={onOpenCategories}><CategoriesIcon />Управление категориями</button></div>
                <p className="mb-[9px] text-[12px] text-[#958d86]">Товар отображается в этих категориях вашего магазина.</p>
                <div className="flex flex-wrap gap-1.5">
                    {visibleProductCategories.length > 0
                        ? visibleProductCategories.map((category) => {
                            const isPrimary = category.id === primaryCategory?.id;
                            const isDeleting = deletingCategoryIds.includes(category.id);

                            return (
                                <span key={category.id} className={`inline-flex min-h-[29px] items-center rounded-lg border border-[#dfd6d0] bg-[#faf8f6] text-[12px] font-[650] text-[#5d554f] ${isPrimary ? 'px-[9px]' : 'gap-1 pl-[9px] pr-1.5'}`}>
                                    {category.name}
                                    {!isPrimary && <button type="button" className="grid h-5 w-5 cursor-pointer place-items-center rounded border-0 bg-transparent p-0 text-[#817870] hover:bg-[#f0ebe7] hover:text-[color:var(--color-accent)] disabled:cursor-wait disabled:opacity-50" aria-label={`Убрать из категории ${category.name}`} disabled={isDeleting} onClick={() => onDeleteCategory(category.id)}><CloseIcon /></button>}
                                </span>
                            );
                        })
                        : <span className="text-[12px] text-[#958d86]">Категории не назначены.</span>}
                    <button type="button" className="flex min-h-[29px] cursor-pointer items-center gap-1 rounded-lg border border-dashed border-[#dfd6d0] bg-white px-[9px] text-[12px] font-[650] text-[color:var(--color-accent)]" aria-expanded={isCategorySelectOpen} onClick={onToggleCategorySelect}><PlusIcon />Добавить</button>
                </div>
                {categoryDeleteError && <p className="mb-0 mt-1.5 text-[12px] text-[#8d857e]" role="alert">{categoryDeleteError}</p>}
                {isCategorySelectOpen && (
                    <div className="mt-2 w-full">
                        <SearchableSelect
                            className="w-full"
                            options={productCategoryOptions}
                            value={categoryToAddId}
                            onChange={onAddCategory}
                            placeholder="Выберите категорию"
                            searchPlaceholder="Поиск категории"
                            emptyMessage="Категории не найдены"
                            ariaLabel="Добавить категорию магазина"
                            ariaBusy={isAddingCategory}
                            disabled={isShopGroupsLoading || Boolean(shopGroupsLoadError)}
                            closeOnSelect={false}
                        />
                        {categoryAddError && <p className="mb-0 mt-1.5 text-[12px] text-[#8d857e]" role="alert">{categoryAddError}</p>}
                    </div>
                )}
            </div>
        </Card>
    );
}

function MediaSection({ sectionRef, media, isLoading, loadError, resolveProductId, onMediaUploaded, onMediaOrderChanged }) {
    const { t, i18n } = useTranslation();
    const inputRef = useRef(null);
    const mediaGridRef = useRef(null);
    const uploadInProgressRef = useRef(false);
    const draggedMediaIdRef = useRef(null);
    const deletedMediaIdsRef = useRef(new Set());
    const deletingMediaIdsRef = useRef(new Set());
    const [pendingMedia, setPendingMedia] = useState([]);
    const [uploadErrors, setUploadErrors] = useState([]);
    const [sortError, setSortError] = useState('');
    const [deleteError, setDeleteError] = useState('');
    const [deletingMediaIds, setDeletingMediaIds] = useState([]);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [draggedMediaId, setDraggedMediaId] = useState(null);
    const [mediaDropTarget, setMediaDropTarget] = useState(null);
    const [isSortingMedia, setIsSortingMedia] = useState(false);
    const [mediaConfig, setMediaConfig] = useState(null);
    const [mediaConfigError, setMediaConfigError] = useState('');
    const isUploading = pendingMedia.length > 0;
    const isDeletingMedia = deletingMediaIds.length > 0;
    const images = media.filter((item) => item.type === 'image');
    const lightboxImages = images.map((item) => ({ src: item.large_url, alt: '' }));
    const imageCount = images.length + pendingMedia.filter((item) => item.type === 'image').length;
    const videoCount = media.filter((item) => item.type === 'video').length
        + pendingMedia.filter((item) => item.type === 'video').length;
    const occupiedMediaSlots = media.length + pendingMedia.length + (isLoading ? 1 : 0);
    const remainingImages = mediaConfig ? Math.max(0, mediaConfig.image.max_count - imageCount) : 0;
    const remainingVideos = mediaConfig ? Math.max(0, mediaConfig.video.max_count - videoCount) : 0;
    const isAddDisabled = isLoading
        || isUploading
        || isSortingMedia
        || isDeletingMedia
        || !mediaConfig
        || (remainingImages === 0 && remainingVideos === 0);
    const acceptedMediaTypes = mediaConfig
        ? [
            ...(remainingImages > 0 ? [...mediaConfig.image.mime_types, ...mediaConfig.image.extensions.map((extension) => `.${extension}`)] : []),
            ...(remainingVideos > 0 ? [...mediaConfig.video.mime_types, ...mediaConfig.video.extensions.map((extension) => `.${extension}`)] : []),
        ].join(',')
        : '';

    useEffect(() => {
        let isActive = true;

        getShopItemMediaConfig()
            .then((config) => {
                if (!isActive) return;

                setMediaConfig(config);
                setMediaConfigError('');
            })
            .catch((error) => {
                console.error(error);

                if (isActive) setMediaConfigError(t('productEditPage.media.configLoadError'));
            });

        return () => {
            isActive = false;
        };
    }, [t]);

    useLayoutEffect(() => {
        const grid = mediaGridRef.current;

        if (!grid) return undefined;

        const updateUploadSpan = () => {
            const styles = window.getComputedStyle(grid);
            const cardWidth = Number.parseFloat(styles.getPropertyValue('--media-card-width'));
            const columnGap = Number.parseFloat(styles.columnGap);

            if (!cardWidth || Number.isNaN(columnGap)) return;

            const columnCount = Math.max(1, Math.floor((grid.clientWidth + columnGap) / (cardWidth + columnGap)));
            const occupiedLastRow = occupiedMediaSlots % columnCount;
            const freeColumns = occupiedLastRow === 0 ? columnCount : columnCount - occupiedLastRow;
            const uploadSpan = freeColumns >= 3 ? freeColumns : columnCount;

            grid.style.setProperty('--media-upload-column-span', String(uploadSpan));
        };

        updateUploadSpan();

        const observer = new ResizeObserver(updateUploadSpan);
        observer.observe(grid);

        return () => observer.disconnect();
    }, [occupiedMediaSlots]);

    const endMediaDrag = () => {
        draggedMediaIdRef.current = null;
        setDraggedMediaId(null);
        setMediaDropTarget(null);
    };

    const moveMedia = async (event, target) => {
        const draggedId = draggedMediaIdRef.current;

        if (draggedId === null || draggedId === target.id || isSortingMedia || isDeletingMedia) return;

        event.preventDefault();
        event.stopPropagation();
        const previousMedia = media;
        const targetRect = event.currentTarget.getBoundingClientRect();
        const position = event.clientX < targetRect.left + targetRect.width / 2 ? 'before' : 'after';
        const reordered = media.filter((item) => item.id !== draggedId);
        const targetIndex = reordered.findIndex((item) => item.id === target.id);
        const insertIndex = targetIndex + (position === 'after' ? 1 : 0);
        const draggedMedia = media.find((item) => item.id === draggedId);

        if (!draggedMedia || targetIndex < 0) {
            endMediaDrag();

            return;
        }

        reordered.splice(insertIndex, 0, draggedMedia);
        const mainImageId = reordered.find((item) => item.type === 'image')?.id ?? null;
        const optimisticMedia = reordered.map((item, index) => ({
            ...item,
            sort_order: index,
            is_main: item.id === mainImageId,
        }));

        endMediaDrag();

        if (optimisticMedia.every((item, index) => item.id === previousMedia[index]?.id)) return;

        setIsSortingMedia(true);
        setSortError('');
        onMediaOrderChanged(optimisticMedia);

        try {
            const productId = await resolveProductId();
            const savedMedia = await reorderShopItemMedia(productId, optimisticMedia.map((item) => item.id));

            onMediaOrderChanged(savedMedia);
        } catch (error) {
            onMediaOrderChanged(previousMedia);
            setSortError(Object.values(error.errors ?? {}).flat().join(' ') || 'Не удалось сохранить порядок медиафайлов.');
        } finally {
            setIsSortingMedia(false);
        }
    };

    const uploadFiles = async (fileList) => {
        const files = Array.from(fileList ?? []);

        if (uploadInProgressRef.current || files.length === 0 || !mediaConfig) return;

        const pending = files.map((file, index) => {
            const extension = file.name.split('.').pop()?.toLowerCase();
            const mimeType = file.type.toLowerCase();
            const type = mediaConfig.video.mime_types.includes(mimeType) || mediaConfig.video.extensions.includes(extension)
                ? 'video'
                : mediaConfig.image.extensions.includes(extension) || mediaConfig.image.mime_types.includes(mimeType)
                    ? 'image'
                    : null;

            return {
                id: `${Date.now()}-${index}-${file.name}`,
                file,
                type,
                previewUrl: type ? URL.createObjectURL(file) : null,
            };
        });
        const errors = [];

        uploadInProgressRef.current = true;
        setUploadErrors([]);
        setPendingMedia(pending);

        let productId;

        try {
            productId = await resolveProductId();
        } catch (error) {
            const validationMessage = Object.values(error.errors ?? {}).flat().join(' ');
            const message = validationMessage || error.message || 'Не удалось создать черновик товара.';

            pending.forEach((item) => {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
            });
            setPendingMedia([]);
            setUploadErrors([{
                message,
                filenames: pending.map((item) => item.file.name),
            }]);
            uploadInProgressRef.current = false;

            return;
        }

        for (const item of pending) {
            try {
                if (!item.type) throw new Error('Поддерживаются только фотографии и видео.');

                const uploadedMedia = await uploadShopItemMedia(productId, item.type, item.file);
                onMediaUploaded(uploadedMedia);
            } catch (error) {
                const validationMessages = Object.values(error.errors ?? {}).flat().filter(Boolean);
                const messages = error.status === 413
                    ? ['Файл слишком большой для загрузки.']
                    : validationMessages.length > 0
                        ? validationMessages
                        : [error.message || 'Не удалось загрузить файл.'];

                messages.forEach((message) => {
                    const existingError = errors.find((uploadError) => uploadError.message === message);

                    if (existingError) {
                        if (!existingError.filenames.includes(item.file.name)) {
                            existingError.filenames.push(item.file.name);
                        }
                    } else {
                        errors.push({ message, filenames: [item.file.name] });
                    }
                });
                setUploadErrors(errors.map((uploadError) => ({
                    ...uploadError,
                    filenames: [...uploadError.filenames],
                })));
            } finally {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
                setPendingMedia((current) => current.filter((pendingItem) => pendingItem.id !== item.id));
            }
        }

        uploadInProgressRef.current = false;
    };

    const deleteMedia = async (item) => {
        if (deletingMediaIdsRef.current.has(item.id)) return;

        deletingMediaIdsRef.current.add(item.id);
        setDeleteError('');
        setDeletingMediaIds((current) => [...current, item.id]);

        try {
            const productId = await resolveProductId();
            const savedMedia = await deleteShopItemMedia(productId, item.id);

            deletedMediaIdsRef.current.add(item.id);
            onMediaOrderChanged(savedMedia.filter((mediaItem) => !deletedMediaIdsRef.current.has(mediaItem.id)));
        } catch (error) {
            const validationMessage = Object.values(error.errors ?? {}).flat().join(' ');

            setDeleteError(validationMessage || error.message || 'Не удалось удалить медиафайл.');
        } finally {
            deletingMediaIdsRef.current.delete(item.id);
            setDeletingMediaIds((current) => current.filter((mediaId) => mediaId !== item.id));
        }
    };
    const { isDragActive, dropZoneProps } = useFileDropZone({
        disabled: isAddDisabled,
        onDrop: (files) => void uploadFiles(files),
    });
    const otherMediaErrors = [...new Set([loadError, mediaConfigError, sortError, deleteError].filter(Boolean))];
    let remainingMediaHint = '';

    if (mediaConfig) {
        const imageRemaining = t('productEditPage.media.imageRemaining', { count: remainingImages });
        const videoRemaining = t('productEditPage.media.videoRemaining', { count: remainingVideos });

        if (remainingImages === 0 && remainingVideos === 0) {
            remainingMediaHint = t('productEditPage.media.noMediaRemaining');
        } else if (remainingImages === 0) {
            remainingMediaHint = t('productEditPage.media.noImagesRemaining', { videos: videoRemaining });
        } else if (remainingVideos === 0) {
            remainingMediaHint = t('productEditPage.media.noVideosRemaining', { images: imageRemaining });
        } else {
            remainingMediaHint = t('productEditPage.media.mediaRemaining', {
                images: imageRemaining,
                videos: videoRemaining,
            });
        }
    }

    return (
        <Card
            sectionRef={sectionRef}
            id="photo"
            title="Фото и видео"
            required
            className={`transition-[border-color,box-shadow] ${isDragActive ? 'border-[color:var(--color-accent)] ring-[3px] ring-[rgba(184,79,24,.09)]' : ''}`}
            sectionProps={dropZoneProps}
        >
            <div ref={mediaGridRef} className="product-media-grid">
                {media.map((item) => {
                    const isDeleting = deletingMediaIds.includes(item.id);

                    return (
                        <div
                            key={item.id}
                            data-media-card
                            className={`media-card relative h-[178px] w-[139px] overflow-hidden rounded-[10px] border bg-[#f5f1ee] transition-[border-color,box-shadow,opacity,transform] max-sm:h-[153px] max-sm:w-[119px] ${draggedMediaId === item.id ? 'scale-[.97] border-[color:var(--color-accent)] opacity-45' : 'border-[color:var(--color-border)]'} ${mediaDropTarget?.id === item.id ? 'border-[color:var(--color-accent)] ring-2 ring-[rgba(184,79,24,.18)]' : ''}`}
                            onDragOver={(event) => {
                                if (draggedMediaIdRef.current === null || isSortingMedia || isDeletingMedia) return;

                                event.preventDefault();
                                event.stopPropagation();
                                const rect = event.currentTarget.getBoundingClientRect();
                                const position = event.clientX < rect.left + rect.width / 2 ? 'before' : 'after';
                                event.dataTransfer.dropEffect = draggedMediaIdRef.current === item.id ? 'none' : 'move';
                                setMediaDropTarget(draggedMediaIdRef.current === item.id ? null : { id: item.id, position });
                            }}
                            onDrop={(event) => void moveMedia(event, item)}
                        >
                            {item.type === 'image' ? (
                                <button
                                    type="button"
                                    draggable={false}
                                    className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0"
                                    aria-label="Открыть фотографию"
                                    onClick={() => {
                                        setLightboxIndex(images.findIndex((image) => image.id === item.id));
                                        setIsLightboxOpen(true);
                                    }}
                                >
                                    <img className="h-full w-full object-cover" src={item.small_url} alt="" draggable={false} />
                                </button>
                            ) : (
                                <video className="h-full w-full bg-black object-cover" src={item.url} controls preload="metadata" draggable={false} />
                            )}
                            <MediaDragHandle
                                className={`${isSortingMedia || isDeletingMedia ? '!cursor-not-allowed opacity-60' : ''} ${draggedMediaId === item.id ? '!cursor-grabbing' : ''}`}
                                aria-label="Изменить порядок медиафайла"
                                title="Перетащить"
                                draggable={!isSortingMedia && !isUploading && !isDeletingMedia}
                                onDragStart={(event) => {
                                    if (isDeletingMedia) {
                                        event.preventDefault();

                                        return;
                                    }

                                    draggedMediaIdRef.current = item.id;
                                    setDraggedMediaId(item.id);
                                    setSortError('');
                                    event.dataTransfer.effectAllowed = 'move';
                                    event.dataTransfer.setData('application/x-shopra-media-id', String(item.id));
                                    event.dataTransfer.setDragImage(event.currentTarget.closest('[data-media-card]') ?? event.currentTarget.parentElement, 20, 20);
                                }}
                                onDragEnd={endMediaDrag}
                            />
                            <MediaDeleteButton
                                aria-label="Удалить медиафайл"
                                title="Удалить"
                                disabled={isDeleting || isSortingMedia}
                                onClick={() => void deleteMedia(item)}
                            />
                            {mediaDropTarget?.id === item.id && (
                                <span className={`pointer-events-none absolute inset-y-2 z-30 w-0.5 rounded-full bg-[color:var(--color-accent)] ${mediaDropTarget.position === 'before' ? 'left-1' : 'right-1'}`} aria-hidden="true" />
                            )}
                            {item.is_main && <span className="pointer-events-none absolute bottom-[5px] right-[5px] rounded-[5px] bg-white/90 px-[5px] py-[3px] text-[11px] font-[750] text-[#9b3f14]">Главное</span>}
                            {isDeleting && (
                                <div className="absolute inset-0 z-30 grid place-items-center bg-black/35" role="status" aria-label="Удаление медиафайла">
                                    <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-white/40 border-t-white" aria-hidden="true" />
                                </div>
                            )}
                        </div>
                    );
                })}
                {pendingMedia.map((item) => (
                    <div key={item.id} className="relative h-[178px] w-[139px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[#f5f1ee] max-sm:h-[153px] max-sm:w-[119px]">
                        {item.type === 'video' ? (
                            <video className="h-full w-full bg-black object-cover" src={item.previewUrl} muted preload="metadata" draggable={false} />
                        ) : item.type === 'image' && item.previewUrl ? (
                            <img className="h-full w-full object-cover" src={item.previewUrl} alt="" draggable={false} />
                        ) : null}
                        <div className="absolute inset-0 z-20 grid place-items-center bg-black/35" role="status" aria-label={`Загрузка ${item.file.name}`}>
                            <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-white/40 border-t-white" aria-hidden="true" />
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="grid h-[178px] w-[139px] place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-[#f8f5f2] max-sm:h-[153px] max-sm:w-[119px]" role="status" aria-label="Загрузка медиафайлов">
                        <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-[#d8cbc2] border-t-[color:var(--color-accent)]" aria-hidden="true" />
                    </div>
                )}
                <label className={`product-media-upload flex h-[178px] min-w-0 flex-col items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[#f8f5f2] px-4 text-[color:var(--color-accent)] max-sm:h-[153px] ${isAddDisabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
                    <input
                        ref={inputRef}
                        className="sr-only"
                        type="file"
                        accept={acceptedMediaTypes}
                        multiple
                        disabled={isAddDisabled}
                        onChange={(event) => {
                            void uploadFiles(event.target.files);
                            event.target.value = '';
                        }}
                    />
                    <UploadIcon />
                    <strong className="mt-1.5 text-[11px] text-[#5d554f]">Добавить</strong>
                    {mediaConfig && (
                        <span className="mt-2 space-y-0.5 text-center text-[12px] leading-[1.4] text-[#98918a]">
                            <small className="block">{t('productEditPage.media.imageRequirements', {
                                formats: formatMediaExtensions(mediaConfig.image.extensions),
                                size: new Intl.NumberFormat(i18n.resolvedLanguage).format(mediaConfig.image.max_kilobytes / 1024),
                            })}</small>
                            <small className="block">{t('productEditPage.media.videoRequirements', {
                                formats: formatMediaExtensions(mediaConfig.video.extensions),
                                size: new Intl.NumberFormat(i18n.resolvedLanguage).format(mediaConfig.video.max_kilobytes / 1024),
                            })}</small>
                        </span>
                    )}
                </label>
            </div>
            {mediaConfig && <p className="mt-2 text-[12px] leading-[1.45] text-[#9c948e]">{remainingMediaHint}</p>}
            {(uploadErrors.length > 0 || otherMediaErrors.length > 0) && (
                <div className="mt-3 space-y-2">
                    {uploadErrors.map(({ message, filenames }) => (
                        <Alert key={`upload-${message}`} variant="error" className="items-start">
                            <span className="min-w-0">
                                <strong className="block">{message}</strong>
                                <span className="mt-0.5 block break-words font-medium text-[#766d66]">
                                    {filenames.length === 1 ? 'Файл' : 'Файлы'}: {filenames.join(', ')}
                                </span>
                            </span>
                        </Alert>
                    ))}
                    {otherMediaErrors.map((message) => (
                        <Alert key={`media-${message}`} variant="error">{message}</Alert>
                    ))}
                </div>
            )}
            <ImageLightbox
                images={lightboxImages}
                index={lightboxIndex}
                open={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                onIndexChange={setLightboxIndex}
            />
        </Card>
    );
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

function Card({ sectionRef, id, title, required, children, bodyClassName = 'p-[15px_17px_17px] max-sm:p-[13px]', className = '', sectionProps = {} }) {
    return <section ref={sectionRef} id={id} className={`rounded-[14px] border border-[color:var(--color-border)] bg-white shadow-[0_7px_24px_rgba(70,47,31,.03)] ${className}`} {...sectionProps}><header className="flex min-h-[48px] items-center gap-[9px] border-b border-[#f0ece8] px-[17px]"><h2 className="text-[15px] font-[740]">{title}</h2>{required && <em className="rounded-full bg-[color:var(--color-success-soft)] px-[7px] py-1 text-[11px] font-[720] not-italic text-[color:var(--color-success)]">Обязательно</em>}</header><div className={bodyClassName}>{children}</div></section>;
}

function AccordionSection({ sectionRef, id, title, icon, children, open = false }) {
    return <details ref={sectionRef} id={id} className="accordion" open={open}><summary className="accordion__summary"><span className="accordion__icon"><SectionIcon type={icon} /></span><strong className="accordion__title">{title}</strong><em className="accordion__badge">Необязательно</em><ChevronIcon /></summary><div className="accordion__body">{children}</div></details>;
}

function Field({ label, children }) { return <label className="flex flex-col gap-[7px]"><span className="text-[12px] font-bold text-[#554e48]">{label}</span>{children}</label>; }
function PriceField({ label, name, value, onChange, suffix, required }) { return <Field label={<>{label} {required && <b className="text-[color:var(--color-accent)]">*</b>}</>}><span className="relative"><input className={`${fieldClass} pr-11 font-bold`} name={name} value={value} onChange={onChange} /><b className="absolute right-[11px] top-1/2 -translate-y-1/2 text-[11px] text-[#8d857f]">{suffix}</b></span></Field>; }

function SectionIcon({ type, size = 14 }) {
    const paths = { box: 'm16 16 2 2 4-4M21 10V8l-9-6-9 6v8l9 6 3-1', photo: 'M16 5h6M19 2v6M21 12v7H3V3h10M3 17l6-6 4 4 3-3 5 5', price: 'M16 8h-6a2 2 0 100 4h4a2 2 0 110 4H8M12 18V6', layers: 'm2 7 10-5 10 5-10 5L2 7m0 5 10 5 10-5M2 17l10 5 10-5', file: 'M15 2H6v20h14V7l-5-5zm-1 0v6h6M8 13h8M8 17h8', sliders: 'M20 7h-9M14 17H5M17 14v6M7 4v6', truck: 'M14 18V4H2v14h3m10 0H9m10 0h3v-5l-4-5h-4m3 12a2 2 0 100-4 2 2 0 000 4zM7 20a2 2 0 100-4 2 2 0 000 4z', link: 'M9 17H7A5 5 0 017 7h2m6 0h2a5 5 0 010 10h-2M8 12h8' };
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}
