import React from 'react'
import { ArrowNext, ArrowPrev } from '../ui/Icons'

interface PaginationBarProps {
  totalPages: number
  currentPage: number
  handleClickPage: (page: number) => void
  handlePrevClick: () => void
  handleNextClick: () => void
  selectMode?: boolean
}

const PaginationBar = (props: PaginationBarProps) => {
  const { totalPages, currentPage, handleClickPage, handlePrevClick, handleNextClick } = props
  const renderPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    if (totalPages <= maxPagesToShow + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      const startPage = Math.max(2, currentPage - 2)
      const endPage = Math.min(totalPages - 1, currentPage + 2)

      if (startPage > 2) {
        pages.push('...')
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages.map((page, index) => (
      <button
        key={index}
        onClick={() => typeof page === 'number' && handleClickPage(page)}
        className={page === currentPage ? 'bg-primary-skyBlue text-white' : ''}
        disabled={typeof page !== 'number' || props.selectMode}
      >
        {page}
      </button>
    ))
  }

  return (
    <div className="flex flex-row items-center justify-center">
      <div className="flex flex-row gap-x-2 [&>button]:flex [&>button]:h-12 [&>button]:w-12 [&>button]:flex-row [&>button]:items-center [&>button]:justify-center [&>button]:rounded-[4px] [&>button]:text-xl [&>button]:leading-8">
        <button onClick={handlePrevClick} disabled={currentPage === 1 || props.selectMode}>
          <ArrowPrev />
        </button>
        {renderPageNumbers()}
        <button onClick={handleNextClick} disabled={currentPage === totalPages || props.selectMode}>
          <ArrowNext />
        </button>
      </div>
    </div>
  )
}

export default PaginationBar
