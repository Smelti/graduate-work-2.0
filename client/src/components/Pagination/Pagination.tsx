type PaginationProps = {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        const isActive = pageNum === currentPage;
        return (
          <button
            key={pageNum}
            className={`page-btn ${isActive ? 'active' : ''}`}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        );
      })}
    </div>
  );
}
