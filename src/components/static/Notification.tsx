import { Popover, PopoverContent, PopoverTrigger } from '../ui/Popover'
import React, { useCallback, useEffect, useState } from 'react'
import { getUserSymbols } from '../../lib/getUserSymbols'
import { cn } from '../../lib/utils'
import { userAPI } from '../../lib/api'
import { FeedbackSuggestion } from '../TutorialEditor/Feedback'
import { formatRelativeTime } from '../../lib/timeFormat'
import { useAuth } from '../../lib/AuthContext'

export const Notification = () => {
  const [suggestion, setSuggestion] = useState<FeedbackSuggestion[]>([])
  const { userId } = useAuth()
  console.log(userId)
  const getSuggestion = useCallback(async () => {
    try {
      const res: any = await userAPI.getSuggestion(11)
      setSuggestion(res.items)
    } catch (e) {
      console.error('Error getting suggestion by userID: ', e)
    }
  }, [])

  useEffect(() => {
    getSuggestion()
  }, [])

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className="sm:ml-10 flex items-center justify-between ">
            <div className=" flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-tertiary-grey-silver text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M6 19V10C6 6.68629 8.68629 4 12 4V4C15.3137 4 18 6.68629 18 10V19M6 19H18M6 19H4M18 19H20"
                  stroke="#292929"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M11 22L13 22"
                  stroke="#292929"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="3" r="1" stroke="#292929" />

                {suggestion.length > 0 && (
                  <circle
                    cx="18"
                    cy="6"
                    r="3.75"
                    fill="#EC4242"
                    stroke="#E5E5E5"
                    strokeWidth="0.5"
                  />
                )}
              </svg>
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent className="flex max-h-[19rem] gap-y-3 overflow-y-auto flex-col justify-between items-start ">
          <p className="text-tertiary-grey-dim text-sm">
            <b>Suggestions</b>
          </p>
          {suggestion.map((el, i) => {
            return (
              <div
                key={i + el.articleId}
                className={cn(
                  { 'border-b border-tertiary-grey-stone': i !== suggestion.length - 1 },
                  'flex pb-2 items-start gap-2 justify-between',
                )}
              >
                <div className="min-w-[24px] w-6 h-6 flex text-[12px] items-center justify-center bg-secondary-navy text-white rounded-full">
                  {getUserSymbols(el.firstName, el.lastName)}
                </div>
                <div className="text-sm">
                  <p className="text-tertiary-grey-dim">
                    {el.firstName} {el.lastName} made an suggestion on <b>{el.chapterTitle}</b>
                  </p>
                  <p className="text-tertiary-grey-stone mt-1">{formatRelativeTime(el.date)}</p>
                  <a
                    href={`/dashboard/my-tutorials?type=${el.articleType}&id=${el.articleId}&status=published`}
                    className="text-primary-skyBlue mt-3 block"
                  >
                    <b>Review</b>
                  </a>
                </div>
              </div>
            )
          })}

          {suggestion.length === 0 && (
            <p className="text-tertiary-grey-dim text-[13px]">
              Currently their are no new comments
            </p>
          )}
        </PopoverContent>
      </Popover>
    </>
  )
}
