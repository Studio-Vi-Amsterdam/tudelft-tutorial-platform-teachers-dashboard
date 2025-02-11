import React from 'react'
import TextInput from '../ui/TextInput'
import { AddElementsType, ChapterInterface, SubchapterLayout } from 'src/types/types'
import ElementsBlock from './ElementsBlock'
import AddMediaElement from './AddMediaElement'
import BundledEditor from './BundledEditor'
import SelectThumbnail from './SelectThumbnail'
import SelectSubtitles from './SelectSubtitles'
import AddSectionBlock from './AddSectionBlock'
// import SelectSubtitles from './SelectSubtitles'

interface ChapterContentProps {
  chapter: ChapterInterface
  chapterIndex: number
  handleChangeChapterTitle: (val: string, index?: number) => void
  handleChapterTextInputChange: (val: string, index: number) => void
  handleAddElement: (val: string, index?: number) => void
  elements: AddElementsType[]
  setIsSubchapterCreating: React.Dispatch<React.SetStateAction<boolean>>
}

const ChapterContent = (props: ChapterContentProps) => {
  const {
    chapter,
    chapterIndex,
    handleChangeChapterTitle,
    handleChapterTextInputChange,
    handleAddElement,
  } = props

  let layout = ''
  switch (chapter.layout) {
    case 'image left':
      layout = 'imageText'
      break
    case 'video left':
      layout = 'videoText'
      break
    case 'video right':
      layout = 'textVideo'
      break
    case 'image right':
      layout = 'textImage'
      break
  }

  return (
    <>
      <TextInput
        placeholder="Chapter title"
        headingType="h2"
        value={chapter.title.text}
        index={chapterIndex}
        handleChange={handleChangeChapterTitle}
        notValid={!chapter.title.isValid}
      />

      {chapter.layout !== '1 column' && (
        <>
          <div
            className={`${
              chapter.layout.split(' ')[1] === 'left'
                ? 'flex-col sm:flex-row-reverse'
                : 'flex-col sm:flex-row'
            } flex gap-6`}
          >
            <div className={'sm:w-1/2'}>
              <BundledEditor
                handleChange={handleChapterTextInputChange}
                index={chapterIndex}
                value={chapter.text.text}
                extended
                notValid={!chapter.text.isValid}
              />
            </div>

            <div className="sm:w-1/2">
              {chapter.layout.split(' ')[0] === 'video' && (
                <>
                  <AddMediaElement
                    block="chapterMedia"
                    chapterIndex={chapterIndex}
                    mediaType={'video'}
                    layout={layout as SubchapterLayout}
                    listIndex={undefined}
                    subchapterIndex={undefined}
                    mediaTypeFilter="only-video"
                  />
                  {chapter?.video && (
                    <>
                      <SelectThumbnail
                        video={chapter.video}
                        chapterIndex={chapterIndex}
                        layout="videoText"
                        listIndex={undefined}
                        subchapterIndex={undefined}
                      />
                      <SelectSubtitles
                        video={chapter.video}
                        chapterIndex={chapterIndex}
                        layout="videoText"
                        listIndex={undefined}
                        subchapterIndex={undefined}
                      />
                    </>
                  )}
                </>
              )}
              {chapter.layout.split(' ')[0] === 'image' && (
                <AddMediaElement
                  block="chapterMedia"
                  chapterIndex={chapterIndex}
                  layout={layout as SubchapterLayout}
                  mediaType={'image'}
                  listIndex={undefined}
                  subchapterIndex={undefined}
                  mediaTypeFilter="only-image"
                />
              )}
            </div>
          </div>
        </>
      )}

      <ElementsBlock
        elements={chapter.elements}
        handleAddElement={handleAddElement}
        block="chapterElements"
        chapterIndex={chapterIndex}
      />

      <AddSectionBlock
        variant="outline"
        chapterIndex={chapterIndex}
        handleAddElement={handleAddElement}
        setIsSubchapterCreating={props.setIsSubchapterCreating}
      />
    </>
  )
}

export default ChapterContent
