import React, { useState } from 'react'
import { useAppDispatch } from 'src/redux/hooks'
import { ExternalVideoInterface, ThumbnailInterface } from 'src/types/types'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { MediaLibrary } from '../Media/MediaLibrary'
import { Button } from '../ui/Button'
import {
  setExternalVideoThumbnail,
  setExternalVideoTitle,
  setExternalVideoUrl,
} from 'src/redux/features/editorSlice'
import { convertToEmbedUrl } from '../../lib/regex/externalVideo'

interface ExternalVideoElementProps {
  index: number
  chapterIndex: number | undefined
  attributes: ExternalVideoInterface
}

const ExternalVideoElement = (props: ExternalVideoElementProps) => {
  const [dialogOpened, setDialogOpened] = useState<boolean>(false)
  const [selectedMedia, setSelectedMedia] = useState<ThumbnailInterface | undefined>(undefined)

  const dispatch = useAppDispatch()

  const handleChangeTitle = (value: string) => {
    dispatch(setExternalVideoTitle({ chapterIndex: props.chapterIndex, index: props.index, value }))
  }

  const handleChangeUrl = (value: string) => {
    dispatch(
      setExternalVideoUrl({
        chapterIndex: props.chapterIndex,
        index: props.index,
        value: convertToEmbedUrl(value),
      }),
    )
  }

  const handleSelectThumbnail = (item: ThumbnailInterface) => {
    if (selectedMedia === item) {
      setSelectedMedia(undefined)
    } else {
      setSelectedMedia(item)
    }
  }

  const handleSubmitThumbnail = () => {
    if (selectedMedia !== undefined) {
      dispatch(
        setExternalVideoThumbnail({
          chapterIndex: props.chapterIndex,
          index: props.index,
          thumbnail: selectedMedia,
        }),
      )
    }
    setDialogOpened(false)
  }

  const handleDeleteThumbnail = () => {
    dispatch(
      setExternalVideoThumbnail({
        chapterIndex: props.chapterIndex,
        index: props.index,
        thumbnail: {
          description: '',
          format: '',
          link: '',
          isValid: true,
          publishDate: '',
          title: '',
          type: 'image',
        },
      }),
    )
  }

  return (
    <div className="py-10 flex flex-col gap-y-8">
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="min-h-14 min-w-[104px] max-w-[104px]">Title</div>
        <div
          className={`w-9/12 ${!props.attributes.title.isValid ? 'border border-red-500 rounded-sm' : ''}`}
        >
          <input
            value={props.attributes.title.text}
            placeholder="Title"
            onChange={(e) => handleChangeTitle(e.target.value)}
            className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
          />
        </div>
      </div>
      <div className="flex w-full flex-row items-center justify-between gap-2">
        <div className="min-h-14 min-w-[104px] max-w-[104px]">Url:</div>
        <div
          className={`w-9/12 ${!props.attributes.url.isValid ? 'border border-red-500 rounded-sm' : ''}`}
        >
          <input
            value={props.attributes.url.text}
            placeholder="Url"
            onChange={(e) => handleChangeUrl(e.target.value)}
            className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
          />
        </div>
      </div>
      <div className="w-full flex flex-col">
        <p className="font-semibold">Video Thumbnail</p>
        <div className="flex flex-row justify-between gap-x-2">
          {props.attributes.thumbnail && props.attributes.thumbnail.url ? (
            <div className="w-1/2">
              <img src={props.attributes.thumbnail.url} />
            </div>
          ) : (
            <p>No thumbnail</p>
          )}
          <div className="flex flex-col w-1/2 gap-y-2">
            <Button onClick={() => setDialogOpened(true)}>
              {props.attributes.thumbnail && props.attributes.thumbnail.url ? 'Change' : 'Set'}{' '}
              Thumbnail
            </Button>
            {props.attributes.thumbnail?.id && (
              <Button variant={'outline'} onClick={handleDeleteThumbnail}>
                Delete Thumbnail
              </Button>
            )}
          </div>
        </div>
        <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
          <DialogContent className=" max-w-5xl flex-col bg-white pt-20 w-[90%]">
            <MediaLibrary
              isPopup={true}
              itemsPerPage={9}
              selectedMedia={selectedMedia}
              handleSelectMedia={handleSelectThumbnail}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              handleMultipleSelect={() => {}}
              mediaToDelete={undefined}
              column="3"
              hideVideo={true}
            />
            <DialogFooter>
              <Button onClick={handleSubmitThumbnail} disabled={!selectedMedia}>
                <p>Save</p>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default ExternalVideoElement
