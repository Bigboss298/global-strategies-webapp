import { Button } from './Button'
import { cn } from '../../utils/cn'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export const Pagination = ({ currentPage, totalPages, onPageChange, className }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className={cn('flex items-center justify-center gap-1 sm:gap-2 flex-wrap', className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        aria-label="First page"
        className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 text-xs sm:text-sm"
      >
        &laquo;
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 text-xs sm:text-sm"
      >
        &lsaquo;
      </Button>

      {getPageNumbers().map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-1.5 sm:px-3 py-2 text-gray-500 text-xs sm:text-sm">...</span>
          ) : (
            <Button
              variant={currentPage === page ? 'primary' : 'outline'}
              size="sm"
              onClick={() => onPageChange(page as number)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
              className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 text-xs sm:text-sm"
            >
              {page}
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 text-xs sm:text-sm"
      >
        &rsaquo;
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        aria-label="Last page"
        className="h-8 w-8 sm:h-9 sm:w-auto sm:px-3 p-0 text-xs sm:text-sm"
      >
        &raquo;
      </Button>
    </div>
  )
}

