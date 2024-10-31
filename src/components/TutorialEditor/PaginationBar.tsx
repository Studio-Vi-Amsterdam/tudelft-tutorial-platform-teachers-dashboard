import React, { useState } from 'react'
import { ArrowNext, ArrowPrev } from '../ui/Icons'
import { Button } from '../ui/Button'

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
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [inputValue, setInputValue] = useState<number>(currentPage)

  const errorMessageText = `Please, pass a valid number of page. Between 1 and ${totalPages}`

  const handleInputChange = (val: string) => {
    const value = parseInt(val)
    if (isNaN(value) || value < 1 || value > totalPages) {
      setErrorMessage(errorMessageText)
    } else {
      setErrorMessage('')
    }
    setInputValue(value)
  }

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
    <div className="flex flex-col gap-y-6 items-center justify-center">
      <div className="flex flex-row gap-x-2 [&>button]:flex sm:[&>button]:h-12 sm:[&>button]:w-12 [&>button]:h-8 [&>button]:w-8 [&>button]:flex-row [&>button]:items-center [&>button]:justify-center [&>button]:rounded-[4px] sm:[&>button]:text-xl [&>button]:leading-8">
        <button onClick={handlePrevClick} disabled={currentPage === 1 || props.selectMode}>
          <ArrowPrev />
        </button>
        {renderPageNumbers()}
        <button onClick={handleNextClick} disabled={currentPage === totalPages || props.selectMode}>
          <ArrowNext />
        </button>
      </div>
      <div className="flex flex-col gap-y-2 items-center justify-center">
        <div className="flex flex-row justify-between items-center gap-x-3">
          <Button
            disabled={errorMessage.length > 0}
            className="text-xl py-2 px-4 border-none leading-[30px]"
            onClick={() => handleClickPage(inputValue)}
          >
            Go to page
          </Button>
          <input
            type="number"
            className="focus:outline-none text-xl leading-[30px] py-2 px-4 rounded border-stone bg-background-aliceBlue"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={currentPage.toString()}
          />
        </div>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  )
}

export default PaginationBar
