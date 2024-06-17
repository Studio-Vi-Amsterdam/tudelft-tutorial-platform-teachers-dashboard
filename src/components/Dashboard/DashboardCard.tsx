import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { articlesAPI } from 'src/lib/api'
import { localFormatDate } from 'src/lib/localFormatDate'
import { deleteFromPublished } from 'src/redux/features/dashboardSlice'
import { useAppDispatch } from 'src/redux/hooks'
import { DashboardPublishedInterface } from 'src/types/types'

interface DashboardCardProps {
  item: DashboardPublishedInterface
}

const DashboardCard = (props: DashboardCardProps) => {
  const { item } = props
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const handleClickEdit = async () => {
    navigate(`my-tutorials?type=${item.type}&id=${item.id}`)
  }
  const handleOpenDeletePopup = async () => {
    setIsFetching(true)
    const afterDeleteAction = () => {
      dispatch(deleteFromPublished(item.id))
      setIsFetching(false)
    }
    await articlesAPI
      .deleteArticle(item.type, item.id)
      .then((res) => res.status === 200 && afterDeleteAction())
  }
  return (
    <div className="flex w-[calc(25%-18px)]  flex-col gap-y-4 rounded-[4px] bg-background-aliceBlue p-4">
      <div className="flex flex-row items-center justify-between">
        <span className="rounded-[4px] border border-secondary-cornYellow bg-tertiary-cornYellow px-2 py-[6px] text-xs capitalize leading-5">
          {item.type}
        </span>
        <div className=" flex flex-row gap-x-2 [&>button]:h-6 [&>button]:w-6 [&>button]:rounded-[4px] [&>button]:bg-white [&>button]:p-1">
          <button>
            <img src="/img/dashboardCard/view.svg" alt="" />
          </button>
          <button onClick={handleClickEdit}>
            <img src="/img/dashboardCard/edit.svg" alt="" />
          </button>
          <button onClick={handleOpenDeletePopup} disabled={isFetching}>
            <img src="/img/dashboardCard/delete.svg" alt="" />
          </button>
          <button>
            <img src="/img/dashboardCard/copy.svg" alt="" />
          </button>
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
