import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Editor } from '@tinymce/tinymce-react';
import 'tinymce/tinymce';
import 'tinymce/icons/default';
import 'tinymce/themes/silver';
import 'tinymce/models/dom';
import 'tinymce/plugins/code';
import 'tinymce/plugins/image';
import 'tinymce/skins/ui/oxide/skin.min.css';
import contentUiCss from 'tinymce/skins/ui/oxide/content.min.css?inline';
import contentCss from 'tinymce/skins/content/default/content.min.css?inline';
import ChevronIcon from '../../components/icons/ChevronIcon';
import UploadIcon from '../../components/icons/UploadIcon';
import useSectionScroll from '../../hooks/useSectionScroll';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import useTinyMceLanguage from '../../hooks/useTinyMceLanguage';
import CategorySlugField from './CategorySlugField';
import { updateShopGroup } from '../../services/shopGroups';
import { uploadEditorImage } from '../../services/editorImages';

const fieldClass = 'h-[42px] w-full rounded-[9px] border border-[#ddd5cf] bg-white px-[11px] text-[13px] text-[#3f3934] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]';
const editorBaseInit = {
    skin: false,
    content_css: false,
    content_style: `${contentUiCss}\n${contentCss}`,
    plugins: 'code image',
    toolbar: 'undo redo | blocks | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | image code',
    images_upload_handler: (blobInfo) => uploadEditorImage(blobInfo.blob(), blobInfo.filename()),
};

