import React from 'react'
import EditorLabel from '../ui/EditorLabel'
import BundledEditor from './BundledEditor'
import Tip from '../ui/Tip'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  addTutorialBottomElements,
  setTutorialBottomText,
  setTutorialBottomTitle,
} from 'src/redux/features/editorSlice'
import TextInput from '../ui/TextInput'
import { RemoveLastSymbol } from '../../lib/capitalize'
import AddSectionBlock from './AddSectionBlock'
import { articlesAPI } from '../../lib/api'
import ElementsBlock from './ElementsBlock'

interface TutorialBottomSectionProps {
  articleType: string | null
}

const TutorialBottomSection = (props: TutorialBottomSectionProps) => {
  const dispatch = useAppDispatch()

  const tutorialBottom = useAppSelector((state: RootState) => state.editor.tutorialBottom)
  const handleTutorialBottomTextChange = (val: string) => {
    dispatch(setTutorialBottomText(val))
  }
  const handleTutorialBottomTitleChange = (val: string) => {
    dispatch(setTutorialBottomTitle(val))
  }

  const tutorialBottomStateElements = useAppSelector(
    (state: RootState) => state.editor.tutorialBottomContent,
  )
  const handleAddTutorialBottomElement = async (val: string): Promise<void> => {
    const payload: any = {}
    payload[val] = ''
    if (val === 'text block') {
      payload.text = {
        text: '',
        isValid: true,
      }
      delete payload['text block']
      dispatch(addTutorialBottomElements(payload))
    } else if (val === 'infobox block') {
      payload.infobox = {
        text: '',
        isValid: true,
      }
      delete payload['infobox block']
      dispatch(addTutorialBottomElements(payload))
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
      dispatch(addTutorialBottomElements(payload))
    } else if (val === 'h5p element') {
      payload.h5pElement = {
        text: '',
        error: '',
        isValid: true,
      }
      delete payload['h5p element']
      dispatch(addTutorialBottomElements(payload))
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
      dispatch(addTutorialBottomElements(payload))
    } else if (val === 'download file') {
      payload.file = {
        file: { id: undefined, url: '', isValid: true },
        title: { text: '', isValid: true },
        description: { text: '', isValid: true },
      }
      delete payload['download file']
      dispatch(addTutorialBottomElements(payload))
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
      dispatch(addTutorialBottomElements(payload))
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
      dispatch(addTutorialBottomElements(payload))
    } else if (val === 'external video') {
      payload.externalVideo = {
        title: { text: '', isValid: true },
        url: { text: '', isValid: true },
        thumbnail: undefined,
      }
      delete payload['external video']
      dispatch(addTutorialBottomElements(payload))
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
        title: { text: '', isValid: true },
      }
      dispatch(addTutorialBottomElements(payload))
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
        title: { text: '', isValid: true },
      }
      dispatch(addTutorialBottomElements(payload))
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
        title: { text: '', isValid: true },
      }
      dispatch(addTutorialBottomElements(payload))
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
        title: { text: '', isValid: true },
      }
      dispatch(addTutorialBottomElements(payload))
    } else if (val === '1 column') {
      payload.defaultVal = true
      delete payload['1 column']
      dispatch(addTutorialBottomElements(payload))
    } else {
      dispatch(addTutorialBottomElements(payload))
    }
  }

  return (
    <section className="relative flex w-full flex-col gap-y-6 py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
      <EditorLabel>
        The “useful links” chapter is optional and is shown on the bottom of the{' '}
        {RemoveLastSymbol(props.articleType ?? '')} page.
      </EditorLabel>
      <TextInput
        placeholder="Usefull links"
        headingType={tutorialBottom.titleType}
        value={tutorialBottom.title}
        handleChange={handleTutorialBottomTitleChange}
      />
      <BundledEditor
        placeholder="Usefull links description"
        value={tutorialBottom.text}
        handleChange={handleTutorialBottomTextChange}
      />
      <Tip>
        This section can be used for a list of useful links, but also for other recurring sections
        such as a conclusion.
      </Tip>

      <ElementsBlock
        block="tutorialBottomElements"
        handleAddElement={handleAddTutorialBottomElement}
        elements={tutorialBottomStateElements}
      />

      {!tutorialBottomStateElements.find((el) => el.defaultVal) && (
        <AddSectionBlock variant="outline" handleAddElement={handleAddTutorialBottomElement} />
      )}

      <AddSectionBlock variant="dashed" handleAddElement={handleAddTutorialBottomElement} />
    </section>
  )
}

export default TutorialBottomSection
