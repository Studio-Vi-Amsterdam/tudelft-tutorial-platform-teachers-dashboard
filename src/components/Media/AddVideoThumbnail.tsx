import React, { useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import MediaPreviewTemplate from './MediaPreviewTemplate'
import { FileThumbnailInterface } from 'src/types/types'

interface AddVideoThumbnailProps {
  file: FileThumbnailInterface | null
  setThumbnail: (value: File) => void
}

const AddVideoThumbnail = (props: AddVideoThumbnailProps) => {
  const { file, setThumbnail } = props
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png'],
    },
    maxFiles: 1,
  })
  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setThumbnail(acceptedFiles[0])
    }
  }, [acceptedFiles])

  return (
    <div className="w-9/12 mt-4">
      <label className="mb-2 block">Thumbnail</label>
      <div className="w-full flex flex-row gap-x-2">
        {file && file.file ? (
          <MediaPreviewTemplate
            item={{ url: URL.createObjectURL(file.file), type: 'image' }}
            styles="w-1/2"
          />
        ) : (
          <></>
        )}
        <div className="flex w-1/2 bg-tertiary-grey-silver flex-col items-center justify-center border border-dashed border-tertiary-grey-stone gap-y-2">
          <div
            {...getRootProps({})}
            className="flex w-full px-4 flex-col items-center justify-center gap-y-2 rounded py-4 text-center text-tertiary-grey-dim"
          >
            <input {...getInputProps()} />
            <p className="cursor-pointer text-center text-base">
              Drag n drop image here, or click to <br />
              {file ? 'change' : 'set'} thumbnail
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddVideoThumbnail
