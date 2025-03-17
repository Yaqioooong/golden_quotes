export function generatePagination(currentPage, totalPages) {
    // 如果总页数小于7，显示所有页码
    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // 如果当前页接近开始
    if (currentPage <= 3) {
        return [1, 2, 3, 4, 5, '...', totalPages];
    }

    // 如果当前页接近结束
    if (currentPage >= totalPages - 2) {
        return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // 如果当前页在中间
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
    ];
}