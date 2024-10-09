import React, { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import PickMediaDialog from './PickMediaDialog'
import { AddMediaElementProps } from 'src/types/types'
import {
  deleteMediaFromArray,
  setElementImage,
  setElementVideo,
  setFeaturedImage,
  setSubchapterMedia,
} from 'src/redux/features/editorSlice'
import MediaPreviewTemplate from '../Media/MediaPreviewTemplate'
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
} from '../ui/AlertDialog'

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
      if (block === 'tutorialMeta' && state.editor.meta.tutorialBelongs !== undefined) {
        return state.editor.meta.tutorialBelongs.image.value
      }
      if (block === 'softwareMeta' && state.editor.meta.softwareBelongs !== undefined) {
        return state.editor.meta.softwareBelongs.image.value
      }
      if (block === 'courseMeta' && state.editor.meta.courseBelongs !== undefined) {
        return state.editor.meta.courseBelongs.image.value
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

  const handleClearMedia = () => {
    mediaDataState && mediaDataState.id && dispatch(deleteMediaFromArray(mediaDataState.id))
    if (
      props.block === 'tutorialMeta' ||
      props.block === 'courseMeta' ||
      props.block === 'softwareMeta'
    ) {
      dispatch(
        setFeaturedImage({
          data: {
            format: '',
            link: '',
            url: '',
            isValid: true,
            publishDate: '',
            title: '',
            type: 'image',
            description: '',
            thumbnail: undefined,
          },
          block: props.block,
        }),
      )
    } else if (
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
            isValid: false,
            publishDate: '',
            title: '',
            type: 'image',
            description: '',
            thumbnail: undefined,
            hasZoom: false,
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
              isValid: true,
              publishDate: '',
              title: '',
              type: 'image',
              description: '',
              thumbnail: undefined,
              hasZoom: false,
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
              isValid: true,
              publishDate: '',
              title: '',
              type: 'video',
              description: '',
              thumbnail: undefined,
            },
            index: props.listIndex,
            subchapterIndex: props.subchapterIndex,
          }),
        )
      }
    }
    changeOpenState()
  }

  const handleChangeZoomFlag = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (
      props.layout !== undefined &&
      props.chapterIndex !== undefined &&
      props.listIndex !== undefined &&
      mediaDataState !== undefined
    ) {
      dispatch(
        setSubchapterMedia({
          chapterIndex: props.chapterIndex,
          layout: props.layout,
          listIndex: props.listIndex,
          media: {
            format: mediaDataState.format,
            link: mediaDataState.url ?? mediaDataState.link,
            url: mediaDataState.url ?? mediaDataState.link,
            publishDate: mediaDataState.publishDate,
            title: mediaDataState.title,
            isValid: true,
            type: 'image',
            description: mediaDataState.description,
            thumbnail: undefined,
            hasZoom: e.target.checked,
          },
        }),
      )
    } else if (mediaDataState !== undefined) {
      if (props.mediaType === 'image') {
        dispatch(
          setElementImage({
            block: props.block,
            nestedIndex: props.chapterIndex,
            image: {
              format: mediaDataState.format,
              link: mediaDataState.url ?? mediaDataState.link,
              url: mediaDataState.url ?? mediaDataState.link,
              publishDate: mediaDataState.publishDate,
              title: mediaDataState.title,
              isValid: true,
              type: 'image',
              description: mediaDataState.description,
              thumbnail: undefined,
              hasZoom: e.target.checked,
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
          <div className="absolute w-full h-full  top-0 left-0 group-hover:opacity-100 opacity-0 transition-opacity delay-300">
            <div
              className={
                'absolute left-1 top-1 z-40 flex w-fit flex-row rounded-[20px] border bg-tertiary-skyBlue-10 p-2'
              }
            >
              <div
                className={`${
                  openedMenu ? 'translate-x-0 scale-x-100 pr-1' : 'translate-x-1/2 scale-x-0 pr-0'
                } ${
                  hiddenMenu && 'hidden'
                } flex flex-row justify-between gap-x-2 border-r border-tertiary-skyBlue-20 transition-all delay-300 [&>button]:h-6 [&>button]:w-6 [&>button]:self-center [&>button]:bg-transparent [&>button]:bg-center [&>button]:bg-no-repeat [&>button]:text-black`}
              >
                <AlertDialog>
                  <AlertDialogTrigger>
                    <div className="w-6 h-6 bg-delete bg-no-repeat bg-center self-center bg-transparent text-black"></div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {props.mediaType}{' '}
                        from article.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleClearMedia}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
          </div>
          <MediaPreviewTemplate item={mediaDataState} styles="w-full" />
        </div>
      ) : mediaDataState ? (
        <div
          className={`${props.className === 'without-bg' ? '' : 'bg-tertiary-grey-silver py-16 justify-center'} ${!mediaDataState.isValid ? 'border border-red-500' : ''} flex w-full items-center `}
        >
          <Button variant={'outline'} onClick={() => setDialogOpened(true)}>
            <div className={props.className === 'without-bg' ? 'hidden' : ''}>+</div>
            <p>Select {props.mediaType} from media library</p>
          </Button>
        </div>
      ) : (
        <>No mediaDataState</>
      )}
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
      {props.mediaType === 'image' &&
        mediaDataState !== undefined &&
        props.block !== 'tutorialMeta' &&
        props.block !== 'courseMeta' &&
        props.block !== 'softwareMeta' && (
          <div className="flex flex-row gap-x-2">
            <input
              type="checkbox"
              className="w-6 h-6 border-2 bg-white rounded-sm border-stone after:!bg-primary-skyBlue after:!border-primary-skyBlue after:!opacity-90 after:!bg-check after:!bg-center after:!bg-no-repeat"
              checked={mediaDataState.hasZoom || false}
              onChange={(e) => handleChangeZoomFlag(e)}
            />

            <label>Has Image Zoom</label>
          </div>
        )}
    </div>
  )
}

export default AddMediaElement
