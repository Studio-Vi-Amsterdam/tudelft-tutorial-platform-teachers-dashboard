import React from 'react'
import EditorLabel from '../ui/EditorLabel'
import { AddElementsType, SubchapterInterface } from 'src/types/types'
import TextInput from '../ui/TextInput'
import ChapterMenu from './ChapterMenu'
import { deleteChapter, duplicateChapter, moveChapter } from 'src/redux/features/editorSlice'
import AddMediaElement from './AddMediaElement'
import ExtendedBundledEditor from './ExtendedBundledEditor'

interface SubchapterContentProps {
  subchapters: SubchapterInterface[]
  chapterTitle: string
  chapterIndex: number
  handleChangeSubchapterTitle: (
    val: string,
    index?: number | undefined,
    subchapterIndex?: number,
  ) => void
  handleSubchapterTextInputChange: (val: string, index: number, subchapterIndex: number) => void
  elements: AddElementsType[]
  handleAddSubchapterElement: (val: string, index?: number, subchapterIndex?: number) => void
}

const SubchapterContent = (props: SubchapterContentProps) => {
  const {
    subchapters,
    chapterTitle,
    chapterIndex,
    handleChangeSubchapterTitle,
    handleSubchapterTextInputChange,
  } = props
  return (
    <section>
      {subchapters?.map((subchapter, subchapterIndex) => (
        <section key={subchapterIndex} className="relative flex w-full flex-col gap-y-6 ">
          <EditorLabel>
            This section is a subchapter to chapter {`${chapterTitle && `"${chapterTitle}"`}`}.
          </EditorLabel>
          <ChapterMenu
            index={subchapterIndex}
            moveChapter={moveChapter}
            deleteChapter={deleteChapter}
            duplicateChapter={duplicateChapter}
            parentIndex={chapterIndex}
          />
          <TextInput
            placeholder="Subchapter title"
            headingType="h3"
            value={subchapter.title}
            index={chapterIndex}
            subchapterIndex={subchapterIndex}
            handleChange={handleChangeSubchapterTitle}
          />
          <div
            className={`${
              subchapter.layout === '1 column'
                ? 'flex-col'
                : subchapter.layout.split(' ')[1] === 'left'
                  ? 'flex-col sm:flex-row-reverse'
                  : 'flex-col sm:flex-row'
            } flex gap-x-6`}
          >
            <div className={`${subchapter.layout === '1 column' ? ' w-full' : ' w-1/2 '}`}>
              <ExtendedBundledEditor
                handleInputChange={handleSubchapterTextInputChange}
                subchapter={true}
                value={subchapter.text}
                chapterIndex={chapterIndex}
                subchapterIndex={subchapterIndex}
              />
            </div>
            {subchapter.layout !== '1 column' && (
              <div className="w-1/2">
                <div className="flex w-full flex-col gap-y-2">
                  {subchapter.layout.split(' ')[0] === 'video' && (
                    <AddMediaElement
                      block="subchapterMedia"
                      chapterIndex={chapterIndex}
                      mediaType={'video'}
                      listIndex={undefined}
                      subchapterIndex={subchapterIndex}
                    />
                  )}
                  {subchapter.layout.split(' ')[0] === 'image' && (
                    <AddMediaElement
                      block="subchapterMedia"
                      chapterIndex={chapterIndex}
                      mediaType={'image'}
                      listIndex={undefined}
                      subchapterIndex={subchapterIndex}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </section>
  )
}

export default SubchapterContent
