import React, { useState } from 'react'
import EditorLabel from '../ui/EditorLabel'
import { AddElementsType, ChapterInterface } from 'src/types/types'
import { useAppDispatch } from 'src/redux/hooks'
import {
  addChapterElement,
  deleteChapter,
  duplicateChapter,
  moveChapter,
  setChapterText,
  setChapterTitle,
} from 'src/redux/features/editorSlice'
import ChapterContent from './ChapterContent'
import ChapterMenu from './ChapterMenu'
import { articlesAPI } from 'src/lib/api'
import AddSectionBlock from './AddSectionBlock'

interface ChapterSectionProps {
  chapter: ChapterInterface
  index: number
  articleType: string | null
}

const ChapterSection = (props: ChapterSectionProps) => {
  const { chapter, index } = props
  const [isSubchapterCreating, setIsSubchapterCreating] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const handleChapterTextInputChange = (val: string, index: number): void => {
    dispatch(setChapterText({ chapterIndex: index, text: val }))
  }

  const handleChangeChapterTitle = (val: string, index?: number) => {
    index !== undefined && dispatch(setChapterTitle({ chapterIndex: index, text: val }))
  }

  const handleAddElement = async (
    val: string,
    index?: number,
    subchapterIndex?: number,
    showTitle?: boolean,
  ) => {
    const payload: any = {}
    payload[val] = ''

    if (val === 'text block') {
      payload.textLayout = {
        title: isSubchapterCreating
          ? {
              text: '',
              isValid: true,
            }
          : undefined,
        text: {
          text: '',
          isValid: true,
        },
      }

      delete payload['text block']
    }
    if (val === 'infobox block') {
      payload.infobox = {
        title: isSubchapterCreating
          ? {
              text: '',
              isValid: true,
            }
          : undefined,
        text: { text: '', isValid: true },
      }
      delete payload['infobox block']
    }
    if (val === 'quiz') {
      payload[val] = {
        question: { text: '', isValid: true },
        answers: [
          { answer: '', isCorrect: '1', isValid: true },
          { answer: '', isCorrect: '0', isValid: true },
          { answer: '', isCorrect: '0', isValid: true },
          { answer: '', isCorrect: '0', isValid: true },
        ],
        answersCount: 4,
      }
    } else if (val === 'h5p element') {
      payload.h5pElement = {
        title: isSubchapterCreating
          ? {
              text: '',
              isValid: true,
            }
          : undefined,
        text: '',
        error: '',
        isValid: true,
      }
      delete payload['h5p element']
    } else if (val === 'tutorial cards') {
      try {
        const response = await articlesAPI.getAllArticles('tutorials')
        const tutorials = response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          isValid: true,
        }))
        payload.tutorialCards = {
          title: isSubchapterCreating
            ? {
                text: '',
                isValid: true,
              }
            : undefined,
          items: [
            {
              value: { id: undefined, title: '', isValid: true },
              proposedList: tutorials,
            },
          ],
        }
        delete payload['tutorial cards']
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          payload.tutorialCards = {
            title: isSubchapterCreating
              ? {
                  text: '',
                  isValid: true,
                }
              : undefined,
            items: [
              {
                value: { id: undefined, title: '', isValid: true },
                proposedList: [],
              },
            ],
          }
        } else {
          console.error(error)
        }
      }
    } else if (val === 'download file') {
      payload.file = {
        subchapterTitle: isSubchapterCreating
          ? {
              text: '',
              isValid: true,
            }
          : undefined,
        file: { id: undefined, url: '', isValid: true },
        title: { text: '', isValid: true },
        description: { text: '', isValid: true },
      }
      delete payload['download file']
    } else if (val === 'image') {
      payload.image = {
        subchapterTitle: isSubchapterCreating
          ? {
              text: '',
              isValid: true,
            }
          : undefined,
        format: '',
        link: '',
        url: '',
        isValid: true,
        publishDate: '',
        title: '',
        type: 'image',
        description: '',
        thumbnail: undefined,
        hasZoom: false,
      }
    } else if (val === 'video') {
      payload.video = {
        subchapterTitle: isSubchapterCreating
          ? {
              text: '',
              isValid: true,
            }
          : undefined,
        format: '',
        link: '',
        url: '',
        isValid: true,
        publishDate: '',
        title: '',
        type: 'video',
        description: '',
        thumbnail: undefined,
      }
    } else if (val === 'external video') {
      payload.externalVideo = {
        title: { text: '', isValid: true },
        url: { text: '', isValid: true },
        thumbnail: undefined,
      }
      delete payload['external video']
    } else if (val === 'image left') {
      payload.imageText = {
        image: {
          isValid: true,
          format: '',
          link: '',
          publishDate: '',
          title: '',
          type: 'image',
          description: '',
        },
        text: { text: '', isValid: true },
        title: { text: '', isValid: true, hidden: !showTitle },
      }
      delete payload['image left']
    } else if (val === 'image right') {
      payload.textImage = {
        image: {
          isValid: true,
          format: '',
          link: '',
          publishDate: '',
          title: '',
          type: 'image',
          description: '',
        },
        text: { text: '', isValid: true },
        title: { text: '', isValid: true, hidden: !showTitle },
      }
      delete payload['image right']
    } else if (val === 'video left') {
      payload.videoText = {
        video: {
          format: '',
          link: '',
          publishDate: '',
          title: '',
          isValid: true,
          type: 'video',
          description: '',
          thumbnail: {
            description: '',
            format: '',
            type: 'image',
            link: '',
            isValid: true,
            publishDate: '',
            title: '',
          },
        },
        text: { text: '', isValid: true },
        title: { text: '', isValid: true, hidden: !showTitle },
      }
      delete payload['video left']
    } else if (val === 'video right') {
      payload.textVideo = {
        video: {
          format: '',
          link: '',
          publishDate: '',
          title: '',
          isValid: true,
          type: 'video',
          description: '',
          thumbnail: {
            description: '',
            format: '',
            type: 'image',
            link: '',
            isValid: true,
            publishDate: '',
            title: '',
          },
        },
        text: { text: '', isValid: true },
        title: { text: '', isValid: true, hidden: !showTitle },
      }
      delete payload['video right']
    } else if (val === '1 column') {
      payload.defaultVal = true
      delete payload['1 column']
    }
    if (index !== undefined) {
      dispatch(addChapterElement({ val: payload, chapterIndex: index }))
    }
  }

  const elements: AddElementsType[] = [
    'text block',
    'infobox block',
    'image',
    'video',
    'download file',
    'h5p element',
    'tutorial cards',
    'quiz',
    'external video',
  ]

  return (
    <section className="relative flex w-full flex-col gap-y-6 py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
      <EditorLabel>This section is a chapter of your {props.articleType}.</EditorLabel>
      <ChapterMenu
        index={index}
        moveChapter={moveChapter}
        deleteChapter={deleteChapter}
        duplicateChapter={duplicateChapter}
      />
      <ChapterContent
        chapter={chapter}
        elements={elements}
        handleAddElement={handleAddElement}
        handleChangeChapterTitle={handleChangeChapterTitle}
        handleChapterTextInputChange={handleChapterTextInputChange}
        setIsSubchapterCreating={setIsSubchapterCreating}
        chapterIndex={index}
      />
      <AddSectionBlock
        variant="dashed"
        chapterIndex={index}
        handleAddElement={handleAddElement}
        setIsSubchapterCreating={setIsSubchapterCreating}
        isSubchapter={true}
      />
    </section>
  )
}

export default ChapterSection
