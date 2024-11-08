import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { MediaObjectInterface, PickMediaDialogProps } from 'src/types/types'
import { MediaLibrary } from '../Media/MediaLibrary'
import { Button } from '../ui/Button'
import { useAppDispatch } from 'src/redux/hooks'
import {
  appendMediaToArray,
  setElementImage,
  setElementVideo,
  setFeaturedImage,
  setSubchapterMedia,
} from 'src/redux/features/editorSlice'
import { FileUpload } from '../Media/FileUpload'

const PickMediaDialog = (props: PickMediaDialogProps) => {
  const { dialogOpened, setDialogOpened } = props

  const [selectedMedia, setSelectedMedia] = useState<MediaObjectInterface | undefined>(undefined)
  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const handleSubmitMedia = () => {
    if (selectedMedia) {
      if (
        props.block === 'tutorialMeta' ||
        props.block === 'courseMeta' ||
        props.block === 'softwareMeta'
      ) {
        dispatch(setFeaturedImage({ data: selectedMedia, block: props.block }))
      } else if (
        props.layout !== undefined &&
        props.chapterIndex !== undefined &&
        props.listIndex !== undefined &&
        props.block !== 'tutorialMeta'
      ) {
        dispatch(
          setSubchapterMedia({
            chapterIndex: props.chapterIndex,
            layout: props.layout,
            listIndex: props.listIndex,
            media: selectedMedia,
          }),
        )
      } else {
        if (props.mediaType === 'image') {
          dispatch(
            setElementImage({
              block: props.block,
              nestedIndex: props.chapterIndex,
              image: selectedMedia,
              index: props.listIndex,
              subchapterIndex: props.subchapterIndex,
            }),
          )
        } else if (props.mediaType === 'video') {
          dispatch(
            setElementVideo({
              block: props.block,
              nestedIndex: props.chapterIndex,
              video: selectedMedia,
              index: props.listIndex,
              subchapterIndex: props.subchapterIndex,
            }),
          )
        }
      }
    }
    selectedMedia && selectedMedia.id && dispatch(appendMediaToArray(selectedMedia.id))
    setDialogOpened(false)
    setSelectedMedia(undefined)
  }

  const handleSelectMedia = (item: MediaObjectInterface) => {
    if (selectedMedia === item) {
      setSelectedMedia(undefined)
    } else {
      setSelectedMedia(item)
    }
  }

  return (
    <>
      <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
        <DialogContent className="flex max-w-5xl flex-col gap-y-5 bg-white pt-10 w-[90%]">
          <div>
            <Button
              onClick={() => setIsOpenUpload(true)}
              className="px-10 whitespace-nowrap max-sm:w-full flex justify-center"
            >
              Upload file
            </Button>
          </div>
          <MediaLibrary
            isPopup={true}
            itemsPerPage={9}
            selectedMedia={selectedMedia}
            handleSelectMedia={handleSelectMedia}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            handleMultipleSelect={() => {}}
            mediaToDelete={undefined}
            column="3"
            hideVideo={true}
            isFetching={isFetching}
            mediaTypeFilter={props.mediaTypeFilter}
          />
          <DialogFooter>
            <Button onClick={handleSubmitMedia} disabled={!selectedMedia}>
              <p>Save</p>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenUpload} onOpenChange={(val) => setIsOpenUpload(val)}>
        <DialogContent className="bg-white max-w-7xl !rounded p-8 sm:p-10">
          <FileUpload
            onFetching={setIsFetching}
            setIsOpen={(val: boolean) => setIsOpenUpload(val)}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PickMediaDialog
