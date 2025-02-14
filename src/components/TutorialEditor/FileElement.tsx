import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { appendMediaToArray, setFileElement } from 'src/redux/features/editorSlice'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { CustomFileInterface, QuizElementProps } from 'src/types/types'
import TextInput from '../ui/TextInput'
import { mediaAPI } from 'src/lib/api'
import { useToast } from 'src/lib/use-toast'
import Preloader from '../ui/Preloader'

const FileElement = (props: QuizElementProps) => {
  const [fileData, setFileData] = useState<CustomFileInterface | null>(null)
  const errValidationStyle = 'border border-red-500 rounded-sm'
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { toast } = useToast()
  const [fileTitle, setFileTitle] = useState<string>('')
  const [fileDescription, setFileDescription] = useState<string>('')

  const dispatch = useAppDispatch()

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
        dispatch(appendMediaToArray(res.data.data.id))
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

  const fileState = useAppSelector((state: RootState) =>
    props.block === 'tutorialElements' && props.listIndex !== undefined
      ? state.editor.tutorialTop.elements[props.listIndex].file
      : props.block === 'tutorialBottomElements' && props.listIndex !== undefined
        ? state.editor.tutorialBottomContent[props.listIndex].file
        : props.block === 'chapterElements' &&
            props.chapterIndex !== undefined &&
            props.listIndex !== undefined
          ? state.editor.chapters[props.chapterIndex].elements[props.listIndex].file
          : props.block === 'subchapterElements' &&
            props.chapterIndex !== undefined &&
            props.subchapterIndex !== undefined &&
            props.listIndex !== undefined &&
            state.editor.chapters[props.chapterIndex].subchapters[props.subchapterIndex].elements[
              props.listIndex
            ].file,
  )

  useEffect(() => {
    if (fileState) {
      setFileData(fileState.file)
      setFileTitle(fileState.title.text)
      setFileDescription(fileState.description.text)
    }
  }, [fileState])

  useEffect(() => {
    if (fileData !== null) {
      console.log(fileDescription)
      dispatch(
        setFileElement({
          block: props.block,
          index: props.listIndex,
          nestedIndex: props.chapterIndex,
          subchapterIndex: props.subchapterIndex,
          file: {
            file: fileData,
            description: {
              text: fileDescription,
              isValid: fileDescription?.trim()?.length > 0,
            },
            title: { text: fileTitle, isValid: fileTitle?.trim()?.length > 0 },
          },
        }),
      )
    }
  }, [fileData, fileTitle, fileDescription])

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
        </div>
      ) : (
        <div className="mb-8 mt-4 flex w-full flex-row items-center justify-between">
          <Preloader color="primary" />
        </div>
      )}
      <div className="flex flex-col gap-y-8">
        <div className="flex w-full flex-row items-center justify-between">
          <div>Title</div>
          <div className="w-9/12">
            <TextInput
              value={fileTitle}
              handleChange={(e) => {
                setFileTitle(e)
              }}
              placeholder={isFetching || fileData === null ? 'First select the file' : 'Title'}
              className="!text-base !p-4"
              disabled={isFetching || fileData === null}
              notValid={fileState ? !fileState.title.isValid : true}
            />
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between">
          <div>Description</div>
          <div className="w-9/12">
            <TextInput
              value={fileDescription}
              handleChange={(e) => {
                setFileDescription(e)
              }}
              placeholder={
                isFetching || fileData === null ? 'First select the file' : 'Description'
              }
              disabled={isFetching || fileData === null}
              className="!text-base !p-4"
              notValid={fileState ? !fileState.description.isValid : true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileElement
