export default function Skeleton({ as: Component = 'span', className = '', ...props }) {
    return (
        <Component
            className={['skeleton', className].filter(Boolean).join(' ')}
            aria-hidden="true"
            {...props}
        />
    );
}
