import styles from "./Pagination.module.css";
import { usePagination } from "./usePagination";

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pages = usePagination({ currentPage, totalPages });

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        이전
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={page === currentPage ? styles.active : ""}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        다음
      </button>
    </div>
  );
}

export default Pagination;