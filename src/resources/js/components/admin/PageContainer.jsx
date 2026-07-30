export default function PageContainer({ children, className = '' }) {
    return <div className={`shopra-page-container ${className}`.trim()}>{children}</div>;
}
