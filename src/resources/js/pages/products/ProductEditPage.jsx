import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { appName, supportedCurrencies } from '../../adminConfig';
import ActionsMenu from '../../components/admin/ActionsMenu';
import AdminCard from '../../components/admin/AdminCard';
import AdminMobileActionBar from '../../components/admin/AdminMobileActionBar';
import Alert from '../../components/admin/Alert';
import Breadcrumbs from '../../components/admin/Breadcrumbs';
import ConfirmModal from '../../components/admin/ConfirmModal';
import ImageLightbox from '../../components/admin/ImageLightbox';
import { MediaDeleteButton, MediaDragHandle } from '../../components/admin/MediaCardControls';
import ProductStatusBadge from '../../components/admin/ProductStatusBadge';
import RichTextEditor from '../../components/admin/RichTextEditor';
import SearchableSelect from '../../components/admin/SearchableSelect';
import SectionNavigation from '../../components/admin/SectionNavigation';
import SeoFields from '../../components/admin/SeoFields';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import Select from '../../components/form/Select';
import BackIcon from '../../components/icons/BackIcon';
import BoxIcon from '../../components/icons/BoxIcon';
import PhotoIcon from '../../components/icons/PhotoIcon';
import CurrencyIcon from '../../components/icons/CurrencyIcon';
import LayersIcon from '../../components/icons/LayersIcon';
import DraftProductsIcon from '../../components/icons/DraftProductsIcon';
import ControlsIcon from '../../components/icons/ControlsIcon';
import LinkIcon from '../../components/icons/LinkIcon';
import CategoriesIcon from '../../components/icons/CategoriesIcon';
import PlusIcon from '../../components/icons/PlusIcon';
import EyeIcon from '../../components/icons/EyeIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import UploadIcon from '../../components/icons/UploadIcon';
import CloseIcon from '../../components/icons/CloseIcon';
import RocketIcon from '../../components/icons/RocketIcon';
import ChevronIcon from '../../components/icons/ChevronIcon';
import SaveIcon from '../../components/icons/SaveIcon';
import PencilIcon from '../../components/icons/PencilIcon';
import { ApiError, csrf, request } from '../../services/api';
import { getShopAttributes } from '../../services/shopAttributes';
import { getShopGroups } from '../../services/shopGroups';
import { addShopItemCategory, deleteShopItemCategory, deleteShopItemMedia, getProductVariants, getShopItemMediaConfig, reorderShopItemMedia, uploadShopItemMedia } from '../../services/shopItems';
import { getCurrencySettings } from '../../services/settings';
import useFileDropZone from '../../hooks/useFileDropZone';
import useScrollSpy from '../../hooks/useScrollSpy';
import { formatMediaExtensions } from '../../utils/media';
import { convertPriceToStoreCurrency, findCurrencyRate, isValidCurrencyRate, parsePrice } from '../../utils/prices';
import calculateProductCompleteness from '../../utils/productCompleteness';
import { buildShopGroupOptions } from '../../utils/shopGroups';
import CategoriesModal from './CategoriesModal';
import CurrencySettingsModal from './CurrencySettingsModal';
import ProductAttributesSection from './ProductAttributesSection';
import ProductVariantsModal from './ProductVariantsModal';


const sectionLinks = [
    { id: 'main', label: 'Основное', icon: BoxIcon },
    { id: 'photo', label: 'Фото', icon: PhotoIcon },
    { id: 'price', label: 'Цена и наличие', icon: CurrencyIcon },
    { id: 'variants', label: 'Варианты', icon: LayersIcon },
    { id: 'description', label: 'Описание', icon: DraftProductsIcon },
    { id: 'features', label: 'Характеристики', icon: ControlsIcon },
    { id: 'seo', label: 'SEO', icon: LinkIcon },
];
const emptySectionLinks = [];
const productStatusLabels = {
    draft: 'Черновик',
    active: 'Активный',
    archived: 'В архиве',
};

const improvementPriority = [
    'name',
    'price',
    'first-photo',
    'category',
    'description',
    'photo-gallery',
    'attributes',
    'seo-title',
    'seo-description',
];

const emptyVariantsSummary = () => ({
    hasModifications: false,
    hasVariants: false,
    activeQuantity: 0,
    optionCount: 0,
    valueCount: 0,
    optionNames: [],
    mainPhotoValue: null,
});

const idsMatch = (left, right) => left !== null && left !== undefined
    && right !== null && right !== undefined
    && String(left) === String(right);
const nullableIdsMatch = (left, right) => (
    (left === null || left === undefined) && (right === null || right === undefined)
) || idsMatch(left, right);

function buildVariantsSummary(variants, attributes = []) {
    const options = Array.isArray(variants?.options) ? variants.options : [];
    const combinations = Array.isArray(variants?.variants) ? variants.variants : [];
    const attributeForOption = (option) => attributes.find((attribute) => idsMatch(attribute.id, option.shop_attribute_id));
    const defaultPhotoValueId = variants?.settings?.default_photo_value_id;
    let mainPhotoValue = null;

    if (variants?.settings?.photos_enabled && defaultPhotoValueId !== null && defaultPhotoValueId !== undefined) {
        for (const option of options) {
            const value = (option.values ?? []).find((item) => idsMatch(item.id, defaultPhotoValueId));
            if (!value) continue;

            const attributeOption = attributeForOption(option)?.options?.find((item) => idsMatch(item.id, value.shop_attribute_option_id));
            mainPhotoValue = value.value ?? attributeOption?.value ?? null;
            break;
        }
    }

    return {
        hasModifications: options.length > 0,
        hasVariants: combinations.length > 0,
        activeQuantity: combinations.reduce((quantity, variant) => variant.is_active
            ? quantity + Number(variant.quantity ?? 0)
            : quantity, 0),
        optionCount: options.length,
        valueCount: options.reduce((count, option) => count + (option.values?.length ?? 0), 0),
        optionNames: options.map((option) => option.name ?? attributeForOption(option)?.name ?? `Опция #${option.id}`),
        mainPhotoValue,
    };
}

function formatRussianCount(count, one, few, many) {
    const remainder100 = count % 100;
    const remainder10 = count % 10;

    if (remainder100 >= 11 && remainder100 <= 14) return `${count} ${many}`;
    if (remainder10 === 1) return `${count} ${one}`;
    if (remainder10 >= 2 && remainder10 <= 4) return `${count} ${few}`;

    return `${count} ${many}`;
}

function normalizeNullableQuantity(quantity) {
    return quantity === '' || quantity === null || quantity === undefined ? null : quantity;
}

function buildStatusUpdatePayload(product, status) {
    return {
        name: product.name,
        price: product.price,
        old_price: product.old_price,
        currency: product.currency,
        quantity: product.quantity,
        show_stock: product.show_stock,
        description: product.description,
        seo_title: product.seo_title,
        seo_description: product.seo_description,
        shop_group_id: product.shop_group_id,
        status,
    };
}

