import { UnknownAction } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from 'src/components/ui/AlertDialog'

interface MoveChapterArgs {
  index: number
  moveTo: 'up' | 'down'
  parentIndex?: number
}

interface DuplicateDeleteChapterArgs {
  index: number
  parentIndex?: number
}

interface ChapterMenuProps {
  index: number
  moveChapter: (arg0: MoveChapterArgs) => UnknownAction
  duplicateChapter: (arg0: DuplicateDeleteChapterArgs) => UnknownAction
  deleteChapter: (arg0: DuplicateDeleteChapterArgs) => UnknownAction
  parentIndex?: number
}

const ChapterMenu = (props: ChapterMenuProps) => {
  const { index } = props

  const chaptersLength = useAppSelector((state: RootState) => state.editor.chapters.length)

  const [openedMenu, setOpenedMenu] = useState<boolean>(false)

  const changeOpenState = () => {
    if (openedMenu) {
      setOpenedMenu(false)
    } else {
      setOpenedMenu(true)
    }
  }

  const [hiddenMenu, setHiddenMenu] = useState<boolean>(true)

  useEffect(() => {
    if (openedMenu) {
      setTimeout(() => setHiddenMenu(false), 300)
    } else {
      setTimeout(() => setHiddenMenu(true), 300)
    }
  }, [openedMenu])

  const dispatch = useAppDispatch()

  const moveChapterUp = () => {
    dispatch(
      props.moveChapter({
        index,
        moveTo: 'up',
        parentIndex: props?.parentIndex,
      }),
    )
  }

  const moveChapterDown = () => {
    dispatch(
      props.moveChapter({
        index,
        moveTo: 'down',
        parentIndex: props?.parentIndex,
      }),
    )
  }

  const handleDuplicateChapter = () => {
    dispatch(
      props.duplicateChapter({
        index,
        parentIndex: props?.parentIndex,
      }),
    )
  }

  const handleDeleteChapter = () => {
    dispatch(
      props.deleteChapter({
        index,
        parentIndex: props?.parentIndex,
      }),
    )
  }

  return (
    <section className="flex flex-row justify-end">
      <div className="flex w-fit flex-row rounded-[20px] bg-background-seasalt p-2">
        <div
          className={`${openedMenu ? 'translate-x-0 scale-x-100' : 'translate-x-1/2 scale-x-0'} ${
            hiddenMenu && 'hidden'
          } flex flex-row justify-between gap-x-2 border-r border-primary-skyBlue pr-1 transition-all delay-300 [&>button]:h-6 [&>button]:w-6 [&>button]:self-center [&>button]:bg-transparent [&>button]:bg-center [&>button]:bg-no-repeat [&>button]:text-black`}
        >
          <button
            className="bg-arrow"
            disabled={index + 1 >= chaptersLength}
            onClick={moveChapterDown}
          ></button>
          <button
            className="rotate-180 bg-arrow"
            disabled={index === 0}
            onClick={moveChapterUp}
          ></button>
          <button className="bg-duplicate" onClick={handleDuplicateChapter}></button>
          <AlertDialog>
            <AlertDialogTrigger>
              <div className="w-6 h-6 bg-delete bg-no-repeat bg-center self-center bg-transparent text-black"></div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete chapter from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteChapter}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center justify-center pl-1">
          <button
            className={`${
              openedMenu ? 'bg-cross' : 'bg-elipsis'
            } h-6 w-6 bg-cross bg-center bg-no-repeat transition-all duration-300`}
            onClick={changeOpenState}
          ></button>
        </div>
      </div>
    </section>
  )
}

export default ChapterMenu
