import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

export function Pagination({ currentPage, totalPages, baseUrl }: PaginationProps) {
  // Don't show pagination if there's only one page
  if (totalPages <= 1) {
    return null
  }

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    const pages = []

    // Always show first page
    pages.push(1)

    // Calculate range around current page
    let rangeStart = Math.max(2, currentPage - 1)
    let rangeEnd = Math.min(totalPages - 1, currentPage + 1)

    // Adjust range to always show 3 pages if possible
    if (rangeEnd - rangeStart < 2) {
      if (rangeStart === 2) {
        rangeEnd = Math.min(totalPages - 1, rangeStart + 2)
      } else if (rangeEnd === totalPages - 1) {
        rangeStart = Math.max(2, rangeEnd - 2)
      }
    }

    // Add ellipsis before range if needed
    if (rangeStart > 2) {
      pages.push(-1) // -1 represents ellipsis
    }

    // Add range pages
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i)
    }

    // Add ellipsis after range if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(-2) // -2 represents ellipsis
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <nav aria-label="Pagination" className="flex justify-center my-8">
      <ul className="flex items-center gap-1">
        <li>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            disabled={currentPage === 1}
            asChild={currentPage !== 1}
          >
            {currentPage === 1 ? (
              <span>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </span>
            ) : (
              <Link href={`${baseUrl}?page=${currentPage - 1}`}>
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Link>
            )}
          </Button>
        </li>

        {pageNumbers.map((pageNumber, i) => (
          <li key={i}>
            {pageNumber === -1 || pageNumber === -2 ? (
              <span className="flex h-8 w-8 items-center justify-center">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">More pages</span>
              </span>
            ) : (
              <Button
                variant={pageNumber === currentPage ? "default" : "outline"}
                size="icon"
                className="h-8 w-8"
                asChild={pageNumber !== currentPage}
              >
                {pageNumber === currentPage ? (
                  <span aria-current="page">{pageNumber}</span>
                ) : (
                  <Link href={`${baseUrl}?page=${pageNumber}`}>
                    {pageNumber}
                    <span className="sr-only">Page {pageNumber}</span>
                  </Link>
                )}
              </Button>
            )}
          </li>
        ))}

        <li>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            disabled={currentPage === totalPages}
            asChild={currentPage !== totalPages}
          >
            {currentPage === totalPages ? (
              <span>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </span>
            ) : (
              <Link href={`${baseUrl}?page=${currentPage + 1}`}>
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Link>
            )}
          </Button>
        </li>
      </ul>
    </nav>
  )
}
