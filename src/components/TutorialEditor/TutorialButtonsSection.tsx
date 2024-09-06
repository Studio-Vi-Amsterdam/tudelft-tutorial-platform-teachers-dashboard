import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/Button'
import { articlesAPI } from 'src/lib/api'
import { reducerParser } from 'src/lib/reducerParser'
import { useToast } from 'src/lib/use-toast'
import { setMetafieldsValidationErrors } from 'src/redux/features/editorSlice'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { ArtictesType, TutorialMetaObject } from 'src/types/types'

const TutorialButtonsSection = () => {
  const tutorial = useAppSelector((state: RootState) => state.editor)
  const params = new URLSearchParams(useLocation().search)
  const articleType = params.get('type') as ArtictesType
  const articleId = params.get('id')
  const status = params.get('status')

  const navigate = useNavigate()
  const { toast } = useToast()

  const meta = useAppSelector((state: RootState) => state.editor.meta)
  const dispatch = useAppDispatch()

  interface MetaField {
    required: boolean
    list?: any[]
    value?: string | { id: number }
  }

  const checkTutorialsMetafields = (articleType: ArtictesType) => {
    if (articleType === 'tutorials') {
      const tutorialBelongs = checkMetafieldsValidity('tutorialBelongs')
      const tutorialResponsible = checkMetafieldsValidity('tutorialResponsible')
      return {
        ...(tutorialBelongs.length > 0 && { tutorialBelongs }),
        ...(tutorialResponsible.length > 0 && { tutorialResponsible }),
      }
    } else if (articleType === 'courses') {
      const courseBelongs = checkMetafieldsValidity('courseBelongs')
      const courseResponsible = checkMetafieldsValidity('courseResponsible')
      return {
        ...(courseBelongs.length > 0 && { courseBelongs }),
        ...(courseResponsible.length > 0 && { courseResponsible }),
      }
    } else if (articleType === 'softwares') {
      const softwareBelongs = checkMetafieldsValidity('softwareBelongs')
      return {
        ...(softwareBelongs.length > 0 && { softwareBelongs }),
      }
    } else if (articleType === 'subjects') {
      const subjectsInvolve = checkMetafieldsValidity('subjectsInvolve')
      return {
        ...(subjectsInvolve.length > 0 && { subjectsInvolve }),
      }
    }
  }

  const checkMetafieldsValidity = (metaSection: keyof TutorialMetaObject) => {
    const section = meta[metaSection]
    let errorKeys: any = []
    if (section === undefined) {
      return errorKeys
    } else {
      const keys = Object.keys(section) as Array<keyof typeof section>
      errorKeys = keys
        .map((keyName) => {
          const currentObject = section[keyName] as MetaField | undefined

          if (currentObject && (keyName === 'keywords' || keyName === 'teachers')) {
            if (
              currentObject.required === true &&
              (currentObject.list === undefined || currentObject.list.length === 0)
            ) {
              return keyName
            }
          } else if (currentObject && typeof currentObject.value === 'string') {
            if (currentObject.required === true && currentObject.value.trim().length === 0) {
              return keyName
            }
          } else if (
            currentObject &&
            typeof currentObject.value === 'object' &&
            currentObject.value !== null &&
            'id' in currentObject.value
          ) {
            if (currentObject.required === true && currentObject.value.id === undefined) {
              return keyName
            }
          }

          return null
        })
        .filter((keyName) => keyName !== null)
    }
    return errorKeys
  }

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
      } catch (error) {
        console.error(error)
        toast({
          title: 'Something went wrong!',
          variant: 'destructive',
        })
      }
    }
  }

  const testPublishClick = async () => {
    const validationResult = checkTutorialsMetafields(articleType)
    if (validationResult && Object.keys(validationResult).length > 0) {
      dispatch(setMetafieldsValidationErrors(validationResult))
      toast({
        title: 'Sending error!',
        variant: 'destructive',
        description: 'Fill required fields!',
      })
    } else {
      const parsedObject = await reducerParser.parseFromReducer(
        tutorial,
        'publish',
        articleId !== 'new' ? articleId ?? undefined : undefined,
        articleType,
      )
      sendRequest(parsedObject)
    }
  }

  const handleDraftClick = async () => {
    const parsedObject = await reducerParser.parseFromReducer(
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
    <section className="flex w-full flex-row items-center justify-end gap-2 gap-y-6 lg:gap-x-6 py-10 sm:py-14 flex-wrap">
      {articleId !== 'new' && (
        <Button variant={'outline'} size={'lg'} onClick={handlePreviewClick}>
          <p>Preview</p>
        </Button>
      )}
      <Button variant={'outline'} size={'lg'} onClick={handleDraftClick}>
        {status === 'new' ? (
          <p>Save as draft</p>
        ) : status === 'draft' ? (
          <p>Update draft</p>
        ) : (
          status === 'published' && <p>Switch to draft</p>
        )}
      </Button>
      <Button size={'lg'} onClick={testPublishClick}>
        <p>Publish {status === 'published' && 'changes'}</p>
      </Button>
    </section>
  )
}

export default TutorialButtonsSection
