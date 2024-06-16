import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import PickMediaDialog from './PickMediaDialog'
import { AddMediaElementProps } from 'src/types/types'

const AddMediaElement = (props: AddMediaElementProps) => {
  const [dialogOpened, setDialogOpened] = useState<boolean>(false)

  const mediaDataState = useAppSelector((state: RootState) =>
    props.block === 'subchapterMedia' &&
    props.chapterIndex !== undefined &&
    props.subchapterIndex !== undefined
      ? state.editor.chapters[props.chapterIndex].subchapters[props.subchapterIndex][
          props.mediaType
        ]
      : props.block === 'chapterMedia' && props.chapterIndex !== undefined
        ? state.editor.chapters[props.chapterIndex][props.mediaType]
        : props.block === 'tutorialElements' && props.listIndex !== undefined
          ? state.editor.tutorialTop.elements[props.listIndex][props.mediaType]
          : props.block === 'chapterElements' &&
              props.chapterIndex !== undefined &&
              props.listIndex !== undefined
            ? state.editor.chapters[props.chapterIndex].elements[props.listIndex][props.mediaType]
            : props.block === 'subchapterElements' &&
              props.chapterIndex !== undefined &&
              props.subchapterIndex !== undefined &&
              props.listIndex !== undefined &&
              state.editor.chapters[props.chapterIndex].subchapters[props.subchapterIndex].elements[
                props.listIndex
              ][props.mediaType],
  )

  return (
    <div className="flex w-full flex-col gap-y-2">
      {mediaDataState && mediaDataState.link ? (
        <div className="w-full">
          <img src={mediaDataState.link} className="w-full object-cover" alt="" />
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
      />
    </div>
  )
}

export default AddMediaElement
