import React, { useEffect, useState } from 'react'
import { mediaAPI } from '../../lib/api'
import { GalleryBlockViewIcon, GalleryListViewIcon } from '../ui/Icons'
import GalleryBlockView from '../TutorialEditor/GalleryBlockView'
import GalleryListView from '../TutorialEditor/GalleryListView'
import PaginationBar from '../TutorialEditor/PaginationBar'
import { MediaObjectInterface } from '../../types/types'
import Preloader from '../ui/Preloader'
import { Dialog } from '../ui/Dialog'
import FileEdit from './FileEdit'

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

  useEffect(() => {
    if (!props.isFetching) {
      handleGetMedia(`page=${currentPage}&amount=${itemsPerPage}`)
    }
  }, [props.isFetching])

  const handleGetMedia = (params?: string) => {
    setIsLoading(true)
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
          description: serverItem.description,
          isOwner: serverItem.is_media_owner,
        }
      })
      setMedia(newMedia)
      setIsLoading(false)
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

  const [searchValue] = useState<string>('')
  // const handleChangeSearchValue = async (val: string) => {
  //   setSearchValue(val)
  //   if (val === '' && val !== searchValue) {
  //     handleGetMedia(`page=${currentPage}&amount=${itemsPerPage}`)
  //   } else {
  //     setIsLoading(true)
  //     const foundMedia = await mediaAPI.searchMedia(val).then((res) =>
  //       res.data.map((serverItem: any) => {
  //         return {
  //           id: serverItem.id,
  //           url: serverItem.url,
  //           type: serverItem.media_type.split('/')[0],
  //           format: serverItem.media_type.split('/')[1],
  //           title: serverItem.title,
  //           publishDate: serverItem.published,
  //         }
  //       }),
  //     )
  //     setMedia(foundMedia.slice(0, itemsPerPage))
  //     setIsLoading(false)
  //   }
  // }

  const [mediaEditOpen, setMediaEditOpen] = useState<boolean>(false)
  const [selectedMedia, setSelectedMedia] = useState<MediaObjectInterface | undefined>(undefined)

  const handleOpenEditMediaPopup = (media: MediaObjectInterface) => {
    setMediaEditOpen(true)
    setSelectedMedia(media)
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
        {/* <div className="flex flex-row items-center justify-end [&>div:first-child]:before:!hidden [&>div>button]:flex [&>div>button]:flex-row [&>div>button]:items-center [&>div>button]:gap-x-6 [&>div]:relative [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-tertiary-skyBlue-20"> */}
        {/*  <div className="pr-6"> */}
        {/*    <button className="px-4"> */}
        {/*      <input */}
        {/*        type="text" */}
        {/*        placeholder="Search" */}
        {/*        value={searchValue} */}
        {/*        onChange={(e) => handleChangeSearchValue(e.target.value)} */}
        {/*      /> */}
        {/*      <SearchIcon color="#000000" /> */}
        {/*    </button> */}
        {/*  </div> */}
        {/*  <div className="px-6"> */}
        {/*    <button className="px-4 py-2"> */}
        {/*      <p>Sort</p> */}
        {/*      <SortIcon color="#000000" /> */}
        {/*    </button> */}
        {/*  </div> */}
        {/*  <div className="pl-6"> */}
        {/*    <button className="px-4 py-2"> */}
        {/*      <p>Filter</p> */}
        {/*      <FilterIcon color="#000000" /> */}
        {/*    </button> */}
        {/*  </div> */}
        {/* </div> */}
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
