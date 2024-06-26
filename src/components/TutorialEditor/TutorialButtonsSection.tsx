import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/Button'
import { articlesAPI } from 'src/lib/api'
import { reducerParser } from 'src/lib/reducerParser'
import { useToast } from 'src/lib/use-toast'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { ArtictesType } from 'src/types/types'

const TutorialButtonsSection = () => {
  const tutorial = useAppSelector((state: RootState) => state.editor)
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type') as ArtictesType
  const articleId = params.get('id')
  const navigate = useNavigate()
  const { toast } = useToast()

  const sendRequest = async (parsedObject: any, draft?: boolean) => {
    if (articleType && articleId) {
      try {
        if (articleId === 'new') {
          const res = draft
            ? await articlesAPI.postDraftArticle(articleType, parsedObject)
            : await articlesAPI.postArticle(articleType, parsedObject)

          if (res.data.id || res.data.data.id) {
            const newId = res.data.id || res.data.data.id
            navigate(`/dashboard/my-tutorials?type=${articleType}&id=${newId}`)
            toast({
              title: `Article created in "${articleType}"${draft ? ' as draft' : ''}`,
              description: 'Successfully!',
            })
          }
        } else {
          const res = draft
            ? await articlesAPI.postDraftArticle(articleType, parsedObject)
            : await articlesAPI.updateArticle(articleType, parsedObject)

          if (res.data) {
            toast({
              title: `Article updated in "${articleType}"${draft ? ' as draft' : ''}`,
              description: 'Successfully!',
            })
          }
        }
      } catch (error) {
        console.error(error)
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
        })
      }
    }
  }

  const testPublishClick = () => {
    const parsedObject = reducerParser.parseFromReducer(
      tutorial,
      'publish',
      articleId !== 'new' ? articleId ?? undefined : undefined,
      articleType,
    )
    sendRequest(parsedObject)
  }

  const testDraftClick = () => {
    const parsedObject = reducerParser.parseFromReducer(
      tutorial,
      'draft',
      articleId !== 'new' ? articleId ?? undefined : undefined,
      articleType,
    )
    sendRequest(parsedObject, true)
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

  return (
    <section className="flex w-full flex-row items-center justify-end gap-x-6 py-14">
      {articleId !== 'new' && (
        <Button variant={'outline'} size={'lg'} onClick={handlePreviewClick}>
          <p>Preview</p>
        </Button>
      )}
      <Button variant={'outline'} size={'lg'} onClick={testDraftClick}>
        <p>Save as draft</p>
      </Button>
      <Button size={'lg'} onClick={testPublishClick}>
        <p>Publish</p>
      </Button>
    </section>
  )
}

export default TutorialButtonsSection
