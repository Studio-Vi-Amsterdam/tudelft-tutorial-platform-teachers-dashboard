import React, { useEffect, useState } from 'react'
import { LayoutChapterType } from 'src/types/types'
import { Button } from '../ui/Button'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { addBlankSubchapterToEls } from 'src/redux/features/editorSlice'
import { RootState } from 'src/redux/store'

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
  const store = useAppSelector((state: RootState) => state.editor)
  useEffect(() => {
    console.log(store)
  }, [store])
  return (
    <section className="py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver relative flex w-full flex-col gap-y-6 ">
      {isChapterCreating && (
        <div className="flex bg-seasalt flex-col gap-y-4 rounded-[8px] border-[2px] border-dashed border-tertiary-grey-dim py-6">
          <h4 className="text-center">Choose layout</h4>
          <div className="flex flex-row flex-wrap justify-center gap-x-10 gap-y-4">
            {subchapterLayout.map((layoutType: LayoutChapterType, index: number) => (
              <button
                key={index}
                onClick={() => createChapter(layoutType)}
                className="flex w-1/4 flex-col items-start gap-y-1"
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
          <p>Add subchapter</p>
        </Button>
      )}
    </section>
  )
}

export default NewAddSubchapter
