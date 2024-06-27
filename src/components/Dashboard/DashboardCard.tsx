import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articlesAPI } from 'src/lib/api'
import { localFormatDate } from 'src/lib/localFormatDate'
import { deleteFromDrafts, deleteFromPublished } from 'src/redux/features/dashboardSlice'
import { useAppDispatch } from 'src/redux/hooks'
import { DashboardPublishedInterface } from 'src/types/types'
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
} from 'src/components/ui/AlertDialog'
import { useToast } from 'src/lib/use-toast'

interface DashboardCardProps {
  item: DashboardPublishedInterface
  draft?: boolean
}

const DashboardCard = (props: DashboardCardProps) => {
  const { item, draft } = props
  const { toast } = useToast()
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleClickEdit = async () => {
    navigate(`my-tutorials?type=${item.type}&id=${item.id}&status=${item.status}`)
  }
  const handleOpenDeletePopup = async () => {
    setIsFetching(true)
    const afterDeleteAction = () => {
      if (draft) {
        dispatch(deleteFromDrafts(item.id))
      } else {
        dispatch(deleteFromPublished(item.id))
      }
      toast({
        title: `${draft ? 'Draft' : 'Article'} with id: ${item.id} deleted`,
        description: 'Successfully!',
      })
      setIsFetching(false)
    }
    await articlesAPI
      .deleteArticle(item.type, item.id)
      .then((res) => res.status === 200 && afterDeleteAction())
  }
  const openPreviewTab = () => {
    item.previewLink && window.open(item.previewLink, '_blank', 'noopener,noreferrer')
  }
  return (
    <div className="flex w-[calc(25%-18px)]  flex-col gap-y-4 rounded-[4px] bg-background-aliceBlue p-4">
      <div className="flex flex-row items-center justify-between">
        <span className="rounded-[4px] border border-secondary-cornYellow bg-tertiary-cornYellow px-2 py-[6px] text-xs capitalize leading-5">
          {item.type}
        </span>
        <div className=" flex flex-row gap-x-2 [&>button]:h-6 [&>button]:w-6 [&>button]:rounded-[4px] [&>button]:bg-white [&>button]:p-1">
          <button onClick={openPreviewTab}>
            <img src="/img/dashboardCard/view.svg" alt="" />
          </button>
          <button onClick={handleClickEdit}>
            <img src="/img/dashboardCard/edit.svg" alt="" />
          </button>
          <AlertDialog>
            <AlertDialogTrigger>
              <img src="/img/dashboardCard/delete.svg" alt="" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete tutorial from our
                  servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleOpenDeletePopup} disabled={isFetching}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          {/* <button> */}
          {/*  <img src="/img/dashboardCard/copy.svg" alt="" /> */}
          {/* </button> */}
        </div>
      </div>
      <div className="flex flex-col gap-y-6">
        <h4 className="text-xl leading-8">{item.title}</h4>
        <div className="flex flex-col gap-y-2 pb-16 [&>div]:flex [&>div]:flex-row">
          <div>
            <p className="text-primary-subtext w-20 text-left">Published</p>
            {localFormatDate(item.publish_date)}
          </div>
          <div>
            <p className="text-primary-subtext w-20 text-left">Last Edit</p>
            {'no data'}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard
