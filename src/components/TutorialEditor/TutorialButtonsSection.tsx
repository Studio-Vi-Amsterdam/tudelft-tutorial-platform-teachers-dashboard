import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from 'src/components/ui/Button'
import { articlesAPI } from 'src/lib/api'
import { reducerParser } from 'src/lib/reducerParser'
import { useToast } from 'src/lib/use-toast'
import {
  setMetafieldsValidationErrors,
  setTutorialDescriptionValid,
  setTutorialTitleValid,
  setValidatedChapters,
  setValidatedTutorialTopElements,
} from 'src/redux/features/editorSlice'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  ArtictesType,
  ChapterElementsObject,
  TutorialMetaObject,
  TutorialTopElementsObject,
} from 'src/types/types'
import { EyeIcon, SmallFileIcon } from '../ui/Icons'
import TutorialActionsButton from './TutorialActionsButton'

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

  const tutorialTop = useAppSelector((state: RootState) => state.editor.tutorialTop)

  const checkTutorialTitleValidity = () => {
    // true if valid
    return tutorialTop.title.text.trim().length > 0
  }

  const checkTutorialDescriptionValidity = () => {
    // return tutorialTop.description.text.trim().length > 0
    return true
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

  const tutorialTopElements = useAppSelector(
    (state: RootState) => state.editor.tutorialTop.elements,
  )

  const chapters = useAppSelector((state: RootState) => state.editor.chapters)

  interface ValidatedElements {
    count: number
    newState: TutorialTopElementsObject[] | ChapterElementsObject[]
  }

  const validateElements = (
    elements: TutorialTopElementsObject[] | ChapterElementsObject[],
  ): ValidatedElements => {
    let count = 0
    const parsedElements = elements.map((element) => {
      if (element.text) {
        // const isValid = element.text.text.trim().length > 0
        const isValid = true
        !isValid && count++
        return { text: { ...element.text, isValid } }
      } else if (element.infobox) {
        const isValid = element.infobox.text.trim().length > 0
        !isValid && count++
        return {
          infobox: { ...element.infobox, isValid },
        }
      } else if (element.h5pElement) {
        const isValid = element.h5pElement.text.trim().length > 0
        !isValid && count++
        return {
          h5pElement: {
            ...element.h5pElement,
            isValid,
          },
        }
      } else if (element.image) {
        const isValid = !!element.image.id
        !isValid && count++
        return {
          image: {
            ...element.image,
            isValid,
          },
        }
      } else if (element.video) {
        const isValid = !!element.video.id
        !isValid && count++
        return {
          video: {
            ...element.video,
            isValid,
          },
        }
      } else if (element.file) {
        const isFileValid = element.file.file ? !!element.file.file.id : false
        !isFileValid && count++
        const isTitleValid = element.file.title.text.trim().length > 0
        !isTitleValid && count++
        const isDescriptionValid = element.file.description.text.trim().length > 0
        !isDescriptionValid && count++
        return {
          file: {
            ...element.file,
            file: {
              ...element.file.file,
              isValid: isFileValid,
            },
            title: {
              ...element.file.title,
              isValid: isTitleValid,
            },
            description: {
              ...element.file.description,
              isValid: isDescriptionValid,
            },
          },
        }
      } else if (element.quiz) {
        const isQuestionValid = element.quiz.question.text.trim().length > 0
        !isQuestionValid && count++
        return {
          quiz: {
            ...element.quiz,
            question: { ...element.quiz.question, isValid: isQuestionValid },
            answers: element.quiz.answers.map((answer) => {
              const isValidAnswer = answer.answer.trim().length > 0
              !isValidAnswer && count++
              return {
                ...answer,
                isValid: isValidAnswer,
              }
            }),
          },
        }
      } else if (element.tutorialCards) {
        return {
          tutorialCards: element.tutorialCards.map((card) => {
            const isCardValid =
              card.value.id !== undefined ||
              (card.value.url !== undefined &&
                card.value.url.trim().length > 0 &&
                card.value.title.trim().length > 0)
            !isCardValid && count++
            return {
              ...card,
              value: {
                ...card.value,
                isValid: isCardValid,
              },
            }
          }),
        }
      } else if (element.textLayout) {
        /* const isTitleValid = element.textLayout.title.text.trim().length > 0
        !isTitleValid && count++
        const isTextValid = element.textLayout.text.text.trim().length > 0
        !isTextValid && count++ */
        return {
          textLayout: {
            title: { ...element.textLayout.title, isValid: true },
            text: { ...element.textLayout.text, isValid: true },
          },
        }
      } else if (element.imageText) {
        /* const isTitleValid = element.imageText.title.text.trim().length > 0
        !isTitleValid && count++
        const isTextValid = element.imageText.text.text.trim().length > 0
        !isTextValid && count++ */
        const isImageValid = !!element.imageText.image.id
        !isImageValid && count++
        return {
          imageText: {
            title: { ...element.imageText.title, isValid: true },
            text: { ...element.imageText.text, isValid: true },
            image: { ...element.imageText.image, isValid: isImageValid },
          },
        }
      } else if (element.textImage) {
        /* const isTitleValid = element.textImage.title.text.trim().length > 0
        !isTitleValid && count++
        const isTextValid = element.textImage.text.text.trim().length > 0
        !isTextValid && count++ */
        const isImageValid = !!element.textImage.image.id
        !isImageValid && count++
        return {
          textImage: {
            title: { ...element.textImage.title, isValid: true },
            text: { ...element.textImage.text, isValid: true },
            image: { ...element.textImage.image, isValid: isImageValid },
          },
        }
      } else if (element.textVideo) {
        /* const isTitleValid = element.textVideo.title.text.trim().length > 0
        !isTitleValid && count++
        const isTextValid = element.textVideo.text.text.trim().length > 0
        !isTextValid && count++ */
        const isImageValid = !!element.textVideo.video.id
        !isImageValid && count++
        return {
          textVideo: {
            title: { ...element.textVideo.title, isValid: true },
            text: { ...element.textVideo.text, isValid: true },
            video: { ...element.textVideo.video, isValid: isImageValid },
          },
        }
      } else if (element.videoText) {
        /* const isTitleValid = element.videoText.title.text.trim().length > 0
        !isTitleValid && count++
        const isTextValid = element.videoText.text.text.trim().length > 0
        !isTextValid && count++ */
        const isImageValid = !!element.videoText.video.id
        !isImageValid && count++
        return {
          videoText: {
            title: { ...element.videoText.title, isValid: true },
            text: { ...element.videoText.text, isValid: true },
            video: { ...element.videoText.video, isValid: isImageValid },
          },
        }
      }
      return element
    })
    return { count, newState: parsedElements }
  }

  const validateTutorialTopElements = () => {
    const { newState, count } = validateElements(tutorialTopElements)
    dispatch(setValidatedTutorialTopElements(newState))
    return count === 0
  }
  const validateChapters = () => {
    let count = 0
    const newState = chapters.map((chapter) => {
      const isTitleValid = chapter.title.text.trim().length > 0
      !isTitleValid && count++
      // const isTextValid = chapter.text.text.trim().length > 0
      const isTextValid = true
      !isTextValid && count++
      const parsedElements = validateElements(chapter.elements)
      count = count + parsedElements.count
      const isImageValid = chapter?.image ? !!chapter.image.id : true
      !isImageValid && count++
      const isVideoValid = chapter?.video ? !!chapter.video.id : true
      !isVideoValid && count++
      if (chapter.image) {
        return {
          ...chapter,
          title: { ...chapter.title, isValid: isTitleValid },
          text: { ...chapter.text, isValid: isTextValid },
          image: { ...chapter.image, isValid: isImageValid },
          elements: parsedElements.newState,
        }
      } else if (chapter.video) {
        return {
          ...chapter,
          title: { ...chapter.title, isValid: isTitleValid },
          text: { ...chapter.text, isValid: isTextValid },
          video: { ...chapter.video, isValid: isVideoValid },
          elements: parsedElements.newState,
        }
      } else {
        return {
          ...chapter,
          title: { ...chapter.title, isValid: isTitleValid },
          text: { ...chapter.text, isValid: isTextValid },
          elements: parsedElements.newState,
        }
      }
    })
    dispatch(setValidatedChapters(newState))
    return count === 0
  }

  const testPublishClick = async () => {
    const metafieldsValidationResult = checkTutorialsMetafields(articleType)
    const tutorialTitleValidationResult = checkTutorialTitleValidity()
    const tutorialDescriptionValidationResult = checkTutorialDescriptionValidity()
    const tutTopElValidationResult = validateTutorialTopElements()
    const chaptersValidationResult = validateChapters()
    if (!tutorialTitleValidationResult) {
      dispatch(setTutorialTitleValid(false))
      validationErrAlert()
    }
    if (!tutorialDescriptionValidationResult) {
      dispatch(setTutorialDescriptionValid(false))
      validationErrAlert()
    }
    if (!tutTopElValidationResult) {
      validationErrAlert()
    }
    if (!chaptersValidationResult) {
      validationErrAlert()
    }
    if (metafieldsValidationResult && Object.keys(metafieldsValidationResult).length > 0) {
      dispatch(setMetafieldsValidationErrors(metafieldsValidationResult))
      validationErrAlert()
    }
    if (
      tutorialTitleValidationResult &&
      tutorialDescriptionValidationResult &&
      metafieldsValidationResult &&
      tutTopElValidationResult &&
      chaptersValidationResult &&
      Object.keys(metafieldsValidationResult).length === 0
    ) {
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
    <section className="w-full flex flex-col items-end gap-y-6 [&>div]:w-full [&>div]:flex [&>div]:flex-row [&>div]:items-center [&>div]:justify-end [&>div]:gap-y-6 [&>div]:lg:gap-x-6 py-10 sm:py-14 [&>div]:flex-wrap">
      <div>
        <Button size={'lg'} onClick={testPublishClick}>
          <p>Publish {status === 'published' && 'changes'}</p>
        </Button>
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
        <Button variant={'outline'} size={'md'} onClick={handleDraftClick}>
          <SmallFileIcon />
          {status === 'new' ? (
            <p>Save as draft</p>
          ) : status === 'draft' ? (
            <p>Update draft</p>
          ) : (
            status === 'published' && <p>Switch to draft</p>
          )}
        </Button>
        <TutorialActionsButton />
      </div>
    </section>
  )
}

export default TutorialButtonsSection
