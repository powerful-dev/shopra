import './Brand.css'

export default function Brand({ compact = false }) {
    return (
        <span className="shopra-brand" aria-label="Shopra">
            <span className="brand-mark">
                <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shopping-bag"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path><path d="M3 6h18"></path><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                <span>S</span>
            </span>
            {!compact && <span className="shopra-brand-name">Shopra</span>}
        </span>
    );
}
