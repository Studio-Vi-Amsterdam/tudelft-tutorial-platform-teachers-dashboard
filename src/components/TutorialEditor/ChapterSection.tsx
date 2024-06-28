import React, { useState } from 'react'
import EditorLabel from '../ui/EditorLabel'
import { AddElementsType, ChapterInterface } from 'src/types/types'
import { useAppDispatch } from 'src/redux/hooks'
import {
  addChapterElement,
  addSubchapterElement,
  deleteChapter,
  duplicateChapter,
  moveChapter,
  setChapterText,
  setChapterTitle,
  setSubchapterText,
  setSubchapterTitle,
} from 'src/redux/features/editorSlice'
import ChapterContent from './ChapterContent'
import SubchapterContent from './SubchapterContent'
import ChapterMenu from './ChapterMenu'
import NewAddSubchapter from './NewAddSubchapter'
import { articlesAPI } from 'src/lib/api'

interface ChapterSectionProps {
  chapter: ChapterInterface
  index: number
}

const ChapterSection = (props: ChapterSectionProps) => {
  const { chapter, index } = props
  const [, setAddSubchapterElementsActive] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const handleChapterTextInputChange = (val: string, index: number): void => {
    dispatch(setChapterText({ chapterIndex: index, text: val }))
  }

  const handleSubchapterTextInputChange = (
    val: string,
    index: number,
    subchapterIndex: number,
  ): void => {
    index !== undefined &&
      subchapterIndex !== undefined &&
      dispatch(
        setSubchapterText({
          chapterIndex: index,
          subchapterIndex,
          text: val,
        }),
      )
  }

  const handleChangeChapterTitle = (val: string, index?: number) => {
    index !== undefined && dispatch(setChapterTitle({ chapterIndex: index, text: val }))
  }

  const handleChangeSubchapterTitle = (val: string, index?: number, subchapterIndex?: number) => {
    index !== undefined &&
      subchapterIndex !== undefined &&
      dispatch(
        setSubchapterTitle({
          chapterIndex: index,
          text: val,
          subchapterIndex,
        }),
      )
  }

  const handleAddElement = async (val: string, index?: number) => {
    const payload: any = {}

    payload[val] = ''

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
        value: '',
        error: '',
      }
    } else if (val === 'tutorial cards') {
      try {
        const response = await articlesAPI.getArticles('tutorials')
        const tutorials = response.data.map((item: any) => ({
          id: item.id,
          title: item.title,
        }))
        payload.tutorialCard = {
          value: { id: undefined, title: '' },
          proposedList: tutorials,
        }
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          payload.tutorialCard = {
            value: { id: undefined, title: '' },
            proposedList: [],
          }
        } else {
          console.error(error)
        }
      }
    }

    if (index !== undefined) {
      dispatch(addChapterElement({ val: payload, chapterIndex: index }))
    }
  }

  const handleAddSubchapterElement = (val: string, index?: number, subchapterIndex?: number) => {
    const payload: any = {}
    payload[val] = ''
    index !== undefined &&
      subchapterIndex !== undefined &&
      dispatch(
        addSubchapterElement({
          val: payload,
          chapterIndex: index,
          subchapterIndex,
        }),
      )
    setAddSubchapterElementsActive(false)
  }

  const elements: AddElementsType[] = [
    'text',
    'infobox',
    'image',
    'video',
    // 'file',
    'h5p element',
    'tutorial cards',
    // 'quiz',
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
      <SubchapterContent
        chapterIndex={index}
        chapterTitle={chapter.title}
        elements={elements}
        handleAddSubchapterElement={handleAddSubchapterElement}
        handleChangeSubchapterTitle={handleChangeSubchapterTitle}
        handleSubchapterTextInputChange={handleSubchapterTextInputChange}
        subchapters={chapter.subchapters}
      />
      <NewAddSubchapter chapterIndex={index} />
    </section>
  )
}

export default ChapterSection
