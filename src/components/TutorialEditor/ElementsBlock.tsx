import React from 'react'
import { useAppDispatch } from 'src/redux/hooks'
import {
  addTutorialCard,
  changeSubchapterText,
  changeSubchapterTitle,
  changeTutorialCard,
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
import { Button } from '../ui/Button'

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

  const handleSubchapterTitleChange = (
    value: string,
    listIndex: number,
    layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText',
    chapterIndex?: number,
  ) => {
    if (chapterIndex !== undefined) {
      dispatch(changeSubchapterTitle({ value, chapterIndex, layout, listIndex }))
    }
  }

  const handleSelectTutorialCard = (
    value: string,
    block: string,
    listIndex: number,
    nestedIndex: number,
    chapterIndex?: number,
  ) => {
    dispatch(changeTutorialCard({ value, block, listIndex, nestedIndex, chapterIndex }))
  }

  const handleAddTutorialCardToGroup = (
    block: string,
    listIndex: number,
    chapterIndex?: number,
  ) => {
    dispatch(addTutorialCard({ block, listIndex, chapterIndex }))
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
              <div className="relative w-full mt-4 mb-5 ">
                <input
                  type="text"
                  className={
                    'w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone'
                  }
                  value={element.textImage.title}
                  placeholder={'Subchapter Title'}
                  onChange={(e) =>
                    handleSubchapterTitleChange(
                      e.target.value,
                      index,
                      'textImage',
                      props.chapterIndex,
                    )
                  }
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between gap-6">
                <div className="sm:w-1/2">
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
                <div className="sm:w-1/2">
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
              <div className="relative w-full mt-4 mb-5 ">
                <input
                  type="text"
                  className={
                    'w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone'
                  }
                  value={element.imageText.title}
                  placeholder={'Subchapter Title'}
                  onChange={(e) =>
                    handleSubchapterTitleChange(
                      e.target.value,
                      index,
                      'imageText',
                      props.chapterIndex,
                    )
                  }
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between gap-6">
                <div className="sm:w-1/2">
                  <AddMediaElement
                    mediaType="image"
                    block={props.block}
                    chapterIndex={props.chapterIndex}
                    subchapterIndex={props.subchapterIndex}
                    listIndex={index}
                    layout="imageText"
                  />
                </div>
                <div className="sm:w-1/2">
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
              <div className="relative w-full mt-4 mb-5 ">
                <input
                  type="text"
                  className={
                    'w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone'
                  }
                  value={element.videoText.title}
                  placeholder={'Subchapter Title'}
                  onChange={(e) =>
                    handleSubchapterTitleChange(
                      e.target.value,
                      index,
                      'videoText',
                      props.chapterIndex,
                    )
                  }
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between gap-6">
                <div className="sm:w-1/2">
                  <AddMediaElement
                    mediaType="video"
                    block={props.block}
                    chapterIndex={props.chapterIndex}
                    subchapterIndex={props.subchapterIndex}
                    listIndex={index}
                    layout="videoText"
                  />
                </div>
                <div className="sm:w-1/2">
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
              <div className="relative w-full mt-4 mb-5 ">
                <input
                  type="text"
                  className={
                    'w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone'
                  }
                  value={element.textVideo.title}
                  placeholder={'Subchapter Title'}
                  onChange={(e) =>
                    handleSubchapterTitleChange(
                      e.target.value,
                      index,
                      'textVideo',
                      props.chapterIndex,
                    )
                  }
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between gap-6">
                <div className="sm:w-1/2">
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
                <div className="sm:w-1/2">
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
          {/* {element.tutorialCard !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <div className="flex w-full flex-row items-center justify-between gap-2">
                <div className="min-w-[104px] max-w-[104px]">Tutorial</div>
                <div className="w-9/12">
                  <select
                    value={element.tutorialCard.value.title}
                    className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                    onChange={(e) =>
                      handleSelectTutorialCard(e.target.value, block, index, props.chapterIndex)
                    }
                  >
                    <option value="">Choose tutorial</option>
                    {element.tutorialCard.proposedList &&
                      element.tutorialCard.proposedList.map((listItem, index) => (
                        <option key={index} value={listItem.title}>
                          {listItem.title}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </DeleteElementWraper>
          )} */}
          {element.tutorialCards !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <div className="flex w-full flex-col items-start justify-between gap-4 bg-tertiary-skyBlue-10">
                {element.tutorialCards.map((el, nestedIndex) => (
                  <div
                    key={nestedIndex}
                    className="flex w-full flex-row items-center justify-between gap-2"
                  >
                    <div className="min-w-[104px] max-w-[104px]">Tutorial</div>
                    <div className="w-9/12">
                      <select
                        value={el.value.title}
                        className="w-full rounded-[4px] border border-DIM bg-background-seasalt p-4  text-tertiary-grey-stone"
                        onChange={(e) =>
                          handleSelectTutorialCard(
                            e.target.value,
                            block,
                            index,
                            nestedIndex,
                            props.chapterIndex,
                          )
                        }
                      >
                        <option value="">Choose tutorial</option>
                        {el.proposedList &&
                          el.proposedList.map((listItem, index) => (
                            <option key={index} value={listItem.title}>
                              {listItem.title}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                ))}
                <Button
                  variant={'dashed'}
                  onClick={() => handleAddTutorialCardToGroup(block, index, chapterIndex)}
                >
                  <div>+</div>
                  <p>Add Card</p>
                </Button>
              </div>
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
