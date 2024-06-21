import React, { useState } from 'react'
import Dropzone from 'react-dropzone'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import GalleryFileView from './GalleryFileView'
import { mediaAPI } from '../../lib/api'

export const FileUpload = () => {
  const emptyFileTitles = { index: 0, val: '' }
  const [paths, setPaths] = useState<string[]>([])
  const [files, setFiles] = useState<File[] | null>(null)
  const [filesTitles, setFilesTitles] = useState<{ index: number; val: string }[]>([
    emptyFileTitles,
  ])
  const [errorMessage] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<number | null>(null)

  const handleSetFileData = (files: File[]) => {
    setFiles(files)
    setPaths(files.map((file) => URL.createObjectURL(file)))
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
      // eslint-disable-next-line array-callback-return
      files.map((el, index) => {
        const title = filesTitles.filter((el) => el.index === index)
        const formData = new FormData()
        formData.append('file', el)
        formData.append('title', title[0].val)
        mediaAPI.uploadFiles(formData).then((res) => {
          // TODO after success upload
          console.log(res)
        })
      })
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-8">
        <div className="w-full">
          {!files && (
            <div className="flex w-full flex-col items-center justify-center py-2">
              <Dropzone onDrop={(acceptedFiles) => handleSetFileData(acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <section
                    {...getRootProps()}
                    className="flex w-full h-80	bg-tertiary-grey-silver px-20 flex-col items-center h- justify-center gap-y-2"
                  >
                    <input {...getInputProps()} />
                    <div className="flex w-full flex-col items-center justify-center gap-y-2 rounded-[4px] border border-dashed border-tertiary-grey-stone py-2 text-center text-tertiary-grey-dim">
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

          {files?.length === 1 && <img src={paths[0]} className="w-full" alt="Placeholder" />}
        </div>
        {files?.length === 1 && (
          <div>
            <label>Title</label>
            <div className="w-9/12">
              <TextInput
                value={filesTitles !== undefined ? filesTitles[0].val : ''}
                handleChange={(value) => handleSetFilesTitles(value, 0)}
                placeholder="Title"
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
        <div className="flex gap-4 justify-between">
          <Button variant={'outline'} onClick={handleDeleteFiles}>
            Delete file{files && files?.length > 1 ? 's' : ''}
          </Button>
          <Button onClick={handleUploadFiles}>Save</Button>
        </div>
      </div>
    </>
  )
}
