export default function Field({ label, error, className = '', children, ...props }) {
    const message = Array.isArray(error) ? error[0] : error;

    return <label className={`form-field ${className}`} {...props}><span className="form-label">{label}</span>{children}{message && <span className="text-[11px] text-red-600" role="alert">{message}</span>}</label>;
}