export default function CategoryEditModal({ category, parentOptions = [], isLoadingParents = false, parentsError = '', onClose, onUpdated }) {
    const { t } = useTranslation();
    const editorLanguage = useTinyMceLanguage();
    const editorInit = useMemo(() => ({
        ...editorBaseInit,
        ...editorLanguage,
    }), [editorLanguage]);
    const scrollContainerRef = useRef(null);
    const sectionNavigationRef = useRef(null);
    const sectionRefs = useRef({});
    const [slug, setSlug] = useState('');
    const [isEditingSlug, setIsEditingSlug] = useState(false);
    const [name, setName] = useState('');
    const [parentId, setParentId] = useState('');
    const [description, setDescription] = useState('');
    const [text, setText] = useState('');
    const [seoTitle, setSeoTitle] = useState('');
    const [seoDescription, setSeoDescription] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    usePageScrollLock(Boolean(category));
    const scrollToSection = useSectionScroll({
        stickyRef: sectionNavigationRef,
        containerRef: scrollContainerRef,
    });
    const sectionLinks = [
        ['category-edit-main', t('categoryEditModal.main.title'), 'box'],
        ['category-edit-photo', t('categoryEditModal.photo.title'), 'photo'],
        ['category-edit-seo', 'SEO', 'link'],
    ];

    useEffect(() => {
        setName(category?.name ?? '');
        setSlug(category?.slug ?? '');
        setParentId(category?.parent_id == null ? '' : String(category.parent_id));
        setDescription(category?.description ?? '');
        setText(category?.text ?? '');
        setSeoTitle(category?.seo_title ?? '');
        setSeoDescription(category?.seo_description ?? '');
        setIsEditingSlug(false);
        setSaveError('');
    }, [category]);

    async function saveCategory(event) {
        event.preventDefault();
        if (!category || isSaving) return;

        setIsSaving(true);
        setSaveError('');

        try {
            const updatedCategory = await updateShopGroup(category.id, {
                name,
                slug,
                parent_id: parentId ? Number(parentId) : null,
                description: description || null,
                text: text || null,
                seo_title: seoTitle || null,
                seo_description: seoDescription || null,
            });
            onUpdated(updatedCategory);
        } catch (error) {
            setSaveError(Object.values(error.errors ?? {}).flat().join(' ') || t('categoriesModal.errors.save'));
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
                    <CloseIcon />
                </button>
            </header>

            <form id="category-edit-form" ref={scrollContainerRef} className="min-h-0 flex-1 overflow-y-auto" onSubmit={saveCategory}>
                <nav ref={sectionNavigationRef} className="sticky top-0 z-20 border-b border-[color:var(--color-border)] bg-[rgba(247,246,243,.95)] backdrop-blur" aria-label={t('categoryEditModal.sectionsLabel')}>
                    <div className="flex items-center gap-0.5 overflow-x-auto px-5 py-1 max-[620px]:px-3">
                        {sectionLinks.map(([id, label, icon], index) => (
                            <button key={id} type="button" className={`flex min-h-[45px] shrink-0 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-2.5 text-[12px] font-[680] ${index === 0 ? 'relative text-[color:var(--color-accent)] after:absolute after:inset-x-2.5 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[color:var(--color-accent)]' : 'text-[#756e67]'}`} onClick={() => scrollToSection(sectionRefs.current[id])}>
                                <span className={`grid h-[25px] w-[25px] place-items-center rounded-lg ${index === 0 ? 'bg-[#f9eee7]' : 'bg-[#f0ebe7]'}`}><SectionIcon type={icon} /></span>{label}
                            </button>
                        ))}
                    </div>
                </nav>

                <div className="space-y-3 px-5 pb-5 pt-[13px] max-[620px]:px-3 max-[620px]:pb-3">
                    <Card sectionRef={(element) => { sectionRefs.current['category-edit-main'] = element; }} id="category-edit-main" title={t('categoryEditModal.main.title')}>
                    <div className="grid grid-cols-[120px_minmax(0,1fr)] gap-3 max-[620px]:grid-cols-1">
                        <Field label={t('categoryEditModal.main.id')}>
                            <input className={`${fieldClass} bg-[#f7f4f1] text-[#8d857e]`} type="text" value={category.id} readOnly />
                        </Field>
                        <Field label={t('categoryEditModal.main.name')}>
                            <input className={fieldClass} type="text" value={name} onChange={(event) => setName(event.target.value)} disabled={isSaving} />
                            <CategorySlugField slug={slug} isEditing={isEditingSlug} disabled={isSaving} onChange={setSlug} onEditingChange={setIsEditingSlug} />
                        </Field>
                    </div>
                    <div className="mt-[15px]">
                        <Field label={t('categoryEditModal.main.parent')}>
                            <select
                                className={fieldClass}
                                value={parentId}
                                onChange={(event) => setParentId(event.target.value)}
                                disabled={isSaving || isLoadingParents || Boolean(parentsError)}
                                aria-busy={isLoadingParents}
                            >
                                <option value="">{isLoadingParents ? t('categoriesModal.form.loadingCategories') : t('categoryEditModal.main.noParent')}</option>
                                {parentOptions.filter((option) => option.id !== category.id).map((option) => (
                                    <option key={option.id} value={option.id}>{option.label}</option>
                                ))}
                            </select>
                            {parentsError && <span className="text-xs text-[#8d857e]" role="alert">{parentsError}</span>}
                        </Field>
                    </div>
                    <div className="mt-[15px]">
                        <Field label={t('categoryEditModal.main.shortDescription')}>
                            <Editor
                                key={`short-description-${editorLanguage.language}`}
                                licenseKey="gpl"
                                init={editorInit}
                                value={description}
                                onEditorChange={setDescription}
                                disabled={isSaving}
                            />
                        </Field>
                    </div>
                    <div className="mt-[15px]">
                        <Field label={t('categoryEditModal.main.fullDescription')}>
                            <Editor
                                key={`full-description-${editorLanguage.language}`}
                                licenseKey="gpl"
                                init={editorInit}
                                value={text}
                                onEditorChange={setText}
                                disabled={isSaving}
                            />
                        </Field>
                    </div>
                </Card>

                <Card sectionRef={(element) => { sectionRefs.current['category-edit-photo'] = element; }} id="category-edit-photo" title={t('categoryEditModal.photo.title')}>
                    <div className="flex flex-wrap gap-2">
                        <div className="relative h-[178px] w-[139px] overflow-hidden rounded-[10px] border border-[color:var(--color-border)] bg-[linear-gradient(145deg,#86939d,#2b3c48)] max-sm:h-[153px] max-sm:w-[119px]">
                            <i className="absolute inset-[24%] rounded-[36%_36%_18%_18%] border border-white/40 bg-[#314555]/55" />
                        </div>
                        <label className="flex h-[178px] w-[139px] cursor-pointer flex-col items-center justify-center rounded-[10px] border border-[color:var(--color-border)] bg-[#f8f5f2] text-[color:var(--color-accent)] max-sm:h-[153px] max-sm:w-[119px]">
                            <input className="sr-only" type="file" accept="image/*" />
                            <UploadIcon />
                            <strong className="mt-1.5 text-[11px] text-[#5d554f]">{t('categoryEditModal.photo.add')}</strong>
                            <small className="text-[11px] text-[#98918a]">{t('categoryEditModal.photo.image')}</small>
                        </label>
                    </div>
                    <p className="mb-0 mt-2 text-[12px] text-[#9c948e]">{t('categoryEditModal.photo.hint')}</p>
                </Card>

                <details ref={(element) => { sectionRefs.current['category-edit-seo'] = element; }} id="category-edit-seo" className="accordion scroll-mt-[58px]">
                    <summary className="accordion__summary">
                        <span className="accordion__icon"><LinkIcon /></span>
                        <strong className="accordion__title">SEO</strong>
                        <em className="accordion__badge">{t('categoryEditModal.optional')}</em>
                        <ChevronIcon />
                    </summary>
                    <div className="accordion__body">
                        <Field label={t('categoryEditModal.seo.title')}>
                            <input className={fieldClass} type="text" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} disabled={isSaving} />
                        </Field>
                        <div className="mt-[13px]">
                            <Field label={t('categoryEditModal.seo.description')}>
                                <textarea className="h-[92px] w-full resize-y rounded-[9px] border border-[#ddd5cf] bg-white p-[11px] text-[13px] leading-normal outline-none focus:border-[#c77d56]" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} disabled={isSaving} />
                            </Field>
                        </div>
                        <div className="mt-[13px] rounded-[10px] border border-[color:var(--color-border)] bg-[#faf9f7] p-3">
                            <small className="text-[11px] text-[color:var(--color-success)]">{category.url}</small>
                            <strong className="mt-[3px] block text-[12px] text-[#375b8b]">{seoTitle}</strong>
                            <p className="mb-0 mt-[3px] text-[11px] text-[#7c746e]">{seoDescription}</p>
                        </div>
                    </div>
                    </details>
                    {saveError && <p className="m-0 text-xs text-[#8d857e]" role="alert">{saveError}</p>}
                </div>
            </form>

            <footer className="flex justify-end gap-2 border-t border-[color:var(--color-border)] bg-white px-6 py-3 max-[620px]:px-4">
                <button type="button" className="button button--secondary" onClick={onClose} disabled={isSaving}>{t('categoryEditModal.cancel')}</button>
                <button type="submit" form="category-edit-form" className="button button--primary" disabled={isSaving}>{isSaving ? t('categoriesModal.form.saving') : t('common.save')}</button>
            </footer>
        </section>
    );
}

