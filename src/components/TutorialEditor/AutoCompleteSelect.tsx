import clsx from 'clsx'
import React, { useEffect, useState } from 'react'
import { ChevronDown } from '../ui/Icons'

interface AutoCompleteSelectProps<T> {
  possibleValues: T[]
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
  inputPlaceholder: string
  buttonPlaceholder: string
  getSuggestionText: (item: T) => string
  getSuggestionId: (item: T) => number
  // temporary test callback
  onSelectSuggestion?: (selectedItem: T) => void
}

const AutoCompleteSelect = <T,>({
  possibleValues,
  inputValue,
  setInputValue,
  inputPlaceholder,
  buttonPlaceholder,
  getSuggestionText,
  getSuggestionId,
  onSelectSuggestion,
}: AutoCompleteSelectProps<T>) => {
  const [suggestions, setSuggestions] = useState<T[]>(possibleValues)
  const [isSelectOpen, setIsSelectOpen] = useState<boolean>(false)

  const fillSuggestions = (value: string) => {
    if (value.length > 0) {
      const filteredSuggestions = possibleValues.filter((suggestion) =>
        getSuggestionText(suggestion).toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : [])
    } else {
      setSuggestions(possibleValues)
    }
  }

  const handleSuggestionClick = (value: number) => {
    const selectedObject = suggestions.find((item) => getSuggestionId(item) === value) as T
    setInputValue(getSuggestionText(selectedObject))
    setSuggestions([])
    setIsSelectOpen(false)
    onSelectSuggestion && onSelectSuggestion(selectedObject)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)
    fillSuggestions(value)
  }

  useEffect(() => {
    fillSuggestions(inputValue)
  }, [])

  return (
    <div className="flex w-full flex-col rounded-[4px] border border-dim bg-background-seasalt">
      <button
        className={clsx(
          'w-full relative font-[Arial] text-base text-left rounded-[4px] focus:outline-none bg-background-seasalt text-tertiary-grey-stone',
          {
            'p-2': !isSelectOpen,
            'pt-2 px-2 pb-4 border-b-transparent rounded-b-none': isSelectOpen,
          },
        )}
        onClick={() => setIsSelectOpen((prevState) => !prevState)}
      >
        <span
          style={{
            translate: `${isSelectOpen ? '0 calc(-50% - 4px)' : '0 calc(-50%)'}`,
            rotate: `${isSelectOpen ? '180deg' : '0deg'}`,
          }}
          className={clsx(
            'absolute w-3 h-3 flex justify-center items-center text-dim right-[0.543rem] top-1/2 transition-all duration-150',
          )}
        >
          <ChevronDown />
        </span>
        {inputValue.trim() === '' ? buttonPlaceholder : inputValue}
      </button>
      {isSelectOpen && (
        <div
          style={{ width: 'calc(100% - 16px)' }}
          className="mx-auto flex flex-col gap-y-4 border-t border-tertiary-grey-dim pt-4"
        >
          <input
            type="text"
            placeholder={inputPlaceholder}
            className="p-1 text-stone font-[Arial] border border-stone rounded-[0.12rem] bg-background-seasalt"
            value={inputValue}
            onChange={handleInputChange}
          />
          <div className="custom-vertical-scrollbar flex max-h-28 flex-col gap-y-2 overflow-y-auto pl-2 pr-8 mb-2 [&>button]:py-1">
            {suggestions.map((item, index) => (
              <button
                className="w-full text-left px-2 text-black font-[Arial] transition-colors rounded-[4px] duration-100 hover:bg-tertiary-grey-silver"
                key={index}
                onClick={() => handleSuggestionClick(getSuggestionId(item))}
              >
                {getSuggestionText(item)}
              </button>
            ))}
            {suggestions.length === 0 && 'Not found suggestions!'}
          </div>
        </div>
      )}
    </div>
  )
}

export default AutoCompleteSelect
