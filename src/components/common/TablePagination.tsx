export function TablePagination({
  page,
  pageCount,
  onPageChange,
}: {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  const pages = Array.from({ length: Math.max(pageCount, 1) }, (_, index) => index + 1);

  return (
    <div className="flex items-center justify-center gap-3 px-4 py-5">
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="text-sm text-brgy-ink disabled:cursor-not-allowed disabled:text-neutral-300"
      >
        Prev
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full text-sm ${
            pageNumber === page ? "bg-brgy-sidebar font-medium text-white" : "text-brgy-ink"
          }`}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        disabled={page === pageCount}
        onClick={() => onPageChange(page + 1)}
        className="text-sm text-brgy-ink disabled:cursor-not-allowed disabled:text-neutral-300"
      >
        Next
      </button>
    </div>
  );
}
