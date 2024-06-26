import React, { useEffect, useState } from 'react'
import { mediaAPI } from '../../lib/api'
import {
  FilterIcon,
  GalleryBlockViewIcon,
  GalleryListViewIcon,
  SearchIcon,
  SortIcon,
} from '../ui/Icons'
import GalleryBlockView from '../TutorialEditor/GalleryBlockView'
import GalleryListView from '../TutorialEditor/GalleryListView'
import PaginationBar from '../TutorialEditor/PaginationBar'
import { MediaObjectInterface } from '../../types/types'

interface MediaLibraryProps {
  itemsPerPage?: number
  isPopup?: boolean
  handleSelectMedia?: (item: MediaObjectInterface) => void
  selectedMedia: MediaObjectInterface | undefined
  selectMode?: boolean
  handleMultipleSelect: (item: MediaObjectInterface) => void
  mediaToDelete: MediaObjectInterface[] | undefined
}

export const MediaLibrary = (props: MediaLibraryProps) => {
  const [media, setMedia] = useState<MediaObjectInterface[] | undefined>(undefined)
  const [totalMediaPages, setTotalMediaPages] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState<number>(props.itemsPerPage ?? 12)
  const [viewType, setViewType] = useState<'block' | 'list'>('block')
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleGetMedia = (params?: string) => {
    setMedia(undefined)
    mediaAPI.getMedia(params).then((res) => {
      const newMedia: MediaObjectInterface[] = res.data.map((serverItem: any) => {
        return {
          id: serverItem.id,
          url: serverItem.url,
          type: serverItem.media_type.split('/')[0],
          format: serverItem.media_type.split('/')[1],
          title: serverItem.title,
          publishDate: serverItem.published,
        }
      })
      setMedia(newMedia)
    })
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

  useEffect(() => {
    mediaAPI.getAllMediaPages().then((res) => {
      setTotalMediaPages(Math.ceil(parseInt(res.data) / itemsPerPage))
    })
  }, [itemsPerPage])

  useEffect(() => {
    handleGetMedia(`page=${currentPage}&amount=${itemsPerPage}`)
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    if (viewType === 'block') {
      setItemsPerPage(props.itemsPerPage ?? 12)
    } else if (viewType === 'list') {
      setItemsPerPage(4)
    }
  }, [viewType])

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-10">
        <div className="flex flex-row items-center justify-start gap-x-6 [&>button]:flex [&>button]:flex-row [&>button]:gap-x-4 [&>button]:rounded-[4px] [&>button]:bg-background-aliceBlue [&>button]:p-2">
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
            disabled={props.selectMode}
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
            disabled={props.selectMode}
          >
            <GalleryListViewIcon color={viewType === 'list' ? '#00A6D6' : '#67676B'} />
            <p
              className={`${viewType === 'list' ? 'w-0' : 'w-[84px]'} transition-all duration-330 in-expo overflow-hidden`}
            >
              <span className="whitespace-nowrap pl-4">List View</span>
            </p>
          </button>
        </div>
        <div className="flex flex-row items-center justify-end [&>div:first-child]:before:!hidden [&>div>button]:flex [&>div>button]:flex-row [&>div>button]:items-center [&>div>button]:gap-x-6 [&>div]:relative [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-tertiary-skyBlue-20">
          <div className="pr-6">
            <button className="px-4">
              <p>Search</p>
              <SearchIcon color="#000000" />
            </button>
          </div>
          <div className="px-6">
            <button className="px-4 py-2">
              <p>Sort</p>
              <SortIcon color="#000000" />
            </button>
          </div>
          <div className="pl-6">
            <button className="px-4 py-2">
              <p>Filter</p>
              <FilterIcon color="#000000" />
            </button>
          </div>
        </div>
      </div>
      <div className="min-h-[620px]">
        {media && (
          <div className="flex flex-col gap-y-6">
            {viewType === 'block' && (
              <GalleryBlockView
                selectMode={props.selectMode}
                currentItems={media}
                mediaToDelete={props.mediaToDelete}
                handleMultipleSelect={props.handleMultipleSelect}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handleSelectMedia={props.handleSelectMedia ? props.handleSelectMedia : () => {}}
                selectedMedia={props.selectedMedia}
              />
            )}
            {viewType === 'list' && (
              <GalleryListView
                selectMode={props.selectMode}
                currentItems={media}
                mediaToDelete={props.mediaToDelete}
                handleMultipleSelect={props.handleMultipleSelect}
                // eslint-disable-next-line @typescript-eslint/no-empty-function
                handleSelectMedia={props.handleSelectMedia ? props.handleSelectMedia : () => {}}
                selectedMedia={props.selectedMedia}
              />
            )}
            <PaginationBar
              selectMode={props.selectMode}
              currentPage={currentPage}
              handleClickPage={handleClick}
              handleNextClick={handleNextClick}
              handlePrevClick={handlePrevClick}
              totalPages={totalMediaPages}
            />
          </div>
        )}
      </div>
    </>
  )
}
