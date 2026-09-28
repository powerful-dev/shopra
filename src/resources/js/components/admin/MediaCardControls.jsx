import GripIcon from '../icons/GripIcon';
import TrashIcon from '../icons/TrashIcon';

export function MediaDragHandle({ className = '', ...props }) {
    return (
        <span
            className={`media-control media-control--drag ${className}`}
            role="button"
            tabIndex={0}
            {...props}
        >
            <GripIcon />
        </span>
    );
}

export function MediaDeleteButton({ className = '', ...props }) {
    return (
        <button
            type="button"
            className={`media-control media-control--delete ${className}`}
            {...props}
        >
            <TrashIcon />
        </button>
    );
}
