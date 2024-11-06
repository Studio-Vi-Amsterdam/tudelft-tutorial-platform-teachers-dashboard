import React from 'react'
import TextInput from '../ui/TextInput'
import { AddElementsType, ChapterInterface } from 'src/types/types'
import ElementsBlock from './ElementsBlock'
import AddElementBlock from './AddElementBlock'
import AddMediaElement from './AddMediaElement'
import BundledEditor from './BundledEditor'
import SelectThumbnail from './SelectThumbnail'
import SelectSubtitles from './SelectSubtitles'
// import SelectSubtitles from './SelectSubtitles'

interface ChapterContentProps {
  chapter: ChapterInterface
  chapterIndex: number
  handleChangeChapterTitle: (val: string, index?: number) => void
  handleChapterTextInputChange: (val: string, index: number) => void
  handleAddElement: (val: string, index?: number) => void
  elements: AddElementsType[]
}

const ChapterContent = (props: ChapterContentProps) => {
  const {
    chapter,
    chapterIndex,
    handleChangeChapterTitle,
    handleChapterTextInputChange,
    handleAddElement,
    elements,
  } = props

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
      <div
        className={`${
          chapter.layout === '1 column'
            ? 'flex-col'
            : chapter.layout.split(' ')[1] === 'left'
              ? 'flex-col sm:flex-row-reverse'
              : 'flex-col sm:flex-row'
        } flex gap-6`}
      >
        <div className={`${chapter.layout === '1 column' ? ' w-full' : ' sm:w-1/2 '}`}>
          <BundledEditor
            handleChange={handleChapterTextInputChange}
            index={chapterIndex}
            value={chapter.text.text}
            extended
            notValid={!chapter.text.isValid}
          />
        </div>
        {chapter.layout !== '1 column' && (
          <div className="sm:w-1/2">
            {chapter.layout.split(' ')[0] === 'video' && (
              <>
                <AddMediaElement
                  block="chapterMedia"
                  chapterIndex={chapterIndex}
                  mediaType={'video'}
                  listIndex={undefined}
                  subchapterIndex={undefined}
                  mediaTypeFilter="only-video"
                />
                {chapter?.video && (
                  <>
                    <SelectThumbnail
                      video={chapter.video}
                      chapterIndex={props.chapterIndex}
                      layout="videoText"
                      listIndex={undefined}
                      subchapterIndex={undefined}
                    />
                    <SelectSubtitles
                      video={chapter.video}
                      chapterIndex={props.chapterIndex}
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
                mediaType={'image'}
                listIndex={undefined}
                subchapterIndex={undefined}
                mediaTypeFilter="only-image"
              />
            )}
          </div>
        )}
      </div>

      <ElementsBlock
        elements={chapter.elements}
        block="chapterElements"
        chapterIndex={chapterIndex}
      />

      <AddElementBlock
        handleAddElement={handleAddElement}
        elements={elements}
        index={chapterIndex}
      />
    </>
  )
}

export default ChapterContent
