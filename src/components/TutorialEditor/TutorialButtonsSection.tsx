import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/Button'
import { articlesAPI } from 'src/lib/api'
import { reducerParser } from 'src/lib/reducerParser'
import { useToast } from 'src/lib/use-toast'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { ArtictesType, UsersItemInterface } from 'src/types/types'
import { AuthorIcon, EyeIcon, LocationIcon, SmallFileIcon } from '../ui/Icons'
import TutorialActionsButton from './TutorialActionsButton'
import { validateArticle } from 'src/lib/validation'
import { sendArticle } from 'src/lib/sendArticle'
import AddAuthorModal from './AddAuthorModal'

interface TutorialButtonsProps {
  usersList: UsersItemInterface[]
  articleType: string | null
}

const TutorialButtonsSection = (props: TutorialButtonsProps) => {
  const tutorial = useAppSelector((state: RootState) => state.editor)
  const [isAddAuthorDialogOpen, setIsAddAuthorDialogOpen] = useState<boolean>(false)
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type') as ArtictesType
  const articleId = params.get('id')
  const status = params.get('status')

  const navigate = useNavigate()
  const { toast } = useToast()

  const dispatch = useAppDispatch()

  const sendRequest = async (parsedObject: any, draft?: boolean) => {
    if (articleType && articleId) {
      try {
        if (articleId === 'new') {
          const res = draft
            ? await articlesAPI.postDraftArticle(articleType, parsedObject)
            : await articlesAPI.postArticle(articleType, parsedObject)

          if (res.data.id || res.data.data.id) {
            const newId = res.data.id || res.data.data.id
            navigate(
              `/dashboard/my-tutorials?type=${articleType}&id=${newId}&status=${draft ? 'draft' : 'published'}`,
            )
            toast({
              title: `Article created in "${articleType}"${draft ? ' as draft' : ''}`,
              description: 'Successfully!',
            })
          }
        } else {
          const res = await articlesAPI.updateArticle(articleType, parsedObject)

          if (res.data) {
            navigate(
              `/dashboard/my-tutorials?type=${articleType}&id=${articleId}&status=${draft ? 'draft' : 'published'}`,
            )
            toast({
              title: `Article updated in "${articleType}"${draft ? ' as draft' : ''}`,
              description: 'Successfully!',
            })
          }
        }
      } catch (error: any) {
        console.error(error)
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
          description: error.message as string,
        })
      }
    }
  }

  const validationErrAlert = () => {
    toast({
      title: 'Something went wrong!',
      variant: 'destructive',
      description: 'Check that all required fields are filled in noted by * and outlined in red',
    })
  }

  const sendArticleSuccessToast = (message: string) => {
    toast({
      title: message,
      description: 'Successfully!',
    })
  }

  const sendArticleErrorToast = (error: string) => {
    toast({
      title: 'Something went wrong!',
      variant: 'destructive',
      description: error,
    })
  }

  const testPublishClick = async () => {
    const validationSucceed = validateArticle(tutorial, articleType, dispatch, validationErrAlert)
    if (validationSucceed) {
      const parsedObject = await reducerParser.parseFromReducer(
        tutorial,
        'publish',
        articleId !== 'new' ? articleId ?? undefined : undefined,
        articleType,
      )
      sendArticle(
        articleType,
        articleId,
        parsedObject,
        navigate,
        sendArticleSuccessToast,
        sendArticleErrorToast,
      )
    }
  }

  const handleDraftClick = async () => {
    const validationSucceed = validateArticle(tutorial, articleType, dispatch, validationErrAlert)
    if (validationSucceed) {
      const parsedObject = await reducerParser.parseFromReducer(
        tutorial,
        'draft',
        articleId !== 'new' ? articleId ?? undefined : undefined,
        articleType,
      )
      sendRequest(parsedObject, true)
    }
  }

  const handlePreviewClick = async () => {
    if (articleType && articleId && articleId !== 'new') {
      try {
        const response = await articlesAPI.getPreviewLink(articleType, Number(articleId))
        const previewLink = response.data.preview_link
        if (previewLink) {
          window.open(previewLink, '_blank', 'noopener,noreferrer')
        }
      } catch (error) {
        console.error(error)
        toast({
          title: 'Failed to fetch preview link!',
          variant: 'destructive',
        })
      }
    }
  }

  const toggleAddAuthorDialogOpen = () => {
    setTimeout(() => {
      setIsAddAuthorDialogOpen(!isAddAuthorDialogOpen)
    }, 300)
  }

  return (
    <section className="w-full flex flex-col items-end gap-y-6 [&>div]:w-full [&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:justify-end [&>div]:gap-y-6 [&>div]:gap-x-6 py-10 sm:py-14 [&>div]:flex-wrap">
      <div>
        <Button
          variant={'outline'}
          size={'lg'}
          className="max-w-[170px] gap-2 px-4"
          onClick={handleDraftClick}
        >
          <SmallFileIcon />
          {status === 'new' ? (
            <p>Save as draft</p>
          ) : status === 'draft' ? (
            <p>Update draft</p>
          ) : (
            status === 'published' && <p>Switch to draft</p>
          )}
        </Button>
        <div className="flex">
          <Button size={'lg'} className="px-4 gap-2 rounded-r-none" onClick={testPublishClick}>
            <span className="flex justify-center items-center w-6 h-6">
              <LocationIcon />
            </span>
            <p>Publish {status === 'published' && 'changes'}</p>
          </Button>
          <TutorialActionsButton
            editor={tutorial}
            articleId={articleId}
            articleType={articleType}
            usersList={props.usersList}
          />
        </div>
      </div>
      <div className="h-0.5 w-full bg-tertiary-grey-silver"></div>
      <div className="flex flex-row gap-x-6">
        {articleId !== 'new' && (
          <Button variant={'outline'} size={'md'} onClick={handlePreviewClick}>
            <span className="flex justify-center items-center w-6 h-6">
              <EyeIcon />
            </span>
            <p>Preview</p>
          </Button>
        )}

        <Button
          variant={'outline'}
          size={'md'}
          className="px-4"
          disabled={articleId === null || articleId === 'new'}
          onClick={toggleAddAuthorDialogOpen}
        >
          <span className="flex justify-center items-center w-6 h-6">
            <AuthorIcon />
          </span>
          <p>Manage editors</p>
        </Button>
      </div>

      <AddAuthorModal
        usersList={props.usersList}
        articleType={props.articleType}
        isOpen={isAddAuthorDialogOpen}
        setIsOpen={toggleAddAuthorDialogOpen}
        articleId={articleId}
      />
    </section>
  )
}

export default TutorialButtonsSection
