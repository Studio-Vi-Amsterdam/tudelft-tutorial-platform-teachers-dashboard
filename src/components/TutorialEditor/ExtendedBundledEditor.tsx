import React from 'react'
import BundledEditor from './BundledEditor'

interface BundledEditorProps {
  value: string
  chapterIndex?: number
  subchapterIndex?: number
  subchapter: boolean
  block?: string
  layout?: 'textImage' | 'imageText' | 'textVideo' | 'videoText'
  handleInputChange?: (val: string, index: number, subchapterIndex: number) => void
  handleTextChange?: (val: string, index: number, block: string) => void
  handleSubchapterTextChange?: (
    val: string,
    index: number,
    layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText',
    listIndex: number,
  ) => void
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
            : props.handleSubchapterTextChange
              ? props.handleSubchapterTextChange
              : () => {
                  console.log('Change text')
                }
      }
      layout={props.layout}
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
          'mark' /* 
          'eqneditor', */,
        ],

        /* toolbar: 'bullist numlist link code table command term mark mathjax eqneditor', */
        toolbar: 'bullist numlist link code table command term mark mathjax',
      }}
    />
  )
}

export default ExtendedBundledEditor
