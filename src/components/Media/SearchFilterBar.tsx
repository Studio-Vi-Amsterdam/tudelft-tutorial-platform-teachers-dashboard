import React, { useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FilterIcon, SearchIcon, SortIcon } from '../ui/Icons'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '../ui/Dropdown'
import { SortedObjectInterface } from 'src/types/types'

interface SearchFilterBarProps {
  searchValue: string
  handleChangeSearchValue: (val: string) => Promise<void>
  setSelectedSortKey: React.Dispatch<React.SetStateAction<SortedObjectInterface | undefined>>
  selectedSortKey: SortedObjectInterface | undefined
  selectedFilters: SortedObjectInterface[]
  setSelectedFilters: React.Dispatch<React.SetStateAction<SortedObjectInterface[]>>
}

const SearchFilterBar = (props: SearchFilterBarProps) => {
  const {
    searchValue,
    handleChangeSearchValue,
    selectedSortKey,
    setSelectedSortKey,
    selectedFilters,
    setSelectedFilters,
  } = props
  const [isInputOpen, setIsInputOpen] = useState<boolean>(false)
  const [sortKeys] = useState<SortedObjectInterface[]>([
    {
      title: 'Newest first',
      name: 'newest-first',
    },
    {
      title: 'Oldest first',
      name: 'oldest-first',
    },
  ])

  const [filters] = useState<SortedObjectInterface[]>([
    {
      title: 'My uploads',
      name: 'my-uploads',
    },
  ])

  const changeFilterChecked = (filterName: string) => {
    const searchableObject = selectedFilters.find((item) => item.name === filterName)
    if (searchableObject === undefined) {
      // Adding filter to array
      const newFilter = filters.find((item) => item.name === filterName)
      newFilter && setSelectedFilters((prevState) => [...prevState, newFilter])
    } else {
      // deleting filter from array
      const newfiltersArray = selectedFilters.filter((item) => item.name !== filterName)
      setSelectedFilters(newfiltersArray)
    }
  }

  const changeSortKey = (keyName: string) => {
    const keyObject = sortKeys.find((item) => item.name === keyName)
    setSelectedSortKey(keyObject)
  }

  const closeInput = () => {
    searchValue.length < 1 && setIsInputOpen(false)
  }

  const toggleInputOpen = () => {
    if (isInputOpen) {
      closeInput()
    } else {
      setIsInputOpen(true)
    }
  }

  return (
    <div className="flex flex-row items-center [&>div:hover]:bg-tertiary-skyBlue-10 transition-colors [&>div]:transition-colors [&>div]:duration-300 duration-300 justify-end [&>div:first-child]:before:!hidden [&>div>button]:flex [&>div>button]:flex-row [&>div>button]:items-center [&>div>button]:gap-x-6 [&>div]:relative [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-tertiary-skyBlue-20">
      <div className="pr-6 relative flex flex-row group items-center hover:!bg-transparent">
        {searchValue !== undefined && (
          <input
            className={`absolute ${isInputOpen ? 'bg-background-aliceBlue' : 'bg-white group-hover:bg-tertiary-skyBlue-10 placeholder:text-black'} right-full px-4 py-2 h-10 transition-all duration-300 bg-background-aliceBlue focus:outline-none outline-none top-0 ${isInputOpen ? 'w-48' : 'w-20 pr-0'}`}
            type="text"
            value={searchValue}
            onFocus={() => setIsInputOpen(true)}
            onBlur={() => closeInput()}
            placeholder="Search"
            onChange={(e) => handleChangeSearchValue(e.target.value)}
          />
        )}
        <button
          className={`px-4 z-10 py-2 ${isInputOpen ? 'bg-background-aliceBlue' : 'group-hover:bg-tertiary-skyBlue-10'} transition-colors duration-300`}
          onClick={toggleInputOpen}
        >
          <SearchIcon color="#000000" />
        </button>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="px-10 data-[state='open']:bg-background-aliceBlue flex py-2 flex-row gap-x-6 text-black font-normal font-sans">
            <p>{selectedSortKey !== undefined ? selectedSortKey.title : 'Sort'}</p>
            <SortIcon color="#000000" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="p-4 mt-2 flex flex-col gap-y-4 bg-background-aliceBlue rounded border-none"
          >
            <DropdownMenuRadioGroup value={selectedSortKey?.name} onValueChange={changeSortKey}>
              {sortKeys.map((item, index) => (
                <DropdownMenuRadioItem
                  key={item.name + index}
                  className="text-tertiary-grey-dim"
                  value={item.name}
                >
                  {item.title}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger className="pl-10 data-[state='open']:bg-background-aliceBlue flex py-2 px-4 flex-row gap-x-6 text-black font-normal font-sans">
            <p>Filter</p>
            <FilterIcon color="#000000" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="p-4 mt-2 flex flex-col gap-y-4 bg-background-aliceBlue rounded border-none"
          >
            {filters.map((item, index) => (
              <DropdownMenuCheckboxItem
                key={item.name + index}
                className="text-tertiary-grey-dim"
                checked={
                  !!selectedFilters.find((selectedFilter) => selectedFilter.name === item.name)
                }
                onCheckedChange={() => changeFilterChecked(item.name)}
              >
                {item.title}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default SearchFilterBar
