function paginationItems(currentPage, totalPages) {
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pages = [1];
    if (currentPage > 3) pages.push('…');
    for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page += 1) {
        pages.push(page);
    }
    if (currentPage < totalPages - 2) pages.push('…');
    pages.push(totalPages);

    return pages;
}

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = paginationItems(currentPage, totalPages);

    return (
        <nav className="mt-5 flex justify-center" aria-label="Пагинация администраторов">
            <div className="pagination">
                <button className="pagination__item" type="button" onClick={() => onPageChange(Math.max(1, currentPage - 1))} disabled={currentPage <= 1} aria-label="Предыдущая страница">←</button>
                {pages.map((page, index) => page === '…' ? <span className="grid h-[29px] min-w-[29px] place-items-center text-[12px] text-[color:var(--color-secondary)]" key={`ellipsis-${index}`}>…</span> : <button className={`pagination__item ${page === currentPage ? 'pagination__item--active' : ''}`} type="button" onClick={() => onPageChange(page)} key={page}>{page}</button>)}
                <button className="pagination__item" type="button" onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} disabled={currentPage >= totalPages} aria-label="Следующая страница">→</button>
            </div>
        </nav>
    );
}
