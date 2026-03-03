import { usePagination } from "./usePagination";
import { LeftArrow, RightArrow } from "../../../atoms/Icon/Common"; 

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = usePagination({ currentPage, totalPages });

  return (
    <nav className="flex items-center justify-center gap-xxs py-md">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <LeftArrow className={`w-5 h-5 ${currentPage === 1 ? "text-text-disabled" : "text-secondary"}`} />
      </button>

      <div className="flex gap-xxs">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-[40px] h-[40px] rounded-full flex items-center justify-center text-base font-medium transition-all cursor-pointer
              ${page === currentPage ? "bg-primary text-white" : "bg-bg-muted text-text hover:bg-secondary-light"}
            `}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-[40px] h-[40px] cursor-pointer disabled:opacity-20 disabled:cursor-not-allowed"
      >
        <RightArrow className={`w-5 h-5 ${currentPage === totalPages ? "text-text-disabled" : "text-secondary"}`} />
      </button>
    </nav>
  );
}

export default Pagination;