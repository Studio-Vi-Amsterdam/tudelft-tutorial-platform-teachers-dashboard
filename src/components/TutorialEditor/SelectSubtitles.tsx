import React, { useState } from 'react'
import { MediaObjectInterface, SubchapterLayout, ThumbnailInterface } from 'src/types/types'
import { Button } from '../ui/Button'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { MediaLibrary } from '../Media/MediaLibrary'
import { useAppDispatch } from 'src/redux/hooks'
import { setVideoSubtitles } from 'src/redux/features/editorSlice'
import { FileIcon } from '../ui/Icons'

interface ThumbProps {
  video: MediaObjectInterface
  chapterIndex: number | undefined
  subchapterIndex: number | undefined
  listIndex: number
  layout?: SubchapterLayout
}

const SelectSubtitles = (props: ThumbProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useAppDispatch()
  const selectedSubtitles = props.video.subtitles
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
        setVideoSubtitles({
          index: props.listIndex,
          subtitles: selectedMedia,
          chapterIndex: props.chapterIndex,
          layout: props.layout,
        }),
      )
    }
    setDialogOpened(false)
  }

  const handleDeleteMedia = () => {
    dispatch(
      setVideoSubtitles({
        index: props.listIndex,
        subtitles: {
          type: 'video',
          format: '',
          link: '',
          title: '',
          publishDate: '',
          isValid: true,
          description: '',
        },
        chapterIndex: props.chapterIndex,
        layout: props.layout,
      }),
    )
  }

  return (
    props.video && (
      <div className="w-full flex flex-col">
        <p className="font-semibold">Video Subtitles</p>
        <div className="flex flex-row justify-between mt-2 gap-x-2">
          {selectedSubtitles && selectedSubtitles.url ? (
            <div className="w-1/2 flex justify-start items-start">
              <div className="relative flex flex-col items-start gap-3 w-full">
                <FileIcon />
                {selectedSubtitles.url && (
                  <p className="text-primary-skyBlue font-medium break-all text-small">
                    {selectedSubtitles.url.split('/').pop()}
                  </p>
                )}
              </div>
            </div>
          ) : (
            <p>No subtitles</p>
          )}
          <div className="flex flex-col w-1/2 gap-y-2">
            <Button onClick={() => setDialogOpened(true)}>
              {selectedSubtitles && selectedSubtitles.url ? 'Change' : 'Set'} Subtitles
            </Button>
            {selectedSubtitles && (
              <Button variant={'outline'} onClick={handleDeleteMedia}>
                Delete Subtitles
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

export default SelectSubtitles
