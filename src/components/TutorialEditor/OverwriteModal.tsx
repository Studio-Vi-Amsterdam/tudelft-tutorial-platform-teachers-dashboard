import React, { useEffect, useState } from 'react'
import type { ArtictesType, TitleIdentifierInterface } from 'src/types/types'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '../ui/Dialog'
import AutoCompleteSelect from './AutoCompleteSelect'
import { Button } from '../ui/Button'
import { SmallFileIcon } from '../ui/Icons'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import clsx from 'clsx'
import { useLocation } from 'react-router-dom'
import { useToast } from 'src/lib/use-toast'
import { getStringArticleType } from 'src/lib/getStringArticleType'
import { Capitalize } from '../../lib/capitalize'
import { articlesAPI } from '../../lib/api'

interface RewriteModalProps {
  articleType: ArtictesType
  articleId: string | null
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  articlesList: TitleIdentifierInterface[]
}

const OverwriteModal = (props: RewriteModalProps) => {
  const params = new URLSearchParams(useLocation().search)
  const articleStatus = params.get('status')
  const articleTitle = useAppSelector((state: RootState) => state.editor.tutorialTop.title)
  const articleTitleText = articleTitle.text.length > 0 ? articleTitle.text : 'Untitled article'
  const stringArticleType = getStringArticleType(props.articleType)

  const [inputValue, setInputValue] = useState<string>('')
  const [targetArticle, setTargetArticle] = useState<TitleIdentifierInterface>()

  const [isSelectValueValid, setIsSelectValueValid] = useState<boolean>(false)
  const [isSecondStep, setIsSecondStep] = useState<boolean>(false)

  const { toast } = useToast()

  const handleSuccess = () => {
    props.setIsOpen(false)
    setInputValue('')
    toast({
      title: 'Success!',
      description: `This ${stringArticleType} is now overwritten by ${targetArticle?.title ?? 'selected ' + stringArticleType}.`,
    })
    setTargetArticle(undefined)
    setIsSecondStep(false)
    setIsSelectValueValid(false)
  }

  const handleSubmit = async () => {
    const intCurrentArticleId = parseInt(props.articleId as string)
    const intTargetArticleId = targetArticle?.id ?? 0

    const migrateArticle = await articlesAPI.overwriteArticle(
      props.articleType,
      intCurrentArticleId,
      intTargetArticleId,
    )

    if (migrateArticle?.data === true) {
      handleSuccess()
    }
  }

  useEffect(() => {
    const findedObject = props.articlesList.find((item) => item.title === inputValue)
    if (findedObject) {
      setIsSelectValueValid(true)
      setTargetArticle(findedObject)
    } else {
      setIsSelectValueValid(false)
      setTargetArticle(undefined)
    }
  }, [inputValue])

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="bg-white xl:min-w-[888px] lg:min-w-[666px] max-sm:min-w-[90%] p-10 flex flex-col gap-y-10">
        <DialogHeader>
          <DialogTitle className="text-black font-normal font-sans text-h3 pr-8 text-left -tracking-1">
            {isSecondStep
              ? 'Are you sure you want to overwrite?'
              : `Overwrite ${stringArticleType} to`}
          </DialogTitle>
        </DialogHeader>
        {isSecondStep ? (
          <>
            <div className="px-4 py-6 bg-tertiary-skyBlue-10 rounded-sm flex flex-col items-start gap-y-4 [&>div]:flex [&>div]:flex-col [&>div]:items-start [&>div]:gap-y-2">
              <div>
                <p className="text-dim text-lg font-inter font-normal">
                  You’re about to migrate this {stringArticleType}:
                </p>
                <div className="flex flex-row items-center gap-x-2 text-black">
                  <div className="w-6 h-6 flex justify-center items-center">
                    <SmallFileIcon />
                  </div>
                  <p className="font-normal font-inter text-xl leading-[1.875rem] ">
                    <span className="capitalize">{articleStatus}</span> •{' '}
                    {Capitalize(stringArticleType)} - {articleTitleText}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-dim text-lg font-inter font-normal">To:</p>
                <div className="flex flex-row items-center text-black">
                  <p className="font-bold font-inter text-xl leading-[1.875rem]">
                    {targetArticle?.title}
                  </p>
                </div>
              </div>
            </div>
            <p className="text-primary-skyBlue text-lg font-normal font-inter">
              <strong>Please note:</strong> The current draft {stringArticleType} will be published,
              and the previously published {stringArticleType} will be moved to the archive.
            </p>
          </>
        ) : (
          <>
            <div className="flex flex-col items-start gap-y-2">
              <p className="text-dim text-xl leading-[1.5] font-inter font-normal">
                Name of {stringArticleType}
              </p>
              <div className="flex flex-row items-center gap-x-2 text-black">
                <div className="w-6 h-6 flex justify-center items-center">
                  <SmallFileIcon />
                </div>
                <p className="font-normal font-inter text-xl leading-[1.875rem] ">
                  {Capitalize(stringArticleType)} - {articleTitleText}
                </p>
              </div>
            </div>
            <div className="flex flex-row max-sm:flex-col gap-4 justify-between items-start h-[14.15rem] w-full">
              <AutoCompleteSelect
                possibleValues={props.articlesList}
                inputValue={inputValue}
                setInputValue={setInputValue}
                inputPlaceholder={`Search selected ${Capitalize(stringArticleType)}`}
                buttonPlaceholder="Select Tutorial"
                getSuggestionId={(item) => item.id}
                getSuggestionText={(item) => item.title}
              />
            </div>
          </>
        )}
        <DialogFooter
          className={clsx('flex flex-row gap-x-4', {
            '!justify-start': isSecondStep,
          })}
        >
          {!isSecondStep && (
            <Button
              onClick={() => setIsSecondStep(true)}
              disabled={!isSelectValueValid || !targetArticle}
            >
              Next
            </Button>
          )}
          {isSecondStep && (
            <>
              <Button onClick={handleSubmit}>Migrate</Button>
              <Button variant="outline" className="!m-0" onClick={() => setIsSecondStep(false)}>
                Cancel
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default OverwriteModal
