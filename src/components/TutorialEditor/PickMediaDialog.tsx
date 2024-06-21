import React, { useState } from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { AddMediaElementProps, MediaObjectInterface } from 'src/types/types'
import { MediaLibrary } from '../Media/MediaLibrary'
import { Button } from '../ui/Button'
import { useAppDispatch } from 'src/redux/hooks'
import {
  setElementImage,
  setElementVideo,
  setSubchapterMedia,
} from 'src/redux/features/editorSlice'

interface PickMediaDialogProps extends AddMediaElementProps {
  dialogOpened: boolean
  setDialogOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const PickMediaDialog = (props: PickMediaDialogProps) => {
  const { dialogOpened, setDialogOpened } = props
  const [selectedMedia, setSelectedMedia] = useState<MediaObjectInterface | undefined>(undefined)
  const dispatch = useAppDispatch()
  const handleSubmitMedia = () => {
    if (selectedMedia) {
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
    <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
      <DialogContent className="w-full max-w-5xl flex-col bg-white pt-20">
        <MediaLibrary
          isPopup={true}
          itemsPerPage={8}
          selectedMedia={selectedMedia}
          handleSelectMedia={handleSelectMedia}
        />
        <DialogFooter>
          <Button onClick={handleSubmitMedia} disabled={!selectedMedia}>
            <p>Save</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PickMediaDialog
