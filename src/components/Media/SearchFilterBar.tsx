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

interface SortedObjectInterface {
  title: string
  name: string
}

interface FilterObjectInterface extends SortedObjectInterface {
  checked: boolean
}

interface SearchFilterBarProps {
  searchValue: string
  handleChangeSearchValue: (val: string) => Promise<void>
}

const SearchFilterBar = (props: SearchFilterBarProps) => {
  const { searchValue, handleChangeSearchValue } = props
  const [isInputOpen, setIsInputOpen] = useState<boolean>(false)
  const [selectedSortKey, setSelectedSortKey] = useState<SortedObjectInterface | undefined>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sortKeys, setSortKeys] = useState<SortedObjectInterface[]>([
    {
      title: 'Newest first',
      name: 'newest-first',
    },
    {
      title: 'Oldest first',
      name: 'oldest-first',
    },
    {
      title: 'Level easy to difficult',
      name: 'level-easy-to-difficult',
    },
    {
      title: 'Level difficult to easy',
      name: 'level-difficult-to-easy',
    },
  ])
  const [filters, setFilters] = useState<FilterObjectInterface[]>([
    {
      title: 'My uploads',
      name: 'my-uploads',
      checked: false,
    },
    {
      title: 'Courses',
      name: 'courses',
      checked: false,
    },
    {
      title: 'Subjects',
      name: 'subjects',
      checked: false,
    },
    {
      title: 'Software',
      name: 'software',
      checked: false,
    },
    {
      title: 'Labs',
      name: 'labs',
      checked: false,
    },
    {
      title: 'Tutorials',
      name: 'tutorials',
      checked: false,
    },
  ])

  const changeFilterChecked = (filterName: string) => {
    const newArr = filters.map((item) => {
      if (item.name === filterName) {
        return { ...item, checked: !item.checked }
      }
      return item
    })
    setFilters(newArr)
  }

  const changeSortKey = (keyName: string) => {
    const keyObject = sortKeys.find((item) => item.name === keyName)
    setSelectedSortKey(keyObject)
  }

  return (
    <div className="flex flex-row items-center [&>div:hover]:bg-tertiary-skyBlue-10 transition-colors [&>div]:transition-colors [&>div]:duration-300 duration-300 justify-end [&>div:first-child]:before:!hidden [&>div>button]:flex [&>div>button]:flex-row [&>div>button]:items-center [&>div>button]:gap-x-6 [&>div]:relative [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-tertiary-skyBlue-20">
      <div className="pr-6 relative flex flex-row items-center hover:!bg-transparent">
        {searchValue !== undefined && (
          <input
            className={`absolute right-full px-4 py-2 h-10 transition-all duration-300 bg-background-aliceBlue focus:outline-none top-0 ${isInputOpen ? 'scale-x-100 ' : 'scale-x-0 translate-x-1/2'}`}
            type="text"
            value={searchValue}
            onChange={(e) => handleChangeSearchValue(e.target.value)}
          />
        )}
        <span
          className={`absolute pointer-events-none transition-all duration-300 ${isInputOpen ? 'right-[296%]' : 'right-[88px]'} ${(isInputOpen && !searchValue) || isInputOpen ? 'invisible' : 'visible'}`}
        >
          Search
        </span>
        <button
          className={`px-4 py-2 ${isInputOpen ? 'bg-background-aliceBlue' : 'hover:bg-tertiary-skyBlue-10'} transition-colors duration-300`}
          onClick={() => setIsInputOpen((prevState) => !prevState)}
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
                checked={item.checked}
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
