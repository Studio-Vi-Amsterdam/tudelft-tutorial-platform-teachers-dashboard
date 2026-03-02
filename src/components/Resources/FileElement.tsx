import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CustomFileInterface } from '@/types/types'
import { mediaAPI } from '@/lib/api'
import { useToast } from '@/lib/use-toast'
import Preloader from '../ui/Preloader'

interface FileElementProps {
  file: CustomFileInterface | null
  onSetFile: (file: CustomFileInterface) => void
}

const FileElement = (props: FileElementProps) => {
  const [fileData, setFileData] = useState<CustomFileInterface | null>(props.file)
  const errValidationStyle = 'border border-red-500 rounded-xs'
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { toast } = useToast()

  const handleSetFileData = async (file: any) => {
    setIsFetching(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', '')
    await mediaAPI.uploadFiles(formData).then((res) => {
      if (res.status === 200) {
        setIsFetching(false)
        setFileData({
          id: res.data.data.id,
          url: res.data.data.url,
          isValid: !!res.data.data.id,
        })
        toast({
          title: 'Success!',
          description: `File uploaded with ID: ${res.data.data.id}`,
        })
      } else {
        setIsFetching(false)
        toast({
          title: 'Error!',
          description: 'Something went wrong',
          variant: 'destructive',
        })
      }
    })
  }

  useEffect(() => {
    if (fileData !== null) {
      props.onSetFile(fileData)
    }
  }, [fileData])

  const onDrop = useCallback((acceptedFiles: any) => {
    handleSetFileData(acceptedFiles[0])
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

  const [errorMessage] = useState<string>('')

  return (
    <div className="flex w-full flex-col gap-y-2">
      {!fileData?.id && !isFetching ? (
        <div className="flex w-full flex-col items-center justify-center py-2">
          <section className="flex w-full flex-col items-center justify-center gap-y-2">
            <div
              {...getRootProps({ className: 'dropzone' })}
              className={`${fileData?.isValid ? 'border border-dashed border-tertiary-grey-stone' : errValidationStyle} flex w-full flex-col items-center justify-center gap-y-2 rounded-[4px] bg-background-seasalt py-2 text-center text-tertiary-grey-dim`}
            >
              <input {...getInputProps()} />
              <p className="cursor-pointer text-center text-base ">
                Drag your file here
                <br /> <u>or upload it</u>
              </p>
              <p className="text-xs leading-5">For multiple files, please use a .zip file</p>
            </div>
            <p className="text-xs leading-5 text-tertiary-grey-dim">Max. upload file size 2GB</p>
            {errorMessage && <p className="text-xs leading-5 text-red-500">{errorMessage}</p>}
          </section>
        </div>
      ) : !isFetching && fileData ? (
        <div className="mb-8 mt-4 flex w-full flex-row items-center justify-between">
          <div>File</div>
          <div className="relative flex w-9/12 flex-col">
            <p className="text-sm leading-5">{fileData.url.split('/').pop()}</p>
          </div>
          <button onClick={() => setFileData(null)} className="text-sm text-red-600 hover:underline">Remove</button>
        </div>
      ) : (
        <div className="mb-8 mt-4 flex w-full flex-row items-center justify-between">
          <Preloader color="primary" />
        </div>
      )}
    </div>
  )
}

export default FileElement
