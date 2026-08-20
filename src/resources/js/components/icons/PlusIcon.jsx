export default function PlusIcon({ width = 18, height = 18, ...props }) {
    return (
        <svg
            width={width}
            height={height}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
            {...props}
        >
            <path d="M12 5v14M5 12h14" />
        </svg>
    );
}