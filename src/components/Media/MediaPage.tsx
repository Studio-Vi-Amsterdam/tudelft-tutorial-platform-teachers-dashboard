import React, { useState } from 'react'
import { MediaLibrary } from './MediaLibrary'
import { Button } from '../ui/Button'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
import { FileUpload } from './FileUpload'
import { MediaObjectInterface } from 'src/types/types'
import { mediaAPI } from 'src/lib/api'
import { useToast } from 'src/lib/use-toast'

export const MediaPage = () => {
  const [isOpenUpload, setIsOpenUpload] = useState<boolean>(false)
  const [isOpenSelect, setIsOpenSelect] = useState<boolean>(false)
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const { toast } = useToast()
  const [mediaToDelete, setMediaToDelete] = useState<MediaObjectInterface[] | undefined>(undefined)
  const handleMultipleSelect = (item: MediaObjectInterface) => {
    setMediaToDelete((prevState) => {
      if (!Array.isArray(prevState)) {
        return [item]
      }

      const existingIndex = prevState.findIndex((media) => media.id === item.id)
      if (existingIndex !== -1) {
        const updatedMedia = [...prevState]
        updatedMedia.splice(existingIndex, 1)
        return updatedMedia
      } else {
        return [...prevState, item]
      }
    })
  }
  const handleDeleteFiles = async () => {
    setIsFetching(true)
    const handleAfterDelete = () => {
      setIsFetching(false)
      toast({
        title: 'Files deleted',
        description: 'Successfully!',
      })
      setMediaToDelete(undefined)
      setIsOpenSelect(false)
      setIsOpenDelete(false)
    }
    if (mediaToDelete !== undefined) {
      mediaToDelete.forEach((el) => {
        el.id && mediaAPI.deleteFile(el.id).then((res) => res.status === 200 && handleAfterDelete())
      })
    }
  }

  const handleFetching = (val: boolean) => {
    setIsFetching(val)
  }

  return (
    <main className="container mx-auto md:mb-24 md:mt-20 my-10 mb-16">
      <header className="md:flex justify-between items-end mb-10 sm:mb-20 gap-3">
        <div>
          <h1 className="font-RobotoSlab text-4xl sm:text-h2 font-light -tracking-1 mb-4">Media</h1>
          <p className="text-tertiary-grey-dim max-w-[495px]">
            Browse the published tutorials for content that might be useful for your new tutorial.
          </p>
        </div>
        <div className="flex gap-2 sm:gap-6 md:mt-0 mt-10">
          <Button
            variant={'outline'}
            onClick={isOpenSelect ? () => setIsOpenSelect(false) : () => setIsOpenSelect(true)}
            className="px-10 whitespace-nowrap max-sm:w-full flex justify-center"
          >
            {isOpenSelect ? 'Cancel' : 'Select files'}
          </Button>
          {isOpenSelect ? (
            <Button
              onClick={() => setIsOpenDelete(true)}
              disabled={mediaToDelete !== undefined && mediaToDelete.length === 0}
              className="px-10 whitespace-nowrap max-sm:w-full flex justify-center"
            >
              Delete
            </Button>
          ) : (
            <Button
              onClick={() => setIsOpenUpload(true)}
              className="px-10 whitespace-nowrap max-sm:w-full flex justify-center"
            >
              Upload file
            </Button>
          )}
        </div>
      </header>

      <MediaLibrary
        selectedMedia={undefined}
        selectMode={isOpenSelect}
        isFetching={isFetching}
        handleMultipleSelect={handleMultipleSelect}
        mediaToDelete={mediaToDelete}
        onFetching={handleFetching}
      />

      <Dialog open={isOpenUpload} onOpenChange={(val) => setIsOpenUpload(val)}>
        <DialogContent className="bg-white max-w-7xl !rounded p-8 sm:p-10">
          <FileUpload
            onFetching={handleFetching}
            setIsOpen={(val: boolean) => setIsOpenUpload(val)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
        <DialogContent className="bg-white max-w-[600px] !rounded p-10">
          <h3 className="sm:pt-16 pt-10 text-2xl sm:text-h3">
            Are you sure to delete selected files?
          </h3>
          <p className="text-subtext">
            If you delete this file you will not be able to recover it.
          </p>
          <DialogFooter className="mt-6 !justify-between gap-4">
            <Button
              onClick={() => setIsOpenDelete(false)}
              disabled={isFetching}
              variant={'outline'}
              className="px-10"
            >
              Cancel
            </Button>
            <Button onClick={() => handleDeleteFiles()} disabled={isFetching} className="px-10">
              {isFetching ? 'Deleting' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
