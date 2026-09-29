import CheckIcon from '../icons/CheckIcon';
import CloseIcon from '../icons/CloseIcon';

export default function Alert({ variant = 'error', className = '', children, ...props }) {
    const Icon = variant === 'success' ? CheckIcon : CloseIcon;

    return (
        <div
            className={`alert alert--${variant} ${className}`.trim()}
            role={variant === 'error' ? 'alert' : 'status'}
            aria-live="polite"
            {...props}
        >
            <span className="alert__icon"><Icon /></span>
            {children}
        </div>
    );
}
