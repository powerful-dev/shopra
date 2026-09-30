import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CloseIcon from '../../components/icons/CloseIcon';
import CheckIcon from '../../components/icons/CheckIcon';
import ChevronIcon from '../../components/icons/ChevronIcon';
import LinkIcon from '../../components/icons/LinkIcon';
import PhotoIcon from '../../components/icons/PhotoIcon';
import SectionBoxIcon from '../../components/icons/SectionBoxIcon';
import UploadIcon from '../../components/icons/UploadIcon';
import { MediaDeleteButton } from '../../components/admin/MediaCardControls';
import RichTextEditor from '../../components/admin/RichTextEditor';
import SearchableSelect from '../../components/admin/SearchableSelect';
import Field from '../../components/form/Field';
import Input from '../../components/form/Input';
import useSectionScroll from '../../hooks/useSectionScroll';
import useFileDropZone from '../../hooks/useFileDropZone';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import CategorySlugField from './CategorySlugField';
import AdminCard from '../../components/admin/AdminCard';
import ImageLightbox from '../../components/admin/ImageLightbox';
import SeoFields from '../../components/admin/SeoFields';
import { deleteShopGroupImage, updateShopGroup, uploadShopGroupImage } from '../../services/shopGroups';
import { getShopItemMediaConfig } from '../../services/shopItems';
import { formatMediaExtensions } from '../../utils/media';

