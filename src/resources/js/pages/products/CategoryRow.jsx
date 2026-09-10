import ActionsMenu from '../../components/admin/ActionsMenu';
import PencilIcon from '../../components/icons/PencilIcon';
import TrashIcon from '../../components/icons/TrashIcon';
import { useTranslation } from 'react-i18next';

export default function CategoryRow({ category, depth = 0, isExpanded, isLoading, error, onToggle, isActionsOpen, onToggleActions, onCloseActions, onEdit, onDelete, dragEnabled, isDragging, dropZone, onDragStart, onDragEnd, onDragOver, onDrop }) {
    const { t } = useTranslation();
    function dropPosition(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const offset = (event.clientY - rect.top) / rect.height;
        return offset < 0.25 ? 'before' : offset > 0.75 ? 'after' : 'inside';
    }

    return (
        <div
            className={`category-tree-row category-tree-row--depth-${Math.min(depth, 2)} ${dropZone?.allowed && dropZone.position === 'inside' ? 'category-tree-row--active' : ''} ${dropZone && !dropZone.allowed ? 'cursor-not-allowed' : ''} ${isDragging ? 'opacity-50' : ''}`}
            style={depth > 2 ? { paddingLeft: 50 + (depth - 2) * 22 } : undefined}
            role="treeitem"
            aria-level={depth + 1}
            aria-expanded={category.has_children ? isExpanded : undefined}
            onDragOver={(event) => onDragOver?.(event, dropPosition(event))}
            onDrop={(event) => onDrop?.(event, dropPosition(event))}
        >
            {dropZone?.allowed && dropZone.position !== 'inside' && <span aria-hidden="true" className="pointer-events-none absolute right-0 z-10 h-0.5 bg-[#c77d56]" style={{ left: depth === 0 ? 10 : 28 + (depth - 1) * 22, [dropZone.position === 'before' ? 'top' : 'bottom']: 0 }} />}
            <span
                className={`grid place-items-center text-[#b0a8a1] ${dragEnabled ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'} ${isDragging ? 'cursor-grabbing' : ''}`}
                title={t('categoriesModal.row.drag')}
                draggable={dragEnabled}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            ><GripIcon /></span>
            {category.has_children ? <button type="button" className="tree-toggle" aria-label={t(isExpanded ? 'categoriesModal.row.collapse' : 'categoriesModal.row.expand', { name: category.name })} aria-expanded={isExpanded} aria-busy={isLoading} onClick={onToggle}><ChevronIcon /></button> : <span />}
            <span />
            <span className={`grid h-6 w-6 place-items-center rounded-[7px] ${category.has_children ? 'bg-[#fff0e7] text-[color:var(--color-accent)]' : 'bg-[#f0f4f6] text-[#667986]'}`}>
                <FolderIcon />
            </span>
            <span className="flex min-w-0 flex-col"><strong className="truncate text-xs text-[#403a35]">{category.name}</strong>{isLoading && <span className="sr-only" role="status">{t('categoriesModal.row.loading')}</span>}{error && <small role="alert">{error}</small>}</span>
            <small className="min-w-[30px] rounded-full bg-[#f2efec] px-[7px] py-1 text-center text-xs text-[#8e857e]">{category.branch_count}</small>
            <ActionsMenu
                className="!w-7"
                ariaLabel={t('categoriesModal.row.actions', { name: category.name })}
                isOpen={isActionsOpen}
                onToggle={onToggleActions}
                onClose={onCloseActions}
                actions={[
                    { label: t('productsPage.edit'), icon: <PencilIcon />, onClick: onEdit },
                    { label: t('categoriesModal.row.delete'), icon: <TrashIcon />, variant: 'danger', onClick: onDelete },
                ]}
            />
        </div>
    );
}

const Svg = ({ children, size = 16 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{children}</svg>;
const GripIcon = () => <Svg size={15}><circle cx="9" cy="6" r="1" /><circle cx="15" cy="6" r="1" /><circle cx="9" cy="12" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="18" r="1" /><circle cx="15" cy="18" r="1" /></Svg>;
const ChevronIcon = () => <Svg size={15}><path d="m9 18 6-6-6-6" /></Svg>;
const FolderIcon = () => <Svg size={14}><path d="M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></Svg>;
