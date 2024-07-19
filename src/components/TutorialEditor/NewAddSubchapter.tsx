import React, { useState } from 'react'
import { LayoutChapterType } from 'src/types/types'
import { Button } from '../ui/Button'
import { useAppDispatch } from 'src/redux/hooks'
import { addBlankSubchapterToEls } from 'src/redux/features/editorSlice'
import LayoutButton from './LayoutButton'

interface NewAddSubchapterProps {
  chapterIndex: number
}
const NewAddSubchapter = (props: NewAddSubchapterProps) => {
  const dispatch = useAppDispatch()
  const [isChapterCreating, setIsChapterCreating] = useState<boolean>(false)
  const [isAddChapterButtonShow, setIsAddChapterButtonShow] = useState<boolean>(true)

  const showChooseLayoutBlock = () => {
    setIsAddChapterButtonShow(false)
    setIsChapterCreating(true)
  }
  const subchapterLayout: LayoutChapterType[] = [
    '1 column',
    'image left',
    'image right',
    'video left',
    'video right',
  ]

  const createChapter = (layoutType: LayoutChapterType) => {
    setIsChapterCreating(false)
    setIsAddChapterButtonShow(true)
    if (props.chapterIndex !== undefined) {
      dispatch(
        addBlankSubchapterToEls({ chapterIndex: props.chapterIndex, chapterType: layoutType }),
      )
    }
  }
  return (
    <section
      className={`relative flex w-full flex-col gap-y-6 ${
        isAddChapterButtonShow
          ? ''
          : 'sm:py-20 pt-14 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver'
      }`}
    >
      {isChapterCreating && (
        <div className="flex flex-col gap-y-4 rounded-[8px] border-[2px] border-dashed border-tertiary-grey-dim bg-seasalt py-6">
          <h4 className="text-center">Choose layout</h4>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-10 gap-x-10 sm:gap-y-4 max-sm:items-center">
            {subchapterLayout.map((layoutType, index) => (
              <LayoutButton
                key={index}
                layoutType={layoutType}
                onClick={() => createChapter(layoutType)}
              />
            ))}
          </div>
        </div>
      )}

      {isAddChapterButtonShow && (
        <Button variant="dashed" onClick={showChooseLayoutBlock}>
          <div>+</div>
          <p>Add subchapter</p>
        </Button>
      )}
    </section>
  )
}

export default NewAddSubchapter
