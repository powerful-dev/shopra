export default function SettingsCard({ icon, title, description, children }) {
    return (
        <section className="rounded-[15px] border border-[color:var(--color-border)] bg-white px-7 py-[26px] shadow-[var(--shadow-sm)] max-sm:px-4 max-sm:py-5">
            <header className="mb-[26px] flex items-start gap-3">
                <span className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-[10px] border border-[#eee1d8] bg-[#fffaf6] text-[color:var(--color-accent)]">
                    {icon}
                </span>
                <span className="min-w-0 pt-px">
                    <h2 className="m-0 text-[18px] font-[760] leading-[1.35] tracking-[-0.02em] text-[color:var(--color-primary)]">{title}</h2>
                    <p className="mt-1 text-[13px] leading-[1.4] text-[color:var(--color-secondary)]">{description}</p>
                </span>
            </header>
            {children}
        </section>
    );
}
