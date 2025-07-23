import React from 'react';
import '../styles/pagination.css';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="pagination">
            <nav className="pagination-nav">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="pagination-button"
                >
                    Previous
                </button>

                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`pagination-page ${currentPage === number ? 'pagination-page-active' : ''}`}
                    >
                        {number}
                    </button>
                ))}

                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                >
                    Next
                </button>
            </nav>
        </div>
    );
};

// export default Pagination;