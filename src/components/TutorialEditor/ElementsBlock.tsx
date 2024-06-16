import React from 'react'
import { useAppDispatch } from 'src/redux/hooks'
import { setElementInfobox, setElementText } from 'src/redux/features/editorSlice'
import { ChapterElementsObject } from 'src/types/types'
import AddMediaElement from './AddMediaElement'
import ExtendedBundledEditor from './ExtendedBundledEditor'
import ReducedBundledEditor from './ReducedBundledEditor'
import DeleteElementWraper from './DeleteElementWraper'
import QuizElement from './QuizElement'
import H5pElement from './H5pElement'
import FileElement from './FileElement'

interface ElementsBlockProps {
  elements: Array<ChapterElementsObject>
  block: string
  chapterIndex?: number
  subchapterIndex?: number
}

const ElementsBlock = (props: ElementsBlockProps) => {
  const { elements, block, chapterIndex, subchapterIndex } = props
  const dispatch = useAppDispatch()

  const handleTextElementChange = (value: string, index?: number, block?: string): void => {
    if (block !== undefined && index !== undefined) {
      dispatch(
        setElementText({
          block,
          index,
          text: value,
          nestedIndex: chapterIndex,
          subchapterIndex,
        }),
      )
    }
  }

  const handleInfoboxElementChange = (value: string, index?: number, block?: string): void => {
    if (block !== undefined && index !== undefined) {
      dispatch(
        setElementInfobox({
          block,
          index,
          infobox: value,
          nestedIndex: chapterIndex,
          subchapterIndex,
        }),
      )
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-6">
      {elements.map((element, index) => (
        <div className="w-full" key={index}>
          {element?.text !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <ExtendedBundledEditor
                value={element.text}
                block={block}
                chapterIndex={index}
                handleTextChange={handleTextElementChange}
                subchapter={false}
              />
            </DeleteElementWraper>
          )}
          {element?.infobox !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <ReducedBundledEditor
                value={element.infobox}
                block={block}
                chapterIndex={index}
                handleTextChange={handleInfoboxElementChange}
                subchapter={false}
              />
            </DeleteElementWraper>
          )}
          {element?.image !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <AddMediaElement
                mediaType="image"
                block={props.block}
                chapterIndex={props.chapterIndex}
                subchapterIndex={props.subchapterIndex}
                listIndex={index}
              />
            </DeleteElementWraper>
          )}
          {element?.video !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <AddMediaElement
                mediaType="video"
                block={props.block}
                chapterIndex={props.chapterIndex}
                subchapterIndex={props.subchapterIndex}
                listIndex={index}
              />
            </DeleteElementWraper>
          )}
          {element?.file !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
              styles="bg-white top-3 right-1 w-6 h-6"
            >
              <FileElement
                block={props.block}
                chapterIndex={props.chapterIndex}
                subchapterIndex={props.subchapterIndex}
                listIndex={index}
              />
            </DeleteElementWraper>
          )}
          {element?.quiz !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <QuizElement
                block={props.block}
                chapterIndex={props.chapterIndex}
                subchapterIndex={props.subchapterIndex}
                listIndex={index}
              />
            </DeleteElementWraper>
          )}
          {element?.h5pElement !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <H5pElement
                block={props.block}
                chapterIndex={props.chapterIndex}
                subchapterIndex={props.subchapterIndex}
                listIndex={index}
              />
            </DeleteElementWraper>
          )}
        </div>
      ))}
    </div>
  )
}

export default ElementsBlock
