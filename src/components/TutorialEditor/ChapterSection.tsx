import React from 'react'
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
import NewAddSubchapter from './NewAddSubchapter'
import { articlesAPI } from 'src/lib/api'

interface ChapterSectionProps {
  chapter: ChapterInterface
  index: number
}

const ChapterSection = (props: ChapterSectionProps) => {
  const { chapter, index } = props

  const dispatch = useAppDispatch()

  const handleChapterTextInputChange = (val: string, index: number): void => {
    dispatch(setChapterText({ chapterIndex: index, text: val }))
  }

  const handleChangeChapterTitle = (val: string, index?: number) => {
    index !== undefined && dispatch(setChapterTitle({ chapterIndex: index, text: val }))
  }

  const handleAddElement = async (val: string, index?: number) => {
    const payload: any = {}

    payload[val] = ''

    if (val === 'text block') {
      payload.text = {
        text: '',
        isValid: true,
      }
      delete payload['text block']
    }
    if (val === 'infobox block') {
      payload.infobox = {
        text: '',
        isValid: true,
      }
      delete payload['infobox block']
    }
    if (val === 'quiz') {
      payload[val] = {
        question: '',
        answers: [
          { answer: '', isCorrect: '1' },
          { answer: '', isCorrect: '0' },
          { answer: '', isCorrect: '0' },
          { answer: '', isCorrect: '0' },
        ],
        answersCount: 4,
      }
    } else if (val === 'h5p element') {
      payload.h5pElement = {
        text: '',
        error: '',
      }
      delete payload['h5p element']
    } else if (val === 'tutorial cards') {
      try {
        const response = await articlesAPI.getAllArticles('tutorials')
        const tutorials = response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
        }))
        payload.tutorialCards = [
          {
            value: { id: undefined, title: '' },
            proposedList: tutorials,
          },
        ]
        delete payload['tutorial cards']
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          payload.tutorialCards = [
            {
              value: { id: undefined, title: '' },
              proposedList: [],
            },
          ]
        } else {
          console.error(error)
        }
      }
    } else if (val === 'download file') {
      payload.file = {
        id: undefined,
        url: '',
      }
      delete payload['download file']
    } else if (val === 'image') {
      payload.image = {
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
  ]

  return (
    <section className="relative flex w-full flex-col gap-y-6 py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
      <EditorLabel>This section is a chapter of your tutorial.</EditorLabel>
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
        chapterIndex={index}
      />
      <NewAddSubchapter chapterIndex={index} />
    </section>
  )
}

export default ChapterSection
