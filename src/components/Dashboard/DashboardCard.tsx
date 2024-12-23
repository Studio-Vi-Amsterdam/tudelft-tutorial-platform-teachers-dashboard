import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articlesAPI } from 'src/lib/api'
import { localFormatDate } from 'src/lib/localFormatDate'
import {
  deleteFromArchived,
  deleteFromDrafts,
  deleteFromPublished,
} from 'src/redux/features/dashboardSlice'
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/Tooltip'
import { cn } from '../../lib/utils'

interface DashboardCardProps {
  item: DashboardPublishedInterface
  type: string
}

const DashboardCard = (props: DashboardCardProps) => {
  const { item, type } = props
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
      switch (type) {
        case 'draft':
          dispatch(deleteFromDrafts(item.id))
          break
        case 'archived':
          dispatch(deleteFromArchived(item.id))
          break
        default:
          dispatch(deleteFromPublished(item.id))
          break
      }
      toast({
        title: `Article with id: ${item.id} deleted`,
        description: 'Successfully!',
      })
      setIsFetching(false)
    }
    await articlesAPI
      .deleteArticle(item.type, item.id)
      .then((res) => res.status === 200 && afterDeleteAction())
  }
  const openPreviewTab = async () => {
    try {
      const response = await articlesAPI.getPreviewLink(item.type, item.id)
      response.data &&
        response.data.preview_link &&
        window.open(response.data.preview_link, '_blank', 'noopener,noreferrer')
    } catch (error) {
      console.error(`Error fetching preview link for ${type} with id ${item.id}:`, error)
      return null
    }
  }

  const users = [
    {
      first_name: 'Oleksandr',
      last_name: 'Moroziuk',
      email: 'omarmaduk@gmail.com',
    },
    {
      first_name: 'Taras',
      last_name: 'Chornata',
      email: 'omarmaduk@gmail.com',
    },
  ]

  return (
    <div className="flex  flex-col gap-y-4 rounded-[4px] bg-background-aliceBlue p-4">
      <div className="flex flex-row items-center justify-between">
        <span className="rounded-[4px] border border-secondary-cornYellow bg-tertiary-cornYellow px-2 py-[1px] text-xs capitalize leading-5">
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
          <div className="text-sm">
            <p className="text-[#666666] w-20 text-left text-sm">Published</p>
            {localFormatDate(item.publish_date)}
          </div>
          <div className="text-sm">
            <p className="text-[#666666] w-20 text-left text-sm">Last Edit</p>
            {'no data'}
          </div>
          <div className="text-sm items-center flex">
            <p className="text-[#666666] w-20 text-left text-sm">Editor(s):</p>
            <TooltipProvider delayDuration={0}>
              {users.map((el, i) => (
                <Tooltip key={i + el.first_name}>
                  <TooltipTrigger className={cn({ 'ml-[-8px]': i > 0 }, `z-[${100 - i}]`)}>
                    <div className="w-8 h-8 flex text-[11px] items-center justify-center border text-white rounded-full bg-[#0C2340] border-[#EFF1F3]">
                      {el.first_name.substring(0, 1)}
                      {el.last_name.substring(0, 1)}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent align="center" side="bottom" className="avatar-tooltip">
                    <div className="bg-[#525252] relative p-[6px] rounded-[4px]">
                      {el.first_name} {el.last_name}
                      <span className="arrow absolute left-[50%]">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="11"
                          height="7"
                          viewBox="0 0 11 7"
                          fill="none"
                        >
                          <path
                            d="M-9.53674e-07 7L11 7L7.14808 1.39721C6.35339 0.24129 4.64661 0.24129 3.85192 1.39721L-9.53674e-07 7Z"
                            fill="#525252"
                          />
                        </svg>
                      </span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardCard
