import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage,
  showItemsInfo = true 
}) => {
  // Calculate displayed items range
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const effectiveTotalPages = Math.max(1, totalPages);
    
    if (effectiveTotalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(effectiveTotalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      if (currentPage < effectiveTotalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page
      if (!pages.includes(effectiveTotalPages)) {
        pages.push(effectiveTotalPages);
      }
    }
    
    return pages;
  };

  const effectiveTotalPages = Math.max(1, totalPages);
  const isNavigationDisabled = totalPages <= 1;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
      {/* Items Info */}
      {showItemsInfo && (
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
          {totalItems === 0 ? (
            <span>Tidak ada item untuk ditampilkan</span>
          ) : (
            <>
              Menampilkan <span style={{ color: 'var(--text-primary)' }} className="font-medium">{startItem}</span>
              {' - '}
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">{endItem}</span>
              {' dari '}
              <span style={{ color: 'var(--text-primary)' }} className="font-medium">{totalItems}</span>
              {' item'}
            </>
          )}
        </p>
      )}

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page Button */}
        <motion.button
          whileHover={!isNavigationDisabled ? { scale: 1.05 } : {}}
          whileTap={!isNavigationDisabled ? { scale: 0.95 } : {}}
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isNavigationDisabled}
          className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-muted)',
          }}
          title="Halaman pertama"
        >
          <ChevronsLeft className="w-4 h-4" />
        </motion.button>

        {/* Previous Page Button */}
        <motion.button
          whileHover={!isNavigationDisabled ? { scale: 1.05 } : {}}
          whileTap={!isNavigationDisabled ? { scale: 0.95 } : {}}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || isNavigationDisabled}
          className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-muted)',
          }}
          title="Halaman sebelumnya"
        >
          <ChevronLeft className="w-4 h-4" />
        </motion.button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span 
                key={`ellipsis-${index}`} 
                className="px-2 py-1 text-sm"
                style={{ color: 'var(--text-muted)' }}
              >
                ...
              </span>
            ) : (
              <motion.button
                key={page}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onPageChange(page)}
                disabled={isNavigationDisabled}
                className="min-w-[36px] h-9 px-3 rounded-lg font-medium text-sm transition-all duration-200 disabled:cursor-default"
                style={{
                  backgroundColor: currentPage === page 
                    ? 'var(--accent-cyan)' 
                    : 'var(--bg-tertiary)',
                  border: `1px solid ${currentPage === page ? 'var(--accent-cyan)' : 'var(--border-primary)'}`,
                  color: currentPage === page 
                    ? '#000' 
                    : 'var(--text-muted)',
                  boxShadow: currentPage === page 
                    ? '0 0 20px var(--glow-cyan)' 
                    : 'none',
                }}
              >
                {page}
              </motion.button>
            )
          ))}
        </div>

        {/* Next Page Button */}
        <motion.button
          whileHover={!isNavigationDisabled ? { scale: 1.05 } : {}}
          whileTap={!isNavigationDisabled ? { scale: 0.95 } : {}}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === effectiveTotalPages || isNavigationDisabled}
          className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-muted)',
          }}
          title="Halaman berikutnya"
        >
          <ChevronRight className="w-4 h-4" />
        </motion.button>

        {/* Last Page Button */}
        <motion.button
          whileHover={!isNavigationDisabled ? { scale: 1.05 } : {}}
          whileTap={!isNavigationDisabled ? { scale: 0.95 } : {}}
          onClick={() => onPageChange(effectiveTotalPages)}
          disabled={currentPage === effectiveTotalPages || isNavigationDisabled}
          className="p-2 rounded-lg transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
          style={{
            backgroundColor: 'var(--bg-tertiary)',
            border: '1px solid var(--border-primary)',
            color: 'var(--text-muted)',
          }}
          title="Halaman terakhir"
        >
          <ChevronsRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;