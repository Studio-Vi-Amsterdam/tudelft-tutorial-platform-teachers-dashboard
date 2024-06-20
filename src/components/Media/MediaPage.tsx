import React, { useState } from 'react'
import { MediaLibrary } from './MediaLibrary'
import { Button } from '../ui/Button'
import { Dialog, DialogContent } from '../ui/Dialog'
import { FileUpload } from './FileUpload'

export const MediaPage = () => {
  const [isOpenUpload, setIsOpenUpload] = useState(false)
  return (
    <main className="container mx-auto mb-24 mt-20">
      <header className="flex justify-between items-end mb-20">
        <div>
          <h1 className="font-RobotoSlab text-h2 font-light -tracking-1 mb-2">Media</h1>
          <p>
            Browse the published tutorials for content that might be useful for your new tutorial.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant={'outline'}>Select files</Button>
          <Button onClick={() => setIsOpenUpload(true)}>Upload file</Button>
        </div>
      </header>

      <MediaLibrary />

      <Dialog open={isOpenUpload} onOpenChange={(val) => setIsOpenUpload(val)}>
        <DialogContent className="bg-white max-w-7xl">
          <FileUpload />
        </DialogContent>
      </Dialog>
    </main>
  )
}
