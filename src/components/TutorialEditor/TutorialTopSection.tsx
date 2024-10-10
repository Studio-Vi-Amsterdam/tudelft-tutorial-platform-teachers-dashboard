import React from 'react'
import EditorLabel from 'src/components/ui/EditorLabel'
import TextInput from 'src/components/ui/TextInput'
import Tip from 'src/components/ui/Tip'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import {
  addTutorialElements,
  setTutorialDescription,
  setTutorialTitle,
} from 'src/redux/features/editorSlice'
import { RootState } from 'src/redux/store'
import AddElementBlock from './AddElementBlock'
import ElementsBlock from './ElementsBlock'
import BundledEditor from './BundledEditor'
import { AddElementsType, TextElementInterface } from 'src/types/types'
import { articlesAPI } from 'src/lib/api'

interface TutorialTopSectionProps {
  tutorialTitle: TextElementInterface
}

const TutorialTopSection = (props: TutorialTopSectionProps) => {
  const { tutorialTitle } = props

  const tutorialDescription = useAppSelector(
    (state: RootState) => state.editor.tutorialTop.description,
  )

  const tutorialStateElements = useAppSelector(
    (state: RootState) => state.editor.tutorialTop.elements,
  )

  const dispatch = useAppDispatch()

  const handleTutorialTitleInputChange = (value: string): void => {
    dispatch(setTutorialTitle(value))
  }

  const handleTutorialDescriptionInputChange = (value: string): void => {
    dispatch(setTutorialDescription(value))
  }

  const tutorialElements: AddElementsType[] = [
    'text block',
    'infobox block',
    'image',
    'video',
    'tutorial cards',
    'download file',
    'quiz',
    'h5p element',
  ]
  const handleAddTutorialElement = async (val: string): Promise<void> => {
    const payload: any = {}

    payload[val] = ''
    if (val === 'text block') {
      payload.text = {
        text: '',
        isValid: true,
      }
      delete payload['text block']
      dispatch(addTutorialElements(payload))
    } else if (val === 'infobox block') {
      payload.infobox = {
        text: '',
        isValid: true,
      }
      delete payload['infobox block']
      dispatch(addTutorialElements(payload))
    } else if (val === 'quiz') {
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
      dispatch(addTutorialElements(payload))
    } else if (val === 'h5p element') {
      payload.h5pElement = {
        text: '',
        error: '',
        isValid: true,
      }
      delete payload['h5p element']
      dispatch(addTutorialElements(payload))
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
      delete payload['tutorial cards']
      dispatch(addTutorialElements(payload))
    } else if (val === 'download file') {
      payload.file = {
        file: { id: undefined, url: '', isValid: true },
        title: { text: '', isValid: true },
        description: { text: '', isValid: true },
      }
      delete payload['download file']
      dispatch(addTutorialElements(payload))
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
      dispatch(addTutorialElements(payload))
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
      dispatch(addTutorialElements(payload))
    } else {
      dispatch(addTutorialElements(payload))
    }
  }

  return (
    <section className="relative flex w-full flex-col gap-y-6 py-16 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
      <EditorLabel>
        This section is mandatory for all tutorials and appears on top of the tutorial page.
      </EditorLabel>
      <TextInput
        handleChange={handleTutorialTitleInputChange}
        value={tutorialTitle.text}
        placeholder="Tutorial title"
        headingType="h1"
        notValid={!tutorialTitle.isValid}
      />
      <BundledEditor
        value={tutorialDescription.text}
        handleChange={handleTutorialDescriptionInputChange}
        extended
        notValid={!tutorialDescription.isValid}
      />
      <Tip>
        <p>
          Learning outcomes clearly explain, with measurable verbs, what the learner will be able to
          do, and know by the end of your course.
        </p>
        <ul className="list-disc pl-4">
          <li>What skills will they be able to demonstrate?</li>
          <li>What new knowledge will they have obtained?</li>
        </ul>
      </Tip>
      <ElementsBlock block="tutorialElements" elements={tutorialStateElements} />
      <AddElementBlock elements={tutorialElements} handleAddElement={handleAddTutorialElement} />
    </section>
  )
}

export default TutorialTopSection
