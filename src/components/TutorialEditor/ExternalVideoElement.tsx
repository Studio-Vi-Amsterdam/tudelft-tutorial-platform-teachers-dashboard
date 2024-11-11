import React from 'react'
import { useAppDispatch } from 'src/redux/hooks'
import { ExternalVideoInterface } from 'src/types/types'
import { setExternalVideoTitle, setExternalVideoUrl } from 'src/redux/features/editorSlice'
import { convertToEmbedUrl } from '../../lib/regex/externalVideo'

interface ExternalVideoElementProps {
  index: number
  chapterIndex: number | undefined
  attributes: ExternalVideoInterface
}

const ExternalVideoElement = (props: ExternalVideoElementProps) => {
  const dispatch = useAppDispatch()

  const handleChangeTitle = (value: string) => {
    dispatch(setExternalVideoTitle({ chapterIndex: props.chapterIndex, index: props.index, value }))
  }

  const handleChangeUrl = (value: string) => {
    dispatch(
      setExternalVideoUrl({
        chapterIndex: props.chapterIndex,
        index: props.index,
        value: convertToEmbedUrl(value),
      }),
    )
  }

  return (
    <div className="py-10 flex flex-col gap-y-8">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="min-h-14 min-w-[104px] max-w-[104px]">Title</div>
        <div
          className={`w-9/12 ${!props.attributes.title.isValid ? 'border border-red-500 rounded-sm' : ''}`}
        >
          <input
            value={props.attributes.title.text}
            placeholder="Title"
            onChange={(e) => handleChangeTitle(e.target.value)}
            className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
          />
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="min-h-14 min-w-[104px] max-w-[104px]">Url:</div>
        <div
          className={`w-9/12 ${!props.attributes.url.isValid ? 'border border-red-500 rounded-sm' : ''}`}
        >
          <input
            value={props.attributes.url.text}
            placeholder="Url"
            onChange={(e) => handleChangeUrl(e.target.value)}
            className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
          />
        </div>
      </div>
    </div>
  )
}

export default ExternalVideoElement
