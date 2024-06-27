import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import GalleryFileView from './GalleryFileView'
import { mediaAPI } from '../../lib/api'
import { useToast } from 'src/lib/use-toast'
import MediaPreviewTemplate from './MediaPreviewTemplate'

interface FileUploadProps {
  setIsOpen: (arg0: boolean) => void
  onFetching: (val: boolean) => void
}

export const FileUpload = (props: FileUploadProps) => {
  const emptyFileTitles = { index: 0, val: '' }
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [paths, setPaths] = useState<{ url: string; type: string }[]>([])
  const [files, setFiles] = useState<File[] | null>(null)
  const [filesTitles, setFilesTitles] = useState<{ index: number; val: string }[]>([
    emptyFileTitles,
  ])
  const [errorMessage] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<number | null>(null)
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

  const handleSelectFile = (item: number, deleteItem: boolean) => {
    setSelectedFile(!deleteItem ? item : null)
  }

  const handleDeleteFiles = () => {
    setFiles(null)
    setSelectedFile(null)
    setPaths([])
    setFilesTitles([emptyFileTitles])
  }

  const handleUploadFiles = () => {
    if (files !== null) {
      setIsFetching(true)
      // eslint-disable-next-line array-callback-return
      files.map((el, index) => {
        const title = filesTitles.filter((el) => el.index === index)
        const formData = new FormData()

        formData.append('file', el)
        formData.append('title', title[0].val)
        mediaAPI.uploadFiles(formData).then((res) => {
          if (res.status === 200) {
            toast({
              title: 'Success!',
              description: `${res.data.data.title} uploaded with ID: ${res.data.data.id}`,
            })
            if (index + 1 === files.length) {
              setIsFetching(false)
              handleDeleteFiles()
              props.setIsOpen(false)
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

  return (
    <>
      <div className="grid grid-cols-2 gap-8 mt-14">
        <div className="w-full">
          {!files && (
            <div className="flex w-full flex-col items-center justify-center py-2">
              <Dropzone onDrop={(acceptedFiles) => handleSetFileData(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section
                    {...getRootProps()}
                    className="flex w-full h-80	bg-tertiary-grey-silver px-20 flex-col items-center h-96 justify-center gap-y-2"
                  >
                    <input {...getInputProps()} />
                    <div className="flex w-full flex-col items-center justify-center gap-y-2 rounded border border-dashed border-tertiary-grey-stone py-4 text-center text-tertiary-grey-dim">
                      <p className="cursor-pointer text-center text-base ">
                        Drag your file here
                        <br /> <u>or upload it</u>
                      </p>
                    </div>
                    <p className="text-xs leading-5 text-tertiary-grey-dim">
                      Max. upload file size 2GB
                    </p>
                    {errorMessage && (
                      <p className="text-xs leading-5 text-red-500">{errorMessage}</p>
                    )}
                  </section>
                )}
              </Dropzone>
            </div>
          )}

          {files?.length === 1 && <MediaPreviewTemplate item={paths[0]} styles="w-full" />}
        </div>
        {files?.length === 1 && (
          <div>
            <label className="mb-2 block">Title</label>
            <div className="w-full">
              <TextInput
                value={filesTitles !== undefined ? filesTitles[0].val : ''}
                handleChange={(value) => handleSetFilesTitles(value, 0)}
                placeholder="Title"
                className="w-full block !border-[#67676B] rounded-lg !leading-5"
              />
            </div>
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
          />
        </div>
      )}

      <div>
        <div className="flex gap-4 justify-between mt-12">
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
