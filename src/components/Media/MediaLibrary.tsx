import React, { useEffect, useRef, useState } from 'react'
import { GalleryBlockViewIcon, GalleryListViewIcon } from '../ui/Icons'
import {
  MediaObjectInterface,
  MediaTypeFilters,
  MediaViewType,
  SortedObjectInterface,
} from '../../types/types'
import { Dialog } from '../ui/Dialog'
import FileEdit from './FileEdit'
import SearchFilterBar from './SearchFilterBar'
import { handleGetMedia } from 'src/lib/handleGetMedia'
import MediaCards from './MediaCards'

interface MediaLibraryProps {
  itemsPerPage?: number
  isPopup?: boolean
  handleSelectMedia?: (item: MediaObjectInterface) => void
  selectedMedia: MediaObjectInterface | undefined
  selectMode?: boolean
  isFetching?: boolean
  handleMultipleSelect: (item: MediaObjectInterface) => void
  mediaToDelete: MediaObjectInterface[] | undefined
  column?: string
  hideVideo?: boolean
  onFetching?: (val: boolean) => void
  mediaTypeFilter?: MediaTypeFilters
}

export const MediaLibrary = (props: MediaLibraryProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [media, setMedia] = useState<MediaObjectInterface[] | undefined>(undefined)
  const [totalMediaPages, setTotalMediaPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(props.itemsPerPage ?? 12)
  const [viewType, setViewType] = useState<MediaViewType>('block')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedSortKey, setSelectedSortKey] = useState<SortedObjectInterface | undefined>()
  const [selectedFilters, setSelectedFilters] = useState<SortedObjectInterface[]>([])
  const [mediaEditOpen, setMediaEditOpen] = useState<boolean>(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaObjectInterface | undefined>(undefined)
  const requestTimout = useRef<NodeJS.Timeout | null>(null)
  const sortKey = selectedSortKey ? `&sortKey=${selectedSortKey.name}` : ''
  const query = searchValue.length > 0 ? `&query=${searchValue}` : ''

  const setFiltersForRequest = (): string => {
    if (selectedFilters.length > 0) {
      return `&filters=${selectedFilters.map((item) => item.name).join(',')},${props.mediaTypeFilter ?? ''}`
    } else {
      if (props.mediaTypeFilter) {
        return `&filters=${props.mediaTypeFilter}`
      }
    }
    // if has not selected filters and filters from props
    return ''
  }

  const filters = setFiltersForRequest()

  const getMediaForLocalState = (params?: string) => {
    handleGetMedia({
      setIsLoading,
      setMedia,
      params,
      setTotalMediaPages,
      itemsPerPage,
    })
  }

  useEffect(() => {
    getMediaForLocalState(
      `page=${currentPage}&pageSize=${itemsPerPage}${filters}${sortKey}${query}`,
    )
  }, [currentPage])

  useEffect(() => {
    if (!props.isFetching) {
      setCurrentPage(1)
      getMediaForLocalState(`page=1&pageSize=${itemsPerPage}${filters}${sortKey}${query}`)
    }
  }, [itemsPerPage, selectedFilters, selectedSortKey, props.isFetching])

  useEffect(() => {
    if (viewType === 'block') {
      setItemsPerPage(props.itemsPerPage ?? 12)
    } else if (viewType === 'list') {
      setItemsPerPage(4)
    }
  }, [viewType])

  const handleChangeSearchValue = async (val: string) => {
    setSearchValue(val)
    if (requestTimout.current) clearTimeout(requestTimout.current)
    requestTimout.current = setTimeout(() => {
      setCurrentPage(1)
      getMediaForLocalState(`page=1&pageSize=${itemsPerPage}${filters}${sortKey}&query=${val}`)
    }, 500)
  }

  const handleOpenEditMediaPopup = (media: MediaObjectInterface) => {
    setMediaEditOpen(true)
    setSelectedMedia(media)
  }
  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }
  const handlePrevClick = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }
  const handleNextClick = () => {
    if (currentPage < totalMediaPages) setCurrentPage(currentPage + 1)
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-4 sm:mb-10">
        <div className="flex flex-row items-center justify-start gap-x-4 sm:gap-x-6 [&>button]:flex [&>button]:flex-row [&>button]:gap-x-4 [&>button]:rounded-[4px] [&>button]:bg-background-aliceBlue [&>button]:p-2">
          <button
            className={`
              ${
                viewType === 'block'
                  ? '!bg-tertiary-skyBlue-10 text-primary-skyBlue'
                  : 'text-tertiary-grey-dim'
              }
                !gap-0
              `}
            onClick={() => setViewType('block')}
            disabled={props.selectMode || isLoading}
          >
            <GalleryBlockViewIcon color={viewType === 'block' ? '#00A6D6' : '#67676B'} />
            <p
              className={`${viewType === 'block' ? 'w-0 ' : 'w-[105px]'} transition-all duration-330 in-expo overflow-hidden`}
            >
              <span className="whitespace-nowrap pl-4">Gallery View</span>
            </p>
          </button>
          <button
            className={`${
              viewType === 'list'
                ? '!bg-tertiary-skyBlue-10 text-primary-skyBlue'
                : 'text-tertiary-grey-dim'
            } !gap-0 `}
            onClick={() => setViewType('list')}
            disabled={props.selectMode || isLoading}
          >
            <GalleryListViewIcon color={viewType === 'list' ? '#00A6D6' : '#67676B'} />
            <p
              className={`${viewType === 'list' ? 'w-0' : 'w-[84px]'} transition-all duration-330 in-expo overflow-hidden`}
            >
              <span className="whitespace-nowrap pl-4">List View</span>
            </p>
          </button>
        </div>
        <SearchFilterBar
          handleChangeSearchValue={handleChangeSearchValue}
          searchValue={searchValue}
          selectedSortKey={selectedSortKey}
          setSelectedSortKey={setSelectedSortKey}
          selectedFilters={selectedFilters}
          setSelectedFilters={setSelectedFilters}
        />
      </div>
      <div className="md:min-h-[620px]">
        <MediaCards
          column={props.column}
          selectMode={props.selectMode}
          currentPage={currentPage}
          handleNextClick={handleNextClick}
          handlePrevClick={handlePrevClick}
          totalMediaPages={totalMediaPages}
          isPopup={props.isPopup}
          mediaToDelete={props.mediaToDelete}
          handleMultipleSelect={props.handleMultipleSelect}
          handleSelectMedia={props.handleSelectMedia}
          handleOpenEditMediaPopup={handleOpenEditMediaPopup}
          selectedMedia={props.selectedMedia}
          hideVideo={props.hideVideo}
          handleClick={handleClick}
          isLoading={isLoading}
          media={media}
          searchValue={searchValue}
          viewType={viewType}
        />
      </div>
      <Dialog open={mediaEditOpen} onOpenChange={setMediaEditOpen}>
        {props.onFetching && (
          <FileEdit
            selectedMedia={selectedMedia}
            setMediaEditOpen={setMediaEditOpen}
            setSelectedMedia={setSelectedMedia}
            onFetching={props.onFetching}
          />
        )}
      </Dialog>
    </>
  )
}
