import React from 'react'
import { Dialog, DialogContent, DialogFooter } from '../ui/Dialog'
// import {
//   FilterIcon,
//   GalleryBlockViewIcon,
//   GalleryListViewIcon,
//   SearchIcon,
//   SortIcon,
// } from '../ui/Icons'
// import GalleryBlockView from './GalleryBlockView'
// import GalleryListView from './GalleryListView'
// import PaginationBar from './PaginationBar'
// import { Button } from '../ui/Button'
// import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
// import { RootState } from 'src/redux/store'
// import { setElementImage, setElementVideo } from 'src/redux/features/editorSlice'
import { AddMediaElementProps } from 'src/types/types'

interface PickMediaDialogProps extends AddMediaElementProps {
  dialogOpened: boolean
  setDialogOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const PickMediaDialog = (props: PickMediaDialogProps) => {
  const { dialogOpened, setDialogOpened } = props
  return (
    <Dialog open={dialogOpened} onOpenChange={setDialogOpened}>
      <DialogContent className="w-full max-w-5xl flex-col bg-white pt-20">
        <DialogFooter>
          {/* <Button onClick={handleSubmitMedia} disabled={!selectedMedia}> */}
          {/*  <p>Save</p> */}
          {/* </Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default PickMediaDialog
