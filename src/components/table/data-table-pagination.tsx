import React from "react";
import { Button } from "../ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface DataTablePaginationProps {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (newPageIndex: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
  canPreviousPage: boolean;
  canNextPage: boolean;
}

const DataTablePagination = ({
  pageIndex,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
  canPreviousPage,
  canNextPage,
}: DataTablePaginationProps) => {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </label>
          <select
            id="rows-per-page"
            className="h-8 rounded border border-gray-300"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[20, 25, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <nav
          role="navigation"
          aria-label="Pagination navigation"
          className="flex items-center space-x-2"
        >
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(0)}
            disabled={!canPreviousPage}
            aria-label="Go to first page"
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!canPreviousPage}
            aria-label="Go to previous page"
          >
            <ChevronLeft />
          </Button>
          <span>
            Page {pageIndex + 1} of {pageCount}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!canNextPage}
            aria-label="Go to next page"
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pageCount - 1)}
            disabled={!canNextPage}
            aria-label="Go to last page"
          >
            <ChevronsRight />
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default DataTablePagination;
