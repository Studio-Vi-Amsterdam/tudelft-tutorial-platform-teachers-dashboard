import React from 'react'
import { GalleryViewProps } from 'src/types/types'
import MediaPreviewTemplate from '../Media/MediaPreviewTemplate'

const GalleryBlockView = (props: GalleryViewProps) => {
  const { currentItems, selectedMedia, handleSelectMedia } = props
  return (
    <div
      className={`${props.column === '3' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md::grid-cols-3 lg:grid-cols-4'} grid gap-2  sm:gap-6 mb-10 sm:mb-14`}
    >
      {currentItems?.map((item, index) => (
        <button
          key={index}
          className={`
            ${
              selectedMedia === item ? '' : 'before:!hidden'
            } ${props.selectMode && item?.isOwner ? 'after:w-6 after:h-6 after:absolute after:border-2 after:bg-white after:rounded-sm after:border-stone after:top-2 after:right-2 after:z-10' : ' group '} 
          ${props.mediaToDelete !== undefined && props.mediaToDelete.includes(item) && 'after:!bg-primary-skyBlue after:!border-primary-skyBlue after:!opacity-90 after:!bg-check after:!bg-center after:!bg-no-repeat'}
          relative  before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50 before:z-10`}
          onClick={
            props.selectMode && item.isOwner
              ? () => props.handleMultipleSelect(item)
              : !props.selectMode && item.isOwner
                ? () => handleSelectMedia(item)
                : // eslint-disable-next-line @typescript-eslint/no-empty-function
                  () => {}
          }
        >
          {!props.selectMode && !props.isPopup && item.isOwner && (
            <div className="absolute w-full h-full bg-[rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
              <div className="border-transparent bg-primary-skyBlue z-10 text-primary-white disabled:bg-tertiary-skyBlue-20 flex flex-row items-center justify-center gap-x-6 rounded-[4px] border px-6 py-3 [&>div]:text-2xl transition-colors duration-200 [&>div]:leading-6 [&>p]:text-base">
                Edit
              </div>
            </div>
          )}
          {props.hideVideo && <div className="absolute top-0 left-0 w-full h-full z-10"></div>}

          <MediaPreviewTemplate item={item} styles="w-full" />
        </button>
      ))}
    </div>
  )
}

export default GalleryBlockView
