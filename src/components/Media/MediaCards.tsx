import React from 'react'
import { MediaObjectInterface, MediaViewType } from 'src/types/types'
import Preloader from '../ui/Preloader'
import GalleryBlockView from '../TutorialEditor/GalleryBlockView'
import GalleryListView from '../TutorialEditor/GalleryListView'
import PaginationBar from '../TutorialEditor/PaginationBar'

interface MediaCardsInterface {
  media: MediaObjectInterface[] | undefined
  isLoading: boolean
  viewType: MediaViewType
  selectMode: boolean | undefined
  isPopup: boolean | undefined
  mediaToDelete: MediaObjectInterface[] | undefined
  handleMultipleSelect: (item: MediaObjectInterface) => void
  handleSelectMedia?: ((item: MediaObjectInterface) => void) | undefined
  handleOpenEditMediaPopup: (media: MediaObjectInterface) => void
  selectedMedia: MediaObjectInterface | undefined
  hideVideo: boolean | undefined
  column: string | undefined
  searchValue: string
  currentPage: number
  handleClick: (pageNumber: number) => void
  handleNextClick: () => void
  handlePrevClick: () => void
  totalMediaPages: number
}

const MediaCards = (props: MediaCardsInterface) => {
  const {
    media,
    isLoading,
    viewType,
    handleOpenEditMediaPopup,
    searchValue,
    handleClick,
    handleNextClick,
    handlePrevClick,
    totalMediaPages,
    currentPage,
  } = props
  if (isLoading) {
    return (
      <div className={'w-full flex justify-center items-center'}>
        <Preloader color="secondary" />
      </div>
    )
  } else {
    if (media && media.length > 0) {
      return (
        <div className="flex flex-col gap-y-10">
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
      )
    } else {
      return (
        <div className="w-full flex justify-center items-center py-7 text-2xl font-medium text-primary-skyBlue">
          Media not found!
        </div>
      )
    }
  }
}

export default MediaCards
