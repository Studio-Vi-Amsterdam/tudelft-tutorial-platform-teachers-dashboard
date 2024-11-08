import React from 'react'
import { useAppDispatch } from 'src/redux/hooks'
import {
  changeSubchapterText,
  changeSubchapterTitle,
  setElementInfobox,
  setElementText,
} from 'src/redux/features/editorSlice'
import { ChapterElementsObject } from 'src/types/types'
import AddMediaElement from './AddMediaElement'
import DeleteElementWraper from './DeleteElementWraper'
import QuizElement from './QuizElement'
import H5pElement from './H5pElement'
import FileElement from './FileElement'
import TutorialCardsElement from './TutorialCardsElement'
import BundledEditor from './BundledEditor'
import SelectThumbnail from './SelectThumbnail'
import SelectSubtitles from './SelectSubtitles'
import ExternalVideoElement from './ExternalVideoElement'

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
          text: { text: value, isValid: true },
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
          infobox: { text: value, isValid: true },
          nestedIndex: chapterIndex,
          subchapterIndex,
        }),
      )
    }
  }

  const handleSubchapterTextChange = (
    val: string,
    index: number,
    layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText' | 'textLayout',
    listIndex: number,
  ) => {
    if (listIndex !== undefined && layout !== undefined) {
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
    layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText' | 'textLayout',
    chapterIndex?: number,
  ) => {
    dispatch(changeSubchapterTitle({ value, chapterIndex, layout, listIndex, block }))
  }

  return (
    <div className="flex w-full flex-col gap-y-6">
      {elements.map((element, index) => (
        <div className="w-full" key={index}>
          {element?.textLayout !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <div className="relative w-full mt-4 mb-5 ">
                <input
                  type="text"
                  className={`${element.textLayout.title.isValid ? '' : 'border border-red-500 rounded-md'} w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone`}
                  value={element.textLayout.title.text}
                  placeholder={'Subchapter Title'}
                  onChange={(e) =>
                    handleSubchapterTitleChange(
                      e.target.value,
                      index,
                      'textLayout',
                      props.chapterIndex,
                    )
                  }
                />
              </div>
              <div className="w-full flex flex-col sm:flex-row justify-between gap-6">
                <div className="w-full">
                  <BundledEditor
                    value={element.textLayout.text.text}
                    block={block}
                    index={props.chapterIndex}
                    handleChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    notValid={!element.textLayout.text.isValid}
                    layout="textLayout"
                    extended
                  />
                </div>
              </div>
            </DeleteElementWraper>
          )}
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
                  className={`${element.textImage.title.isValid ? '' : 'border border-red-500 rounded-md'} w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone`}
                  value={element.textImage.title.text}
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
                  <BundledEditor
                    value={element.textImage.text.text}
                    block={block}
                    index={props.chapterIndex}
                    handleChange={handleSubchapterTextChange}
                    notValid={!element.textImage.text.isValid}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="textImage"
                    extended
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
                    mediaTypeFilter="only-image"
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
                  className={`${element.imageText.title.isValid ? '' : 'border border-red-500 rounded-md'} w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone`}
                  value={element.imageText.title.text}
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
                    mediaTypeFilter="only-image"
                  />
                </div>
                <div className="sm:w-1/2">
                  <BundledEditor
                    value={element.imageText.text.text}
                    block={block}
                    index={props.chapterIndex}
                    notValid={!element.imageText.text.isValid}
                    handleChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="imageText"
                    extended
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
                  className={`${element.videoText.title.isValid ? '' : 'border border-red-500 rounded-md'} w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone`}
                  value={element.videoText.title.text}
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
                  <div className="w-full flex flex-col gap-y-4">
                    <AddMediaElement
                      mediaType="video"
                      block={props.block}
                      chapterIndex={props.chapterIndex}
                      subchapterIndex={props.subchapterIndex}
                      listIndex={index}
                      layout="videoText"
                      mediaTypeFilter="only-video"
                    />
                    <SelectThumbnail
                      video={element.videoText.video}
                      chapterIndex={props.chapterIndex}
                      subchapterIndex={props.subchapterIndex}
                      listIndex={index}
                      layout="videoText"
                    />
                    <SelectSubtitles
                      video={element.videoText.video}
                      chapterIndex={props.chapterIndex}
                      subchapterIndex={props.subchapterIndex}
                      listIndex={index}
                      layout="videoText"
                    />
                  </div>
                </div>
                <div className="sm:w-1/2">
                  <BundledEditor
                    value={element.videoText.text.text}
                    block={block}
                    notValid={!element.videoText.text.isValid}
                    index={props.chapterIndex}
                    handleChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="videoText"
                    extended
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
                  className={`${element.textVideo.title.isValid ? '' : 'border border-red-500 rounded-md'} w-full rounded-[4px] border border-inputBorder bg-background-seasalt px-2 py-[10px] text-xl leading-8 placeholder:text-tertiary-grey-stone`}
                  value={element.textVideo.title.text}
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
                  <BundledEditor
                    value={element.textVideo.text.text}
                    notValid={!element.textVideo.text.isValid}
                    block={block}
                    index={props.chapterIndex}
                    handleChange={handleSubchapterTextChange}
                    subchapter={true}
                    subchapterIndex={index}
                    layout="textVideo"
                    extended
                  />
                </div>
                <div className="sm:w-1/2">
                  <div className="w-full flex flex-col gap-y-4">
                    <AddMediaElement
                      mediaType="video"
                      block={props.block}
                      chapterIndex={props.chapterIndex}
                      subchapterIndex={props.subchapterIndex}
                      listIndex={index}
                      layout="textVideo"
                      mediaTypeFilter="only-video"
                    />
                    <SelectThumbnail
                      video={element.textVideo.video}
                      chapterIndex={props.chapterIndex}
                      subchapterIndex={props.subchapterIndex}
                      listIndex={index}
                      layout="textVideo"
                    />
                    <SelectSubtitles
                      video={element.textVideo.video}
                      chapterIndex={props.chapterIndex}
                      subchapterIndex={props.subchapterIndex}
                      listIndex={index}
                      layout="textVideo"
                    />
                  </div>
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
              <BundledEditor
                value={element.text.text}
                block={block}
                index={index}
                handleChange={handleTextElementChange}
                extended
                notValid={!element.text.isValid}
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
              <BundledEditor
                value={element.infobox.text}
                block={block}
                index={index}
                handleChange={handleInfoboxElementChange}
                notValid={!element.infobox.isValid}
              />
            </DeleteElementWraper>
          )}
          {element.tutorialCards !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
            >
              <TutorialCardsElement
                block={block}
                chapterIndex={chapterIndex}
                index={index}
                tutorialCards={element.tutorialCards}
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
                mediaTypeFilter="only-image"
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
              <div className="w-full flex flex-col gap-y-4">
                <AddMediaElement
                  mediaType="video"
                  block={props.block}
                  chapterIndex={props.chapterIndex}
                  subchapterIndex={props.subchapterIndex}
                  listIndex={index}
                  mediaTypeFilter="only-video"
                />
                <SelectThumbnail
                  video={element.video}
                  chapterIndex={props.chapterIndex}
                  subchapterIndex={props.subchapterIndex}
                  listIndex={index}
                />
                <SelectSubtitles
                  chapterIndex={props.chapterIndex}
                  subchapterIndex={props.subchapterIndex}
                  listIndex={index}
                  video={element.video}
                />
              </div>
            </DeleteElementWraper>
          )}
          {element?.externalVideo !== undefined && (
            <DeleteElementWraper
              block={block}
              chapterIndex={props.chapterIndex}
              subchapterIndex={subchapterIndex}
              elementIndex={index}
              styles="bg-white top-3 right-1 w-6 h-6"
            >
              <ExternalVideoElement
                chapterIndex={props.chapterIndex}
                attributes={element.externalVideo}
                index={index}
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
              file={element.file.file?.id}
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
