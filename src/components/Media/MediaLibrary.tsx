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

export const MediaLibrary = () => {
  const [media, setMedia] = useState<any>(undefined)
  const [totalMediaPages, setTotalMediaPages] = useState(0)
  const itemsPerPage = 12
  const [viewType, setViewType] = useState<'block' | 'list'>('block')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [selectedMedia, setSelectedMedia] = useState<MediaObjectInterface | undefined>(undefined)

  const handleGetMedia = (params?: string) => {
    mediaAPI.getMedia(params).then((res) => {
      setMedia(res.data)
    })
  }

  const handleSelectMedia = (item: MediaObjectInterface) => {
    if (selectedMedia === item) {
      setSelectedMedia(undefined)
    } else {
      setSelectedMedia(item)
    }
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
  }, [])

  useEffect(() => {
    handleGetMedia(`page=${currentPage}&amount=${itemsPerPage}`)
  }, [currentPage])

  return (
    <>
      <div className="flex flex-row items-center justify-between mb-6">
        <div className="flex flex-row items-center justify-start gap-x-6 [&>button]:flex [&>button]:flex-row [&>button]:gap-x-4 [&>button]:rounded-[4px] [&>button]:bg-background-aliceBlue [&>button]:p-2">
          <button
            className={
              viewType === 'block'
                ? '!bg-tertiary-skyBlue-10 text-primary-skyBlue'
                : 'text-tertiary-grey-dim'
            }
            onClick={() => setViewType('block')}
          >
            <GalleryBlockViewIcon color={viewType === 'block' ? '#00A6D6' : '#67676B'} />
            {viewType !== 'block' && <p>Gallery View</p>}
          </button>
          <button
            className={
              viewType === 'list'
                ? '!bg-tertiary-skyBlue-10 text-primary-skyBlue'
                : 'text-tertiary-grey-dim'
            }
            onClick={() => setViewType('list')}
          >
            <GalleryListViewIcon color={viewType === 'list' ? '#00A6D6' : '#67676B'} />
            {viewType !== 'list' && <p>List View</p>}
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

      {media && (
        <div className="flex flex-col gap-y-10">
          {viewType === 'block' && (
            <GalleryBlockView
              currentItems={media}
              handleSelectMedia={handleSelectMedia}
              selectedMedia={selectedMedia}
            />
          )}
          {viewType === 'list' && (
            <GalleryListView
              currentItems={media}
              handleSelectMedia={handleSelectMedia}
              selectedMedia={selectedMedia}
            />
          )}
          <PaginationBar
            currentPage={currentPage}
            handleClickPage={handleClick}
            handleNextClick={handleNextClick}
            handlePrevClick={handlePrevClick}
            totalPages={totalMediaPages}
          />
        </div>
      )}
    </>
  )
}
