import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import PickMediaDialog from './PickMediaDialog'
import { AddMediaElementProps } from 'src/types/types'
import {
  setElementImage,
  setElementVideo,
  setSubchapterMedia,
} from 'src/redux/features/editorSlice'

const AddMediaElement = (props: AddMediaElementProps) => {
  const [dialogOpened, setDialogOpened] = useState<boolean>(false)

  const mediaDataState = useAppSelector((state: RootState) => {
    const { block, chapterIndex, subchapterIndex, layout, mediaType, listIndex } = props
    if (layout === undefined) {
      if (
        block === 'subchapterMedia' &&
        chapterIndex !== undefined &&
        subchapterIndex !== undefined &&
        layout !== undefined
      ) {
        return state.editor.chapters[chapterIndex].subchapters[subchapterIndex][mediaType]
      }

      if (block === 'chapterMedia' && chapterIndex !== undefined) {
        return state.editor.chapters[chapterIndex][mediaType]
      }

      if (block === 'tutorialElements' && listIndex !== undefined) {
        return state.editor.tutorialTop.elements[listIndex][mediaType]
      }

      if (block === 'chapterElements' && chapterIndex !== undefined && listIndex !== undefined) {
        return state.editor.chapters[chapterIndex].elements[listIndex][mediaType]
      }

      if (
        block === 'subchapterElements' &&
        chapterIndex !== undefined &&
        subchapterIndex !== undefined &&
        listIndex !== undefined
      ) {
        return state.editor.chapters[chapterIndex].subchapters[subchapterIndex].elements[listIndex][
          mediaType
        ]
      }
    } else {
      if (
        chapterIndex !== undefined &&
        listIndex !== undefined &&
        (layout === 'imageText' || layout === 'textImage')
      ) {
        const chapter = state.editor.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[listIndex] : undefined
        const layoutItem = element ? element[layout] : undefined

        return layoutItem ? layoutItem.image : undefined
      }
      if (
        chapterIndex !== undefined &&
        listIndex !== undefined &&
        (layout === 'videoText' || layout === 'textVideo')
      ) {
        const chapter = state.editor.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[listIndex] : undefined
        const layoutItem = element ? element[layout] : undefined

        return layoutItem ? layoutItem.video : undefined
      }
    }

    return undefined
  })

  const dispatch = useAppDispatch()

  const handleClearMedia = () => {
    if (
      props.layout !== undefined &&
      props.chapterIndex !== undefined &&
      props.listIndex !== undefined
    ) {
      dispatch(
        setSubchapterMedia({
          chapterIndex: props.chapterIndex,
          layout: props.layout,
          listIndex: props.listIndex,
          media: {
            format: '',
            link: '',
            url: '',
            publishDate: '',
            title: '',
            type: 'image',
          },
        }),
      )
    } else {
      if (props.mediaType === 'image') {
        dispatch(
          setElementImage({
            block: props.block,
            nestedIndex: props.chapterIndex,
            image: {
              format: '',
              link: '',
              url: '',
              publishDate: '',
              title: '',
              type: 'image',
            },
            index: props.listIndex,
            subchapterIndex: props.subchapterIndex,
          }),
        )
      } else if (props.mediaType === 'video') {
        dispatch(
          setElementVideo({
            block: props.block,
            nestedIndex: props.chapterIndex,
            video: {
              format: '',
              link: '',
              url: '',
              publishDate: '',
              title: '',
              type: 'video',
            },
            index: props.listIndex,
            subchapterIndex: props.subchapterIndex,
          }),
        )
      }
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-2">
      {mediaDataState && mediaDataState.url ? (
        <div className="w-full group relative">
          <div className="absolute flex justify-center items-center group-hover:opacity-100 opacity-0 transition-opacity delay-300 bg-[rgba(0,0,0,0.3)] w-full h-full top-0 left-0">
            <Button onClick={handleClearMedia}>Delete</Button>
          </div>
          <img src={mediaDataState.url} className="w-full object-cover" alt="" />
        </div>
      ) : (
        <div className="flex w-full items-center justify-center bg-tertiary-grey-silver py-16">
          <Button variant={'outline'} onClick={() => setDialogOpened(true)}>
            <div>+</div>
            <p>Select {props.mediaType} from media library</p>
          </Button>
        </div>
      )}
      <div className="flex flex-row">
        <input type="checkbox" />
        <p>Show subtitles</p>
      </div>
      <PickMediaDialog
        block={props.block}
        chapterIndex={props.chapterIndex}
        dialogOpened={dialogOpened}
        listIndex={props.listIndex}
        mediaType={props.mediaType}
        setDialogOpened={setDialogOpened}
        subchapterIndex={props.subchapterIndex}
        layout={props.layout}
      />
    </div>
  )
}

export default AddMediaElement
