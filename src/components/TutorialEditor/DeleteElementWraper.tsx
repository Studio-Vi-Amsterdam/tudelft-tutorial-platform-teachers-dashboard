import React, { useEffect, useState } from 'react'
import { deleteElement, deleteMediaFromArray, moveElement } from 'src/redux/features/editorSlice'
import { useAppDispatch } from 'src/redux/hooks'
import { ElementProps } from 'src/types/types'
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

interface DeleteElementWraperProps extends ElementProps {
  children: React.ReactNode
  elementIndex: number
  styles?: string
  file?: number
}

const DeleteElementWraper = (props: DeleteElementWraperProps) => {
  const dispatch = useAppDispatch()

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

  const handleDeleteElement = () => {
    if (props.file) {
      dispatch(deleteMediaFromArray(props.file))
    }
    dispatch(
      deleteElement({
        block: props.block,
        chapterIndex: props.chapterIndex,
        elementIndex: props.elementIndex,
        subchapterIndex: props.subchapterIndex,
      }),
    )
  }

  const handleMoveElement = (position: 'up' | 'down') => {
    dispatch(
      moveElement({
        index: props.elementIndex,
        block: props.chapterIndex !== undefined ? 'chapter' : 'tutorialTop',
        position,
        chapterIndex: props.chapterIndex,
      }),
    )
  }

  return (
    <div className="relative h-full w-full">
      <div
        className={`${
          props.styles && props.styles
        } absolute right-1 top-1 z-10 flex w-fit flex-row rounded-[20px] border bg-background-seasalt p-2`}
      >
        <div
          className={`${
            openedMenu ? 'translate-x-0 scale-x-100 pr-1' : 'translate-x-1/2 scale-x-0 pr-0'
          } ${
            hiddenMenu && 'hidden'
          } flex flex-row justify-between gap-x-2 border-r border-primary-skyBlue transition-all delay-300 [&>button]:h-6 [&>button]:w-6 [&>button]:self-center [&>button]:bg-transparent [&>button]:bg-center [&>button]:bg-no-repeat [&>button]:text-black`}
        >
          <AlertDialog>
            <AlertDialogTrigger>
              <button className="w-6 h-6 bg-delete bg-no-repeat bg-center self-center bg-transparent text-black"></button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete element from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteElement}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <button className="bg-arrow" onClick={() => handleMoveElement('down')}></button>
          <button
            className="rotate-180 bg-arrow"
            disabled={props.elementIndex === 0}
            onClick={() => handleMoveElement('up')}
          ></button>
        </div>
        <div className={`${openedMenu ? 'pl-1' : ''} flex items-center justify-center `}>
          <button
            className={`${
              openedMenu ? 'bg-cross' : 'bg-elipsis'
            } h-6 w-6 bg-cross bg-center bg-no-repeat transition-all duration-300`}
            onClick={changeOpenState}
          ></button>
        </div>
      </div>
      {props.children}
    </div>
  )
}

export default DeleteElementWraper
