import React, { useState } from 'react'
import { MediaObjectInterface, SubchapterLayout, ThumbnailInterface } from 'src/types/types'
import { Button } from '../ui/Button'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { MediaLibrary } from '../Media/MediaLibrary'
import { useAppDispatch } from 'src/redux/hooks'
import { setVideoThumbnail } from 'src/redux/features/editorSlice'

interface ThumbProps {
  video: MediaObjectInterface
  chapterIndex: number | undefined
  subchapterIndex: number | undefined
  listIndex: number
  layout?: SubchapterLayout
}

const SelectThumbnail = (props: ThumbProps) => {
  const dispatch = useAppDispatch()
  const selectedThumbnail = props.video.thumbnail
  const [selectedMedia, setSelectedMedia] = useState<ThumbnailInterface | undefined>(undefined)
  const [dialogOpened, setDialogOpened] = useState<boolean>(false)

  const handleSelectMedia = (item: ThumbnailInterface) => {
    if (selectedMedia === item) {
      setSelectedMedia(undefined)
    } else {
      setSelectedMedia(item)
    }
  }

  const handleSubmitMedia = () => {
    if (selectedMedia !== undefined) {
      dispatch(
        setVideoThumbnail({
          index: props.listIndex,
          thumbnail: selectedMedia,
          chapterIndex: props.chapterIndex,
          layout: props.layout,
        }),
      )
    }
    setDialogOpened(false)
  }

  const handleDeleteMedia = () => {
    dispatch(
      setVideoThumbnail({
        index: props.listIndex,
        thumbnail: {
          description: '',
          format: '',
          link: '',
          publishDate: '',
          title: '',
          type: 'image',
        },
        chapterIndex: props.chapterIndex,
        layout: props.layout,
      }),
    )
  }

  return (
    props.video && (
      <div className="w-full flex flex-col">
        <p className="font-semibold">Video Thumbnail</p>
        <div className="flex flex-row justify-between gap-x-2">
          {selectedThumbnail && selectedThumbnail.url ? (
            <div className="w-1/2">
              <img src={selectedThumbnail.url} />
            </div>
          ) : (
            <p>No thumbnail</p>
          )}
          <div className="flex flex-col w-1/2 gap-y-2">
            <Button onClick={() => setDialogOpened(true)}>
              {selectedThumbnail && selectedThumbnail.url ? 'Change' : 'Set'} Thumbnail
            </Button>
            {selectedThumbnail && (
              <Button variant={'outline'} onClick={handleDeleteMedia}>
                Delete Thumbnail
              </Button>
            )}
          </div>
        </div>
        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <DialogContent className=" max-w-5xl flex-col bg-white pt-20 w-[90%]">
            <MediaLibrary
              isPopup={true}
              itemsPerPage={8}
              selectedMedia={selectedMedia}
              handleSelectMedia={handleSelectMedia}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              handleMultipleSelect={() => {}}
              mediaToDelete={undefined}
              column="3"
              hideVideo={true}
            />
            <DialogFooter>
              <Button onClick={handleSubmitMedia} disabled={!selectedMedia}>
                <p>Save</p>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  )
}

export default SelectThumbnail
