import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmModal from '../../components/admin/ConfirmModal';
import CategoryEditModal from './CategoryEditModal';
import CategoryRow from './CategoryRow';
import CategorySlugField from './CategorySlugField';
import usePageScrollLock from '../../hooks/usePageScrollLock';
import { createShopGroup, deleteShopGroup, getRootShopGroups, getShopGroupChildren, getShopGroups, getUniqueShopGroupSlug, moveShopGroup, searchShopGroups } from '../../services/shopGroups';

export default function CategoriesModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const [openActionsId, setOpenActionsId] = useState(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [categoryToEdit, setCategoryToEdit] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [groups, setGroups] = useState([]);
    const [reloadKey, setReloadKey] = useState(0);
    const parentOptions = buildParentOptions(groups);
    const [categories, setCategories] = useState([]);
    const [categoriesError, setCategoriesError] = useState('');
    const [branches, setBranches] = useState({});
    const pendingBranches = useRef(new Map());
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const [searchError, setSearchError] = useState('');
    const [collapsedSearchBranches, setCollapsedSearchBranches] = useState({});
    const query = search.trim();
    const isSearching = [...query].length >= 2;
    const searchGroups = searchResult?.query === query ? searchResult.groups : [];
    usePageScrollLock(isOpen);

    useEffect(() => {
        if (!isOpen || !isSearching) return undefined;
        const controller = new AbortController();
        setSearchResult(null);
        setSearchError('');
        const timeout = setTimeout(() => {
            searchShopGroups(query, { signal: controller.signal })
                .then((groups) => {
                    if (controller.signal.aborted) return;
                    setSearchResult({ query, groups });
                    setCollapsedSearchBranches({});
                })
                .catch(() => {
                    if (!controller.signal.aborted) setSearchError(t('categoriesModal.errors.search'));
                });
        }, 350);
        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [isOpen, isSearching, query, reloadKey, t]);

    const [draggedId, setDraggedId] = useState(null);
    const [dropZone, setDropZone] = useState(null);
    const [isMoving, setIsMoving] = useState(false);
    const [moveError, setMoveError] = useState('');

    function endDrag() {
        setDraggedId(null);
        setDropZone(null);
    }

    async function removeCategory() {
        if (!categoryToDelete || isDeleting) return;

        setIsDeleting(true);
        setMoveError('');

        try {
            await deleteShopGroup(categoryToDelete.id);
            setCategoryToDelete(null);
            setOpenActionsId(null);
            setReloadKey((key) => key + 1);
        } catch {
            setCategoryToDelete(null);
            setMoveError(t('categoriesModal.errors.delete'));
        } finally {
            setIsDeleting(false);
        }
    }

    function getDropZone(target, position) {
        const parentId = position === 'inside' ? target?.id ?? null : target.parent_id;
        const byId = new Map(groups.map((group) => [group.id, group]));
        let ancestorId = parentId;
        const visited = new Set();
        let allowed = draggedId !== null && target?.id !== draggedId && !isMoving;
        while (ancestorId !== null && allowed) {
            if (ancestorId === draggedId || visited.has(ancestorId)) allowed = false;
            visited.add(ancestorId);
            ancestorId = byId.get(ancestorId)?.parent_id ?? null;
        }
        return { targetId: target?.id ?? null, position, allowed };
    }

    function dragOver(event, target, position) {
        if (draggedId === null) return;
        event.preventDefault();
        event.stopPropagation();
        const zone = getDropZone(target, position);
        event.dataTransfer.dropEffect = zone.allowed ? 'move' : 'none';
        setDropZone(zone);
    }

    async function dropCategory(event, target, position) {
        event.preventDefault();
        event.stopPropagation();
        const zone = getDropZone(target, position);
        const id = draggedId;
        endDrag();
        if (!zone.allowed) return;
        setIsMoving(true);
        setMoveError('');
        let saved = false;
        try {
            await moveShopGroup(id, zone.targetId, zone.position);
            saved = true;
            for (const controller of pendingBranches.current.values()) controller.abort();
            pendingBranches.current.clear();
            const branchIds = Object.keys(branches).filter((key) => branches[key].children || branches[key].expanded);
            if (position === 'inside' && target && !branchIds.includes(String(target.id))) branchIds.push(String(target.id));
            const [roots, all, loadedBranches, found] = await Promise.all([
                getRootShopGroups(),
                getShopGroups(),
                Promise.all(branchIds.map(async (key) => [key, await getShopGroupChildren(key)])),
                isSearching ? searchShopGroups(query) : Promise.resolve(null),
            ]);
            setCategories(roots);
            setGroups(all);
            setBranches((current) => Object.fromEntries(loadedBranches.map(([key, children]) => [key, {
                children,
                expanded: position === 'inside' && Number(key) === target?.id ? true : Boolean(current[key]?.expanded),
                loading: false,
                error: '',
            }])));
            if (found) setSearchResult({ query, groups: found });
        } catch (error) {
            setMoveError(saved ? t('categoriesModal.errors.refreshAfterMove') : Object.values(error.errors ?? {}).flat().join(' ') || t('categoriesModal.errors.move'));
        } finally {
            setIsMoving(false);
        }
    }

    const searchIds = new Set(searchGroups.map((group) => group.id));
    const searchChildren = new Map();
    for (const group of searchGroups) {
        const parentId = searchIds.has(group.parent_id) ? group.parent_id : null;
        if (!searchChildren.has(parentId)) searchChildren.set(parentId, []);
        searchChildren.get(parentId).push(group);
    }
    const activeBranches = isSearching
        ? Object.fromEntries(searchGroups.map((group) => [group.id, {
            children: searchChildren.get(group.id) ?? [],
            expanded: !collapsedSearchBranches[group.id],
        }]))
        : branches;

    useEffect(() => {
        setBranches({});
        return () => {
            for (const controller of pendingBranches.current.values()) controller.abort();
            pendingBranches.current.clear();
        };
    }, [isOpen, reloadKey]);

    async function toggleCategory(category) {
        const branch = branches[category.id];
        if (pendingBranches.current.has(category.id)) return;
        if (branch?.children) {
            setBranches((current) => ({ ...current, [category.id]: { ...current[category.id], expanded: !current[category.id]?.expanded } }));
            return;
        }

        const controller = new AbortController();
        pendingBranches.current.set(category.id, controller);
        setBranches((current) => ({ ...current, [category.id]: { ...current[category.id], loading: true, error: '' } }));
        try {
            const children = await getShopGroupChildren(category.id, { signal: controller.signal });
            if (!controller.signal.aborted) {
                setBranches((current) => ({ ...current, [category.id]: { ...current[category.id], children, expanded: true, loading: false } }));
            }
        } catch {
            if (!controller.signal.aborted) {
                setBranches((current) => ({ ...current, [category.id]: { ...current[category.id], expanded: false, loading: false, error: t('categoriesModal.errors.children') } }));
            }
        } finally {
            if (pendingBranches.current.get(category.id) === controller) pendingBranches.current.delete(category.id);
        }
    }

    const visibleCategories = [];
    const visited = new Set();
    function appendCategories(items, depth = 0) {
        for (const category of items) {
            if (visited.has(category.id)) continue;
            visited.add(category.id);
            visibleCategories.push({ category: isSearching ? { ...category, has_children: searchChildren.has(category.id) } : category, depth });
            if (activeBranches[category.id]?.expanded) appendCategories(activeBranches[category.id].children ?? [], depth + 1);
        }
    }
    appendCategories(isSearching ? searchChildren.get(null) ?? [] : categories);
    const [isLoadingParents, setIsLoadingParents] = useState(false);
    const [parentsError, setParentsError] = useState('');
    const closeModal = useCallback(() => {
        setOpenActionsId(null);
        setCategoryToDelete(null);
        setCategoryToEdit(null);
        setSearch('');
        setIsCreateFormOpen(false);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') closeModal();
        };

        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [closeModal, isOpen]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const controller = new AbortController();
        setIsLoadingParents(true);
        setParentsError('');

        getShopGroups({ signal: controller.signal })
            .then((groups) => {
                if (!controller.signal.aborted) setGroups(groups);
            })
            .catch(() => {
                if (!controller.signal.aborted) setParentsError(t('categoriesModal.errors.parents'));
            })
            .finally(() => {
                if (!controller.signal.aborted) setIsLoadingParents(false);
            });

        return () => controller.abort();
    }, [isOpen, reloadKey, t]);

    useEffect(() => {
        if (!isOpen) return undefined;

        const controller = new AbortController();
        setCategoriesError('');

        getRootShopGroups({ signal: controller.signal })
            .then((groups) => {
                if (!controller.signal.aborted) setCategories(groups);
            })
            .catch(() => {
                if (!controller.signal.aborted) setCategoriesError(t('categoriesModal.errors.tree'));
            });

        return () => controller.abort();
    }, [isOpen, reloadKey, t]);

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
                        <p className="m-0 text-[11px] font-bold uppercase tracking-[.12em] text-[color:var(--color-accent)]">{t('categoriesModal.eyebrow')}</p>
                        <h2 id="categories-modal-title" className="mb-1 mt-0.5 text-[28px] font-[760] tracking-[-.04em] text-[#312d29] max-[620px]:text-[22px]">{t('categoriesModal.title')}</h2>
                        <span className="text-xs text-[#8d857e]">{t('categoriesModal.description')}</span>
                    </div>
                    <button type="button" className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-[11px] border border-[color:var(--color-border)] bg-white text-[#706861] hover:text-[color:var(--color-accent)]" onClick={closeModal} aria-label={t('categoriesModal.close')}>
                        <CloseIcon />
                    </button>
                </header>

                <div className="grid grid-cols-[minmax(260px,1fr)_auto_auto] gap-2.5 px-7 pb-2.5 pt-4 max-[620px]:grid-cols-1 max-[620px]:gap-[7px] max-[620px]:px-[14px] max-[620px]:pb-[9px] max-[620px]:pt-[11px]">
                    <label className="flex h-[46px] items-center gap-[9px] rounded-[10px] border border-[#d8d0ca] bg-white px-[13px] text-[#8f877f]">
                        <SearchIcon />
                        <input className="h-full min-w-0 flex-1 border-0 bg-transparent text-xs text-[#3f3934] outline-none" placeholder={t('categoriesModal.searchPlaceholder')} aria-label={t('categoriesModal.searchLabel')} maxLength={255} value={search} onChange={(event) => { setSearch(event.target.value); setOpenActionsId(null); }} />
                    </label>
                    <button
                        type="button"
                        className="button button--primary min-h-[46px] justify-center px-[15px]"
                        aria-expanded={isCreateFormOpen}
                        aria-controls="new-category-form"
                        onClick={() => setIsCreateFormOpen((isOpen) => !isOpen)}
                    >
                        <PlusIcon />{t('categoriesModal.newCategory')}
                    </button>
                </div>

                <div className="mx-7 mb-[13px] flex items-start gap-[9px] rounded-[10px] border border-[#e7d2c4] bg-[#fff3eb] px-[14px] py-3 text-[color:var(--color-accent)] max-[620px]:mx-[14px]">
                    <SparklesIcon />
                    <p className="m-0 flex flex-col">
                        <strong className="text-xs text-[#5c5149]">{t('categoriesModal.editorTitle')}</strong>
                        <small className="mt-0.5 text-xs leading-[1.4] text-[#8e8279]">{t('categoriesModal.editorDescription')}</small>
                    </p>
                </div>

                {isCreateFormOpen && (
                    <CategoryCreateForm
                        parentOptions={parentOptions}
                        isLoadingParents={isLoadingParents}
                        parentsError={parentsError}
                        onCancel={() => setIsCreateFormOpen(false)}
                        onCreated={(category) => {
                            setGroups((current) => [...current, category]);
                            setReloadKey((key) => key + 1);
                        }}
                    />
                )}

                <div className="grid min-h-0 flex-1 gap-[14px] px-7 pb-[14px]">
                    <div className="flex min-h-0 flex-col">
                        <div className="flex items-center justify-between pb-2 text-xs font-bold text-[#5f5751]">
                            <span>{t('categoriesModal.treeTitle')}</span>
                        </div>
                        <div className="category-tree-list rounded-xl border border-[color:var(--color-border)] bg-white p-1" role="tree" aria-label={t('categoriesModal.treeLabel')}>
                            {moveError && <p role="alert" className="m-0 p-2 text-xs text-[#8d857e]">{moveError}</p>}
                            {isMoving && <p role="status" className="m-0 p-2 text-xs text-[#8d857e]">{t('categoriesModal.savingOrder')}</p>}
                            {!isSearching && categoriesError && <p role="alert" className="m-0 p-2 text-xs text-[#8d857e]">{categoriesError}</p>}
                            {isSearching && searchError && <p role="alert" className="m-0 p-2 text-xs text-[#8d857e]">{searchError}</p>}
                            {isSearching && !searchError && searchResult?.query !== query && <p role="status" className="m-0 p-2 text-xs text-[#8d857e]">{t('categoriesModal.searching')}</p>}
                            {isSearching && searchResult?.query === query && searchGroups.length === 0 && <p role="status" className="m-0 p-2 text-xs text-[#8d857e]">{t('categoriesModal.noResults')}</p>}
                            {visibleCategories.map(({ category, depth }) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    depth={depth}
                                    dragEnabled={!isMoving && !isLoadingParents && !parentsError}
                                    isDragging={draggedId === category.id}
                                    dropZone={dropZone?.targetId === category.id ? dropZone : null}
                                    onDragStart={(event) => {
                                        setDraggedId(category.id);
                                        setOpenActionsId(null);
                                        setMoveError('');
                                        event.dataTransfer.effectAllowed = 'move';
                                        event.dataTransfer.setData('text/plain', String(category.id));
                                        event.dataTransfer.setDragImage(event.currentTarget.closest('[role="treeitem"]'), 20, 20);
                                    }}
                                    onDragEnd={endDrag}
                                    onDragOver={(event, position) => dragOver(event, category, position)}
                                    onDrop={(event, position) => dropCategory(event, category, position)}
                                    isExpanded={Boolean(activeBranches[category.id]?.expanded)}
                                    isLoading={Boolean(activeBranches[category.id]?.loading)}
                                    error={activeBranches[category.id]?.error}
                                    onToggle={() => isSearching
                                        ? setCollapsedSearchBranches((current) => ({ ...current, [category.id]: !current[category.id] }))
                                        : toggleCategory(category)}
                                    isActionsOpen={openActionsId === category.id}
                                    onToggleActions={() => setOpenActionsId((id) => id === category.id ? null : category.id)}
                                    onCloseActions={() => setOpenActionsId(null)}
                                    onEdit={() => setCategoryToEdit(category)}
                                    onDelete={() => setCategoryToDelete(category)}
                                />
                            ))}
                            {draggedId !== null && (
                                <div
                                    className={`min-h-9 rounded-lg border-2 border-dashed px-3 py-2 text-xs ${dropZone?.targetId === null ? 'border-[#c77d56] bg-[#fff0e7]' : 'border-[#d8d0ca] text-[#8d857e]'}`}
                                    onDragOver={(event) => dragOver(event, null, 'inside')}
                                    onDrop={(event) => dropCategory(event, null, 'inside')}
                                >{t('categoriesModal.moveToRoot')}</div>
                            )}
                        </div>
                    </div>
                </div>

                <footer className="flex min-h-[83px] items-center justify-between gap-[18px] border-t border-[color:var(--color-border)] bg-white px-7 py-[11px] max-[620px]:min-h-0 max-[620px]:flex-col max-[620px]:items-stretch max-[620px]:gap-2 max-[620px]:px-[14px] max-[620px]:py-[9px]">
                    <div className="flex min-w-0 flex-1 flex-col gap-[7px]">
                        <span className="text-xs text-[#706860]"><b className="text-[color:var(--color-accent)]">{categories.length}</b> {t('categoriesModal.categoriesInStructure')}</span>
                        <small className="text-xs text-[#918880]">{t('categoriesModal.footerHint')}</small>
                    </div>
                    <button type="button" className="button button--primary min-w-28 justify-center max-[620px]:w-full" onClick={closeModal}>{t('categoriesModal.done')}</button>
                </footer>
            </section>
            <ConfirmModal
                isOpen={Boolean(categoryToDelete)}
                title={t('categoriesModal.confirmDeleteTitle')}
                message={t('categoriesModal.confirmDeleteMessage', { name: categoryToDelete?.name })}
                confirmText={t('categoriesModal.row.delete')}
                cancelText={t('categoriesModal.form.cancel')}
                isLoading={isDeleting}
                onConfirm={removeCategory}
                onClose={(event) => {
                    event?.stopPropagation();
                    if (!isDeleting) setCategoryToDelete(null);
                }}
                variant="danger"
            />
            <CategoryEditModal
                category={categoryToEdit}
                parentOptions={parentOptions}
                isLoadingParents={isLoadingParents}
                parentsError={parentsError}
                onClose={() => setCategoryToEdit(null)}
                onUpdated={() => {
                    setCategoryToEdit(null);
                    setReloadKey((key) => key + 1);
                }}
            />
        </div>
    );
}

