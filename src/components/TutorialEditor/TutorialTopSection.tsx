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
import ElementsBlock from './ElementsBlock'
import BundledEditor from './BundledEditor'
import { ArtictesType, TextElementInterface } from 'src/types/types'
import { articlesAPI } from 'src/lib/api'
import { Capitalize, RemoveLastSymbol } from '../../lib/capitalize'
import AddSectionBlock from './AddSectionBlock'
import { Feedback } from './Feedback'

interface TutorialTopSectionProps {
  tutorialTitle: TextElementInterface
  articleType: string | null
  articleId: string | null
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

  const handleAddTutorialElement = async (
    val: string,
    chapterIndex?: number,
    subchapterIndex?: number,
    showTitle?: boolean,
  ): Promise<void> => {
    const payload: any = {}
    payload[val] = ''
    if (val === 'text block') {
      payload.textLayout = {
        title: {
          text: '',
          isValid: true,
        },
        text: {
          text: '',
          isValid: true,
        },
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
        question: { text: '', isValid: true },
        answers: [
          { answer: '', isCorrect: '1', isValid: true },
          { answer: '', isCorrect: '0', isValid: true },
          { answer: '', isCorrect: '0', isValid: true },
          { answer: '', isCorrect: '0', isValid: true },
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
          isValid: true,
        }))
        payload.tutorialCards = [
          {
            value: { id: undefined, title: '', isValid: true },
            proposedList: tutorials,
          },
        ]
      } catch (error: any) {
        if (error.response && error.response.status === 404) {
          payload.tutorialCards = [
            {
              value: { id: undefined, title: '', isValid: true },
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
    } else if (val === 'external video') {
      payload.externalVideo = {
        title: { text: '', isValid: true },
        url: { text: '', isValid: true },
        thumbnail: undefined,
      }
      delete payload['external video']
      dispatch(addTutorialElements(payload))
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
      dispatch(addTutorialElements(payload))
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
      dispatch(addTutorialElements(payload))
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
      dispatch(addTutorialElements(payload))
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
      dispatch(addTutorialElements(payload))
    } else if (val === '1 column') {
      payload.defaultVal = true
      delete payload['1 column']
      dispatch(addTutorialElements(payload))
    } else {
      dispatch(addTutorialElements(payload))
    }
  }

  return (
    <section className="relative flex w-full flex-col gap-y-6 py-16 sm:py-20">
      <EditorLabel>
        This intro chapter is mandatory for all {props.articleType} and appears on top of a{' '}
        {RemoveLastSymbol(props.articleType ?? '')} page.
      </EditorLabel>
      <TextInput
        handleChange={handleTutorialTitleInputChange}
        value={tutorialTitle.text}
        placeholder={Capitalize(RemoveLastSymbol(props.articleType ?? '')) + ' title'}
        headingType="h1"
        notValid={!tutorialTitle.isValid}
      />
      <BundledEditor
        placeholder={`Write a short description for the ${RemoveLastSymbol(props.articleType ?? '')} here.`}
        value={tutorialDescription.text}
        handleChange={handleTutorialDescriptionInputChange}
        extended
        notValid={!tutorialDescription.isValid}
      />

      <Feedback
        articleId={props.articleId as string}
        articleType={props.articleType as ArtictesType}
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

      <ElementsBlock
        block="tutorialElements"
        handleAddElement={handleAddTutorialElement}
        elements={tutorialStateElements}
      />

      {!tutorialStateElements.find((el) => el.defaultVal) && (
        <AddSectionBlock variant="outline" handleAddElement={handleAddTutorialElement} />
      )}

      <AddSectionBlock variant="dashed" handleAddElement={handleAddTutorialElement} />
    </section>
  )
}

export default TutorialTopSection