export default function ProductEditPage() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();
    const isNew = id === 'new' || !id;
    const currentProductId = isNew ? null : String(id);
    const [form, setForm] = useState({ name: '', price: '', old_price: '', currency: '', quantity: '', show_stock: true, description: '', seo_title: '', seo_description: '', shop_group_id: null, status: isNew ? 'draft' : null });
    const [loadedProductId, setLoadedProductId] = useState(null);
    const [productLoadError, setProductLoadError] = useState(null);
    const [shopGroupOptions, setShopGroupOptions] = useState([]);
    const [isShopGroupsLoading, setIsShopGroupsLoading] = useState(true);
    const [shopGroupsLoadError, setShopGroupsLoadError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isActionsOpen, setIsActionsOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const [statusActionError, setStatusActionError] = useState(null);
    const [saveNotification, setSaveNotification] = useState(null);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isCurrencySettingsOpen, setIsCurrencySettingsOpen] = useState(false);
    const [isVariantsOpen, setIsVariantsOpen] = useState(false);
    const [isPreparingVariants, setIsPreparingVariants] = useState(false);
    const [variantsOpenError, setVariantsOpenError] = useState('');
    const [pendingVariantsProductId, setPendingVariantsProductId] = useState(null);
    const [variantsSummary, setVariantsSummary] = useState(emptyVariantsSummary);
    const [variantsSummaryStatus, setVariantsSummaryStatus] = useState(isNew ? 'loaded' : 'loading');
    const [currencySettings, setCurrencySettings] = useState({ currency: null, currency_rates: [] });
    const [currencyStatus, setCurrencyStatus] = useState('loading');
    const [isDeleting, setIsDeleting] = useState(false);
    const [media, setMedia] = useState([]);
    const [hasFilledAttribute, setHasFilledAttribute] = useState(false);
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
    const productCreationContextRef = useRef(null);
    const productCreationKindRef = useRef(null);
    const automaticallyCreatedProductIdRef = useRef(null);
    const saveInProgressRef = useRef(null);
    const submittingOperationsRef = useRef(new Map());
    const createdProductIdRef = useRef(isNew ? null : id);
    const skipProductLoadIdRef = useRef(null);
    const attributesSectionRef = useRef(null);
    const variantAttributesRef = useRef([]);
    const statusActionRequestRef = useRef(0);
    const variantsOpenOperationRef = useRef(null);
    const activeProductIdRef = useRef(currentProductId);
    const productContextRef = useRef({ productId: currentProductId, version: 0 });
    if (!nullableIdsMatch(productContextRef.current.productId, currentProductId)) {
        productContextRef.current = {
            productId: currentProductId,
            version: productContextRef.current.version + 1,
        };
    }
    activeProductIdRef.current = currentProductId;
    const isProductContextVersionCurrent = (contextVersion) => (
        productContextRef.current.version === contextVersion
    );
    const isProductContextCurrent = (contextVersion, productId = null) => {
        if (!isProductContextVersionCurrent(contextVersion)) return false;
        if (productId === null || productId === undefined) return true;

        return idsMatch(activeProductIdRef.current, productId)
            || (activeProductIdRef.current === null && idsMatch(createdProductIdRef.current, productId));
    };
    const navigateToCreatedProduct = (productId, contextVersion) => {
        if (!isProductContextCurrent(contextVersion, productId)) return false;

        productContextRef.current.productId = String(productId);
        navigate(`/admin/products/${productId}`, { replace: true });

        return true;
    };
    const beginSubmitting = (contextVersion = productContextRef.current.version) => {
        const operationCount = submittingOperationsRef.current.get(contextVersion) ?? 0;
        submittingOperationsRef.current.set(contextVersion, operationCount + 1);
        if (isProductContextVersionCurrent(contextVersion)) setIsSubmitting(true);
    };
    const endSubmitting = (contextVersion) => {
        const operationCount = Math.max(0, (submittingOperationsRef.current.get(contextVersion) ?? 0) - 1);

        if (operationCount === 0) {
            submittingOperationsRef.current.delete(contextVersion);
        } else {
            submittingOperationsRef.current.set(contextVersion, operationCount);
        }

        if (isProductContextVersionCurrent(contextVersion)) setIsSubmitting(operationCount > 0);
    };
    const isCurrentProductLoaded = isNew || loadedProductId === currentProductId;
    const currentProductLoadError = productLoadError?.productId === currentProductId
        ? productLoadError.message
        : '';
    const currentStatusActionError = statusActionError?.productId === currentProductId
        ? statusActionError.message
        : '';
    const saveNotificationProductId = isNew ? 'new' : currentProductId;
    const currentSaveNotification = saveNotification?.productId === saveNotificationProductId
        ? saveNotification
        : null;
    const { activeSectionId, scrollToSection } = useScrollSpy({
        sections: isCurrentProductLoaded ? sectionLinks : emptySectionLinks,
        sectionRefs,
        navigationRef: sectionNavigationRef,
    });

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
        const controller = new AbortController();

        getCurrencySettings({ signal: controller.signal })
            .then((settings) => {
                setCurrencySettings({
                    currency: settings.currency,
                    currency_rates: Array.isArray(settings.currency_rates) ? settings.currency_rates : [],
                });
                setCurrencyStatus('loaded');
            })
            .catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Unable to load shop currencies.', error);
                    setCurrencyStatus('error');
                }
            });

        return () => controller.abort();
    }, []);

    useEffect(() => {
        statusActionRequestRef.current += 1;
        setIsStatusChanging(false);
        setIsArchiveConfirmOpen(false);
        setStatusActionError(null);
        setVariantsOpenError('');

        if (variantsOpenOperationRef.current
            && variantsOpenOperationRef.current.contextVersion !== productContextRef.current.version) {
            variantsOpenOperationRef.current = null;
            setIsPreparingVariants(false);
            setPendingVariantsProductId(null);
        }

        setIsSubmitting((submittingOperationsRef.current.get(productContextRef.current.version) ?? 0) > 0);
    }, [id, isNew]);

    useEffect(() => {
        if (!pendingVariantsProductId) return;

        if (idsMatch(currentProductId, pendingVariantsProductId)) {
            setPendingVariantsProductId(null);
            setIsPreparingVariants(false);
            setIsVariantsOpen(true);
        } else if (currentProductId !== null) {
            setPendingVariantsProductId(null);
            setIsPreparingVariants(false);
        }
    }, [currentProductId, pendingVariantsProductId]);

    useEffect(() => {
        if (isNew) {
            variantAttributesRef.current = [];
            setVariantsSummary(emptyVariantsSummary());
            setVariantsSummaryStatus('loaded');

            return undefined;
        }

        const controller = new AbortController();
        let isActive = true;
        setVariantsSummaryStatus('loading');

        Promise.all([
            getProductVariants(id),
            getShopAttributes({ signal: controller.signal }),
        ])
            .then(([variants, attributes]) => {
                if (!isActive) return;

                variantAttributesRef.current = attributes;
                setVariantsSummary(buildVariantsSummary(variants, attributes));
                setVariantsSummaryStatus('loaded');
            })
            .catch((error) => {
                if (!isActive || error.name === 'AbortError') return;

                console.error('Unable to load product variants summary.', error);
                setVariantsSummaryStatus('error');
            });

        return () => {
            isActive = false;
            controller.abort();
        };
    }, [id, isNew]);

    useEffect(() => {
        if (isNew) {
            createdProductIdRef.current = null;
            automaticallyCreatedProductIdRef.current = null;
            setLoadedProductId(null);
            setProductLoadError(null);
            setMedia([]);
            setProductCategories([]);
            setCategoryToAddId(null);
            setIsAddingCategory(false);
            setCategoryAddError('');
            setDeletingCategoryIds([]);
            setCategoryDeleteError('');
            setIsMediaLoading(false);
            setMediaLoadError('');

            return undefined;
        }

        createdProductIdRef.current = id;

        if (skipProductLoadIdRef.current === String(id)) {
            skipProductLoadIdRef.current = null;
            setLoadedProductId(String(id));
            setProductLoadError(null);
            setIsMediaLoading(false);
            setMediaLoadError('');

            return undefined;
        }

        automaticallyCreatedProductIdRef.current = null;
        let isActive = true;
        setLoadedProductId(null);
        setProductLoadError(null);
        setIsMediaLoading(true);
        setMediaLoadError('');
        setIsActionsOpen(false);
        setIsDeleteConfirmOpen(false);
        setIsCategoriesOpen(false);
        setIsCurrencySettingsOpen(false);
        setIsVariantsOpen(false);
        setIsCategorySelectOpen(false);
        setMedia([]);
        setProductCategories([]);
        setCategoryToAddId(null);
        setIsAddingCategory(false);
        setCategoryAddError('');
        setDeletingCategoryIds([]);
        setCategoryDeleteError('');

        request(`/api/products/${id}`)
            .then(({ data: product }) => {
                if (!isActive) return;

                setForm({
                    name: product.name ?? '',
                    price: product.price ?? '',
                    old_price: product.old_price ?? '',
                    currency: product.currency ?? '',
                    quantity: product.quantity ?? '',
                    show_stock: product.show_stock ?? true,
                    description: product.description ?? '',
                    seo_title: product.seo_title ?? '',
                    seo_description: product.seo_description ?? '',
                    shop_group_id: product.shop_group_id ?? null,
                    status: product.status,
                });
                setMedia(product.media ?? []);
                setProductCategories(product.categories ?? []);
                setLoadedProductId(String(id));
            })
            .catch((error) => {
                if (!isActive) return;

                console.error(error);
                setProductLoadError({
                    productId: String(id),
                    message: 'Не удалось загрузить товар. Обновите страницу или вернитесь к списку товаров.',
                });
            })
            .finally(() => {
                if (isActive) setIsMediaLoading(false);
            });

        return () => {
            isActive = false;
        };
    }, [id, isNew]);

    const updateField = ({ target }) => {
        setForm((current) => ({
            ...current,
            [target.name]: target.type === 'checkbox' ? target.checked : target.value,
        }));
    };

    const createProduct = (status, useDraftDefaults = false, attributes = undefined) => {
        const creationContextVersion = productContextRef.current.version;

        if (createdProductIdRef.current) {
            return Promise.resolve({ id: createdProductIdRef.current, status: form.status ?? status });
        }

        if (productCreationPromiseRef.current && productCreationContextRef.current === creationContextVersion) {
            if (useDraftDefaults && productCreationKindRef.current === 'explicit-save') {
                return productCreationPromiseRef.current.catch(() => {
                    if (!isProductContextVersionCurrent(creationContextVersion)) {
                        throw new Error('Product context changed during creation.');
                    }

                    return createProduct('draft', true);
                });
            }

            return productCreationPromiseRef.current;
        }

        const payload = {
            ...form,
            name: form.name.trim() || null,
            price: useDraftDefaults && form.price === '' ? 0 : form.price,
            old_price: form.old_price || null,
            quantity: useDraftDefaults && form.quantity === '' ? 0 : normalizeNullableQuantity(form.quantity),
            show_stock: form.show_stock,
            seo_title: form.seo_title || null,
            seo_description: form.seo_description || null,
            status,
            ...(attributes === undefined ? {} : { attributes }),
        };
        let creationPromise;

        creationPromise = (async () => {
            await csrf();
            const { data: product } = await request('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!isProductContextVersionCurrent(creationContextVersion)) return product;

            createdProductIdRef.current = product.id;
            automaticallyCreatedProductIdRef.current = useDraftDefaults ? String(product.id) : null;
            skipProductLoadIdRef.current = String(product.id);
            setLoadedProductId(String(product.id));
            attributesSectionRef.current?.preserveForProduct(product.id);
            setForm((current) => ({
                ...current,
                currency: product.currency ?? current.currency,
                status: product.status,
            }));
            return product;
        })().finally(() => {
            if (productCreationPromiseRef.current === creationPromise) {
                productCreationPromiseRef.current = null;
                productCreationContextRef.current = null;
                productCreationKindRef.current = null;
            }
        });

        productCreationPromiseRef.current = creationPromise;
        productCreationContextRef.current = creationContextVersion;
        productCreationKindRef.current = useDraftDefaults ? 'automatic-draft' : 'explicit-save';

        return creationPromise;
    };

    const ensureProduct = async () => {
        const contextVersion = productContextRef.current.version;

        if (createdProductIdRef.current) {
            const productId = createdProductIdRef.current;

            if (activeProductIdRef.current === null && saveInProgressRef.current !== contextVersion) {
                navigateToCreatedProduct(productId, contextVersion);
            }

            return productId;
        }

        beginSubmitting(contextVersion);

        try {
            const product = await createProduct('draft', true);

            if (!isProductContextCurrent(contextVersion, product.id)) return null;

            if (saveInProgressRef.current !== contextVersion) {
                navigateToCreatedProduct(product.id, contextVersion);
            }

            return product.id;
        } finally {
            endSubmitting(contextVersion);
        }
    };

    const openProductVariants = async () => {
        if (!isNew) {
            setVariantsOpenError('');
            setIsVariantsOpen(true);
            return;
        }

        if (variantsOpenOperationRef.current) return;

        const contextVersion = productContextRef.current.version;
        const operation = { contextVersion };
        let isWaitingForRoute = false;
        variantsOpenOperationRef.current = operation;
        setIsPreparingVariants(true);
        setVariantsOpenError('');

        try {
            const productId = await ensureProduct();

            if (variantsOpenOperationRef.current !== operation
                || !productId
                || !isProductContextCurrent(contextVersion, productId)) return;

            isWaitingForRoute = true;
            setPendingVariantsProductId(String(productId));
        } catch (error) {
            if (variantsOpenOperationRef.current !== operation
                || !isProductContextVersionCurrent(contextVersion)) return;

            console.error('Unable to create a product draft for variants.', error);
            setVariantsOpenError('Не удалось создать черновик товара. Попробуйте ещё раз.');
        } finally {
            if (variantsOpenOperationRef.current === operation) {
                variantsOpenOperationRef.current = null;
                if (!isWaitingForRoute && isProductContextVersionCurrent(contextVersion)) {
                    setIsPreparingVariants(false);
                }
            }
        }
    };

    const saveProduct = async (status) => {
        const savingProductId = currentProductId;
        const savingContextVersion = productContextRef.current.version;
        const isSaveContextCurrent = () => isProductContextVersionCurrent(savingContextVersion)
            && activeProductIdRef.current === savingProductId;

        if (saveInProgressRef.current === savingContextVersion || !isSaveContextCurrent() || (!isNew && loadedProductId !== savingProductId)) return;

        saveInProgressRef.current = savingContextVersion;
        setSaveNotification(null);
        beginSubmitting(savingContextVersion);

        try {
            let product;
            const attributes = await attributesSectionRef.current?.prepareSave() ?? [];

            if (!isSaveContextCurrent()) return;

            const payload = {
                ...form,
                name: form.name.trim() || null,
                old_price: form.old_price || null,
                quantity: normalizeNullableQuantity(form.quantity),
                show_stock: form.show_stock,
                seo_title: form.seo_title || null,
                seo_description: form.seo_description || null,
                status,
                attributes,
            };

            if (isNew) {
                product = await createProduct(status, false, attributes);

                if (!isSaveContextCurrent()) return;

                if (idsMatch(automaticallyCreatedProductIdRef.current, product.id)) {
                    await csrf();

                    if (!isSaveContextCurrent()) return;

                    ({ data: product } = await request(`/api/products/${product.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    }));

                    if (!isSaveContextCurrent()) return;

                    automaticallyCreatedProductIdRef.current = null;
                    setForm((current) => ({
                        ...current,
                        currency: product.currency ?? current.currency,
                        status: product.status,
                    }));
                }
            } else {
                await csrf();

                if (!isSaveContextCurrent()) return;

                ({ data: product } = await request(`/api/products/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }));

                if (!isSaveContextCurrent()) return;

                setForm((current) => ({
                    ...current,
                    currency: product.currency ?? current.currency,
                    status: product.status,
                }));
            }

            if (!isSaveContextCurrent()) return;

            attributesSectionRef.current?.markSaved(product.id);

            setSaveNotification({
                productId: String(product.id),
                type: 'success',
                message: t(isNew ? 'productEditPage.created' : 'productEditPage.saved'),
            });

            if (isNew) {
                navigateToCreatedProduct(product.id, savingContextVersion);
            }
        } catch (error) {
            console.error(error);
            if (isSaveContextCurrent()) {
                attributesSectionRef.current?.handleSaveError(error);
                setSaveNotification({
                    productId: savingProductId ?? 'new',
                    type: 'error',
                    message: error.message || t('productEditPage.saveError'),
                });
            }
        } finally {
            if (saveInProgressRef.current === savingContextVersion) saveInProgressRef.current = null;
            endSubmitting(savingContextVersion);
        }
    };

    if (!isCurrentProductLoaded) {
        return <ProductLoadState error={currentProductLoadError} />;
    }

    const updateProductStatus = async (status) => {
        const productId = currentProductId;
        const isRestoring = form.status === 'archived' && status === 'active';

        if (!productId || loadedProductId !== productId || activeProductIdRef.current !== productId) return;

        const requestId = statusActionRequestRef.current + 1;
        statusActionRequestRef.current = requestId;
        const isActionCurrent = () => statusActionRequestRef.current === requestId
            && activeProductIdRef.current === productId;

        setIsStatusChanging(true);
        setStatusActionError(null);

        try {
            const { data: savedProduct } = await request(`/api/products/${productId}`);

            if (!isActionCurrent()) return;

            await csrf();

            if (!isActionCurrent()) return;

            const { data: updatedProduct } = await request(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(buildStatusUpdatePayload(savedProduct, status)),
            });

            if (!isActionCurrent()) return;

            setForm((current) => ({ ...current, status: updatedProduct.status }));
            setIsArchiveConfirmOpen(false);
        } catch (error) {
            if (!isActionCurrent()) return;

            console.error(error);
            setStatusActionError({
                productId,
                message: error instanceof ApiError && error.status === 422 && status === 'active'
                    ? `${isRestoring ? 'Не удалось восстановить' : 'Не удалось опубликовать'} товар. Заполните и сохраните обязательные данные.`
                    : 'Не удалось изменить статус товара. Попробуйте ещё раз.',
            });
        } finally {
            if (isActionCurrent()) setIsStatusChanging(false);
        }
    };

    const statusMenuAction = {
        draft: {
            label: 'Опубликовать',
            icon: <RocketIcon />,
            onClick: () => updateProductStatus('active'),
        },
        active: {
            label: 'Перенести в архив',
            icon: <BoxIcon />,
            onClick: () => {
                setStatusActionError(null);
                setIsArchiveConfirmOpen(true);
            },
        },
        archived: {
            label: 'Восстановить',
            icon: <RocketIcon />,
            onClick: () => updateProductStatus('active'),
        },
    }[form.status];

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

        const contextVersion = productContextRef.current.version;
        setDeletingCategoryIds((current) => [...current, categoryId]);
        setCategoryDeleteError('');

        try {
            await deleteShopItemCategory(productId, categoryId);
            if (isProductContextCurrent(contextVersion, productId)) {
                setProductCategories((current) => current.filter((category) => category.id !== categoryId));
            }
        } catch (error) {
            if (!isProductContextCurrent(contextVersion, productId)) return;

            console.error(error);
            setCategoryDeleteError('Не удалось убрать товар из категории.');
        } finally {
            if (isProductContextVersionCurrent(contextVersion)) {
                setDeletingCategoryIds((current) => current.filter((id) => id !== categoryId));
            }
        }
    };

    const attachProductCategory = async (categoryId) => {
        if (categoryId === null || isAddingCategory) return;

        const contextVersion = productContextRef.current.version;
        let productId = null;
        setCategoryToAddId(categoryId);
        setIsAddingCategory(true);
        setCategoryAddError('');

        try {
            productId = await ensureProduct();
            if (!productId || !isProductContextCurrent(contextVersion, productId)) return;

            const product = await addShopItemCategory(productId, categoryId);
            if (isProductContextCurrent(contextVersion, productId)) {
                setProductCategories(product.categories ?? []);
            }
        } catch (error) {
            if (!isProductContextCurrent(contextVersion, productId)) return;

            console.error(error);
            setCategoryAddError('Не удалось добавить товар в категорию.');
        } finally {
            if (isProductContextVersionCurrent(contextVersion)) {
                setCategoryToAddId(null);
                setIsAddingCategory(false);
            }
        }
    };

    const primaryCategory = form.shop_group_id === null
        ? null
        : shopGroupOptions.find((option) => idsMatch(option.value, form.shop_group_id))
            ?? productCategories.find((category) => idsMatch(category.id, form.shop_group_id));
    const categoryIds = new Set([
        form.shop_group_id,
        ...productCategories.map((category) => category.id),
    ].filter((categoryId) => categoryId !== null && categoryId !== undefined));
    const imageCount = media.filter((item) => item.type === 'image').length;
    const completeness = calculateProductCompleteness({
        name: form.name,
        price: form.price,
        categoryCount: categoryIds.size,
        photoCount: imageCount,
        description: form.description,
        hasFilledAttribute,
        seoTitle: form.seo_title,
        seoDescription: form.seo_description,
    });
    const normalizedPrice = String(form.price ?? '').replace(/\s/g, '').replace(',', '.');
    const normalizedQuantity = String(form.quantity ?? '').trim();
    const priceValue = normalizedPrice === '' ? Number.NaN : Number(normalizedPrice);
    const quantityValue = normalizedQuantity === '' ? Number.NaN : Number(normalizedQuantity);
    const hasRequiredQuantity = variantsSummary.hasVariants
        ? variantsSummaryStatus === 'loaded' && Number.isFinite(variantsSummary.activeQuantity)
        : Number.isInteger(quantityValue) && quantityValue >= 0;
    const isReadyForSale = form.name.trim().length > 0
        && Number.isFinite(priceValue)
        && priceValue >= 0
        && Boolean(form.currency)
        && imageCount > 0
        && hasRequiredQuantity;
    const completenessTone = {
        low: { color: '#b7483f', label: 'Низкая заполненность' },
        medium: { color: '#b77a2f', label: 'Средняя заполненность' },
        high: { color: 'var(--color-success)', label: 'Высокая заполненность' },
    }[completeness.level];
    const missingCriteriaLabel = completeness.missingCriteria.length === 0
        ? 'Все критерии заполнены.'
        : `Не выполнено ${formatRussianCount(completeness.missingCriteria.length, 'критерий', 'критерия', 'критериев')}`;
    const openAndScrollToSection = (sectionId) => {
        const section = sectionRefs.current[sectionId];

        if (section?.tagName === 'DETAILS' && !section.open) section.open = true;
        window.requestAnimationFrame(() => scrollToSection(sectionId));
    };

    return (
        <div className="max-lg:pb-[calc(48px+env(safe-area-inset-bottom))]">
            <Breadcrumbs
                className="mb-5 max-lg:hidden"
                currentLabel={isNew ? 'Новый товар' : form.name}
            />

            <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Link to="/admin/products" className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#615950] max-lg:h-8 max-lg:w-8" aria-label="Вернуться к товарам"><BackIcon /></Link>
                    <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
                        <h1 className="m-0 min-w-0 truncate text-[32px] font-[760] tracking-[-0.05em] max-lg:text-[19px]">
                            {isNew ? 'Новый товар' : 'Редактирование товара'}
                        </h1>
                        {!isNew && productStatusLabels[form.status] && (
                            <ProductStatusBadge status={form.status} label={productStatusLabels[form.status]} />
                        )}
                    </div>
                </div>
            </header>

            {currentSaveNotification && (
                <Alert variant={currentSaveNotification.type} className="mb-5 h-[40px] py-0">
                    {currentSaveNotification.message}
                </Alert>
            )}

            <SectionNavigation
                navigationRef={sectionNavigationRef}
                sections={sectionLinks}
                activeSectionId={activeSectionId}
                onSectionSelect={scrollToSection}
                className="sticky top-[var(--header-height)] z-30 mb-[13px] border-b border-[color:var(--color-border)] bg-[rgba(247,246,243,.95)] py-1 backdrop-blur max-lg:top-[62px] max-sm:-mx-[13px] max-sm:px-[13px]"
                ariaLabel="Разделы товара"
            />

            <section className="mb-5 flex items-center gap-4 rounded-[14px] border border-[#eadfd7] bg-[#fffaf6] p-4 max-sm:items-start">
                <div
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full"
                    style={{ background: `conic-gradient(${completenessTone.color} ${completeness.score}%, #eadfd7 0)` }}
                    aria-label={`Карточка заполнена на ${completeness.score}%`}
                >
                    <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-white text-[11px] font-[760]">{completeness.score}%</span>
                </div>
                <div className="min-w-0 flex-1">
                    <strong className="block text-[13px]">{isReadyForSale ? 'Уже можно продавать' : 'Заполните обязательные поля'}</strong>
                    <small className="mt-1 block text-[12px] text-[color:var(--color-secondary)]">{completenessTone.label}. {missingCriteriaLabel}</small>
                </div>
                <div className="flex gap-[7px] max-lg:hidden">
                    {isNew ? (
                        <StatusActions status={form.status} isNew isSubmitting={isSubmitting} onSave={saveProduct} />
                    ) : form.status && (
                        <>
                            <button className="button button--primary min-h-[39px] min-w-[120px] whitespace-nowrap" type="button" disabled={isSubmitting || isStatusChanging} onClick={() => saveProduct(form.status)}><SaveIcon />Сохранить</button>
                            <button className="button button--outline min-h-[39px] whitespace-nowrap" type="button"><EyeIcon />Предпросмотр</button>
                            <ActionsMenu
                                ariaLabel={`Действия ${form.name || 'товара'}`}
                                isOpen={isActionsOpen}
                                onToggle={() => setIsActionsOpen((isOpen) => !isOpen)}
                                onClose={() => setIsActionsOpen(false)}
                                actions={[
                                    statusMenuAction && {
                                        ...statusMenuAction,
                                        disabled: isSubmitting || isStatusChanging,
                                    },
                                    {
                                        label: 'Удалить товар',
                                        icon: <TrashIcon />,
                                        variant: 'danger',
                                        disabled: isDeleting || isSubmitting || isStatusChanging,
                                        onClick: () => setIsDeleteConfirmOpen(true),
                                    },
                                ].filter(Boolean)}
                            />
                        </>
                    )}
                </div>
            </section>

            {currentStatusActionError && !isArchiveConfirmOpen && (
                <Alert variant="error" className="mb-3">{currentStatusActionError}</Alert>
            )}

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
                        resolveProductId={ensureProduct}
                        productContextVersion={productContextRef.current.version}
                        getProductContextVersion={() => productContextRef.current.version}
                        isProductContextCurrent={isProductContextCurrent}
                        onMediaUploaded={(uploadedMedia) => {
                            setMedia((current) => [...current, uploadedMedia]
                                .sort((left, right) => left.sort_order - right.sort_order || left.id - right.id));
                        }}
                        onMediaOrderChanged={setMedia}
                    />
                    <PriceSection
                        sectionRef={(element) => { sectionRefs.current.price = element; }}
                        form={form}
                        currencySettings={currencySettings}
                        currencyStatus={currencyStatus}
                        hasVariants={variantsSummary.hasVariants}
                        variantsQuantity={variantsSummary.activeQuantity}
                        isVariantsLoading={variantsSummaryStatus !== 'loaded'}
                        onChange={updateField}
                        onOpenCurrencySettings={() => setIsCurrencySettingsOpen(true)}
                    />
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.variants = element; }} id="variants" title="Модификации товара" icon={LayersIcon} open>
                        {variantsOpenError && <Alert variant="error" className="mb-3">{variantsOpenError}</Alert>}
                        <article className="grid min-h-[82px] grid-cols-[42px_minmax(0,1fr)_auto] items-center gap-3 rounded-[12px] border border-[color:var(--color-border)] bg-[#fcfbfa] p-[12px_13px] max-md:grid-cols-[38px_minmax(0,1fr)]">
                            <span className="grid h-[42px] w-[42px] place-items-center rounded-[11px] bg-[#f1ece8] text-[#81766e]">
                                {variantsSummaryStatus === 'loading'
                                    ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#cfc5be] border-t-[color:var(--color-accent)]" aria-label="Загрузка модификаций" />
                                    : <LayersIcon />}
                            </span>
                            <div className="min-w-0">
                                {variantsSummaryStatus === 'loading' && <><strong className="block text-[13px]">Загрузка модификаций…</strong><small className="mt-0.5 block text-[12px] leading-[1.4] text-[#8c837c]">Получаем сохранённые настройки товара.</small></>}
                                {variantsSummaryStatus === 'error' && <><strong className="block text-[13px]">Не удалось загрузить модификации</strong><small className="mt-0.5 block text-[12px] leading-[1.4] text-[#8c837c]">Откройте настройки, чтобы повторить загрузку сохранённых данных.</small></>}
                                {variantsSummaryStatus === 'loaded' && !variantsSummary.hasModifications && <><strong className="block text-[13px]">Модификации не добавлены</strong><small className="mt-0.5 block text-[12px] leading-[1.4] text-[#8c837c]">Добавьте варианты товара по цвету, размеру или другим характеристикам</small></>}
                                {variantsSummaryStatus === 'loaded' && variantsSummary.hasModifications && <>
                                    <strong className="block text-[13px]">{formatRussianCount(variantsSummary.optionCount, 'опция', 'опции', 'опций')} · {formatRussianCount(variantsSummary.valueCount, 'значение', 'значения', 'значений')}</strong>
                                    <small className="mt-0.5 block break-words text-[12px] leading-[1.4] text-[#8c837c]">{variantsSummary.optionNames.join(', ')}</small>
                                    {variantsSummary.mainPhotoValue && <small className="mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-[#756b64]"><i className="h-2 w-2 rounded-full bg-[#a9683e]" />Основное значение: {variantsSummary.mainPhotoValue}</small>}
                                </>}
                            </div>
                            <button type="button" className="button button--primary min-h-9 disabled:cursor-wait disabled:opacity-70 max-md:col-span-full max-md:w-full" onClick={() => void openProductVariants()} disabled={isPreparingVariants}>
                                {isPreparingVariants
                                    ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden="true" />
                                    : variantsSummary.hasModifications || variantsSummaryStatus === 'error' ? <PencilIcon /> : <PlusIcon />}
                                {isPreparingVariants
                                    ? 'Создание черновика…'
                                    : variantsSummary.hasModifications || variantsSummaryStatus === 'error' ? 'Настроить' : 'Добавить модификации'}
                            </button>
                        </article>
                    </AccordionSection>
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.description = element; }} id="description" title="Описание" icon={DraftProductsIcon}>
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
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.features = element; }} id="features" title="Характеристики" icon={ControlsIcon}>
                        <ProductAttributesSection ref={attributesSectionRef} productId={isNew ? null : id} productContextVersion={productContextRef.current.version} onFilledChange={setHasFilledAttribute} />
                    </AccordionSection>
                    <AccordionSection sectionRef={(element) => { sectionRefs.current.seo = element; }} id="seo" title="SEO" icon={LinkIcon}>
                        <SeoFields
                            title={form.seo_title}
                            description={form.seo_description}
                            url="shopra.store/products/kozhanyy-ryukzak-city"
                            titleLabel="Заголовок для поиска"
                            descriptionLabel="Описание для поиска"
                            titleName="seo_title"
                            descriptionName="seo_description"
                            disabled={isSubmitting}
                            onTitleChange={(seoTitle) => setForm((current) => ({ ...current, seo_title: seoTitle }))}
                            onDescriptionChange={(seoDescription) => setForm((current) => ({ ...current, seo_description: seoDescription }))}
                        />
                    </AccordionSection>
                </form>
                <ProductAside
                    form={form}
                    currencySettings={currencySettings}
                    primaryCategoryName={primaryCategory?.name ?? primaryCategory?.label ?? ''}
                    media={media}
                    isMediaLoading={isMediaLoading}
                    mainPhotoValue={variantsSummary.mainPhotoValue}
                    missingCriteria={completeness.missingCriteria}
                    onRecommendationClick={openAndScrollToSection}
                />
            </div>

            <AdminMobileActionBar>
                {isNew ? (
                    <StatusActions status={form.status} isNew isSubmitting={isSubmitting} onSave={saveProduct} />
                ) : form.status && (
                    <button className="button button--primary min-h-[39px] w-full whitespace-nowrap" type="button" disabled={isSubmitting || isStatusChanging} onClick={() => saveProduct(form.status)}><SaveIcon />Сохранить</button>
                )}
            </AdminMobileActionBar>

            <ConfirmModal
                isOpen={isArchiveConfirmOpen}
                title="Перенести товар в архив?"
                message="Товар будет скрыт с витрины. Позже его можно будет восстановить."
                confirmText="Перенести в архив"
                cancelText="Отмена"
                isLoading={isStatusChanging}
                error={currentStatusActionError}
                onConfirm={() => updateProductStatus('archived')}
                onClose={() => {
                    setIsArchiveConfirmOpen(false);
                    setStatusActionError(null);
                }}
            />
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
            <CurrencySettingsModal
                isOpen={isCurrencySettingsOpen}
                initialData={currencySettings}
                onClose={() => setIsCurrencySettingsOpen(false)}
                onSaved={(settings) => {
                    setCurrencySettings(settings);
                    setCurrencyStatus('loaded');
                }}
            />
            <ProductVariantsModal
                isOpen={isVariantsOpen}
                productId={isNew ? null : id}
                basePrice={form.price}
                media={media}
                productContextVersion={productContextRef.current.version}
                isProductContextCurrent={isProductContextCurrent}
                onClose={() => setIsVariantsOpen(false)}
                onSaved={(variants) => {
                    const updatedSummary = buildVariantsSummary(variants, variantAttributesRef.current);

                    if (variantsSummary.hasVariants && !updatedSummary.hasVariants) {
                        setForm((current) => ({ ...current, quantity: '' }));
                    }
                    setVariantsSummary(updatedSummary);
                    setVariantsSummaryStatus('loaded');
                }}
            />

        </div>
    );
}

