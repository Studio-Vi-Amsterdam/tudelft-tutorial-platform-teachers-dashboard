import React from 'react'
import EditorLabel from '../ui/EditorLabel'
import BundledEditor from './BundledEditor'
import Tip from '../ui/Tip'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { setTutorialBottomText, setTutorialBottomTitle } from 'src/redux/features/editorSlice'
import TextInput from '../ui/TextInput'

const TutorialBottomSection = () => {
  const dispatch = useAppDispatch()

  const tutorialBottom = useAppSelector((state: RootState) => state.editor.tutorialBottom)
  const handleTutorialBottomTextChange = (val: string) => {
    dispatch(setTutorialBottomText(val))
  }
  const handleTutorialBottomTitleChange = (val: string) => {
    dispatch(setTutorialBottomTitle(val))
  }
  return (
    <section className="relative flex w-full flex-col gap-y-6 py-14 sm:py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
      <EditorLabel>
        This section is optional and appears on the bottom of the tutorial page.
      </EditorLabel>
      <TextInput
        placeholder="Title of bottom block"
        headingType={tutorialBottom.titleType}
        value={tutorialBottom.title}
        handleChange={handleTutorialBottomTitleChange}
      />
      <BundledEditor value={tutorialBottom.text} handleChange={handleTutorialBottomTextChange} />
      <Tip>
        This section can be used for a list of useful links, but also for other recurring sections
        such as a conclusion.
      </Tip>
    </section>
  )
}

export default TutorialBottomSection
