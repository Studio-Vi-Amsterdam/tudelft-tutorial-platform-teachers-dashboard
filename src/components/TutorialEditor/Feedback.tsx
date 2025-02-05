import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/Accordion'
import { Arrow, CheckIcon, CloseIcon } from '../ui/Icons'
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { cn } from '../../lib/utils'
import { getUserSymbols } from '../../lib/getUserSymbols'
import PaginationBar from './PaginationBar'
import { articlesAPI } from '../../lib/api'
import { ArtictesType } from '../../types/types'
import Preloader from '../ui/Preloader'
import { formatRelativeTime } from '../../lib/timeFormat'

export interface FeedbackSuggestion {
  firstName: string
  lastName: string
  chapterTitle: string
  articleId: number
  id: number
  articleType: string
  date: string
}

export type FeedbackStatus = 'new' | 'completed' | 'ignored'

interface Suggestion {
  new: FeedbackSuggestion[]
  completed: FeedbackSuggestion[]
  ignored: FeedbackSuggestion[]
}

interface FeedbackProps {
  articleType: ArtictesType
  articleId: string
}

export const Feedback = (props: FeedbackProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeStatus, setActiveStatus] = useState<FeedbackStatus>('new')
  const [suggestion, setSuggestion] = useState<Suggestion>({ new: [], completed: [], ignored: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  const getSuggestion = useCallback(async () => {
    setIsLoading(true)
    try {
      const res: any = await articlesAPI.getSuggestion(
        props.articleType,
        props.articleId,
        activeStatus,
        currentPage,
      )
      setSuggestion((prev) => ({
        ...prev,
        [activeStatus]: res.items as FeedbackSuggestion[],
      }))
      setTotalPages(res.totalPage)
      console.log(res)
    } catch (err) {
      console.error('Error fetching suggestions:', err)
    } finally {
      setIsLoading(false)
    }
  }, [props.articleType, props.articleId, activeStatus, currentPage])

  useEffect(() => {
    getSuggestion()
  }, [getSuggestion])

  const setCommentStatus = useCallback(
    async (status: FeedbackStatus, id: number) => {
      try {
        setIsLoading(true)
        const res = await articlesAPI.setCommentStatus(id, props.articleId, status)
        getSuggestion()
        console.log('Updated comment:', res)
      } catch (err) {
        console.error('Error updating comment status:', err)
      }
    },
    [activeStatus],
  )

  const handleChangeStatus = (status: FeedbackStatus) => {
    setActiveStatus(status)
    setCurrentPage(1)
  }
  const handleClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }
  const handlePrevClick = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }
  const handleNextClick = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }

  return (
    <>
      <Accordion type="single" collapsible onValueChange={(e) => setIsOpen(e === 'feedback')}>
        <AccordionItem value="feedback">
          <AccordionTrigger
            showIcon={false}
            className="flex mt-4 group !outline-0 !no-underline justify-between"
          >
            <div className="text-tertiary-grey-dim">
              Tutorial Feedback from Students
              {!isOpen && suggestion.new.length > 0 && (
                <span className="px-2.5 font-normal rounded-[18px] text-white text-[12px] ml-2 py-1.5 bg-[#00A6D6]">
                  {suggestion.new.length} New
                </span>
              )}
            </div>
            <div className="flex font-normal text-tertiary-grey-dim items-center justify-end">
              {isOpen ? 'Show less' : 'Show all'}
              <span className="group-data-[state=open]:rotate-90">
                <Arrow />
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="py-6 relative border-b-2 border-tertiary-grey-silver">
            <div className="p-4 border text-primary-skyBlue border-primary-skyBlue bg-[#E0F5FE] rounded-[4px]">
              <b>Note:</b> Completed feedback is not automatically applied. You must manually make
              the necessary changes to ensure they are implemented as intended.
            </div>

            <div className="mt-6 flex items-center gap-1.5">
              <p className="text-tertiary-grey-dim font-bold">Comments</p>
              <Button
                onClick={() => handleChangeStatus('new')}
                className={cn(
                  { 'bg-primary-skyBlue text-white': activeStatus === 'new' },
                  'px-2.5 rounded-[18px] py-1',
                )}
                variant="outline"
              >
                New
              </Button>
              <Button
                onClick={() => handleChangeStatus('completed')}
                className={cn(
                  { 'bg-black !text-white': activeStatus === 'completed' },
                  'px-2.5 text-black border-black rounded-[18px] py-1',
                )}
                variant="outline"
              >
                Completed
              </Button>
              <Button
                onClick={() => handleChangeStatus('ignored')}
                className={cn(
                  { 'bg-black !text-white': activeStatus === 'ignored' },
                  'px-2.5 text-black border-black rounded-[18px] py-1',
                )}
                variant="outline"
              >
                Ignored
              </Button>
            </div>

            <div className="mt-6 relative min-h-[50px]">
              {suggestion[activeStatus]?.map((el, i) => {
                return (
                  <div
                    key={i + el.articleId}
                    className="flex pb-6 items-start gap-2 justify-between"
                  >
                    <div className="min-w-[24px] max-w-[24px] w-6 h-6 flex text-[12px] items-center justify-center bg-secondary-navy text-white rounded-full">
                      {getUserSymbols(el.firstName, el.lastName)}
                    </div>
                    <div className="text-sm w-full">
                      <p className="text-tertiary-grey-dim">
                        {el.firstName} {el.lastName}
                      </p>
                      <p className="text-tertiary-grey-stone mt-1 text-[12px]">
                        {formatRelativeTime(el.date)}
                        {activeStatus === 'new' && (
                          <span className="px-2 py-1 bg-primary-skyBlue text-white text[10px] rounded-[60px] ml-2">New</span>
                        )}
                      </p>

                      <p className="text-tertiary-grey-stone mt-2">
                        This tutorial was helpful, but I think a visual example or diagram would
                        make it even better.
                      </p>

                      {activeStatus === 'new' && (
                        <div className="flex mt-3 gap-4">
                          <Button
                            onClick={() => {
                              setCommentStatus('completed', el.id)
                            }}
                            className="border-0 gap-1 hover:underline p-0 text-primary-skyBlue bg-transparent"
                          >
                            <CheckIcon />
                            Complete
                          </Button>

                          <Button
                            onClick={() => {
                              setCommentStatus('ignored', el.id)
                            }}
                            className="border-0 gap-1 hover:underline p-0 text-tertiary-grey-dim bg-transparent"
                          >
                            <CloseIcon />
                            Ignore
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}

              {!suggestion[activeStatus].length && (
                <p className="text-[#B3B3B5]">Currently their are no {activeStatus} comments</p>
              )}

              {isLoading && (
                <div className="absolute bg-white top-0 w-full h-full">
                  <Preloader color="secondary" />
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <PaginationBar
                className="mt-10"
                currentPage={currentPage}
                totalPages={totalPages}
                hidePageSelector={true}
                handleClickPage={handleClick}
                handleNextClick={handleNextClick}
                handlePrevClick={handlePrevClick}
              />
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  )
}
