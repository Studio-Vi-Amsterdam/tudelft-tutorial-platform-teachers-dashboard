import React, { useEffect, useState } from 'react'
import Dropzone from 'react-dropzone'
import { setFileElement } from 'src/redux/features/editorSlice'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { QuizElementProps } from 'src/types/types'
import TextInput from '../ui/TextInput'

const FileElement = (props: QuizElementProps) => {
  const [fileData, setFileData] = useState<File | null>(null)

  const handleSetFileData = (arg0: any) => {
    setFileData(arg0)
  }

  const [fileTitle, setFileTitle] = useState<string>('')
  const [fileDescription, setFileDescription] = useState<string>('')
  const fileState = useAppSelector((state: RootState) =>
    props.block === 'tutorialElements' && props.listIndex !== undefined
      ? state.editor.tutorialTop.elements[props.listIndex].file
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
      console.log(fileState)

      setFileData(fileState.file)
      setFileTitle(fileState.title)
      setFileDescription(fileState.description)
    }
  }, [fileState])

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      setFileElement({
        block: props.block,
        index: props.listIndex,
        nestedIndex: props.chapterIndex,
        subchapterIndex: props.subchapterIndex,
        file: {
          file: fileData,
          description: fileDescription,
          title: fileTitle,
        },
      }),
    )
  }, [fileData, fileTitle, fileDescription])

  const [errorMessage] = useState<string>('')
  return (
    <div className="flex w-full flex-col gap-y-2">
      {!fileData ? (
        <div className="flex w-full flex-col items-center justify-center py-2">
          <Dropzone onDrop={(acceptedFiles) => handleSetFileData(acceptedFiles[0])}>
            {({ getRootProps, getInputProps }) => (
              <section className="flex w-full flex-col items-center justify-center gap-y-2">
                <div
                  {...getRootProps()}
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
            )}
          </Dropzone>
        </div>
      ) : (
        <div className="mb-8 mt-4 flex w-full flex-row items-center justify-between">
          <div>File</div>
          <div className="relative flex w-9/12 flex-col">
            <p className="text-sm leading-5">{fileData.name}</p>
            <p className="text-xs leading-5 text-tertiary-grey-dim">
              Sample files to practice with ({fileData.type.split('/')[1].toUpperCase()},{' '}
              {(fileData.size / 1048576).toFixed(2)}MB)
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-y-8">
        <div className="flex w-full flex-row items-center justify-between">
          <div>Title</div>
          <div className="w-9/12">
            <TextInput
              value={fileTitle}
              handleChange={setFileTitle}
              placeholder="Title"
              className="!text-base !p-4"
            />
          </div>
        </div>
        <div className="flex w-full flex-row items-center justify-between">
          <div>Description</div>
          <div className="w-9/12">
            <TextInput
              value={fileDescription}
              handleChange={setFileDescription}
              placeholder="Description"
              className="!text-base !p-4"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default FileElement