function ProductLoadState({ error }) {
    return (
        <div aria-busy={!error}>
            <Breadcrumbs
                className="mb-5 max-lg:hidden"
                currentLabel={error ? 'Ошибка загрузки' : 'Загрузка товара…'}
            />

            <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                    <Link to="/admin/products" className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#615950] max-lg:h-8 max-lg:w-8" aria-label="Вернуться к товарам"><BackIcon /></Link>
                    <div className="min-w-0">
                        <h1 className="m-0 truncate text-[32px] font-[760] tracking-[-0.05em] max-lg:text-[19px]">
                            Редактирование товара
                        </h1>
                    </div>
                </div>
            </header>

            {error ? (
                <Alert variant="error">{error}</Alert>
            ) : (
                <section className="flex min-h-[120px] items-center justify-center gap-3 rounded-[14px] border border-[color:var(--color-border)] bg-white p-6 text-[13px] font-[650] text-[color:var(--color-secondary)] shadow-[0_7px_24px_rgba(70,47,31,.03)]" role="status" aria-live="polite">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#cfc5be] border-t-[color:var(--color-accent)]" aria-hidden="true" />
                    Загрузка товара…
                </section>
            )}
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
        <AdminCard sectionRef={sectionRef} id="main" title="Основное" icon={BoxIcon} required className="!scroll-mt-0">
            <Field label={<>Название товара <b className="text-[color:var(--color-accent)]">*</b></>}>
                <Input name="name" value={form.name} onChange={onChange} />
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
        </AdminCard>
    );
}

function MediaSection({ sectionRef, productId, isNew, media, isLoading, loadError, resolveProductId, productContextVersion, getProductContextVersion, isProductContextCurrent, onMediaUploaded, onMediaOrderChanged }) {
    const { t, i18n } = useTranslation();
    const inputRef = useRef(null);
    const mediaGridRef = useRef(null);
    const uploadInProgressRef = useRef(null);
    const draggedMediaIdRef = useRef(null);
    const deletedMediaIdsRef = useRef(new Set());
    const deletingMediaIdsRef = useRef(new Set());
    const [pendingMedia, setPendingMedia] = useState([]);
    const [pendingUploadProductId, setPendingUploadProductId] = useState(null);
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

    useEffect(() => {
        const uploadOperation = uploadInProgressRef.current;
        const isCreatingCurrentProduct = uploadOperation?.sourceWasNew
            && !uploadOperation.started
            && (uploadOperation.targetProductId === null
                || isNew
                || idsMatch(productId, uploadOperation.targetProductId));

        if (!isCreatingCurrentProduct) {
            uploadOperation?.pending.forEach((item) => {
                if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
            });
            uploadInProgressRef.current = null;
            setPendingUploadProductId(null);
            setPendingMedia([]);
            setUploadErrors([]);
        }

        setSortError('');
        setDeleteError('');
        setDeletingMediaIds([]);
        setIsSortingMedia(false);
        deletingMediaIdsRef.current.clear();
        deletedMediaIdsRef.current.clear();
        endMediaDrag();
    }, [productContextVersion]);

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
            const availableUploadWidth = grid.clientWidth - (occupiedLastRow * (cardWidth + columnGap));
            const uploadSpan = occupiedLastRow > 0 && availableUploadWidth >= 280
                ? columnCount - occupiedLastRow
                : columnCount;
            const flexibleColumn = `minmax(${cardWidth}px, 1fr)`;

            grid.style.gridTemplateColumns = columnCount > 1
                ? `repeat(${columnCount - 1}, ${cardWidth}px) ${flexibleColumn}`
                : flexibleColumn;

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
        const contextVersion = getProductContextVersion();
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
            if (!productId || !isProductContextCurrent(contextVersion, productId)) return;

            const savedMedia = await reorderShopItemMedia(productId, optimisticMedia.map((item) => item.id));

            if (isProductContextCurrent(contextVersion, productId)) {
                onMediaOrderChanged(savedMedia);
            }
        } catch (error) {
            if (isProductContextCurrent(contextVersion)) {
                onMediaOrderChanged(previousMedia);
                setSortError(Object.values(error.errors ?? {}).flat().join(' ') || 'Не удалось сохранить порядок медиафайлов.');
            }
        } finally {
            if (isProductContextCurrent(contextVersion)) setIsSortingMedia(false);
        }
    };

    const discardUploadOperation = (operation) => {
        operation.pending.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        if (uploadInProgressRef.current === operation) uploadInProgressRef.current = null;
        setPendingUploadProductId(null);
        setPendingMedia([]);
    };

    const uploadPendingFiles = async (operation) => {
        const { pending, targetProductId, contextVersion } = operation;
        const errors = [];

        for (const item of pending) {
            if (uploadInProgressRef.current !== operation
                || !isProductContextCurrent(contextVersion, targetProductId)) break;

            try {
                if (!item.type) throw new Error('Поддерживаются только фотографии и видео.');

                const uploadedMedia = await uploadShopItemMedia(targetProductId, item.type, item.file);
                if (uploadInProgressRef.current === operation
                    && isProductContextCurrent(contextVersion, targetProductId)) {
                    onMediaUploaded(uploadedMedia);
                }
            } catch (error) {
                if (uploadInProgressRef.current !== operation
                    || !isProductContextCurrent(contextVersion, targetProductId)) continue;

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
                if (uploadInProgressRef.current === operation
                    && isProductContextCurrent(contextVersion, targetProductId)) {
                    setPendingMedia((current) => current.filter((pendingItem) => pendingItem.id !== item.id));
                }
            }
        }

        pending.forEach((item) => {
            if (item.previewUrl) URL.revokeObjectURL(item.previewUrl);
        });
        if (uploadInProgressRef.current === operation) {
            uploadInProgressRef.current = null;
            setPendingUploadProductId(null);
            if (isProductContextCurrent(contextVersion, targetProductId)) {
                setPendingMedia((current) => current.filter((pendingItem) => !pending.some((item) => item.id === pendingItem.id)));
            }
        }
    };

    const uploadFiles = async (fileList) => {
        const files = Array.from(fileList ?? []);

        if (uploadInProgressRef.current || files.length === 0 || !mediaConfig) return;

        const contextVersion = getProductContextVersion();
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
        const operation = {
            contextVersion,
            pending,
            sourceWasNew: isNew,
            targetProductId: null,
            started: false,
        };

        uploadInProgressRef.current = operation;
        setUploadErrors([]);
        setPendingMedia(pending);

        try {
            const resolvedProductId = await resolveProductId();

            if (uploadInProgressRef.current !== operation) return;
            if (!resolvedProductId) {
                discardUploadOperation(operation);
                return;
            }

            operation.targetProductId = String(resolvedProductId);

            if (operation.sourceWasNew) {
                setPendingUploadProductId(operation.targetProductId);
                return;
            }

            if (!isProductContextCurrent(contextVersion, operation.targetProductId)) {
                discardUploadOperation(operation);
                return;
            }

            operation.started = true;
            await uploadPendingFiles(operation);
        } catch (error) {
            if (uploadInProgressRef.current !== operation) return;

            if (isProductContextCurrent(contextVersion)) {
                const validationMessage = Object.values(error.errors ?? {}).flat().join(' ');
                const message = validationMessage || error.message || 'Не удалось создать черновик товара.';

                setUploadErrors([{
                    message,
                    filenames: pending.map((item) => item.file.name),
                }]);
            }
            discardUploadOperation(operation);
        }
    };

    useEffect(() => {
        const operation = uploadInProgressRef.current;

        if (!operation || operation.started || !pendingUploadProductId || isNew) return;

        if (!idsMatch(productId, pendingUploadProductId)) {
            discardUploadOperation(operation);
            return;
        }

        const contextVersion = getProductContextVersion();
        if (!isProductContextCurrent(contextVersion, pendingUploadProductId)) return;

        operation.contextVersion = contextVersion;
        operation.started = true;
        setPendingUploadProductId(null);
        void uploadPendingFiles(operation);
    }, [isNew, pendingUploadProductId, productContextVersion, productId]);

    const deleteMedia = async (item) => {
        if (deletingMediaIdsRef.current.has(item.id)) return;

        const contextVersion = getProductContextVersion();
        deletingMediaIdsRef.current.add(item.id);
        setDeleteError('');
        setDeletingMediaIds((current) => [...current, item.id]);

        try {
            const productId = await resolveProductId();
            if (!productId || !isProductContextCurrent(contextVersion, productId)) return;

            const savedMedia = await deleteShopItemMedia(productId, item.id);

            if (isProductContextCurrent(contextVersion, productId)) {
                deletedMediaIdsRef.current.add(item.id);
                onMediaOrderChanged(savedMedia.filter((mediaItem) => !deletedMediaIdsRef.current.has(mediaItem.id)));
            }
        } catch (error) {
            if (!isProductContextCurrent(contextVersion)) return;

            const validationMessage = Object.values(error.errors ?? {}).flat().join(' ');

            setDeleteError(validationMessage || error.message || 'Не удалось удалить медиафайл.');
        } finally {
            deletingMediaIdsRef.current.delete(item.id);
            if (isProductContextCurrent(contextVersion)) {
                setDeletingMediaIds((current) => current.filter((mediaId) => mediaId !== item.id));
            }
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
        <AdminCard
            sectionRef={sectionRef}
            id="photo"
            title="Фото и видео"
            icon={PhotoIcon}
            required
            className={`!scroll-mt-0 transition-[border-color,box-shadow] ${isDragActive ? 'border-[color:var(--color-accent)] ring-[3px] ring-[rgba(184,79,24,.09)]' : ''}`}
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
        </AdminCard>
    );
}