function CategoryCreateForm({ parentOptions, isLoadingParents, parentsError, onCancel, onCreated }) {
    const { t } = useTranslation();
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [manualSlug, setManualSlug] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState('');
    const [parentId, setParentId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [checkedSource, setCheckedSource] = useState(null);
    const source = manualSlug ?? name;
    const isSlugReady = Boolean(name.trim() && slug && checkedSource === source && !isEditing && !isChecking && !error);

    async function saveCategory(event) {
        event.preventDefault();
        if (isSaving || !isSlugReady) return;
        setIsSaving(true);
        setSaveError('');

        try {
            const category = await createShopGroup({ name, slug, parent_id: parentId ? Number(parentId) : null });
            setName('');
            setSlug('');
            setManualSlug(null);
            setCheckedSource(null);
            setIsEditing(false);
            setParentId('');
            onCreated(category);
        } catch (error) {
            setSaveError(Object.values(error.errors ?? {}).flat().join(' ') || t('categoriesModal.errors.save'));
        } finally {
            setIsSaving(false);
        }
    }

    useEffect(() => {
        if (isEditing) return undefined;
        setError('');

        if (!source.trim()) {
            setSlug('');
            setIsChecking(false);
            return undefined;
        }

        const controller = new AbortController();
        setIsChecking(true);
        const timeout = setTimeout(() => {
            getUniqueShopGroupSlug(source, { signal: controller.signal })
                .then((value) => {
                    if (!controller.signal.aborted) {
                        setSlug(value);
                        setCheckedSource(source);
                    }
                })
                .catch(() => {
                    if (!controller.signal.aborted) setError(t('categoriesModal.errors.slug'));
                })
                .finally(() => {
                    if (!controller.signal.aborted) setIsChecking(false);
                });
        }, 300);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [source, isEditing, name, t]);

    return (
        <form
            id="new-category-form"
            className="mx-7 mb-[13px] grid grid-cols-2 gap-[9px] rounded-[11px] border border-[color:var(--color-border)] bg-white p-[11px] max-[620px]:mx-[14px] max-[620px]:grid-cols-1"
            onSubmit={saveCategory}
        >
            <div className="flex min-w-0 flex-col gap-[5px]">
                <label htmlFor="new-category-name" className="text-xs font-bold text-[#554e48]">{t('categoriesModal.form.name')}</label>
                <input
                    id="new-category-name"
                    name="name"
                    className="h-[38px] w-full rounded-lg border border-[#d8d0ca] bg-white px-[9px] text-xs text-[#312d29] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]"
                    type="text"
                    autoFocus
                    maxLength={255}
                    disabled={isSaving}
                    value={name}
                    onChange={(event) => {
                        setName(event.target.value);
                        setManualSlug(null);
                    }}
                    placeholder={t('categoriesModal.form.namePlaceholder')}
                />
                {(name || slug || manualSlug !== null) && (
                    <CategorySlugField
                        slug={slug}
                        isEditing={isEditing}
                        isChecking={isChecking}
                        error={error}
                        disabled={isSaving}
                        onChange={(value) => {
                            setSlug(value);
                            setManualSlug(value);
                        }}
                        onEditingChange={setIsEditing}
                    />
                )}
            </div>
            <label className="flex min-w-0 flex-col gap-[5px]">
                <span className="text-xs font-bold text-[#554e48]">{t('categoriesModal.form.parent')}</span>
                <select className="h-[38px] w-full rounded-lg border border-[#d8d0ca] bg-white px-[9px] text-xs text-[#312d29] outline-none focus:border-[#c77d56] focus:shadow-[0_0_0_3px_rgba(184,79,24,.07)]" value={parentId} onChange={(event) => setParentId(event.target.value)} disabled={isSaving || isLoadingParents || Boolean(parentsError)} aria-busy={isLoadingParents}>
                    <option value="">{isLoadingParents ? t('categoriesModal.form.loadingCategories') : t('categoriesModal.form.noParent')}</option>
                    {parentOptions.map((category) => (
                        <option key={category.id} value={category.id}>{category.label}</option>
                    ))}
                </select>
                {parentsError && <span className="text-xs text-[#8d857e]" role="alert">{parentsError}</span>}
            </label>
            {saveError && <p role="alert" className="col-span-2 m-0 text-xs text-[#8d857e] max-[620px]:col-span-1">{saveError}</p>}
            <div className="col-span-2 flex justify-end gap-2 max-[620px]:col-span-1">
                <button type="button" className="button button--secondary min-h-[36px]" onClick={onCancel} disabled={isSaving}>{t('categoriesModal.form.cancel')}</button>
                <button type="submit" className="button button--primary min-h-[36px]" disabled={isSaving || !isSlugReady}>{isSaving ? t('categoriesModal.form.saving') : t('categoriesModal.form.add')}</button>
            </div>
        </form>
    );
}

function buildParentOptions(groups) {
    const ids = new Set(groups.map((group) => group.id));
    const children = new Map();

    for (const group of groups) {
        const parentId = ids.has(group.parent_id) ? group.parent_id : null;
        if (!children.has(parentId)) children.set(parentId, []);
        children.get(parentId).push(group);
    }

    const options = [];
    const visited = new Set();
    const visit = (group, path = []) => {
        if (visited.has(group.id)) return;
        visited.add(group.id);

        const names = [...path, group.name];
        options.push({ ...group, label: names.join(' → '), depth: path.length, type: children.has(group.id) ? 'parent' : 'leaf', expanded: true });
        for (const child of children.get(group.id) ?? []) visit(child, names);
    };

    for (const group of children.get(null) ?? []) visit(group);
    // Keep every category selectable even if existing data contains a cycle.
    for (const group of groups) visit(group);

    return options;
}

function GuideItem({ icon, title, text }) {
    return <p className="mb-3 flex items-start gap-[9px] text-[color:var(--color-accent)]">{icon}<span className="flex flex-col"><strong className="text-xs text-[#544c46]">{title}</strong><small className="mt-0.5 text-xs leading-[1.4] text-[#918880]">{text}</small></span></p>;
}

const Svg = ({ children, size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const CloseIcon = () => <Svg size={19}><path d="M18 6 6 18M6 6l12 12" /></Svg>;
const SearchIcon = () => <Svg size={17}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></Svg>;
const PlusIcon = () => <Svg size={15}><path d="M5 12h14M12 5v14" /></Svg>;
const SparklesIcon = () => <Svg size={15}><path d="m12 3-1.4 4.2a2 2 0 0 1-1.3 1.3L5 10l4.3 1.5a2 2 0 0 1 1.3 1.3L12 17l1.4-4.2a2 2 0 0 1 1.3-1.3L19 10l-4.3-1.5a2 2 0 0 1-1.3-1.3L12 3Z" /></Svg>;
const FolderIcon = () => <Svg size={14}><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></Svg>;
const LayersIcon = () => <Svg size={15}><path d="m12 2 9 5-9 5-9-5 9-5Z" /><path d="m3 12 9 5 9-5M3 17l9 5 9-5" /></Svg>;
