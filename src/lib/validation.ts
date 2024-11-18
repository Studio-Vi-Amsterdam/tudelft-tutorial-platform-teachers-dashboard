import {
  ArtictesType,
  ChapterElementsObject,
  ChapterInterface,
  EditorState,
  TutorialMetaObject,
  TutorialTopElementsObject,
} from 'src/types/types'
import { urlPattern } from 'src/lib/regex/externalVideo'
import {
  setMetafieldsValidationErrors,
  setTutorialDescriptionValid,
  setTutorialTitleValid,
  setValidatedChapters,
  setValidatedTutorialTopElements,
} from 'src/redux/features/editorSlice'
import { Dispatch, UnknownAction } from '@reduxjs/toolkit'

interface ValidatedElements {
  count: number
  newState: TutorialTopElementsObject[] | ChapterElementsObject[]
}

interface MetaField {
  required: boolean
  list?: any[]
  value?: string | { id: number }
}

const checkTutorialTitleValidity = (title: string) => {
  return title.trim().length > 0
}

const checkTutorialDescriptionValidity = (/* description: string */) => {
  // return description.text.trim().length > 0
  return true
}

const checkMetafieldsValidity = (
  meta: TutorialMetaObject,
  metaSection: keyof TutorialMetaObject,
) => {
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

const checkTutorialsMetafields = (meta: TutorialMetaObject, articleType: ArtictesType) => {
  if (articleType === 'tutorials') {
    const tutorialBelongs = checkMetafieldsValidity(meta, 'tutorialBelongs')
    const tutorialResponsible = checkMetafieldsValidity(meta, 'tutorialResponsible')
    return {
      ...(tutorialBelongs.length > 0 && { tutorialBelongs }),
      ...(tutorialResponsible.length > 0 && { tutorialResponsible }),
    }
  } else if (articleType === 'courses') {
    const courseBelongs = checkMetafieldsValidity(meta, 'courseBelongs')
    const courseResponsible = checkMetafieldsValidity(meta, 'courseResponsible')
    return {
      ...(courseBelongs.length > 0 && { courseBelongs }),
      ...(courseResponsible.length > 0 && { courseResponsible }),
    }
  } else if (articleType === 'softwares') {
    const softwareBelongs = checkMetafieldsValidity(meta, 'softwareBelongs')
    return {
      ...(softwareBelongs.length > 0 && { softwareBelongs }),
    }
  } else if (articleType === 'subjects') {
    const subjectsInvolve = checkMetafieldsValidity(meta, 'subjectsInvolve')
    return {
      ...(subjectsInvolve.length > 0 && { subjectsInvolve }),
    }
  }
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
    } else if (element.externalVideo) {
      const isTitleValid = element.externalVideo.title.text.trim().length > 0
      !isTitleValid && count++
      const isUrlValid = urlPattern.test(element.externalVideo.url.text)
      !isUrlValid && count++
      return {
        externalVideo: {
          title: { ...element.externalVideo.title, isValid: isTitleValid },
          url: { ...element.externalVideo.url, isValid: isUrlValid },
          thumbnail: element.externalVideo.thumbnail,
        },
      }
    }
    return element
  })
  return { count, newState: parsedElements }
}

const validateTutorialTopElements = (
  elements: TutorialTopElementsObject[] | ChapterElementsObject[],
  dispatch: Dispatch<UnknownAction>,
) => {
  const { newState, count } = validateElements(elements)
  dispatch(setValidatedTutorialTopElements(newState))
  return count === 0
}

const validateChapters = (chapters: [] | ChapterInterface[], dispatch: Dispatch<UnknownAction>) => {
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

export const validateArticle = (
  editor: EditorState,
  articleType: ArtictesType,
  dispatch: Dispatch<UnknownAction>,
  validationErrAlert: () => void,
) => {
  const tutorialTop = editor.tutorialTop
  const tutorialTopElements = tutorialTop.elements
  const chapters = editor.chapters
  const meta = editor.meta

  const metafieldsValidationResult = checkTutorialsMetafields(meta, articleType)
  const tutorialTitleValidationResult = checkTutorialTitleValidity(tutorialTop.title.text)
  const tutorialDescriptionValidationResult = checkTutorialDescriptionValidity()
  const tutTopElValidationResult = validateTutorialTopElements(tutorialTopElements, dispatch)
  const chaptersValidationResult = validateChapters(chapters, dispatch)
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
    return true
  }
  return false
}
