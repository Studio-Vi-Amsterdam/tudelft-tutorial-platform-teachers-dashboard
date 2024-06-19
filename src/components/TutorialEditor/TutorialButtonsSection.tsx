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
  const articleType = params.get('type')
  const articleId = params.get('id')
  const navigate = useNavigate()
  const { toast } = useToast()
  const sendRequest = (parsedObject: any, draft?: boolean) => {
    if (articleType && articleId) {
      if (articleId === 'new') {
        try {
          articlesAPI.postArticle(articleType as ArtictesType, parsedObject).then((res) => {
            res.data.id && navigate(`/dashboard/my-tutorials?type=${articleType}&id=${res.data.id}`)
            res.status === 200 &&
              toast({
                title: `Article created in "${articleType}" ${draft ? 'as draft' : ''}`,
                description: 'Successfully!',
              })
          })
        } catch (error) {
          console.error(error)
          toast({
            title: 'Something went wrong!',
            variant: 'destructive',
          })
        }
      } else if (articleId !== 'new') {
        try {
          articlesAPI.updateArticle(articleType as ArtictesType, parsedObject).then(
            (res) =>
              res.data &&
              toast({
                title: `Article updated in "${articleType} ${draft ? 'as draft' : ''}"`,
                description: 'Successfully!',
              }),
          )
        } catch (error) {
          console.error(error)
          toast({
            title: 'Something went wrong!',
            variant: 'destructive',
          })
        }
      }
    }
  }
  const testPublishClick = () => {
    const parsedObject = reducerParser.parseFromReducer(
      tutorial,
      'publish',
      articleId === 'new' ? undefined : (articleId as string),
      articleType as ArtictesType,
    )
    sendRequest(parsedObject)
  }
  const testDraftClick = () => {
    const parsedObject = reducerParser.parseFromReducer(
      tutorial,
      'draft',
      articleId === 'new' ? undefined : (articleId as string),
      articleType as ArtictesType,
    )
    sendRequest(parsedObject, true)
  }
  return (
    <section className="flex w-full flex-row items-center justify-end gap-x-6 py-14">
      <Button variant={'outline'} size={'lg'}>
        <p>Preview</p>
      </Button>
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
