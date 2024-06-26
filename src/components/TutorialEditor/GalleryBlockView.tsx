import React from 'react'
import { GalleryViewProps } from 'src/types/types'
import MediaPreviewTemplate from '../Media/MediaPreviewTemplate'

const GalleryBlockView = (props: GalleryViewProps) => {
  const { currentItems, selectedMedia, handleSelectMedia } = props
  return (
    <div className="flex w-full flex-row justify-between flex-wrap gap-x-6 gap-y-6 mb-14">
      {currentItems?.map((item, index) => (
        <button
          key={index}
          className={`${
            selectedMedia === item ? '' : 'before:!hidden'
          } ${props.selectMode ? 'after:w-6 after:h-6 after:absolute after:border-2 after:bg-white after:rounded-sm after:border-stone after:top-2 after:right-2 after:z-10' : ' '} 
          ${props.mediaToDelete !== undefined && props.mediaToDelete.includes(item) && 'after:!bg-primary-skyBlue after:!border-primary-skyBlue after:!opacity-90 after:!bg-check after:!bg-center after:!bg-no-repeat'}
          relative w-[calc(25%-1.5rem)]  before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50`}
          onClick={
            props.selectMode
              ? () => props.handleMultipleSelect(item)
              : () => handleSelectMedia(item)
          }
        >
          <MediaPreviewTemplate item={item} styles="w-full" />
        </button>
      ))}
    </div>
  )
}

export default GalleryBlockView