function Card({ sectionRef, id, title, children }) {
    return <section ref={sectionRef} id={id} className="scroll-mt-[58px] rounded-[14px] border border-[color:var(--color-border)] bg-white shadow-[0_7px_24px_rgba(70,47,31,.03)]"><header className="flex min-h-[48px] items-center gap-[9px] border-b border-[#f0ece8] px-[17px]"><h2 className="text-[15px] font-[740]">{title}</h2></header><div className="p-[15px_17px_17px] max-sm:p-[13px]">{children}</div></section>;
}

function Field({ label, children }) {
    return <label className="flex min-w-0 flex-col gap-[7px]"><span className="text-[12px] font-bold text-[#554e48]">{label}</span>{children}</label>;
}

const CloseIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>;
const LinkIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 17H7A5 5 0 0 1 7 7h2m6 0h2a5 5 0 0 1 0 10h-2M8 12h8" /></svg>;

function SectionIcon({ type }) {
    const paths = {
        box: 'm16 16 2 2 4-4M21 10V8l-9-6-9 6v8l9 6 3-1',
        photo: 'M16 5h6M19 2v6M21 12v7H3V3h10M3 17l6-6 4 4 3-3 5 5',
        link: 'M9 17H7A5 5 0 0 1 7 7h2m6 0h2a5 5 0 0 1 0 10h-2M8 12h8',
    };

    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[type]} /></svg>;
}
