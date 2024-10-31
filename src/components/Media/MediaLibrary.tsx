import React, { useEffect, useState } from 'react'
import { mediaAPI } from '../../lib/api'
import { GalleryBlockViewIcon, GalleryListViewIcon } from '../ui/Icons'
import GalleryBlockView from '../TutorialEditor/GalleryBlockView'
import GalleryListView from '../TutorialEditor/GalleryListView'
import PaginationBar from '../TutorialEditor/PaginationBar'
import { MediaObjectInterface, SortedObjectInterface } from '../../types/types'
import Preloader from '../ui/Preloader'
import { Dialog } from '../ui/Dialog'
import FileEdit from './FileEdit'
import SearchFilterBar from './SearchFilterBar'
import { handleGetMedia } from 'src/lib/handleGetMedia'

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
}

export const MediaLibrary = (props: MediaLibraryProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [media, setMedia] = useState<MediaObjectInterface[] | undefined>(undefined)
  const [totalMediaPages, setTotalMediaPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(props.itemsPerPage ?? 12)
  const [viewType, setViewType] = useState<'block' | 'list'>('block')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedSortKey, setSelectedSortKey] = useState<SortedObjectInterface | undefined>()
  const [selectedFilters, setSelectedFilters] = useState<SortedObjectInterface[]>([])
  const [mediaEditOpen, setMediaEditOpen] = useState<boolean>(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaObjectInterface | undefined>(undefined)

  const getMediaForLocalState = (params?: string) => {
    handleGetMedia({
      setIsLoading,
      setMedia,
      params,
    })
  }

  useEffect(() => {
    if (!props.isFetching) {
      getMediaForLocalState(`page=${currentPage}&amount=${itemsPerPage}`)
    }
  }, [props.isFetching])

  useEffect(() => {
    mediaAPI.getAllMediaPages().then((res) => {
      setTotalMediaPages(Math.ceil(parseInt(res.data) / itemsPerPage))
    })
  }, [itemsPerPage])

  useEffect(() => {
    const sortKey = selectedSortKey ? `&sortKey=${selectedSortKey.name}` : ''
    const query = searchValue.length > 0 ? `&query=${searchValue}` : ''
    const filters =
      selectedFilters.length > 0
        ? // if filters arr not empty - add them to request separated by comma
          `&filters=${selectedFilters.map((item) => item.name).join(',')}`
        : // if filters arr empty - push to request nothing
          ''
    getMediaForLocalState(`page=${currentPage}&amount=${itemsPerPage}${filters}${sortKey}${query}`)
  }, [currentPage, itemsPerPage, selectedFilters, selectedSortKey, searchValue])

  useEffect(() => {
    if (viewType === 'block') {
      setItemsPerPage(props.itemsPerPage ?? 12)
    } else if (viewType === 'list') {
      setItemsPerPage(4)
    }
  }, [viewType])

  const handleChangeSearchValue = async (val: string) => {
    setSearchValue(val)
    if (val === '' && val !== searchValue) {
      getMediaForLocalState(`page=${currentPage}&amount=${itemsPerPage}`)
    } else {
      setIsLoading(true)
      const foundMedia = await mediaAPI.searchMedia(val).then((res) =>
        res.data.map((serverItem: any) => {
          return {
            id: serverItem.id,
            url: serverItem.url,
            type: serverItem.media_type.split('/')[0],
            format: serverItem.media_type.split('/')[1],
            title: serverItem.title,
            publishDate: serverItem.published,
          }
        }),
      )
      setMedia(foundMedia.slice(0, itemsPerPage))
      setIsLoading(false)
    }
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
        {media && (
          <div className="flex flex-col gap-y-10">
            {isLoading ? (
              <div className={'w-full flex justify-center items-center'}>
                <Preloader color="secondary" />
              </div>
            ) : (
              <>
                {viewType === 'block' && (
                  <GalleryBlockView
                    selectMode={props.selectMode}
                    isPopup={props.isPopup}
                    currentItems={media}
                    mediaToDelete={props.mediaToDelete}
                    handleMultipleSelect={props.handleMultipleSelect}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    handleSelectMedia={
                      props.handleSelectMedia ? props.handleSelectMedia : handleOpenEditMediaPopup
                    }
                    selectedMedia={props.selectedMedia}
                    hideVideo={props.hideVideo}
                    column={props.column}
                  />
                )}
                {viewType === 'list' && (
                  <GalleryListView
                    selectMode={props.selectMode}
                    isPopup={props.isPopup}
                    currentItems={media}
                    mediaToDelete={props.mediaToDelete}
                    handleMultipleSelect={props.handleMultipleSelect}
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    handleSelectMedia={
                      props.handleSelectMedia ? props.handleSelectMedia : handleOpenEditMediaPopup
                    }
                    selectedMedia={props.selectedMedia}
                  />
                )}
              </>
            )}
            {searchValue.trim() === '' && (
              <PaginationBar
                selectMode={props.selectMode}
                currentPage={currentPage}
                handleClickPage={handleClick}
                handleNextClick={handleNextClick}
                handlePrevClick={handlePrevClick}
                totalPages={totalMediaPages}
              />
            )}
          </div>
        )}
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
