import React from 'react'
import { useAppDispatch } from 'src/redux/hooks'
import {
  changeSubchapterText,
  setElementInfobox,
  setElementText,
} from 'src/redux/features/editorSlice'
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

  const handleSubchapterTextChange = (
    val: string,
    index: number,
    layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText',
    listIndex: number,
  ) => {
    if (index !== undefined && listIndex !== undefined && layout !== undefined) {
      dispatch(
        changeSubchapterText({
          chapterIndex: index,
          layout,
          listIndex,
          value: val,
        }),
      )
    }
  }

  return (
    <div className="flex w-full flex-col gap-y-6">
      {elements.map((element, index) => (
        <div className="w-full" key={index}>
          {element?.textImage !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <div className="w-full flex flex-row justify-between gap-6">
                <div className="w-1/2">
                  <ExtendedBundledEditor
                    value={element.textImage.text}
                    block={block}
                    chapterIndex={props.chapterIndex}
                    handleSubchapterTextChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="textImage"
                  />
                </div>
                <div className="w-1/2">
                  <AddMediaElement
                    mediaType="image"
                    block={props.block}
                    chapterIndex={props.chapterIndex}
                    subchapterIndex={props.subchapterIndex}
                    listIndex={index}
                    layout="textImage"
                  />
                </div>
              </div>
            </DeleteElementWraper>
          )}
          {element?.imageText !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <div className="w-full flex flex-row justify-between gap-6">
                <div className="w-1/2">
                  <AddMediaElement
                    mediaType="image"
                    block={props.block}
                    chapterIndex={props.chapterIndex}
                    subchapterIndex={props.subchapterIndex}
                    listIndex={index}
                    layout="imageText"
                  />
                </div>
                <div className="w-1/2">
                  <ExtendedBundledEditor
                    value={element.imageText.text}
                    block={block}
                    chapterIndex={props.chapterIndex}
                    handleSubchapterTextChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="imageText"
                  />
                </div>
              </div>
            </DeleteElementWraper>
          )}
          {element?.videoText !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <div className="w-full flex flex-row justify-between gap-6">
                <div className="w-1/2">
                  <AddMediaElement
                    mediaType="video"
                    block={props.block}
                    chapterIndex={props.chapterIndex}
                    subchapterIndex={props.subchapterIndex}
                    listIndex={index}
                    layout="videoText"
                  />
                </div>
                <div className="w-1/2">
                  <ExtendedBundledEditor
                    value={element.videoText.text}
                    block={block}
                    chapterIndex={props.chapterIndex}
                    handleSubchapterTextChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="videoText"
                  />
                </div>
              </div>
            </DeleteElementWraper>
          )}
          {element?.textVideo !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <div className="w-full flex flex-row justify-between gap-6">
                <div className="w-1/2">
                  <ExtendedBundledEditor
                    value={element.textVideo.text}
                    block={block}
                    chapterIndex={props.chapterIndex}
                    handleSubchapterTextChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="textVideo"
                  />
                </div>
                <div className="w-1/2">
                  <AddMediaElement
                    mediaType="video"
                    block={props.block}
                    chapterIndex={props.chapterIndex}
                    subchapterIndex={props.subchapterIndex}
                    listIndex={index}
                    layout="textVideo"
                  />
                </div>
              </div>
            </DeleteElementWraper>
          )}
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