function PriceSection({ sectionRef, form, currencySettings, currencyStatus, hasVariants, variantsQuantity, isVariantsLoading, onChange, onOpenCurrencySettings }) {
    const { t, i18n } = useTranslation();
    const storeCurrency = currencySettings.currency;
    const currencyRates = currencySettings.currency_rates;
    const priceCurrencies = [...new Set([
        storeCurrency,
        ...currencyRates.map(({ code }) => code),
    ].filter(Boolean))];
    const priceCurrency = form.currency;

    useEffect(() => {
        if (
            currencyStatus === 'loaded'
            && priceCurrencies.length > 0
            && !priceCurrencies.includes(priceCurrency)
        ) {
            onChange({ target: { name: 'currency', value: priceCurrencies[0] } });
        }
    }, [currencyStatus, onChange, priceCurrencies, priceCurrency]);

    const selectedCurrencyRate = findCurrencyRate(currencyRates, priceCurrency);
    const hasRate = isValidCurrencyRate(selectedCurrencyRate);
    const shouldShowPricePreview = Boolean(
        storeCurrency && priceCurrency && priceCurrency !== storeCurrency
    );
    const storeCurrencySymbol = supportedCurrencies.find(({ code }) => code === storeCurrency)?.symbol
        ?? storeCurrency;
    const formatPrice = (value) => value === null
        ? '—'
        : `${new Intl.NumberFormat(i18n.resolvedLanguage, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value)} ${storeCurrencySymbol}`;
    const storefrontPrice = convertPriceToStoreCurrency(form.price, priceCurrency, storeCurrency, currencyRates);
    const storefrontOldPrice = convertPriceToStoreCurrency(form.old_price, priceCurrency, storeCurrency, currencyRates);

    return (
        <AdminCard sectionRef={sectionRef} id="price" title="Цена и наличие" icon={CurrencyIcon} required bodyClassName="" className="!scroll-mt-0">
            <div className="flex min-h-[47px] flex-wrap items-center gap-x-1.5 gap-y-1 border-b border-[#f1e5dc] bg-[#fff8ed] px-[24px] py-3 text-[12px] text-[#92512f] max-sm:px-[13px]">
                {currencyStatus === 'loading' && <span>Загрузка валюты магазина…</span>}
                {currencyStatus === 'error' && <span>Не удалось загрузить валюты магазина.</span>}
                {currencyStatus === 'loaded' && (storeCurrency !== null ? (
                    <span>Валюта магазина: <strong className="font-[650]">{storeCurrency}</strong>.</span>
                ) : (
                    <button
                        className="cursor-pointer border-0 bg-transparent p-0 text-[12px] text-[#a94416] underline decoration-[#d59a78] underline-offset-2"
                        type="button"
                        data-currency-modal-trigger
                        onClick={onOpenCurrencySettings}
                    >
                        Выбрать валюту перед добавлением товаров
                    </button>
                ))}
            </div>

            <div className="p-[17px] max-sm:p-[13px]">
                <div className="flex items-end justify-between gap-6 max-sm:flex-col max-sm:items-stretch max-sm:gap-4">
                    <Field className="w-[182px] max-sm:w-full" label="Валюта цены">
                        <Select
                            className="cursor-pointer pr-9 font-[700]"
                            name="currency"
                            value={priceCurrency}
                            disabled={currencyStatus !== 'loaded' || priceCurrencies.length === 0}
                            onChange={onChange}
                            aria-label="Валюта цены"
                        >
                            {priceCurrencies.length === 0 && (
                                <option value="">
                                    {currencyStatus === 'error' ? 'Валюты недоступны' : 'Загрузка…'}
                                </option>
                            )}
                            {priceCurrencies.map((currency) => (
                                <option key={currency} value={currency}>
                                    {currency} — {t(`currencies.${currency}`)}
                                </option>
                            ))}
                        </Select>
                    </Field>

                    <button
                        className="mb-[10px] inline-flex cursor-pointer items-center gap-1.5 self-end border-0 bg-transparent p-0 text-[13px] font-[500] text-[color:var(--color-accent)] max-sm:mb-0 max-sm:self-start"
                        type="button"
                        data-currency-modal-trigger
                        onClick={onOpenCurrencySettings}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                            <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
                            <circle cx="16" cy="7" r="2" />
                            <circle cx="8" cy="17" r="2" />
                        </svg>
                        Курсы валют
                    </button>
                </div>

                <div className="mt-[18px] grid grid-cols-2 gap-x-5 gap-y-3 max-md:grid-cols-1">
                    <PriceField label="Цена" name="price" value={form.price} onChange={onChange} required />
                    <PriceField label="Старая цена" name="old_price" value={form.old_price} onChange={onChange} />
                </div>

                {shouldShowPricePreview && (
                    <>
                        <div className={`mt-[18px] flex min-h-[124px] items-center justify-between gap-8 rounded-[11px] border px-5 py-4 max-sm:flex-col max-sm:items-start max-sm:gap-4 ${hasRate ? 'border-[#efcfbb] bg-[#fff9f4]' : 'border-[#e8c7a8] bg-[#fff8ed]'}`}>
                            <div>
                                <p className="m-0 text-[12px] text-[#a06d50]">Цена на витрине · {storeCurrency}</p>
                                {hasRate ? (
                                    <>
                                        <strong className="mt-2 block text-[24px] font-[760] leading-none tracking-[-0.025em] text-[#713010]">
                                            {formatPrice(storefrontPrice)}
                                        </strong>
                                        {storefrontOldPrice !== null && (
                                            <s className="mt-3 block text-[12px] text-[#b18268] decoration-[#b18268]">
                                                {formatPrice(storefrontOldPrice)}
                                            </s>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <strong className="mt-2 block text-[16px] font-[720] text-[#8f461e]">
                                            Курс для {priceCurrency} не задан
                                        </strong>
                                        <p className="mt-2 text-[12px] leading-[1.45] text-[#9c6b50]">
                                            Пересчёт цены на витрине недоступен.
                                        </p>
                                    </>
                                )}
                            </div>
                            <div className="max-w-[235px] text-left max-sm:max-w-none">
                                <p className="m-0 text-[12px] font-[600] text-[#96522e]">
                                    1 {priceCurrency} = {hasRate ? selectedCurrencyRate : '—'} {storeCurrency}
                                </p>
                                <p className="mt-2 text-[11px] leading-[1.45] text-[#b07a5d]">
                                    {hasRate ? 'Используется курс магазина.' : 'Добавьте курс в настройках валют.'}
                                </p>
                            </div>
                        </div>

                        <p className="mt-[18px] text-[12px] leading-[1.5] text-[#887e76]">
                            При смене валюты сумма в поле сохраняется. Проверьте её перед сохранением товара.
                        </p>
                    </>
                )}

                <div className="mt-6 border-t border-[#eee8e3] pt-[18px]">
                    <div className="max-w-[420px]">
                        <PriceField
                            label="Количество"
                            name="quantity"
                            value={hasVariants ? variantsQuantity : form.quantity}
                            onChange={onChange}
                            suffix="шт"
                            disabled={hasVariants || isVariantsLoading}
                            required
                        />
                        {hasVariants && <small className="mt-1.5 block text-[11px] leading-[1.4] text-[#8c837c]">Количество рассчитывается по остаткам активных модификаций</small>}
                        {!hasVariants && !isVariantsLoading && form.quantity === '' && <small className="mt-1.5 block text-[11px] leading-[1.4] text-[#8c837c]">Укажите актуальный остаток товара</small>}
                    </div>
                    <label className="mt-3 flex items-center gap-[7px] text-[12px] text-[#6d655e]">
                        <input
                            className="h-[14px] w-[14px] accent-[color:var(--color-accent)]"
                            type="checkbox"
                            name="show_stock"
                            checked={form.show_stock}
                            onChange={onChange}
                        />
                        Показывать остаток на витрине
                    </label>
                </div>
            </div>
        </AdminCard>
    );
}

function ProductAside({ form, currencySettings, primaryCategoryName, media, isMediaLoading, mainPhotoValue, missingCriteria, onRecommendationClick }) {
    const { t, i18n } = useTranslation();
    const images = media.filter((item) => item.type === 'image');
    const mainImage = images.find((item) => item.is_main) ?? images[0] ?? null;
    const previewImages = mainImage
        ? [mainImage, ...images.filter((item) => item.id !== mainImage.id)]
        : [];
    const productName = form.name.trim();
    const rawPrice = String(form.price ?? '').trim();
    const storeCurrency = currencySettings.currency;
    const storePrice = convertPriceToStoreCurrency(
        form.price,
        form.currency,
        storeCurrency,
        currencySettings.currency_rates,
    );
    const formattedPrice = storePrice === null
        ? ''
        : new Intl.NumberFormat(i18n.resolvedLanguage ?? i18n.language, {
            maximumFractionDigits: 2,
        }).format(storePrice);
    const currencyLabel = supportedCurrencies.find(({ code }) => code === storeCurrency)?.symbol
        ?? storeCurrency;
    const unavailablePrice = rawPrice !== '' && parsePrice(form.price) !== null && !formattedPrice;
    const missingCriterionIds = new Set(missingCriteria.map(({ id }) => id));
    const recommendations = missingCriteria
        .filter(({ id }) => id !== 'photo-gallery' || !missingCriterionIds.has('first-photo'))
        .sort((left, right) => {
            const leftPriority = improvementPriority.indexOf(left.id);
            const rightPriority = improvementPriority.indexOf(right.id);

            return (leftPriority < 0 ? improvementPriority.length : leftPriority)
                - (rightPriority < 0 ? improvementPriority.length : rightPriority);
        })
        .slice(0, 4);

    return (
        <aside className="space-y-4 xl:sticky xl:top-[calc(var(--header-height)+24px)]">
            <section className="rounded-[16px] border border-[color:var(--color-border)] bg-white p-4 shadow-[var(--shadow-sm)]">
                <h2 className="mb-3 text-[13px] font-[750]">{t('productEditPage.improvements.title')}</h2>
                {recommendations.length > 0 ? (
                    <div className="space-y-1 text-[12px]">
                        {recommendations.map(({ id, sectionId }) => (
                            <button
                                key={id}
                                className="-mx-1 flex min-h-[30px] w-[calc(100%+8px)] cursor-pointer items-center gap-[7px] rounded-[7px] border-0 bg-transparent px-1 py-0 text-left text-[#625a54] transition-colors hover:bg-[#f8f4f1] hover:text-[color:var(--color-accent)]"
                                type="button"
                                onClick={() => onRecommendationClick(sectionId)}
                            >
                                <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-[#d8d0ca] text-[#837a73]"><PlusIcon width={12} height={12} /></span>
                                {t(`productEditPage.improvements.criteria.${id}`)}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 rounded-[9px] bg-[color:var(--color-success-soft)] px-3 py-2.5 text-[12px] text-[color:var(--color-success)]">
                        <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border border-current text-[11px] font-bold">✓</span>
                        <span>{t('productEditPage.improvements.complete')}</span>
                    </div>
                )}
            </section>

            <section className="overflow-hidden rounded-[16px] border border-[color:var(--color-border)] bg-white shadow-[var(--shadow-sm)] max-lg:hidden">
                <header className="flex items-center justify-between border-b border-[color:var(--color-border)] px-4 py-3">
                    <h2 className="text-[13px] font-[750]">Предпросмотр</h2><EyeIcon /></header>
                    <div className="p-4">
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[12px] bg-[#f5f1ee]">
                            {mainImage ? (
                                <img
                                    className="h-full w-full object-cover"
                                    src={mainImage.large_url ?? mainImage.url ?? mainImage.small_url}
                                    alt={productName || 'Основное фото товара'}
                                />
                            ) : (
                                <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#9a918a]">
                                    {isMediaLoading
                                        ? <span className="h-6 w-6 animate-spin rounded-full border-2 border-[#d8cbc2] border-t-[color:var(--color-accent)]" aria-hidden="true" />
                                        : <PhotoIcon />}
                                    <small className="text-[11px]">{isMediaLoading ? 'Загрузка фотографий…' : 'Фото не добавлено'}</small>
                                </span>
                            )}
                        </div>
                        <div className="mt-[7px] grid grid-cols-5 gap-1">
                            {previewImages.slice(0, 4).map((image, index) => (
                                <span key={image.id} className={`relative aspect-square overflow-hidden rounded-[5px] border bg-[#f5f1ee] ${index === 0 ? 'border-[color:var(--color-accent)]' : 'border-transparent'}`}>
                                    <img className="h-full w-full object-cover" src={image.small_url ?? image.url ?? image.large_url} alt="" />
                                </span>
                            ))}
                            <span className="grid aspect-square place-items-center rounded-[5px] border border-[color:var(--color-border)] bg-white p-0 text-[11px] font-[700] text-[#766e67]">
                                {previewImages.length > 4 ? `+${previewImages.length - 4}` : <PlusIcon />}
                            </span>
                        </div>
                        <small className={`mt-4 block text-[10px] uppercase tracking-[.06em] ${primaryCategoryName ? 'text-[#9a938d]' : 'text-[#b0a8a2]'}`}>
                            {primaryCategoryName || 'Категория не выбрана'}
                        </small>
                        <strong className={`mt-1 block text-[13px] ${productName ? '' : 'text-[#9a938d]'}`}>
                            {productName || 'Название товара не указано'}
                        </strong>
                        <b className={`mt-2 block text-[15px] ${formattedPrice ? '' : 'text-[#9a938d]'}`}>
                            {formattedPrice || (unavailablePrice ? 'Цена в валюте магазина недоступна' : 'Цена не указана')}{formattedPrice && currencyLabel ? ` ${currencyLabel}` : ''}
                        </b>
                        {formattedPrice && !currencyLabel && <small className="mt-1 block text-[11px] text-[#9a938d]">Валюта не выбрана</small>}
                        {mainPhotoValue && (
                            <span className="mt-[7px] inline-flex items-center gap-[5px] rounded-[7px] bg-[#f7f2ee] px-[7px] py-[5px] text-[11px] font-[680] text-[#736960]">
                                <i className="h-[9px] w-[9px] rounded-full bg-[#a9683e]" />По умолчанию: {mainPhotoValue}
                            </span>
                        )}
                    </div>
            </section>

        </aside>);
}

function AccordionSection({ sectionRef, id, title, icon: Icon, children, open = true }) {
    return <details ref={sectionRef} id={id} className="accordion" open={open}><summary className="accordion__summary"><span className="accordion__icon [&_svg]:h-[14px] [&_svg]:w-[14px]"><Icon /></span><strong className="accordion__title">{title}</strong><em className="accordion__badge">Необязательно</em><ChevronIcon /></summary><div className="accordion__body">{children}</div></details>;
}

function PriceField({ label, name, value, onChange, suffix, required, disabled = false }) { return <Field label={<>{label} {required && <b className="text-[color:var(--color-accent)]">*</b>}</>}><span className="relative"><Input className={`${suffix ? 'pr-11' : ''} font-bold disabled:cursor-not-allowed disabled:bg-[#f2efec] disabled:text-[#817870]`} name={name} value={value} onChange={onChange} disabled={disabled} />{suffix && <b className="absolute right-[11px] top-1/2 -translate-y-1/2 text-[11px] text-[#8d857f]">{suffix}</b>}</span></Field>; }
