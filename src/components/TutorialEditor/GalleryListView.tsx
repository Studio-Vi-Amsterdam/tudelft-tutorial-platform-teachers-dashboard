import React from 'react'
import { GalleryViewProps } from 'src/types/types'

const GalleryListView = (props: GalleryViewProps) => {
  const { currentItems, handleSelectMedia, selectedMedia } = props
  return (
    <>
      <div className=" flex w-full flex-row gap-x-6 border-b border-tertiary-grey-dim py-4">
        <div className="w-44">Preview</div>
        <div className="w-[calc(100%-600px)]">Image Title</div>
        <div className="w-44">Publish Date</div>
        <div className="w-44">Media Type</div>
      </div>
      <div className="flex w-full flex-col gap-y-4 [&>button]:flex [&>button]:flex-row [&>button]:justify-between">
        {currentItems.map((item, index) => (
          <button
            key={index}
            className={`${
              selectedMedia === item ? '' : 'before:!hidden'
            } relative w-full h-24 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50 [&>div]:flex [&>div]:flex-row [&>div]:justify-start`}
            onClick={() => handleSelectMedia(item)}
          >
            <img
              src={item.url}
              alt={item.title}
              className="w-44 h-full object-cover object-center"
            />
            <div className="w-[calc(100%-600px)]">{item.title}</div>
            {/* <div className="w-44">{localFormatDate(item.publishDate)}</div> */}
            {/* <div className="w-44">{item.format.toLocaleUpperCase() + ' ' + item.type}</div> */}
          </button>
        ))}
      </div>
    </>
  )
}

export default GalleryListView
