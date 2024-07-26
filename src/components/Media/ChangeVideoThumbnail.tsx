import React, { useEffect, useState } from 'react'
import { MediaObjectInterface } from 'src/types/types'
import MediaPreviewTemplate from './MediaPreviewTemplate'
import { useDropzone } from 'react-dropzone'

interface ChangeVideoThumbnailProps {
  selectedMedia: MediaObjectInterface | undefined
  setFile: (value: React.SetStateAction<File | null>) => void
}

const ChangeVideoThumbnail = (props: ChangeVideoThumbnailProps) => {
  const { selectedMedia, setFile } = props
  const [path, setPath] = useState<string | null>(null)

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/jpeg': ['.jpeg', '.png'],
    },
    maxFiles: 1,
  })

  useEffect(() => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0])
      setPath(URL.createObjectURL(acceptedFiles[0]))
    }
  }, [acceptedFiles])

  return selectedMedia && selectedMedia.type === 'video' ? (
    <div>
      <label className="mb-2 block">Thumbnail</label>
      <div className="w-full flex flex-row gap-x-2">
        {selectedMedia.thumbnail ? (
          <MediaPreviewTemplate
            item={{ url: selectedMedia.thumbnail, type: 'image' }}
            styles="w-1/2"
          />
        ) : path ? (
          <MediaPreviewTemplate item={{ url: path, type: 'image' }} styles="w-1/2" />
        ) : (
          <p className="w-1/2 flex items-center justify-start font-semibold">No Thumbnail there</p>
        )}
        <div className="flex w-1/2 bg-tertiary-grey-silver flex-col items-center justify-center border border-dashed border-tertiary-grey-stone gap-y-2">
          <div
            {...getRootProps({})}
            className="flex w-full px-4 flex-col items-center justify-center gap-y-2 rounded py-4 text-center text-tertiary-grey-dim"
          >
            <input {...getInputProps()} />
            <p className="cursor-pointer text-center text-base">
              Drag n drop image here, or click to <br />
              {selectedMedia.thumbnail ? 'change' : 'set'} thumbnail
            </p>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  )
}

export default ChangeVideoThumbnail
