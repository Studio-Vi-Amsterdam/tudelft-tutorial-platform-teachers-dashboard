import React from 'react'
import { GalleryViewProps } from 'src/types/types'
import MediaPreviewTemplate from '../Media/MediaPreviewTemplate'

const GalleryBlockView = (props: GalleryViewProps) => {
  const { currentItems, selectedMedia, handleSelectMedia } = props

  return (
    <div className="flex w-full flex-row justify-between flex-wrap gap-x-6 gap-y-6 ">
      {currentItems?.map((item, index) => (
        <button
          key={index}
          className={`${
            selectedMedia === item ? '' : 'before:!hidden'
          } relative w-[calc(25%-1.5rem)] h-48 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50`}
          onClick={() => handleSelectMedia(item)}
        >
          {/* <img
            src={item.url}
            alt={item.title}
            className="object-cover h-full w-full object-center"
          /> */}
          <MediaPreviewTemplate item={item} styles="w-full" />
        </button>
      ))}
    </div>
  )
}

export default GalleryBlockView
