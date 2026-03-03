import { useMemo } from "react";

export function usePagination({ currentPage, totalPages }) {
  const pages = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]); 

  return pages;
}