import React from 'react'
import { GalleryViewProps } from 'src/types/types'
import MediaPreviewTemplate from '../Media/MediaPreviewTemplate'

const GalleryBlockView = (props: GalleryViewProps) => {
  const { currentItems, selectedMedia, handleSelectMedia } = props
  return (
    <div
      className={`${props.column === '3' ? 'grid-cols-3' : 'grid-cols-4'} grid  gap-x-6 gap-y-6 mb-14`}
    >
      {currentItems?.map((item, index) => (
        <button
          key={index}
          className={`
            ${
              selectedMedia === item ? '' : 'before:!hidden'
            } ${props.selectMode ? 'after:w-6 after:h-6 after:absolute after:border-2 after:bg-white after:rounded-sm after:border-stone after:top-2 after:right-2 after:z-10' : ' '} 
          ${props.mediaToDelete !== undefined && props.mediaToDelete.includes(item) && 'after:!bg-primary-skyBlue after:!border-primary-skyBlue after:!opacity-90 after:!bg-check after:!bg-center after:!bg-no-repeat'}
          relative  before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50`}
          onClick={
            props.selectMode
              ? () => props.handleMultipleSelect(item)
              : () => handleSelectMedia(item)
          }
        >
          {props.hideVideo && <div className="absolute top-0 left-0 w-full h-full z-10"></div>}

          <MediaPreviewTemplate item={item} styles="w-full" />
        </button>
      ))}
    </div>
  )
}

export default GalleryBlockView
