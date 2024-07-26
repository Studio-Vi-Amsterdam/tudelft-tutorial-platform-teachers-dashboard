import React from 'react'
import TextInput from '../ui/TextInput'
import MediaPreviewTemplate from './MediaPreviewTemplate'
import { FileThumbnailInterface } from 'src/types/types'
import AddVideoThumbnail from './AddVideoThumbnail'

interface GalleryFileViewProps {
  currentItems: { url: string; type: string }[]
  selectedFile: number | null
  onSetFileTitles: (title: string, index: number) => void
  fileTitles: { index: number; val: string }[]
  handleSelectFile: (index: number, deleteItem: boolean) => void
  filesThumbnails: FileThumbnailInterface[]
  onSetFileThumbnails: (thumbnail: File, index: number) => void
}
const GalleryFileView = (props: GalleryFileViewProps) => {
  const {
    currentItems,
    onSetFileTitles,
    fileTitles,
    selectedFile,
    handleSelectFile,
    filesThumbnails,
    onSetFileThumbnails,
  } = props

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 sm:gap-6 gap-1.5">
        {currentItems?.map((item, index) => {
          const isSelected = selectedFile === index
          return (
            <button
              key={index}
              className={`${
                isSelected ? '' : 'before:!hidden'
              } relative w-[calc(25%-1.5rem)] w-full before:absolute before:z-10 before:left-0 before:top-0 before:h-full before:w-full before:bg-black before:opacity-50`}
              onClick={() => handleSelectFile(index, isSelected)}
            >
              <MediaPreviewTemplate item={item} styles="w-full h-full object-cover" />
            </button>
          )
        })}
      </div>
      <p className="mt-6 text-stone">
        Please add a title to every image by selecting each from the overview.
      </p>
      {selectedFile !== null && (
        <div className="w-full flex flex-col">
          <div>
            <label>Title</label>
            <div className="w-9/12">
              <TextInput
                value={fileTitles[selectedFile]?.val ?? ''}
                handleChange={(value) => onSetFileTitles(value, selectedFile)}
                placeholder="Title"
              />
            </div>
          </div>
          {currentItems[selectedFile].type === 'video' && (
            <AddVideoThumbnail
              file={filesThumbnails.find((item) => item.index === selectedFile) ?? null}
              setThumbnail={(value: File) => onSetFileThumbnails(value, selectedFile)}
            />
          )}
        </div>
      )}
    </>
  )
}
export default GalleryFileView
