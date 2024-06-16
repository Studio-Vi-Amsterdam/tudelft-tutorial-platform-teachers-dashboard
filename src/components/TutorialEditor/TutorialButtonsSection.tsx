import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/Button'
import { articlesAPI } from 'src/lib/api'
import { reducerParser } from 'src/lib/reducerParser'
import { useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { ArtictesType } from 'src/types/types'

const TutorialButtonsSection = () => {
  const tutorial = useAppSelector((state: RootState) => state.editor)
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type')
  const articleId = params.get('id')
  const navigate = useNavigate()
  const testClick = () => {
    const parsedObject = reducerParser.parseFromReducer(
      tutorial,
      'publish',
      articleId === 'new' ? undefined : (articleId as string),
    )
    if (articleType && articleId) {
      if (articleId === 'new') {
        try {
          articlesAPI
            .postArticle(articleType as ArtictesType, parsedObject)
            .then(
              (res) =>
                res.data.id &&
                navigate(`/dashboard/my-tutorials?type=${articleType}&id=${res.data.id}`),
            )
        } catch (error) {
          console.error(error)
        }
      } else if (articleId !== 'new') {
        try {
          articlesAPI.updateArticle(articleType as ArtictesType, parsedObject)
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
  return (
    <section className="flex w-full flex-row items-center justify-end gap-x-6 py-14">
      <Button variant={'outline'} size={'lg'}>
        <p>Preview</p>
      </Button>
      <Button variant={'outline'} size={'lg'}>
        <p>Save as draft</p>
      </Button>
      <Button size={'lg'} onClick={testClick}>
        <p>Publish</p>
      </Button>
    </section>
  )
}

export default TutorialButtonsSection
