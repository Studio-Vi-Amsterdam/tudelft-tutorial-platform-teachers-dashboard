import React, { useState } from 'react'
import { UsersItemInterface } from 'src/types/types'

interface AutoCompleteInputProps {
  possibleValues: UsersItemInterface[]
  inputValue: string
  setInputValue: React.Dispatch<React.SetStateAction<string>>
}

const AutoCompleteInput = (props: AutoCompleteInputProps) => {
  const { possibleValues, inputValue, setInputValue } = props
  const [suggestions, setSuggestions] = useState<UsersItemInterface[]>([])

  const handleSuggestionClick = (value: string) => {
    setInputValue(value)
    setSuggestions([])
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setInputValue(value)
    if (value.length > 0) {
      const filteredSuggestions = possibleValues.filter(
        (suggestion) =>
          suggestion.email.toLowerCase().includes(value.toLowerCase()) ||
          suggestion.first_name.toLowerCase().includes(value.toLowerCase()),
      )
      setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : [])
    } else {
      setSuggestions([])
    }
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        className={`w-full text-base rounded-[4px] border focus:outline-none border-DIM bg-background-seasalt p-4 text-tertiary-grey-stone ${suggestions.length > 0 ? 'border-b-transparent rounded-b-none !p-2 !pb-4' : ''}`}
        value={inputValue}
        onChange={handleInputChange}
        aria-autocomplete="list"
        aria-controls="autocomplete-list"
      />
      {suggestions.length > 0 && (
        <ul
          id="autocomplete-list"
          className="custom-vertical-scrollbar absolute top-full left-0 right-0 border pt-4 p-2 list-none rounded-b border-t-0 bg-background-seasalt max-h-40 overflow-y-auto before:absolute before:left-[4%] before:w-[92%] before:h-[1px] before:bg-tertiary-grey-dim before:bg-black before:top-0 flex flex-col gap-y-4"
          role="listbox"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() =>
                handleSuggestionClick(
                  suggestion.email.length === 0 ? suggestion.first_name : suggestion.email,
                )
              }
              className="cursor-pointer text-tertiary-grey-stone hover:text-tertiary-grey-dim hover:bg-tertiary-grey-silver px-2 py-1"
              role="option"
              // Additional props
            >
              {suggestion.email.length === 0 ? suggestion.first_name : suggestion.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AutoCompleteInput
