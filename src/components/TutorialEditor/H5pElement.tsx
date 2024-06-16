import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from 'src/redux/hooks'
import { RootState } from 'src/redux/store'
import { h5pElementInterface, QuizElementProps } from 'src/types/types'
import TextInput from '../ui/TextInput'
import { setElementH5P } from 'src/redux/features/editorSlice'

const H5pElement = (props: QuizElementProps) => {
  const h5pElement = useAppSelector((state: RootState) =>
    props.block === 'tutorialElements' && props.listIndex !== undefined
      ? state.editor.tutorialTop.elements[props.listIndex].h5pElement
      : props.block === 'chapterElements' &&
          props.chapterIndex !== undefined &&
          props.listIndex !== undefined
        ? state.editor.chapters[props.chapterIndex].elements[props.listIndex].h5pElement
        : props.block === 'subchapterElements' &&
          props.chapterIndex !== undefined &&
          props.subchapterIndex !== undefined &&
          props.listIndex !== undefined &&
          state.editor.chapters[props.chapterIndex].subchapters[props.subchapterIndex].elements[
            props.listIndex
          ].h5pElement,
  )
  const [localH5PElement, setLocalH5PElement] = useState<h5pElementInterface>(
    h5pElement || { value: '', error: '' },
  )

  const handleChangeInput = (val: string) => {
    if (val.toLowerCase().includes('<script')) {
      setLocalH5PElement({
        value: val,
        error: "You can't use <script> tag!",
      })
    } else {
      setLocalH5PElement({ error: '', value: val })
    }
  }

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(
      setElementH5P({
        block: props.block,
        h5pElement: localH5PElement,
        index: props.listIndex,
        nestedIndex: props.chapterIndex,
        subchapterIndex: props.subchapterIndex,
      }),
    )
  }, [localH5PElement])

  return localH5PElement ? (
    <div className="flex flex-col gap-y-2 pt-5">
      <p>h5p element</p>
      <TextInput
        handleChange={handleChangeInput}
        placeholder="Insert the h5p embed code here"
        value={localH5PElement.value}
      />
      {localH5PElement.error && <p className="text-red-500">{localH5PElement.error}</p>}
    </div>
  ) : (
    <div></div>
  )
}

export default H5pElement
