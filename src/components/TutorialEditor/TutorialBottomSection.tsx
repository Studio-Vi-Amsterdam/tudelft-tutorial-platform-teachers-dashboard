import React from 'react'
import EditorLabel from '../ui/EditorLabel' /* 
import TextInput from '../ui/TextInput' */
import BundledEditor from './BundledEditor'
import Tip from '../ui/Tip'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import {
  setTutorialBottomText /* , setTutorialBottomTitle */,
} from 'src/redux/features/editorSlice'

const TutorialBottomSection = () => {
  const dispatch = useAppDispatch()

  const tutorialBottom = useAppSelector((state: RootState) => state.editor.tutorialBottom)

  /* const handleTutorialBottomTitleChange = (val: string) => {
    dispatch(setTutorialBottomTitle(val))
  } */

  const handleTutorialBottomTextChange = (val: string) => {
    dispatch(setTutorialBottomText(val))
  }
  return (
    <section className="relative flex w-full flex-col gap-y-6 py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
      <EditorLabel>
        This section is optional and appears on the bottom of the tutorial page.
      </EditorLabel>
      {/* <TextInput
        handleChange={handleTutorialBottomTitleChange}
        value={tutorialBottom.title}
        placeholder="Useful links"
        headingType={tutorialBottom.titleType}
        readonly={true}
      /> */}
      <h3 className="font-bold">Useful Links</h3>
      <BundledEditor
        value={tutorialBottom.text}
        handleChange={handleTutorialBottomTextChange}
        init={{
          menubar: false,
          plugins: ['table', 'lists', 'link', 'code', 'autoresize', 'command'],

          toolbar: 'bullist numlist link code table command',
        }}
      />
      <Tip>
        This section can be used for a list of useful links, but also for other recurring sections
        such as a conclusion.
      </Tip>
    </section>
  )
}

export default TutorialBottomSection
