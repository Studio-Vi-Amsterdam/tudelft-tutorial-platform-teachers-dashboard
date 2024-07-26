import React, { useEffect, useState } from 'react'
import { DialogContent, DialogFooter } from '../ui/Dialog'
import { MediaObjectInterface } from 'src/types/types'
import MediaPreviewTemplate from './MediaPreviewTemplate'
import TextInput from '../ui/TextInput'
import { Button } from '../ui/Button'
import { mediaAPI } from 'src/lib/api'
import { useToast } from 'src/lib/use-toast'
// import ChangeVideoThumbnail from './ChangeVideoThumbnail'

interface FileEditProps {
  selectedMedia: MediaObjectInterface | undefined
  setSelectedMedia: (value: React.SetStateAction<MediaObjectInterface | undefined>) => void
  setMediaEditOpen: (value: React.SetStateAction<boolean>) => void
  onFetching: (val: boolean) => void
}

const FileEdit = (props: FileEditProps) => {
  const { selectedMedia, setSelectedMedia, setMediaEditOpen } = props
  const [file] = useState<File | null>(null)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { toast } = useToast()

  useEffect(() => {
    props.onFetching(isFetching)
  }, [isFetching])

  const sendMediaChangeRequest = (media: MediaObjectInterface) => {
    mediaAPI.updateMedia(media).then((res) => {
      setIsFetching(false)
      if (res.status === 200) {
        toast({
          title: 'Success!',
          description: selectedMedia && `File with ID: ${selectedMedia.id} updated!`,
        })
        setMediaEditOpen(false)
        setSelectedMedia(undefined)
      } else {
        toast({
          title: 'Error!',
          description: 'Something went wrong',
          variant: 'destructive',
        })
      }
    })
  }
  const handleUpdateFile = () => {
    setIsFetching(true)
    if (selectedMedia) {
      if (file) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', `Thumbnail for video with ID: ${selectedMedia?.id}`)
        mediaAPI.uploadFiles(formData).then((res) => {
          sendMediaChangeRequest({ ...selectedMedia, thumbnail: res.data.data.url })
        })
      } else {
        sendMediaChangeRequest(selectedMedia)
      }
    }
  }

  return selectedMedia ? (
    <DialogContent className="bg-white max-w-7xl !rounded p-8 sm:p-10">
      <div className="grid md:grid-cols-2 gap-8 mt-14">
        <div className="w-full">
          <MediaPreviewTemplate item={selectedMedia} styles="w-full" />
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <label className="mb-2 block">Title</label>
            <div className="w-full">
              <TextInput
                value={selectedMedia.title}
                handleChange={(value: string) =>
                  setSelectedMedia({
                    ...selectedMedia,
                    title: value,
                  })
                }
                placeholder="Title"
                className="w-full block !border-[#67676B] rounded-lg !leading-5"
              />
            </div>
          </div>
          {/* <div> */}
          {/*  <label className="mb-2 block">Description</label> */}
          {/*  <div className="w-full"> */}
          {/*    <TextInput */}
          {/*      value={selectedMedia.description} */}
          {/*      handleChange={(value: string) => */}
          {/*        setSelectedMedia({ */}
          {/*          ...selectedMedia, */}
          {/*          description: value, */}
          {/*        }) */}
          {/*      } */}
          {/*      placeholder="Description" */}
          {/*      className="w-full block !border-[#67676B] rounded-lg !leading-5" */}
          {/*    /> */}
          {/*  </div> */}
          {/* </div> */}
          {/* <ChangeVideoThumbnail selectedMedia={selectedMedia} setFile={setFile} /> */}
        </div>
      </div>
      <DialogFooter className="flex sm:flex-row flex-col gap-4 justify-between mt-6 sm:mt-12">
        <Button onClick={handleUpdateFile} className="px-10" disabled={isFetching}>
          {!isFetching ? 'Update' : 'Loading...'}
        </Button>
      </DialogFooter>
    </DialogContent>
  ) : (
    <></>
  )
}

export default FileEdit
