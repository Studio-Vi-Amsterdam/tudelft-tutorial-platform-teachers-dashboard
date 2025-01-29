import React, { useState } from 'react'
import EditorLabel from '../ui/EditorLabel'
import { LayoutChapterType } from 'src/types/types'
import { Button } from '../ui/Button'
import { useAppDispatch } from 'src/redux/hooks'
import {
  addBlankChapter,
  addBlankSubchapter,
  addChapterElement,
} from 'src/redux/features/editorSlice'
import { RemoveLastSymbol } from '../../lib/capitalize'

interface AddChapterSectionProps {
  chapterIndex?: number
  isSubchapter?: boolean
  articleType?: string | null
}

const AddChapterSection = (props: AddChapterSectionProps) => {
  const [isChapterCreating, setIsChapterCreating] = useState<boolean>(false)
  const [isAddChapterButtonShow, setIsAddChapterButtonShow] = useState<boolean>(true)

  const dispatch = useAppDispatch()

  const showChooseLayoutBlock = () => {
    setIsAddChapterButtonShow(false)
    setIsChapterCreating(true)
  }

  const chapterLayout: LayoutChapterType[] = [
    '1 column',
    'image left',
    'image right',
    'video left',
    'video right',
  ]

  const createChapter = (layoutType: LayoutChapterType) => {
    setIsChapterCreating(false)
    setIsAddChapterButtonShow(true)
    if (props.isSubchapter && props.chapterIndex !== undefined) {
      dispatch(
        addBlankSubchapter({
          chapterIndex: props.chapterIndex,
          chapterType: layoutType,
        }),
      )
    } else {
      dispatch(addBlankChapter(layoutType))
      if (layoutType === '1 column') {
        dispatch(
          addChapterElement({
            val: { defaultVal: true },
            chapterIndex: props.chapterIndex ?? 0,
          }),
        )
      }
    }
  }

  return (
    <section
      className={`${
        props.isSubchapter
          ? ''
          : 'py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver'
      } relative flex w-full flex-col gap-y-6 `}
    >
      {!props.isSubchapter && (
        <EditorLabel>
          This is a chapter of your {RemoveLastSymbol(props.articleType ?? '')}.
        </EditorLabel>
      )}
      {isChapterCreating && (
        <div className="flex bg-seasalt flex-col gap-y-4 rounded-[8px] border-[2px] border-dashed border-tertiary-grey-dim py-6">
          <h4 className="text-center">Choose layout</h4>
          <div className="flex flex-col max-sm:items-center sm:flex-row flex-wrap justify-center gap-10 gap-x-10 sm:gap-y-4">
            {chapterLayout.map((layoutType: LayoutChapterType, index: number) => (
              <button
                key={index}
                onClick={() => createChapter(layoutType)}
                className="flex w-[184px] sm:w-1/4 flex-col items-start gap-y-1"
              >
                <div
                  className={`${
                    layoutType !== '1 column'
                      ? layoutType.split(' ')[1] === 'left'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                      : 'flex-col'
                  } flex w-full gap-x-2 gap-y-2 rounded-[4px] border-[2px] border-tertiary-grey-stone p-2`}
                >
                  {layoutType === '1 column' ? (
                    <>
                      <div className="h-8 w-full bg-tertiary-grey-stone"></div>
                      <div className="h-8 w-full bg-tertiary-grey-stone"></div>
                    </>
                  ) : (
                    <>
                      <div className="flex h-[72px] w-1/2 flex-col justify-between [&>div]:h-[6px] [&>div]:w-full [&>div]:bg-tertiary-grey-stone">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                      </div>
                      <div className="flex h-[72px] w-1/2 items-center justify-center bg-tertiary-grey-stone">
                        {layoutType.split(' ')[0] === 'video' && (
                          <div className="h-4 w-[13px] bg-play bg-center bg-no-repeat"></div>
                        )}
                      </div>
                    </>
                  )}
                </div>
                <p className="text-sm text-tertiary-grey-dim">{layoutType}</p>
              </button>
            ))}
          </div>
        </div>
      )}
      {isAddChapterButtonShow && (
        <Button variant={'dashed'} onClick={showChooseLayoutBlock}>
          <div>+</div>
          <p>Add {props.isSubchapter ? 'subchapter' : 'chapter'}</p>
        </Button>
      )}
    </section>
  )
}

export default AddChapterSection