const fieldWrapperClass = '[&.form-field]:gap-[7px] [&>.form-label]:text-[12px] [&>.form-label]:leading-normal [&>.form-label]:text-[#554e48]';
const categoryImageUploadMaxBytes = Number(document.querySelector('meta[name="category-image-upload-max-bytes"]')?.content);
export default function CategoryEditModal({ category, parentOptions = [], isLoadingParents = false, parentsError = '', onClose, onUpdated, onImageChanged }) {
    const { t, i18n } = useTranslation();
    const scrollContainerRef = useRef(null);
    const sectionNavigationRef = useRef(null);
    const sectionRefs = useRef({});
    const photoInputRef = useRef(null);
    const photoUploadInProgressRef = useRef(false);
    const activeCategoryIdRef = useRef(null);
    const saveFeedbackTimerRef = useRef(null);
    const [slug, setSlug] = useState('');
    const [isEditingSlug, setIsEditingSlug] = useState(false);
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState('');
    const [description, setDescription] = useState('');
    const [text, setText] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [savedPhotoUrl, setSavedPhotoUrl] = useState('');
    const [savedLargePhotoUrl, setSavedLargePhotoUrl] = useState('');
    const [photoPreviewUrl, setPhotoPreviewUrl] = useState('');
    const [isPhotoLightboxOpen, setIsPhotoLightboxOpen] = useState(false);
    const [photoLightboxIndex, setPhotoLightboxIndex] = useState(0);
    const [isPhotoUploading, setIsPhotoUploading] = useState(false);
    const [isDeletingPhoto, setIsDeletingPhoto] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);
    const [photoError, setPhotoError] = useState('');
    const [saveError, setSaveError] = useState('');
    const [mediaConfig, setMediaConfig] = useState(null);
    usePageScrollLock(Boolean(category));
    const scrollToSection = useSectionScroll({
        stickyRef: sectionNavigationRef,
        containerRef: scrollContainerRef,
    });
    const sectionLinks = [
        ['category-edit-main', t('categoryEditModal.main.title'), SectionBoxIcon],
        ['category-edit-photo', t('categoryEditModal.photo.title'), PhotoIcon],
        ['category-edit-seo', 'SEO', LinkIcon],
    ];
    const maximumPhotoSizeError = () => categoryImageUploadMaxBytes
        ? t('categoryEditModal.photo.maxSize', {
            size: new Intl.NumberFormat(i18n.resolvedLanguage ?? i18n.language, {
                maximumFractionDigits: 1,
            }).format(categoryImageUploadMaxBytes / (1024 * 1024)),
        })
        : t('categoryEditModal.photo.uploadError');
    const isPhotoUploadDisabled = isPhotoUploading || isDeletingPhoto;
    const {
        isDragActive: isPhotoDragActive,
        reset: resetPhotoDropZone,
        dropZoneProps: photoDropZoneProps,
    } = useFileDropZone({
        disabled: isPhotoUploadDisabled,
        onDrop: (files) => void selectPhoto(files[0]),
    });

    useEffect(() => {
        window.clearTimeout(saveFeedbackTimerRef.current);
        setName(category?.name ?? '');
        setSlug(category?.slug ?? '');
        setParentId(category?.parent_id == null ? '' : String(category.parent_id));
        setDescription(category?.description ?? '');
        setText(category?.text ?? '');
        setSeoTitle(category?.seo_title ?? '');
        setSeoDescription(category?.seo_description ?? '');
        setSavedPhotoUrl(category?.image_url ?? '');
        setSavedLargePhotoUrl(category?.image_large_url ?? '');
        setSelectedPhoto(null);
        setIsPhotoLightboxOpen(false);
        setPhotoLightboxIndex(0);
        resetPhotoDropZone();
        setIsPhotoUploading(false);
        setIsDeletingPhoto(false);
        activeCategoryIdRef.current = category?.id ?? null;
        setIsEditingSlug(false);
        setShowSaveSuccess(false);
        setPhotoError('');
        setSaveError('');
    }, [category, resetPhotoDropZone]);

    useEffect(() => () => window.clearTimeout(saveFeedbackTimerRef.current), []);

    useEffect(() => {
        let isActive = true;

        getShopItemMediaConfig()
            .then((config) => {
                if (isActive) setMediaConfig(config);
            })
            .catch((error) => console.error(error));

        return () => {
            isActive = false;
        };
    }, []);

    useEffect(() => {
        if (!selectedPhoto) {
            setPhotoPreviewUrl(savedPhotoUrl);

            return undefined;
        }

        const previewUrl = URL.createObjectURL(selectedPhoto);
        setPhotoPreviewUrl(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [savedPhotoUrl, selectedPhoto]);

    async function selectPhoto(file) {
        setPhotoError('');

        if (!file?.type.startsWith('image/') || !category || photoUploadInProgressRef.current || isDeletingPhoto) return;

        if (categoryImageUploadMaxBytes && file.size > categoryImageUploadMaxBytes) {
            setPhotoError(maximumPhotoSizeError());

            return;
        }

        const categoryId = category.id;
        photoUploadInProgressRef.current = true;
        setSelectedPhoto(file);
        setIsPhotoUploading(true);

        try {
            const uploadedImage = await uploadShopGroupImage(categoryId, file);

            if (activeCategoryIdRef.current === categoryId) {
                setSavedPhotoUrl(uploadedImage.url);
                setSavedLargePhotoUrl(uploadedImage.large_url);
                onImageChanged?.();
            }
        } catch (error) {
            if (activeCategoryIdRef.current === categoryId) {
                const validationMessage = Object.values(error.errors ?? {}).flat().join(' ');

                setPhotoError(error.status === 413
                    ? t('categoryEditModal.photo.requestTooLarge')
                    : validationMessage || t('categoryEditModal.photo.uploadError'));
            }
        } finally {
            if (activeCategoryIdRef.current === categoryId) {
                setSelectedPhoto(null);
                setIsPhotoUploading(false);
            }

            photoUploadInProgressRef.current = false;
        }
    }

    async function deletePhoto() {
        if (!category || !savedPhotoUrl || isDeletingPhoto || photoUploadInProgressRef.current) return;

        const categoryId = category.id;
        setIsDeletingPhoto(true);
        setPhotoError('');

        try {
            await deleteShopGroupImage(categoryId);

            if (activeCategoryIdRef.current === categoryId) {
                setSavedPhotoUrl('');
                setSavedLargePhotoUrl('');
                setSelectedPhoto(null);
                setIsPhotoLightboxOpen(false);
                onImageChanged?.();
            }
        } catch (error) {
            if (activeCategoryIdRef.current === categoryId) {
                setPhotoError(Object.values(error.errors ?? {}).flat().join(' ') || t('categoryEditModal.photo.deleteError'));
            }
        } finally {
            if (activeCategoryIdRef.current === categoryId) {
                setIsDeletingPhoto(false);
            }
        }
    }

    async function saveCategory(event) {
        event.preventDefault();
        if (!category || isSaving) return;

        const categoryId = category.id;
        window.clearTimeout(saveFeedbackTimerRef.current);
        setIsSaving(true);
        setShowSaveSuccess(false);
        setSaveError('');

        try {
            const updatedCategory = await updateShopGroup(categoryId, {
                name,
                slug,
                parent_id: parentId ? Number(parentId) : null,
                description: description || null,
                text: text || null,
                seo_title: seoTitle || null,
                seo_description: seoDescription || null,
            });
            onUpdated(updatedCategory);

            if (activeCategoryIdRef.current === categoryId) {
                setShowSaveSuccess(true);
                saveFeedbackTimerRef.current = window.setTimeout(() => {
                    setShowSaveSuccess(false);
                }, 3500);
            }
        } catch (error) {
            if (activeCategoryIdRef.current === categoryId) {
                setSaveError(Object.values(error.errors ?? {}).flat().join(' ') || t('categoriesModal.errors.save'));
            }
        } finally {
            setIsSaving(false);
        }
    }

    if (!category) return null;

    return (
        <section
            className="fixed left-1/2 top-1/2 z-[600] flex h-[min(740px,calc(100vh-76px))] w-[min(1000px,calc(100vw-84px))] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-[16px] border border-[#ded6d0] bg-[#fbfaf8] shadow-[0_28px_90px_rgba(42,30,22,.28)] max-[620px]:h-[calc(100vh-32px)] max-[620px]:w-[calc(100vw-28px)]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="category-edit-modal-title"
            onMouseDown={(event) => event.stopPropagation()}
        >
            <header className="flex items-start justify-between gap-4 border-b border-[color:var(--color-border)] bg-white px-6 py-[18px] max-[620px]:px-4">
                <div className="min-w-0">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[.12em] text-[color:var(--color-accent)]">{t('categoryEditModal.eyebrow')}</p>
                    <h2 id="category-edit-modal-title" className="mb-0 mt-1 truncate text-[24px] font-[760] tracking-[-.035em] text-[#312d29]">{t('categoryEditModal.title')}</h2>
                </div>
                <button type="button" className="grid h-[38px] w-[38px] shrink-0 place-items-center rounded-[10px] border border-[color:var(--color-border)] bg-white text-[#706861] hover:text-[color:var(--color-accent)]" onClick={onClose} aria-label={t('categoryEditModal.close')}>
                    <CloseIcon width="18" height="18" />
                </button>
            </header>

            <form id="category-edit-form" ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto" onSubmit={saveCategory}>
                <nav ref={sectionNavigationRef} className="sticky top-0 z-20 border-b border-[color:var(--color-border)] bg-[rgba(247,246,243,.95)] backdrop-blur" aria-label={t('categoryEditModal.sectionsLabel')}>
                    <div className="flex items-center gap-0.5 overflow-x-auto px-5 py-1 max-[620px]:px-3">
                        {sectionLinks.map(([id, label, Icon], index) => (
                            <button key={id} type="button" className={`flex min-h-[45px] shrink-0 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-2.5 text-[12px] font-[680] ${index === 0 ? 'relative text-[color:var(--color-accent)] after:absolute after:inset-x-2.5 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[color:var(--color-accent)]' : 'text-[#756e67]'}`} onClick={() => scrollToSection(sectionRefs.current[id])}>
                                <span className={`grid h-[25px] w-[25px] place-items-center rounded-lg ${index === 0 ? 'bg-[#f9eee7]' : 'bg-[#f0ebe7]'}`}><Icon /></span>{label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="space-y-3 px-5 pb-5 pt-[13px] max-[620px]:px-3 max-[620px]:pb-3">
                    <AdminCard sectionRef={(element) => { sectionRefs.current['category-edit-main'] = element; }} id="category-edit-main" title={t('categoryEditModal.main.title')}>
                    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 max-[620px]:grid-cols-1">
                        <Field label={t('categoryEditModal.main.id')} className={fieldWrapperClass}>
                            <Input className="bg-[#f7f4f1] text-[#8d857e]" type="text" value={category.id} readOnly />
                        </Field>
                        <Field label={t('categoryEditModal.main.name')} className={fieldWrapperClass}>
                            <Input type="text" value={name} onChange={(event) => setName(event.target.value)} disabled={isSaving} />
                            <CategorySlugField slug={slug} isEditing={isEditingSlug} disabled={isSaving} onChange={setSlug} onEditingChange={setIsEditingSlug} />
                        </Field>
                    </div>
                    <div className="mt-[15px]">
                        <Field label={t('categoryEditModal.main.parent')} className={fieldWrapperClass}>
                            <SearchableSelect
                                options={[
                                    {
                                        value: '',
                                        label: isLoadingParents
                                            ? t('categoriesModal.form.loadingCategories')
                                            : t('categoryEditModal.main.noParent'),
                                    },
                                    ...parentOptions
                                        .filter((option) => option.id !== category.id)
                                        .map((option) => ({
                                            value: String(option.id),
                                            label: option.label,
                                        })),
                                ]}
                                value={parentId}
                                onChange={setParentId}
                                placeholder={t('categoryEditModal.main.noParent')}
                                searchPlaceholder={t('categoriesModal.searchPlaceholder')}
                                emptyMessage={t('categoriesModal.noResults')}
                                ariaLabel={t('categoryEditModal.main.parent')}
                                disabled={isSaving || isLoadingParents || Boolean(parentsError)}
                                ariaBusy={isLoadingParents}
                            />
                            {parentsError && <span className="text-xs text-[#8d857e]" role="alert">{parentsError}</span>}
                        </Field>
                    </div>
                    <div className="mt-[15px]">
                        <Field label={t('categoryEditModal.main.shortDescription')} className={fieldWrapperClass}>
                            <RichTextEditor
                                instanceKey="short-description"
                                value={description}
                                onChange={setDescription}
                                disabled={isSaving}
                            />
                        </Field>
                    </div>
                    <div className="mt-[15px]">
                        <Field label={t('categoryEditModal.main.fullDescription')} className={fieldWrapperClass}>
                            <RichTextEditor
                                instanceKey="full-description"
                                value={text}
                                onChange={setText}
                                disabled={isSaving}
                            />
                        </Field>
                    </div>
                </AdminCard>

                <AdminCard
                    sectionRef={(element) => { sectionRefs.current['category-edit-photo'] = element; }}
                    id="category-edit-photo"
                    title={t('categoryEditModal.photo.title')}
                    className={`transition-[border-color,box-shadow] ${isPhotoDragActive ? 'border-[color:var(--color-accent)] ring-[3px] ring-[rgba(184,79,24,.09)]' : ''}`}
                    sectionProps={photoDropZoneProps}
                >
                    <div className="flex gap-2">
                        {photoPreviewUrl && (
                            <div className="media-card relative h-[178px] w-[139px] shrink-0 overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[#f5f1ee] max-sm:h-[153px] max-sm:w-[119px]">
                                {savedLargePhotoUrl && !selectedPhoto ? (
                                    <button
                                        type="button"
                                        className="block h-full w-full cursor-zoom-in border-0 bg-transparent p-0"
                                        aria-label={t('categoryEditModal.photo.openLarge')}
                                        onClick={() => {
                                            setPhotoLightboxIndex(0);
                                            setIsPhotoLightboxOpen(true);
                                        }}
                                    >
                                        <img className="h-full w-full object-cover" src={photoPreviewUrl} alt="" />
                                    </button>
                                ) : (
                                    <img className="h-full w-full object-cover" src={photoPreviewUrl} alt="" />
                                )}
                                {savedPhotoUrl && !isPhotoUploading && (
                                    <MediaDeleteButton
                                        aria-label={t('categoryEditModal.photo.delete')}
                                        title={t('categoryEditModal.photo.delete')}
                                        disabled={isDeletingPhoto}
                                        onClick={() => void deletePhoto()}
                                    />
                                )}
                                {isPhotoUploading && (
                                    <div
                                        className="absolute inset-0 z-20 grid place-items-center bg-black/35"
                                        role="status"
                                        aria-label={t('categoriesModal.form.loading')}
                                    >
                                        <span className="h-7 w-7 animate-spin rounded-full border-[3px] border-white/40 border-t-white" aria-hidden="true" />
                                    </div>
                                )}
                            </div>
                        )}
                        {!photoPreviewUrl && (
                            <button
                                type="button"
                                className="flex h-[178px] min-w-0 flex-1 cursor-pointer flex-col items-center justify-center rounded-[10px] border border-dashed border-[#d0b09d] bg-[#f8f5f2] px-4 text-center text-[color:var(--color-accent)] transition-colors max-sm:h-[153px] disabled:cursor-not-allowed disabled:opacity-60"
                                disabled={isPhotoUploadDisabled}
                                onClick={() => photoInputRef.current?.click()}
                            >
                                <UploadIcon />
                                <strong className="mt-2 text-[13px] text-[#5d554f]">{t('categoryEditModal.photo.add')}</strong>
                                {mediaConfig && (
                                    <small className="mt-1 text-[11px] leading-[1.4] text-[#98918a]">
                                        {t('categoryEditModal.photo.requirements', {
                                            formats: formatMediaExtensions(mediaConfig.image.extensions),
                                            size: new Intl.NumberFormat(i18n.resolvedLanguage).format(mediaConfig.image.max_kilobytes / 1024),
                                        })}
                                    </small>
                                )}
                            </button>
                        )}
                        <Input
                            ref={photoInputRef}
                            className="hidden"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            tabIndex={-1}
                            disabled={isPhotoUploadDisabled}
                            onChange={(event) => {
                                void selectPhoto(event.target.files[0]);
                                event.target.value = '';
                            }}
                        />
                    </div>
                    {photoError && <p className="mb-0 mt-2 text-xs text-red-600" role="alert">{photoError}</p>}
                </AdminCard>

                <details ref={(element) => { sectionRefs.current['category-edit-seo'] = element; }} id="category-edit-seo" className="accordion scroll-mt-[58px]">
                    <summary className="accordion__summary">
                        <span className="accordion__icon"><LinkIcon /></span>
                        <strong className="accordion__title">SEO</strong>
                        <em className="accordion__badge">{t('categoryEditModal.optional')}</em>
                        <ChevronIcon />
                    </summary>
                    <div className="accordion__body">
                        <SeoFields
                            title={seoTitle}
                            description={seoDescription}
                            url={category.url}
                            titleLabel={t('categoryEditModal.seo.title')}
                            descriptionLabel={t('categoryEditModal.seo.description')}
                            disabled={isSaving}
                            onTitleChange={setSeoTitle}
                            onDescriptionChange={setSeoDescription}
                        />
                    </div>
                    </details>
                    {saveError && <p className="m-0 text-xs text-[#8d857e]" role="alert">{saveError}</p>}
                </div>
            </form>

            <footer className="flex items-center gap-3 border-t border-[color:var(--color-border)] bg-white px-6 py-3 max-[620px]:px-4">
                <div className="min-w-0 flex-1" aria-live="polite">
                    {showSaveSuccess && (
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-[color:var(--color-success)]" role="status">
                            <CheckIcon />
                            {t('categoryEditModal.saveSuccess')}
                        </span>
                    )}
                </div>
                <div className="flex shrink-0 gap-2">
                    <button type="button" className="button button--secondary" onClick={onClose}>{t('categoryEditModal.closeButton')}</button>
                    <button type="submit" form="category-edit-form" className="button button--primary" disabled={isSaving}>{isSaving ? t('categoriesModal.form.saving') : t('common.save')}</button>
                </div>
            </footer>
            <ImageLightbox
                images={savedLargePhotoUrl ? [{ src: savedLargePhotoUrl, alt: name }] : []}
                index={photoLightboxIndex}
                open={isPhotoLightboxOpen}
                onClose={() => setIsPhotoLightboxOpen(false)}
                onIndexChange={setPhotoLightboxIndex}
            />
        </section>
    );
}
