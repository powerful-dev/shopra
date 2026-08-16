export default function PageContainer({ children, className = '' }) {
    return <div className={`mx-4 pb-8 pt-[30px] max-sm:!mx-[13px] max-sm:pt-[18px] sm:max-lg:!mx-5 lg:mx-8 lg:pt-6 ${className}`.trim()}>{children}</div>;
}
