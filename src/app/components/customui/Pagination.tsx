import React from "react";

interface PaginationProps {
    currentPage: number;
    totalItems: number | undefined;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 25],
}) => {
    // Calculate total pages
    const totalPages = totalItems ? Math.ceil(totalItems / pageSize) : 0;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPagesToShow = 5;

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always include first page
            pageNumbers.push(1);

            // Calculate start and end pages to show
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);

            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                endPage = Math.min(maxPagesToShow - 1, totalPages - 1);
                startPage = 2;
            }

            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - maxPagesToShow + 2);
                endPage = totalPages - 1;
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pageNumbers.push("...");
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pageNumbers.push("...");
            }

            // Always include last page
            if (totalPages > 1) {
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(e.target.value, 10);
        onPageSizeChange(newPageSize);
    };

    if (!totalItems || totalItems === 0) return null;

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 p-4 bg-white border rounded-lg shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 sm:mb-0">
                <div className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                        {(currentPage - 1) * pageSize + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalItems)}
                    </span>{" "}
                    of <span className="font-medium">{totalItems}</span> results
                </div>

                <div className="flex items-center">
                    <label
                        htmlFor="limit-select"
                        className="mr-2 text-sm text-gray-600"
                    >
                        Show:
                    </label>
                    <select
                        id="limit-select"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="border rounded px-2 py-1 text-sm bg-white"
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Previous page"
                >
                    Previous
                </button>

                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((pageNum, index) => (
                        <React.Fragment key={index}>
                            {pageNum === "..." ? (
                                <span className="px-2 py-1 text-gray-500">
                                    ...
                                </span>
                            ) : (
                                <button
                                    onClick={() =>
                                        typeof pageNum === "number" &&
                                        onPageChange(pageNum)
                                    }
                                    className={`w-8 h-8 flex items-center justify-center rounded ${
                                        currentPage === pageNum
                                            ? "bg-indigo-600 text-white"
                                            : "bg-white text-gray-700 hover:bg-gray-50"
                                    }`}
                                    aria-current={
                                        currentPage === pageNum
                                            ? "page"
                                            : undefined
                                    }
                                >
                                    {pageNum}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage * pageSize >= totalItems}
                    className="px-3 py-1 rounded border bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Next page"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
