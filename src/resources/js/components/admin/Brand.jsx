export default function Brand({ compact = false }) {
    return (
        <span className="flex items-center gap-[11px]" aria-label="Shopra">
            <span className="relative flex h-[34px] w-[30px] items-center justify-center text-[color:var(--sidebar-active-text)]">
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg>
                <span className="absolute top-[13px] text-[10px] font-[800] leading-none">S</span>
            </span>
            {!compact && <span className="text-[21px] font-[650] tracking-[-0.045em] text-[color:var(--sidebar-text-strong)]">Shopra</span>}
        </span>
    );
}
