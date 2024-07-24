import React from 'react'
import { GalleryViewProps } from 'src/types/types'
import MediaPreviewTemplate from '../Media/MediaPreviewTemplate'

const GalleryListView = (props: GalleryViewProps) => {
  const { currentItems, handleSelectMedia, selectedMedia } = props
  return (
    <>
      <div className=" flex w-full flex-row gap-x-6 border-b border-tertiary-grey-dim py-4 justify-between max-md:hidden">
        <div className="w-44 text-subtext">Preview</div>
        <div className="lg:w-[calc(100%-600px)] w-[calc(100%-500px)] text-subtext">Image Title</div>
        <div className="lg:w-44 w-24 text-subtext">Publish Date</div>
        <div className="lg:w-44 w-24 text-subtext">Media Type</div>
      </div>
      <div className="flex w-full flex-col gap-y-4 [&>button]:flex [&>button]:flex-row [&>button]:justify-between sm:mb-14">
        {currentItems.map((item, index) => (
          <button
            key={index}
            className={`${selectedMedia === item ? '' : 'before:!hidden'} 
            ${props.selectMode ? 'after:w-6 after:h-6 after:absolute after:border after:bg-white after:rounded-sm after:border-primary-skyBlue after:top-2 after:right-2 after:z-10' : 'group '} 
          ${props.mediaToDelete !== undefined && props.mediaToDelete.includes(item) && 'after:!bg-primary-skyBlue after:!bg-check after:!bg-center after:!bg-no-repeat'}  
            relative w-full min-h-24 before:absolute before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50 before:z-10 [&>div]:flex max-md:gap-2`}
            onClick={
              props.selectMode
                ? () => props.handleMultipleSelect(item)
                : () => handleSelectMedia(item)
            }
          >
            {!props.selectMode && (
              <div className="absolute w-full h-full bg-[rgba(0,0,0,0.3)] opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                <div className="border-transparent bg-primary-skyBlue z-10 text-primary-white disabled:bg-tertiary-skyBlue-20 flex flex-row items-center justify-center gap-x-6 rounded-[4px] border px-6 py-3 [&>div]:text-2xl transition-colors duration-200 [&>div]:leading-6 [&>p]:text-base">
                  Edit
                </div>
              </div>
            )}
            <MediaPreviewTemplate item={item} styles="md:w-44 min-w-[112px] w-28" />
            <div className="flex justify-between md:flex-row flex-col max-md:gap-2 lg:w-[calc(100%-200px)] md:w-[calc(100%-224px)] w-full">
              <div className="lg:w-[calc(100%-400px)] md:w-[calc(100%-276px)] break-all text-left">
                {item.title}
              </div>
              <div className="lg:w-44 md:w-24 grid text-left max-md:grid-cols-2 gap-2">
                <span className="text-xs text-subtext md:hidden">Publish date</span>
                <span className="max-md:text-xs">09.02.2024</span>
              </div>
              <div className="lg:w-44 md:w-24 text-left grid max-md:grid-cols-2 gap-2">
                <span className="text-xs text-subtext md:hidden">Media type</span>
                <span className="max-md:text-xs">09.02.2024</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  )
}

export default GalleryListView
