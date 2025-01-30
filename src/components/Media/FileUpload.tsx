import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import GalleryFileView from './GalleryFileView'
import { mediaAPI } from '../../lib/api'
import { useToast } from 'src/lib/use-toast'
import MediaPreviewTemplate from './MediaPreviewTemplate'
import { FileThumbnailInterface } from 'src/types/types'

interface FileUploadProps {
  setIsOpen: (arg0: boolean) => void
  onFetching: (val: boolean) => void
}

export const FileUpload = (props: FileUploadProps) => {
  const emptyFileTitles = { index: 0, val: '' }
  const emptyFileThumbnails = { index: 0, file: null }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [paths, setPaths] = useState<{ url: string; type: string }[]>([])
  const [files, setFiles] = useState<File[] | null>(null)
  const [filesTitles, setFilesTitles] = useState<{ index: number; val: string }[]>([
    emptyFileTitles,
  ])
  const [filesThumbnails, setFilesThumbnails] = useState<FileThumbnailInterface[]>([
    emptyFileThumbnails,
  ])
  const [errorMessage] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<number | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { toast } = useToast()

  useEffect(() => {
    props.onFetching(isFetching)
  }, [isFetching])

  const handleSetFileData = (files: File[]) => {
    setFiles(files)
    setPaths(
      files.map((file) => {
        return { url: URL.createObjectURL(file), type: file.type.split('/')[0] }
      }),
    )
  }

  const handleSetFilesTitles = (title: string, index: number) => {
    setFilesTitles((prevState) => {
      const updatedState = prevState.map((item) =>
        item.index === index ? { ...item, val: title } : item,
      )
      const indexExists = updatedState.some((item) => item.index === index)
      return indexExists ? updatedState : [...updatedState, { index, val: title }]
    })
  }

  const handleSetFilesThumbnails = (thumbnail: File, index: number) => {
    setFilesThumbnails((prevState) => {
      const updatedState = prevState.map((item) =>
        item.index === index ? { ...item, file: thumbnail } : item,
      )
      const indexExists = updatedState.some((item) => item.index === index)
      return indexExists ? updatedState : [...updatedState, { index, file: thumbnail }]
    })
  }

  const handleSelectFile = (item: number, deleteItem: boolean) => {
    setSelectedFile(!deleteItem ? item : null)
  }

  const handleDeleteFiles = () => {
    setFiles(null)
    setSelectedFile(null)
    setPaths([])
    setFilesTitles([emptyFileTitles])
    setFilesThumbnails([emptyFileThumbnails])
  }

  const handleUploadFiles = () => {
    if (files !== null) {
      setIsFetching(true)
      // eslint-disable-next-line array-callback-return
      files.map((el, index) => {
        const title = filesTitles.filter((el) => el.index === index)
        const thumbnail = filesThumbnails.filter((el) => el.index === index)
        const formData = new FormData()
        formData.append('file', el)
        formData.append('title', title[0] !== undefined && title[0].val ? title[0].val : '')
        thumbnail &&
          thumbnail[0] !== undefined &&
          thumbnail[0].file &&
          formData.append('thumbnail', thumbnail[0].file)
        mediaAPI.uploadFiles(formData).then((res) => {
          if (res.status === 200) {
            toast({
              title: 'Success!',
              description: `${res.data.data.title} uploaded with ID: ${res.data.data.id}`,
            })
            if (index + 1 === files.length) {
              setTimeout(() => {
                setIsFetching(false)
                handleDeleteFiles()
                props.setIsOpen(false)
              }, 1000)
            }
          } else {
            toast({
              title: 'Error!',
              description: 'Something went wrong',
              variant: 'destructive',
            })
          }
        })
      })
    }
  }

  const onDrop = useCallback((acceptedFiles: any) => {
    handleSetFileData(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/png': ['.jpeg', '.png', '.jpg', '.gif', '.ico', '.webp', '.bmp', '.avif'],
      'audio/mp3': ['.mp3', '.m4a', '.ogg', '.wav'],
      'video/avi': ['.avi', '.mpg', '.mov', '.mp4', '.m4v', '.ogv', '.wmv', '.3gp', '.3g2'],
      'document/pdf': [
        '.doc',
        '.docx',
        '.odt',
        '.pdf',
        '.psd',
        '.ppt',
        '.pptx',
        '.pps',
        '.ppsx',
        '.xls',
        '.xlsx',
      ],
      'text/txt': ['.txt', '.csv'],
      'archive/zip': ['.zip', '.gz', '.rar'],
      'apple/doc': ['.keynote', '.numbers', '.pages'],
    },
    onDrop,
  })

  return (
    <>
      <div className="grid md:grid-cols-2 gap-8 mt-14">
        <div className="w-full">
          {!files && (
            <div className="flex w-full flex-col items-center justify-center py-2">
              <section className="flex w-full flex-col items-center justify-center gap-y-2">
                <div
                  {...getRootProps({ className: 'dropzone' })}
                  className="flex w-full flex-col items-center justify-center gap-y-2 rounded-[4px] border border-dashed border-tertiary-grey-stone bg-background-seasalt py-2 text-center text-tertiary-grey-dim"
                >
                  <input {...getInputProps()} />
                  <p className="cursor-pointer text-center text-base ">
                    Drag your file here
                    <br /> <u>or upload it</u>
                  </p>
                  <p className="text-xs leading-5">For multiple files, please use a .zip file</p>
                </div>
                <p className="text-xs leading-5 text-tertiary-grey-dim">
                  Max. upload file size 2GB
                </p>
                {errorMessage && <p className="text-xs leading-5 text-red-500">{errorMessage}</p>}
              </section>
            </div>
          )}

          {files?.length === 1 && <MediaPreviewTemplate item={paths[0]} styles="w-full" />}
        </div>
        {files?.length === 1 && (
          <div className="w-full flex flex-col gap-y-2">
            <div>
              <label className="mb-2 block">Image Caption</label>
              <div className="w-full">
                <TextInput
                  value={filesTitles !== undefined ? filesTitles[0].val : ''}
                  handleChange={(value) => handleSetFilesTitles(value, 0)}
                  placeholder="Image Caption"
                  className="w-full block !border-[#67676B] rounded-lg !leading-5"
                />
              </div>
            </div>
            {/* {files[0].type.split('/')[0] === 'video' && (
              <AddVideoThumbnail
                file={filesThumbnails.find((item) => item.index === 0) ?? null}
                setThumbnail={(value: File) => handleSetFilesThumbnails(value, 0)}
              />
            )} */}
          </div>
        )}
      </div>

      {files && files?.length > 1 && (
        <div>
          <GalleryFileView
            currentItems={paths}
            handleSelectFile={handleSelectFile}
            fileTitles={filesTitles}
            onSetFileTitles={handleSetFilesTitles}
            selectedFile={selectedFile}
            filesThumbnails={filesThumbnails}
            onSetFileThumbnails={handleSetFilesThumbnails}
          />
        </div>
      )}

      <div>
        <div className="flex sm:flex-row flex-col gap-4 justify-between mt-6 sm:mt-12">
          <Button
            variant={'outline'}
            onClick={handleDeleteFiles}
            className="px-10"
            disabled={files === null || isFetching}
          >
            Delete file{files && files?.length > 1 ? 's' : ''}
          </Button>
          <Button
            onClick={handleUploadFiles}
            className="px-10"
            disabled={files === null || isFetching}
          >
            {!isFetching ? 'Save' : 'Loading...'}
          </Button>
        </div>
      </div>
    </>
  )
}
