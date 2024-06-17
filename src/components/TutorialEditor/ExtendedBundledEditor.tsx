import React from 'react'
import BundledEditor from './BundledEditor'

interface BundledEditorProps {
  value: string
  chapterIndex?: number
  subchapterIndex?: number
  subchapter: boolean
  block?: string
  handleInputChange?: (val: string, index: number, subchapterIndex: number) => void
  handleTextChange?: (val: string, index: number, block: string) => void
}

const ExtendedBundledEditor = (props: BundledEditorProps) => {
  return (
    <BundledEditor
      value={props.value}
      index={props.chapterIndex}
      subchapterIndex={props.subchapterIndex}
      handleChange={
        props.handleInputChange
          ? props.handleInputChange
          : props.handleTextChange
            ? props.handleTextChange
            : () => {
                console.log('Change text')
              }
      }
      subchapter={props.subchapter}
      block={props.block}
      init={{
        menubar: false,
        resize: true,
        plugins: [
          'table',
          'lists',
          'link',
          'code',
          'autoresize',
          'command',
          'term',
          'mark',
          'eqneditor',
        ],

        toolbar: 'bullist numlist link code table command term mark mathjax eqneditor',
      }}
    />
  )
}

export default ExtendedBundledEditor
