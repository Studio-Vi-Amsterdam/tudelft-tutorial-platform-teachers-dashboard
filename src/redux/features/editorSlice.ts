import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { urlPattern } from 'src/lib/regex/externalVideo'
import {
  AddChapterElementInterface,
  AddSubchapterElementInterface,
  AllMetafieldsType,
  ArtictesType,
  BlankSubchapterActionInterface,
  ChapterInterface,
  ChapterSubtitlesActionInterface,
  ChapterTextFieldActionInterface,
  ChapterThumbnailActionInterface,
  EditorState,
  Element,
  ElementFileActionInterface,
  ElementH5PActionInterface,
  ElementImageActionInterface,
  ElementInfoboxTitleActionInterface,
  ElementQuizActionInterface,
  ElementTextActionInterface,
  ElementVideoActionInterface,
  LayoutChapterType,
  MediaObjectInterface,
  MoveChapterInterface,
  SubchapterImageAction,
  SubchapterTextFieldActionInterface,
  SubtitlesActionInterface,
  ThumbnailActionInterface,
  TutorialCardInterface,
  TutorialMetaObject,
  TutorialResponsibleInterface,
  TutorialTopElementsObject,
} from 'src/types/types'

const initialState: EditorState = {
  isEditorLoaded: false,
  pageType: undefined,
  tutorialTop: {
    title: {
      text: '',
      isValid: true,
    },
    titleType: 'h1',
    description: {
      text: '',
      isValid: true,
    },
    elements: [],
  },
  tutorialBottomContent: [],
  chapters: [],
  tutorialBottom: {
    title: 'Useful links',
    titleType: 'h2',
    text: '',
  },
  meta: {},
  mediaIds: [],
}

const removeFirstOccurrence = (array: number[], value: number): number[] => {
  const index = array.indexOf(value)
  if (index !== -1) {
    return [...array.slice(0, index), ...array.slice(index + 1)]
  }
  return array
}

const setElementProperty = (state: any, action: PayloadAction<any>, property: keyof Element) => {
  const { block, index, nestedIndex, subchapterIndex, value, layout } = action.payload

  if (block === 'tutorialElements' && index !== undefined) {
    if (layout) {
      state.tutorialTop.elements[index][layout][property] = {
        ...state.tutorialTop.elements[index][layout][property],
        ...value,
      }
    } else {
      state.tutorialTop.elements[index][property] = {
        ...state.tutorialTop.elements[index][property],
        ...value,
      }
    }
  } else if (block === 'tutorialBottomElements' && index !== undefined) {
    if (layout) {
      state.tutorialBottomContent[index][layout][property] = {
        ...state.tutorialBottomContent[index][layout][property],
        ...value,
      }
    } else {
      state.tutorialBottomContent[index][property] = {
        ...state.tutorialBottomContent[index][property],
        ...value,
      }
    }
  } else if (block === 'chapterElements' && index !== undefined && nestedIndex !== undefined) {
    state.chapters[nestedIndex].elements[index][property] = {
      ...state.chapters[nestedIndex].elements[index][property],
      ...value,
    }
  } else if (
    block === 'subchapterElements' &&
    index !== undefined &&
    nestedIndex !== undefined &&
    subchapterIndex !== undefined
  ) {
    state.chapters[nestedIndex].subchapters[subchapterIndex].elements[index][property] = {
      ...state.chapters[nestedIndex].subchapters[subchapterIndex].elements[index][property],
      ...value,
    }
  } else if (block === 'chapterMedia' && nestedIndex !== undefined) {
    state.chapters[nestedIndex][property] = { ...state.chapters[nestedIndex][property], ...value }
  } else if (
    block === 'subchapterMedia' &&
    nestedIndex !== undefined &&
    subchapterIndex !== undefined
  ) {
    state.chapters[nestedIndex].subchapters[subchapterIndex][property] = {
      ...state.chapters[nestedIndex].subchapters[subchapterIndex][property],
      ...value,
    }
  }
}

export const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    setEditorLoaded: (state, action: PayloadAction<boolean>) => {
      state.isEditorLoaded = action.payload
    },
    setNewState: (
      state,
      action: PayloadAction<{
        parsedObject: EditorState | undefined
        articleType?: ArtictesType
        info?: any
      }>,
    ) => {
      if (action.payload.parsedObject === undefined) {
        state.chapters = initialState.chapters
        state.meta = initialState.meta
        state.pageType = initialState.pageType
        state.tutorialBottom = initialState.tutorialBottom
        state.tutorialTop = initialState.tutorialTop
        state.mediaIds = initialState.mediaIds
        if (action.payload.articleType && action.payload.info) {
          const { info } = action.payload
          if (action.payload.articleType === 'tutorials') {
            state.meta = {
              tutorialBelongs: {
                course: {
                  fieldTitle: 'Course',
                  isValid: true,
                  required: false,
                  list: info.courses,
                  value: { id: undefined, title: '' },
                },
                primary: {
                  fieldTitle: 'Primary software used',
                  isValid: true,
                  required: true,
                  list: info.software,
                  value: { id: undefined, title: '', version: [] },
                },
                version: {
                  fieldTitle: 'Software version',
                  isValid: true,
                  list: [],
                  value: { id: undefined, title: '' },
                  required: false,
                },
                primarySubject: {
                  fieldTitle: 'Primary subject',
                  list: info.subjects,
                  isValid: true,
                  required: true,
                  value: {
                    id: undefined,
                    title: '',
                  },
                },
                secondarySubject: {
                  fieldTitle: 'Secondary subject',
                  list: info.secondarySubjects,
                  isValid: true,
                  required: false,
                  value: {
                    id: undefined,
                    title: '',
                  },
                },
                keywords: {
                  required: true,
                  list: [],
                  isValid: true,
                  value: '',
                  proposedList: info.keywords,
                  fieldTitle: 'Keywords',
                },
                image: {
                  fieldTitle: 'Featured image',
                  required: false,
                  isValid: true,
                  value: {
                    isValid: true,
                    format: '',
                    link: '',
                    publishDate: '',
                    title: '',
                    type: 'image',
                    id: undefined,
                    url: '',
                    description: '',
                  },
                },
                level: {
                  fieldTitle: 'Level',
                  isValid: true,
                  required: false,
                  list: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                  value: '',
                },
              },
              tutorialResponsible: {
                faculty: {
                  fieldTitle: 'Faculty',
                  isValid: true,
                  required: true,
                  value: '',
                  list: ['Bouwkunde'] /* Hardcoded now, as in design file */,
                },
                teachers: {
                  required: true,
                  isValid: true,
                  list: [],
                  value: '',
                  proposedList: info.teachers,
                  fieldTitle: 'Teachers',
                },
              },
            }
          } else if (action.payload.articleType === 'courses') {
            state.meta = {
              courseBelongs: {
                course: {
                  fieldTitle: 'Course',
                  isValid: true,
                  required: false,
                  value: '',
                },
                courseCode: {
                  fieldTitle: 'Course code',
                  required: true,
                  isValid: true,
                  value: '',
                },
                image: {
                  fieldTitle: 'Featured image',
                  required: false,
                  isValid: true,
                  value: {
                    format: '',
                    isValid: true,
                    link: '',
                    publishDate: '',
                    title: '',
                    type: 'image',
                    id: undefined,
                    url: '',
                    description: '',
                  },
                },
                keywords: {
                  fieldTitle: 'Keywords',
                  list: [],
                  isValid: true,
                  proposedList: info.keywords,
                  required: false,
                  value: '',
                },
                primaryStudy: {
                  fieldTitle: 'Primary study',
                  list: info.primaryStudy,
                  required: true,
                  isValid: true,
                  value: {
                    id: undefined,
                    title: '',
                  },
                },
                secondaryStudy: {
                  fieldTitle: 'Secondary study',
                  list: info.secondaryStudy,
                  required: false,
                  isValid: true,
                  value: {
                    id: undefined,
                    title: '',
                  },
                },
              },
              courseResponsible: {
                faculty: {
                  fieldTitle: 'Faculty',
                  required: true,
                  isValid: true,
                  value: '',
                  list: ['Bouwkunde'] /* Hardcoded now, as in design file */,
                },
                teachers: {
                  required: true,
                  isValid: true,
                  list: [],
                  value: '',
                  proposedList: info.teachers,
                  fieldTitle: 'Teachers',
                },
              },
            }
          } else if (action.payload.articleType === 'softwares') {
            state.meta = {
              softwareBelongs: {
                image: {
                  fieldTitle: 'Featured image',
                  required: false,
                  isValid: true,
                  value: {
                    format: '',
                    link: '',
                    isValid: true,
                    publishDate: '',
                    title: '',
                    type: 'image',
                    id: undefined,
                    url: '',
                    description: '',
                  },
                },
                keywords: {
                  fieldTitle: 'Keywords',
                  isValid: true,
                  list: [],
                  proposedList: info.keywords,
                  required: false,
                  value: '',
                },
                softwareVersion: {
                  fieldTitle: 'Software version',
                  required: true,
                  isValid: true,
                  list: info.softwareVersions,
                  value: { id: undefined, title: '' },
                },
              },
            }
          } else if (action.payload.articleType === 'subjects') {
            state.meta = {
              subjectsInvolve: {
                primaryCategory: {
                  fieldTitle: 'Primary category',
                  required: true,
                  isValid: true,
                  list: info.categories ?? [],
                  value: { id: undefined, title: '' },
                },
                secondaryCategory: {
                  fieldTitle: 'Secondary category',
                  required: false,
                  isValid: true,
                  list: info.secondaryCategories ?? [],
                  value: { id: undefined, title: '' },
                },
              },
            }
          }
        }
      } else {
        state.chapters = action.payload.parsedObject.chapters
        state.meta = action.payload.parsedObject.meta
        state.pageType = action.payload.parsedObject.pageType
        state.tutorialBottom = action.payload.parsedObject.tutorialBottom
        state.tutorialTop = action.payload.parsedObject.tutorialTop
        state.mediaIds = action.payload.parsedObject.mediaIds
      }
    },
    setTutorialTitle: (state, action: PayloadAction<string>) => {
      state.tutorialTop.title.isValid = action.payload.trim().length > 0
      state.tutorialTop.title.text = action.payload
    },
    setTutorialDescription: (state, action: PayloadAction<string>) => {
      state.tutorialTop.description.isValid = true
      state.tutorialTop.description.text = action.payload
    },
    setPageType: (state, action: PayloadAction<string | undefined>) => {
      state.pageType = action.payload
    },
    addTutorialElements: (state, action: PayloadAction<TutorialTopElementsObject>) => {
      state.tutorialTop.elements = [
        ...state.tutorialTop.elements.filter((item) => !item.defaultVal),
        action.payload,
      ]
    },
    addTutorialBottomElements: (state, action: PayloadAction<TutorialTopElementsObject>) => {
      state.tutorialBottomContent = [
        ...state.tutorialBottomContent.filter((item) => !item.defaultVal),
        action.payload,
      ]
    },
    deleteElement: (
      state,
      action: PayloadAction<{
        block: string
        elementIndex: number
        chapterIndex: number | undefined
        subchapterIndex: number | undefined
      }>,
    ) => {
      const { block, elementIndex, chapterIndex, subchapterIndex } = action.payload
      if (block === 'tutorialElements') {
        state.tutorialTop.elements = state.tutorialTop.elements.filter((_, i) => i !== elementIndex)
      } else if (block === 'tutorialBottomElements') {
        state.tutorialBottomContent = state.tutorialBottomContent.filter(
          (_, i) => i !== elementIndex,
        )
      } else if (block === 'chapterElements' && chapterIndex !== undefined) {
        state.chapters[chapterIndex].elements = state.chapters[chapterIndex].elements.filter(
          (_, i) => i !== elementIndex,
        )
      } else if (
        block === 'subchapterElements' &&
        chapterIndex !== undefined &&
        subchapterIndex !== undefined
      ) {
        state.chapters[chapterIndex].subchapters[subchapterIndex].elements = state.chapters[
          chapterIndex
        ].subchapters[subchapterIndex].elements.filter((_, i) => i !== elementIndex)
      }
    },
    setSubchapterMedia: (state, action: PayloadAction<SubchapterImageAction>) => {
      const { chapterIndex, media, layout, listIndex } = action.payload

      if (layout === 'imageText' || layout === 'textImage') {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[listIndex] : undefined
        const layoutItem = element ? element[layout] : undefined

        if (layoutItem && layoutItem.image !== undefined) {
          layoutItem.image = media
        }
      } else if (layout === 'textVideo' || layout === 'videoText') {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[listIndex] : undefined
        const layoutItem = element ? element[layout] : undefined

        if (layoutItem && layoutItem.video !== undefined) {
          layoutItem.video = media
        }
      }
    },
    setElementText: (state, action: PayloadAction<ElementTextActionInterface>) => {
      setElementProperty(
        state,
        {
          ...action,
          payload: { ...action.payload, value: action.payload.text },
        },
        'text',
      )
    },
    setInfoboxTitle: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].infobox &&
            state.tutorialTop.elements[payload.index].infobox!.title !== undefined
          ) {
            state.tutorialTop.elements[payload.index].infobox!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].infobox!.title !== undefined
          ) {
            state.chapters[payload.nestedIndex].elements[payload.index].infobox!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setInfoboxText: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (state.tutorialTop.elements[payload.index].infobox !== undefined) {
            state.tutorialTop.elements[payload.index].infobox!.text = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (state.chapters[payload.nestedIndex].elements[payload.index].infobox !== undefined) {
            state.chapters[payload.nestedIndex].elements[payload.index].infobox!.text = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setImageTitle: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].image &&
            state.tutorialTop.elements[payload.index].image!.subchapterTitle !== undefined
          ) {
            state.tutorialTop.elements[payload.index].image!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].image!.subchapterTitle !==
            undefined
          ) {
            state.chapters[payload.nestedIndex].elements[payload.index].image!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setVideoTitle: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].video &&
            state.tutorialTop.elements[payload.index].video!.subchapterTitle !== undefined
          ) {
            state.tutorialTop.elements[payload.index].video!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].video!.subchapterTitle !==
            undefined
          ) {
            state.chapters[payload.nestedIndex].elements[payload.index].video!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setTutorialCardsTitle: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].tutorialCards &&
            state.tutorialTop.elements[payload.index].tutorialCards!.title !== undefined
          ) {
            state.tutorialTop.elements[payload.index].tutorialCards!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].tutorialCards!.title !==
            undefined
          ) {
            state.chapters[payload.nestedIndex].elements[payload.index].tutorialCards!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setFileSubchapterTitle: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].file &&
            state.tutorialTop.elements[payload.index].file!.subchapterTitle !== undefined
          ) {
            state.tutorialTop.elements[payload.index].file!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].file!.subchapterTitle !==
            undefined
          ) {
            state.chapters[payload.nestedIndex].elements[payload.index].file!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setH5PElementTitle: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].h5pElement &&
            state.tutorialTop.elements[payload.index].h5pElement!.title !== undefined
          ) {
            state.tutorialTop.elements[payload.index].h5pElement!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].h5pElement!.title !==
            undefined
          ) {
            state.chapters[payload.nestedIndex].elements[payload.index].h5pElement!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setExternalVideoElementTitle: (
      state,
      action: PayloadAction<ElementInfoboxTitleActionInterface>,
    ) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].externalVideo &&
            state.tutorialTop.elements[payload.index].externalVideo!.subchapterTitle !== undefined
          ) {
            state.tutorialTop.elements[payload.index].externalVideo!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].externalVideo!
              .subchapterTitle !== undefined
          ) {
            state.chapters[payload.nestedIndex].elements[
              payload.index
            ].externalVideo!.subchapterTitle = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setQuizElementTitle: (state, action: PayloadAction<ElementInfoboxTitleActionInterface>) => {
      const payload = action.payload
      if (payload.index !== undefined) {
        if (payload.block === 'tutorialElements') {
          if (
            state.tutorialTop.elements[payload.index].quiz &&
            state.tutorialTop.elements[payload.index].quiz!.title !== undefined
          ) {
            state.tutorialTop.elements[payload.index].quiz!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
        if (payload.block === 'chapterElements' && payload.nestedIndex !== undefined) {
          if (
            state.chapters[payload.nestedIndex].elements[payload.index].quiz!.title !== undefined
          ) {
            state.chapters[payload.nestedIndex].elements[payload.index].quiz!.title = {
              text: payload.value,
              isValid: payload.value.trim().length > 0,
            }
          }
        }
      }
    },
    setElementImage: (state, action: PayloadAction<ElementImageActionInterface>) => {
      setElementProperty(
        state,
        {
          ...action,
          payload: { ...action.payload, value: action.payload.image },
        },
        'image',
      )
    },
    setElementVideo: (state, action: PayloadAction<ElementVideoActionInterface>) => {
      setElementProperty(
        state,
        {
          ...action,
          payload: { ...action.payload, value: action.payload.video },
        },
        'video',
      )
    },
    setVideoThumbnail: (state, action: PayloadAction<ThumbnailActionInterface>) => {
      const { index, layout, thumbnail, block, chapterIndex } = action.payload
      if (chapterIndex !== undefined) {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[index] : undefined
        if (layout === 'textVideo' || layout === 'videoText') {
          const layoutItem = element ? element[layout] : undefined
          if (layoutItem && layoutItem.video !== undefined) {
            layoutItem.video.thumbnail = thumbnail
          }
        } else {
          if (element && element.video !== undefined) {
            element.video.thumbnail = thumbnail
          }
        }
      } else {
        let elements = state.tutorialTop?.elements
        if (block === 'tutorialBottomElements') {
          elements = state.tutorialBottomContent
        }
        const element = elements ? elements[index] : undefined
        if (layout === 'textVideo' || layout === 'videoText') {
          const layoutItem = element ? element[layout] : undefined
          if (layoutItem && layoutItem.video !== undefined) {
            layoutItem.video.thumbnail = thumbnail
          }
        } else {
          if (element && element.video !== undefined) {
            element.video.thumbnail = thumbnail
          }
        }
      }
    },
    setChapterVideoThumbnail: (state, action: PayloadAction<ChapterThumbnailActionInterface>) => {
      const { thumbnail, chapterIndex } = action.payload
      if (chapterIndex !== undefined) {
        const chapter = state.chapters[chapterIndex]
        const chapterVideo = chapter.video
        if (chapterVideo !== undefined) {
          chapterVideo.thumbnail = thumbnail
        }
      }
    },
    setVideoSubtitles: (state, action: PayloadAction<SubtitlesActionInterface>) => {
      const { index, layout, subtitles, chapterIndex, block } = action.payload
      if (chapterIndex !== undefined) {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[index] : undefined
        if (layout === 'textVideo' || layout === 'videoText') {
          const layoutItem = element ? element[layout] : undefined
          if (layoutItem && layoutItem.video !== undefined) {
            layoutItem.video.subtitles = subtitles
          }
        } else {
          if (element && element.video !== undefined) {
            element.video.subtitles = subtitles
          }
        }
      } else {
        let elements = state.tutorialTop?.elements
        if (block === 'tutorialBottomElements') {
          elements = state.tutorialBottomContent
        }
        const element = elements ? elements[index] : undefined
        if (layout === 'textVideo' || layout === 'videoText') {
          const layoutItem = element ? element[layout] : undefined
          if (layoutItem && layoutItem.video !== undefined) {
            layoutItem.video.subtitles = subtitles
          }
        } else {
          if (element && element.video !== undefined) {
            element.video.subtitles = subtitles
          }
        }
      }
    },
    setChapterVideoSubtitles: (state, action: PayloadAction<ChapterSubtitlesActionInterface>) => {
      const { subtitles, chapterIndex } = action.payload
      if (chapterIndex !== undefined) {
        const chapter = state.chapters[chapterIndex]
        const chapterVideo = chapter.video
        if (chapterVideo !== undefined) {
          chapterVideo.subtitles = subtitles
        }
      }
    },
    setElementQuiz: (state, action: PayloadAction<ElementQuizActionInterface>) => {
      setElementProperty(
        state,
        {
          ...action,
          payload: { ...action.payload, value: action.payload.quiz },
        },
        'quiz',
      )
    },
    setElementH5P: (state, action: PayloadAction<ElementH5PActionInterface>) => {
      setElementProperty(
        state,
        {
          ...action,
          payload: {
            ...action.payload,
            value: action.payload.h5pElement,
          },
        },
        'h5pElement',
      )
    },
    setFileElement: (state, action: PayloadAction<ElementFileActionInterface>) => {
      setElementProperty(
        state,
        {
          ...action,
          payload: { ...action.payload, value: action.payload.file },
        },
        'file',
      )
    },
    addBlankChapter: (state, action: PayloadAction<LayoutChapterType>) => {
      if (action.payload === '1 column') {
        state.chapters = [
          ...state.chapters,
          {
            id: undefined,
            layout: action.payload,
            title: { text: '', isValid: true },
            text: { text: '', isValid: true },
            elements: [],
            subchapters: [],
          },
        ]
      } else {
        if (action.payload.split(' ')[0] === 'video') {
          state.chapters = [
            ...state.chapters,
            {
              id: undefined,
              layout: action.payload,
              title: { text: '', isValid: true },
              text: { text: '', isValid: true },
              video: {
                format: '',
                link: '',
                publishDate: '',
                isValid: true,
                title: '',
                type: 'video',
                description: '',
                thumbnail: {
                  description: '',
                  format: '',
                  type: 'image',
                  isValid: true,
                  link: '',
                  publishDate: '',
                  title: '',
                },
              },
              elements: [],
              subchapters: [],
            },
          ]
        } else if (action.payload.split(' ')[0] === 'image') {
          state.chapters = [
            ...state.chapters,
            {
              id: undefined,
              layout: action.payload,
              title: { text: '', isValid: true },
              text: { text: '', isValid: true },
              image: {
                format: '',
                link: '',
                isValid: true,
                publishDate: '',
                title: '',
                type: 'image',
                description: '',
              },
              elements: [],
              subchapters: [],
            },
          ]
        }
      }
    },
    addBlankSubchapter: (state, action: PayloadAction<BlankSubchapterActionInterface>) => {
      if (action.payload.chapterType === '1 column') {
        state.chapters[action.payload.chapterIndex].subchapters = [
          ...(state.chapters[action.payload.chapterIndex].subchapters || []),
          {
            layout: action.payload.chapterType,
            title: { text: '', isValid: true },
            text: { text: '', isValid: true },
            elements: [],
          },
        ]
      } else {
        if (action.payload.chapterType.split(' ')[0] === 'video') {
          state.chapters[action.payload.chapterIndex].subchapters = [
            ...(state.chapters[action.payload.chapterIndex].subchapters || []),
            {
              layout: action.payload.chapterType,
              title: { text: '', isValid: true },
              text: { text: '', isValid: true },
              video: {
                format: '',
                link: '',
                publishDate: '',
                isValid: true,
                title: '',
                type: 'video',
                description: '',
              },
              elements: [],
            },
          ]
        } else if (action.payload.chapterType.split(' ')[0] === 'image') {
          state.chapters[action.payload.chapterIndex].subchapters = [
            ...(state.chapters[action.payload.chapterIndex].subchapters || []),
            {
              layout: action.payload.chapterType,
              title: { text: '', isValid: true },
              text: { text: '', isValid: true },
              image: {
                format: '',
                link: '',
                isValid: true,
                publishDate: '',
                title: '',
                type: 'image',
                description: '',
              },
              elements: [],
            },
          ]
        }
      }
    },
    addBlankSubchapterToEls: (state, action: PayloadAction<BlankSubchapterActionInterface>) => {
      if (action.payload.chapterType === '1 column') {
        state.chapters[action.payload.chapterIndex].elements = [
          ...(state.chapters[action.payload.chapterIndex].elements || []),
          {
            textLayout: {
              text: { text: '', isValid: true },
              title: { text: '', isValid: true },
            },
          },
        ]
      } else if (action.payload.chapterType === 'image left') {
        state.chapters[action.payload.chapterIndex].elements = [
          ...(state.chapters[action.payload.chapterIndex].elements || []),
          {
            imageText: {
              image: {
                isValid: true,
                format: '',
                link: '',
                publishDate: '',
                title: '',
                type: 'image',
                description: '',
              },
              text: { text: '', isValid: true },
              title: { text: '', isValid: true },
            },
          },
        ]
      } else if (action.payload.chapterType === 'image right') {
        state.chapters[action.payload.chapterIndex].elements = [
          ...(state.chapters[action.payload.chapterIndex].elements || []),
          {
            textImage: {
              image: {
                format: '',
                link: '',
                publishDate: '',
                isValid: true,
                title: '',
                type: 'image',
                description: '',
              },
              text: { text: '', isValid: true },
              title: { text: '', isValid: true },
            },
          },
        ]
      } else if (action.payload.chapterType === 'video left') {
        state.chapters[action.payload.chapterIndex].elements = [
          ...(state.chapters[action.payload.chapterIndex].elements || []),
          {
            videoText: {
              video: {
                format: '',
                link: '',
                publishDate: '',
                title: '',
                isValid: true,
                type: 'video',
                description: '',
                thumbnail: {
                  description: '',
                  format: '',
                  type: 'image',
                  link: '',
                  isValid: true,
                  publishDate: '',
                  title: '',
                },
              },
              text: { text: '', isValid: true },
              title: { text: '', isValid: true },
            },
          },
        ]
      } else if (action.payload.chapterType === 'video right') {
        state.chapters[action.payload.chapterIndex].elements = [
          ...(state.chapters[action.payload.chapterIndex].elements || []),
          {
            textVideo: {
              video: {
                format: '',
                link: '',
                publishDate: '',
                title: '',
                isValid: true,
                type: 'video',
                description: '',
                thumbnail: {
                  description: '',
                  format: '',
                  type: 'image',
                  link: '',
                  isValid: true,
                  publishDate: '',
                  title: '',
                },
              },
              text: { text: '', isValid: true },
              title: { text: '', isValid: true },
            },
          },
        ]
      }
    },
    setChapterText: (state, action: PayloadAction<ChapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].text = {
        text: action.payload.text,
        isValid: true,
      }
    },
    setChapterTitle: (state, action: PayloadAction<ChapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].title = {
        text: action.payload.text,
        isValid: true,
      }
    },
    setSubchapterTitle: (state, action: PayloadAction<SubchapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].subchapters[
        action.payload.subchapterIndex
      ].title = { text: action.payload.text, isValid: true }
    },
    setSubchapterText: (state, action: PayloadAction<SubchapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].subchapters[action.payload.subchapterIndex].text =
        { text: action.payload.text, isValid: true }
    },
    addChapterElement: (state, action: PayloadAction<AddChapterElementInterface>) => {
      state.chapters[action.payload.chapterIndex].elements = [
        ...state.chapters[action.payload.chapterIndex].elements.filter((item) => !item.defaultVal),
        action.payload.val,
      ]
    },
    addSubchapterElement: (state, action: PayloadAction<AddSubchapterElementInterface>) => {
      state.chapters[action.payload.chapterIndex].subchapters[
        action.payload.subchapterIndex
      ].elements = [
        ...state.chapters[action.payload.chapterIndex].subchapters[action.payload.subchapterIndex]
          .elements,
        action.payload.val,
      ]
    },
    setTutorialBottomTitle: (state, action: PayloadAction<string>) => {
      state.tutorialBottom.title = action.payload
    },
    setTutorialBottomText: (state, action: PayloadAction<string>) => {
      state.tutorialBottom.text = action.payload
    },
    moveChapter: (state, action: PayloadAction<MoveChapterInterface>) => {
      const newPos = action.payload.moveTo
      const index = action.payload.index
      const parentIndex = action.payload.parentIndex
      const newIndex = newPos === 'up' ? index - 1 : index + 1
      if (!parentIndex) {
        if (newPos === 'up' && index > 0) {
          ;[state.chapters[newIndex], state.chapters[index]] = [
            state.chapters[index],
            state.chapters[newIndex],
          ]
        } else if (newPos === 'down' && index < state.chapters.length - 1) {
          ;[state.chapters[index], state.chapters[newIndex]] = [
            state.chapters[newIndex],
            state.chapters[index],
          ]
        }
      } else {
        if (newPos === 'up' && index > 0) {
          ;[
            state.chapters[parentIndex].subchapters[newIndex],
            state.chapters[parentIndex].subchapters[index],
          ] = [
            state.chapters[parentIndex].subchapters[index],
            state.chapters[parentIndex].subchapters[newIndex],
          ]
        } else if (
          newPos === 'down' &&
          index < state.chapters[parentIndex].subchapters.length - 1
        ) {
          ;[
            state.chapters[parentIndex].subchapters[index],
            state.chapters[parentIndex].subchapters[newIndex],
          ] = [
            state.chapters[parentIndex].subchapters[newIndex],
            state.chapters[parentIndex].subchapters[index],
          ]
        }
      }
    },
    moveElement: (
      state,
      action: PayloadAction<{
        index: number
        block: string
        position: 'up' | 'down'
        chapterIndex?: number
      }>,
    ) => {
      const { block, index, position, chapterIndex } = action.payload
      const newIndex = position === 'up' ? index - 1 : index + 1
      if (block === 'chapter' && chapterIndex !== undefined) {
        if (position === 'up' && index > 0) {
          ;[
            state.chapters[chapterIndex].elements[newIndex],
            state.chapters[chapterIndex].elements[index],
          ] = [
            state.chapters[chapterIndex].elements[index],
            state.chapters[chapterIndex].elements[newIndex],
          ]
        } else if (
          position === 'down' &&
          index < state.chapters[chapterIndex].elements.length - 1
        ) {
          ;[
            state.chapters[chapterIndex].elements[index],
            state.chapters[chapterIndex].elements[newIndex],
          ] = [
            state.chapters[chapterIndex].elements[newIndex],
            state.chapters[chapterIndex].elements[index],
          ]
        }
      } else if (block === 'tutorialTop') {
        if (position === 'up' && index > 0) {
          ;[state.tutorialTop.elements[newIndex], state.tutorialTop.elements[index]] = [
            state.tutorialTop.elements[index],
            state.tutorialTop.elements[newIndex],
          ]
        } else if (position === 'down' && index < state.tutorialTop.elements.length - 1) {
          ;[state.tutorialTop.elements[index], state.tutorialTop.elements[newIndex]] = [
            state.tutorialTop.elements[newIndex],
            state.tutorialTop.elements[index],
          ]
        }
      }
    },
    duplicateChapter: (state, action: PayloadAction<{ index: number; parentIndex?: number }>) => {
      const index = action.payload.index
      const parentIndex = action.payload.parentIndex
      if (!parentIndex) {
        if (index >= 0 && index < state.chapters.length) {
          const newChapter = { ...state.chapters[index] }
          state.chapters.splice(index + 1, 0, newChapter)
        }
      } else {
        if (index >= 0 && index < state.chapters[parentIndex].subchapters.length) {
          const newChapter = {
            ...state.chapters[parentIndex].subchapters[index],
          }
          state.chapters[parentIndex].subchapters.splice(index + 1, 0, newChapter)
        }
      }
    },
    deleteChapter: (state, action: PayloadAction<{ index: number; parentIndex?: number }>) => {
      const index = action.payload.index
      const parentIndex = action.payload.parentIndex
      if (!parentIndex) {
        if (index >= 0 && index < state.chapters.length) {
          state.chapters.splice(index, 1)
        }
      } else {
        if (index >= 0 && index < state.chapters[parentIndex].subchapters.length) {
          state.chapters[parentIndex].subchapters.splice(index, 1)
        }
      }
    },
    changeMetaListIdValue: (
      state,
      action: PayloadAction<{
        value: string
        belongsKeyName: 'primary' | 'version' | 'primarySubject' | 'secondarySubject' | 'course'
      }>,
    ) => {
      if (state.meta.tutorialBelongs) {
        if (action.payload.belongsKeyName === 'primary') {
          state.meta.tutorialBelongs.primary.isValid = true
          state.meta.tutorialBelongs.primary.value = state.meta.tutorialBelongs.primary.list.find(
            (item) => item.title === action.payload.value,
          ) ?? { id: undefined, title: '', version: [] }
          if (state.meta.tutorialBelongs.version) {
            state.meta.tutorialBelongs.version.list =
              state.meta.tutorialBelongs.primary.list.find(
                (item) => item.title === action.payload.value,
              )?.version ?? []
          }
        } else {
          state.meta.tutorialBelongs[action.payload.belongsKeyName].isValid = true
          state.meta.tutorialBelongs[action.payload.belongsKeyName].value =
            state.meta.tutorialBelongs[action.payload.belongsKeyName].list.find(
              (item) => item.title === action.payload.value,
            ) ?? { id: undefined, title: '' }
        }
      }
    },
    changeCourseIdListField: (
      state,
      action: PayloadAction<{
        value: string
        belongsKeyName: 'primaryStudy' | 'secondaryStudy'
      }>,
    ) => {
      if (state.meta.courseBelongs) {
        state.meta.courseBelongs[action.payload.belongsKeyName].isValid = true
        state.meta.courseBelongs[action.payload.belongsKeyName].value = state.meta.courseBelongs[
          action.payload.belongsKeyName
        ].list.find((item) => item.title === action.payload.value) ?? { id: undefined, title: '' }
      }
    },
    changeSoftwareIdListField: (
      state,
      action: PayloadAction<{
        value: string
        belongsKeyName: 'softwareVersion'
      }>,
    ) => {
      if (state.meta.softwareBelongs) {
        state.meta.softwareBelongs[action.payload.belongsKeyName].isValid = true
        state.meta.softwareBelongs[action.payload.belongsKeyName].value =
          state.meta.softwareBelongs[action.payload.belongsKeyName].list.find(
            (item) => item.title === action.payload.value,
          ) ?? { id: undefined, title: '' }
      }
    },
    changeSubjectsIdListField: (
      state,
      action: PayloadAction<{
        value: string
        involvesKeyName: 'primaryCategory' | 'secondaryCategory'
      }>,
    ) => {
      if (state.meta.subjectsInvolve) {
        state.meta.subjectsInvolve[action.payload.involvesKeyName].isValid = true
        state.meta.subjectsInvolve[action.payload.involvesKeyName].value =
          state.meta.subjectsInvolve[action.payload.involvesKeyName].list.find(
            (item) => item.title === action.payload.value,
          ) ?? { id: undefined, title: '' }
      }
    },
    changeSubchapterTitle: (
      state,
      action: PayloadAction<{
        value: string
        chapterIndex: number | undefined
        listIndex: number
        layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText' | 'textLayout'
        block: string
      }>,
    ) => {
      const { value, chapterIndex, listIndex, layout, block } = action.payload
      if (chapterIndex === undefined) {
        let elements = state.tutorialTop.elements
        if (block === 'tutorialBottomElements') {
          elements = state.tutorialBottomContent
        }
        const element = elements[listIndex]
        const layoutItem = element[layout]
        if (layoutItem && layoutItem.text !== undefined && layoutItem.title !== undefined) {
          layoutItem.title.text = value
          layoutItem.title.isValid = true
        }
      } else {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[listIndex] : undefined
        const layoutItem = element ? element[layout] : undefined

        if (layoutItem && layoutItem.text !== undefined && layoutItem.title !== undefined) {
          layoutItem.title.text = value
          layoutItem.title.isValid = true
        }
      }
    },
    addTutorialCard: (
      state,
      action: PayloadAction<{
        block: string
        listIndex: number
        chapterIndex?: number
      }>,
    ) => {
      const { block, listIndex, chapterIndex } = action.payload
      if (block === 'tutorialElements') {
        const elements = state.tutorialTop.elements
        const element = elements && elements[listIndex]
        if (element.tutorialCards !== undefined && element.tutorialCards.items !== undefined) {
          const newObject: TutorialCardInterface = {
            value: { id: undefined, title: '', isValid: true },
            proposedList: element.tutorialCards.items[0].proposedList,
          }
          element.tutorialCards.items = [...element.tutorialCards.items, newObject]
        }
      } else if (block === 'tutorialBottomElements') {
        const elements = state.tutorialBottomContent
        const element = elements && elements[listIndex]
        if (element.tutorialCards !== undefined && element.tutorialCards.items !== undefined) {
          const newObject: TutorialCardInterface = {
            value: { id: undefined, title: '', isValid: true },
            proposedList: element.tutorialCards.items[0].proposedList,
          }
          element.tutorialCards.items = [...element.tutorialCards.items, newObject]
        }
      } else if (block === 'chapterElements' && chapterIndex !== undefined) {
        const elements = state.chapters[chapterIndex].elements
        const element = elements && elements[listIndex]
        if (element.tutorialCards !== undefined && element.tutorialCards.items !== undefined) {
          const newObject: TutorialCardInterface = {
            value: { id: undefined, title: '', isValid: true },
            proposedList: element.tutorialCards.items[0].proposedList,
          }
          element.tutorialCards.items = [...element.tutorialCards.items, newObject]
        }
      }
    },
    changeTutorialCard: (
      state,
      action: PayloadAction<{
        value: string
        block: string
        listIndex: number
        isUrl: boolean
        nestedIndex: number
        chapterIndex?: number
        name?: string
      }>,
    ) => {
      const { value, block, listIndex, nestedIndex, chapterIndex, isUrl, name } = action.payload
      if (block === 'tutorialElements') {
        const elements = state.tutorialTop.elements
        const element = elements && elements[listIndex]
        if (
          element.tutorialCards !== undefined &&
          element.tutorialCards.items !== undefined &&
          element.tutorialCards.items[nestedIndex].value !== undefined
        ) {
          if (isUrl) {
            element.tutorialCards.items[nestedIndex].value.id = undefined
            element.tutorialCards.items[nestedIndex].value[`${name as 'title' | 'url'}`] = value
            element.tutorialCards.items[nestedIndex].value.isValid = value.trim().length > 0
          } else {
            element.tutorialCards.items[nestedIndex].value = element.tutorialCards.items[
              nestedIndex
            ].proposedList.find((el) => el.id === parseInt(value)) ?? {
              id: undefined,
              title: '',
              isValid: false,
            }
          }
        }
      } else if (block === 'tutorialBottomElements') {
        const elements = state.tutorialBottomContent
        const element = elements && elements[listIndex]
        if (
          element.tutorialCards !== undefined &&
          element.tutorialCards.items !== undefined &&
          element.tutorialCards.items[nestedIndex].value !== undefined
        ) {
          if (isUrl) {
            element.tutorialCards.items[nestedIndex].value.id = undefined
            element.tutorialCards.items[nestedIndex].value[`${name as 'title' | 'url'}`] = value
            element.tutorialCards.items[nestedIndex].value.isValid = value.trim().length > 0
          } else {
            element.tutorialCards.items[nestedIndex].value = element.tutorialCards.items[
              nestedIndex
            ].proposedList.find((el) => el.id === parseInt(value)) ?? {
              id: undefined,
              title: '',
              isValid: false,
            }
          }
        }
      } else if (block === 'chapterElements' && chapterIndex !== undefined) {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements && elements[listIndex]

        if (
          element.tutorialCards !== undefined &&
          element.tutorialCards.items !== undefined &&
          element.tutorialCards.items[nestedIndex].value !== undefined
        ) {
          if (isUrl) {
            element.tutorialCards.items[nestedIndex].value[`${name as 'title' | 'url'}`] = value
          } else {
            element.tutorialCards.items[nestedIndex].value = element.tutorialCards.items[
              nestedIndex
            ].proposedList.find((el) => el.id === parseInt(value)) ?? {
              id: undefined,
              title: '',
              isValid: false,
            }
          }
        }
      }
    },
    changeSubchapterText: (
      state,
      action: PayloadAction<{
        value: string
        chapterIndex: number | undefined
        listIndex: number
        layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText' | 'textLayout'
        block: string
      }>,
    ) => {
      const { chapterIndex, listIndex, layout, value, block } = action.payload
      if (chapterIndex === undefined) {
        let elements = state.tutorialTop.elements
        if (block === 'tutorialBottomElements') {
          elements = state.tutorialBottomContent
        }
        const element = elements[listIndex]
        const layoutItem = element ? element[layout] : undefined

        if (layoutItem && layoutItem.text !== undefined) {
          layoutItem.text.text = value
          layoutItem.text.isValid = true
        }
      } else {
        if (layout !== undefined && listIndex !== undefined) {
          const chapter = state.chapters[chapterIndex]
          const elements = chapter?.elements
          const element = elements ? elements[listIndex] : undefined
          const layoutItem = element ? element[layout] : undefined

          if (layoutItem && layoutItem.text !== undefined) {
            layoutItem.text.text = value
            layoutItem.text.isValid = true
          }
        }
      }
    },
    changeMetaField: (
      state,
      action: PayloadAction<{
        value: string
        objectName: keyof TutorialMetaObject
        belongsKeyName?: 'level' | 'image' | 'keywords'
        responsibleKeyName?: keyof TutorialResponsibleInterface
        courseBelongsKeyName?: 'course' | 'courseCode' | 'keywords'
        softwareBelongsKeyName?: 'softwareVersion' | 'keywords'
        subjectInvolveKey?: 'primaryCategory' | 'secondaryCategory'
      }>,
    ) => {
      if (
        action.payload.objectName === 'tutorialBelongs' &&
        action.payload.belongsKeyName &&
        state.meta.tutorialBelongs
      ) {
        state.meta.tutorialBelongs[action.payload.belongsKeyName].isValid = true
        state.meta.tutorialBelongs[action.payload.belongsKeyName].value = action.payload.value
      } else if (
        action.payload.objectName === 'tutorialResponsible' &&
        action.payload.responsibleKeyName &&
        state.meta.tutorialResponsible
      ) {
        state.meta.tutorialResponsible[action.payload.responsibleKeyName].isValid = true
        state.meta.tutorialResponsible[action.payload.responsibleKeyName].value =
          action.payload.value
      } else if (
        action.payload.objectName === 'courseResponsible' &&
        action.payload.responsibleKeyName &&
        state.meta.courseResponsible
      ) {
        state.meta.courseResponsible[action.payload.responsibleKeyName].isValid = true
        state.meta.courseResponsible[action.payload.responsibleKeyName].value = action.payload.value
      } else if (
        action.payload.objectName === 'courseBelongs' &&
        action.payload.courseBelongsKeyName &&
        state.meta.courseBelongs
      ) {
        state.meta.courseBelongs[action.payload.courseBelongsKeyName].isValid = true
        state.meta.courseBelongs[action.payload.courseBelongsKeyName].value = action.payload.value
      } else if (
        action.payload.objectName === 'softwareBelongs' &&
        action.payload.softwareBelongsKeyName &&
        state.meta.softwareBelongs
      ) {
        state.meta.softwareBelongs[action.payload.softwareBelongsKeyName].isValid = true
        state.meta.softwareBelongs[action.payload.softwareBelongsKeyName].value =
          action.payload.value
      } else if (
        action.payload.objectName === 'subjectsInvolve' &&
        action.payload.subjectInvolveKey &&
        state.meta.subjectsInvolve
      ) {
        state.meta.subjectsInvolve[action.payload.subjectInvolveKey].isValid = true
        state.meta.subjectsInvolve[action.payload.subjectInvolveKey].value.title =
          action.payload.value
      }
    },
    addKeywordsToList: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (action.payload.objectName === 'tutorialBelongs' && state.meta.tutorialBelongs) {
        state.meta.tutorialBelongs.keywords.isValid = true
        state.meta.tutorialBelongs.keywords.list = [
          ...state.meta.tutorialBelongs.keywords.list,
          action.payload.value,
        ]
      } else if (action.payload.objectName === 'courseBelongs' && state.meta.courseBelongs) {
        state.meta.courseBelongs.keywords.isValid = true
        state.meta.courseBelongs.keywords.list = [
          ...state.meta.courseBelongs.keywords.list,
          action.payload.value,
        ]
      } else if (action.payload.objectName === 'softwareBelongs' && state.meta.softwareBelongs) {
        state.meta.softwareBelongs.keywords.isValid = true
        state.meta.softwareBelongs.keywords.list = [
          ...state.meta.softwareBelongs.keywords.list,
          action.payload.value,
        ]
      }
    },
    addTeacherToList: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (state.meta.tutorialResponsible && action.payload.objectName === 'tutorialResponsible') {
        state.meta.tutorialResponsible.teachers.isValid = true
        state.meta.tutorialResponsible.teachers.list = [
          ...state.meta.tutorialResponsible.teachers.list,
          action.payload.value,
        ]
      } else if (
        state.meta.courseResponsible &&
        action.payload.objectName === 'courseResponsible'
      ) {
        state.meta.courseResponsible.teachers.isValid = true
        state.meta.courseResponsible.teachers.list = [
          ...state.meta.courseResponsible.teachers.list,
          action.payload.value,
        ]
      }
    },
    removeKeywordFromProposed: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (state.meta.tutorialBelongs && action.payload.objectName === 'tutorialBelongs') {
        state.meta.tutorialBelongs.keywords.proposedList =
          state.meta.tutorialBelongs.keywords.proposedList.filter(
            (item) => item !== action.payload.value,
          )
      } else if (state.meta.courseBelongs && action.payload.objectName === 'courseBelongs') {
        state.meta.courseBelongs.keywords.proposedList =
          state.meta.courseBelongs.keywords.proposedList.filter(
            (item) => item !== action.payload.value,
          )
      } else if (state.meta.softwareBelongs && action.payload.objectName === 'softwareBelongs') {
        state.meta.softwareBelongs.keywords.proposedList =
          state.meta.softwareBelongs.keywords.proposedList.filter(
            (item) => item !== action.payload.value,
          )
      }
    },
    removeTeacherFromProposed: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (state.meta.tutorialResponsible && action.payload.objectName === 'tutorialResponsible') {
        state.meta.tutorialResponsible.teachers.proposedList =
          state.meta.tutorialResponsible.teachers.proposedList.filter(
            (item) => item !== action.payload.value,
          )
      } else if (
        state.meta.courseResponsible &&
        action.payload.objectName === 'courseResponsible'
      ) {
        state.meta.courseResponsible.teachers.proposedList =
          state.meta.courseResponsible.teachers.proposedList.filter(
            (item) => item !== action.payload.value,
          )
      }
    },
    addKeywordsToProposed: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (state.meta.tutorialBelongs && action.payload.objectName === 'tutorialBelongs') {
        state.meta.tutorialBelongs.keywords.proposedList = [
          ...state.meta.tutorialBelongs.keywords.proposedList,
          action.payload.value,
        ]
      } else if (state.meta.courseBelongs && action.payload.objectName === 'courseBelongs') {
        state.meta.courseBelongs.keywords.proposedList = [
          ...state.meta.courseBelongs.keywords.proposedList,
          action.payload.value,
        ]
      } else if (state.meta.softwareBelongs && action.payload.objectName === 'softwareBelongs') {
        state.meta.softwareBelongs.keywords.proposedList = [
          ...state.meta.softwareBelongs.keywords.proposedList,
          action.payload.value,
        ]
      }
    },
    addTeacherToProposed: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (state.meta.tutorialResponsible && action.payload.objectName === 'tutorialResponsible') {
        state.meta.tutorialResponsible.teachers.proposedList = [
          ...state.meta.tutorialResponsible.teachers.proposedList,
          action.payload.value,
        ]
      } else if (
        state.meta.courseResponsible &&
        action.payload.objectName === 'courseResponsible'
      ) {
        state.meta.courseResponsible.teachers.proposedList = [
          ...state.meta.courseResponsible.teachers.proposedList,
          action.payload.value,
        ]
      }
    },
    setKeywordsProposedList: (state, action: PayloadAction<string[]>) => {
      if (state.meta.tutorialBelongs) {
        state.meta.tutorialBelongs.keywords.proposedList = action.payload
      }
    },
    deleteKeyword: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (state.meta.tutorialBelongs && action.payload.objectName === 'tutorialBelongs') {
        state.meta.tutorialBelongs.keywords.list = state.meta.tutorialBelongs.keywords.list.filter(
          (item) => item !== action.payload.value,
        )
      } else if (state.meta.courseBelongs && action.payload.objectName === 'courseBelongs') {
        state.meta.courseBelongs.keywords.list = state.meta.courseBelongs.keywords.list.filter(
          (item) => item !== action.payload.value,
        )
      } else if (state.meta.softwareBelongs && action.payload.objectName === 'softwareBelongs') {
        state.meta.softwareBelongs.keywords.list = state.meta.softwareBelongs.keywords.list.filter(
          (item) => item !== action.payload.value,
        )
      }
    },
    deleteTeacher: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (state.meta.tutorialResponsible && action.payload.objectName === 'tutorialResponsible') {
        state.meta.tutorialResponsible.teachers.list =
          state.meta.tutorialResponsible.teachers.list.filter(
            (item) => item !== action.payload.value,
          )
      } else if (
        state.meta.courseResponsible &&
        action.payload.objectName === 'courseResponsible'
      ) {
        state.meta.courseResponsible.teachers.list =
          state.meta.courseResponsible.teachers.list.filter((item) => item !== action.payload.value)
      }
    },
    setFeaturedImage: (
      state,
      action: PayloadAction<{
        data: MediaObjectInterface
        block: 'softwareMeta' | 'tutorialMeta' | 'courseMeta'
      }>,
    ) => {
      const { data, block } = action.payload
      if (block === 'tutorialMeta' && state.meta.tutorialBelongs !== undefined) {
        state.meta.tutorialBelongs.image.value = data
      } else if (block === 'softwareMeta' && state.meta.softwareBelongs !== undefined) {
        state.meta.softwareBelongs.image.value = data
      } else if (block === 'courseMeta' && state.meta.courseBelongs !== undefined) {
        state.meta.courseBelongs.image.value = data
      }
    },
    appendMediaToArray: (state, action: PayloadAction<number>) => {
      state.mediaIds = [...state.mediaIds, action.payload]
    },
    deleteMediaFromArray(state, action: PayloadAction<number>) {
      if (Array.isArray(state.mediaIds)) {
        state.mediaIds = removeFirstOccurrence(state.mediaIds, action.payload)
      }
    },
    setMetafieldsValidationErrors: (state, action: PayloadAction<any>) => {
      const errorsObject = action.payload
      if (errorsObject) {
        Object.keys(errorsObject).length > 0 &&
          Object.keys(errorsObject).forEach((block) => {
            const blockName = block as keyof typeof state.meta
            const blockData = state.meta[blockName]
            if (blockData) {
              errorsObject[blockName].forEach((field: AllMetafieldsType) => {
                const fieldName = field as keyof typeof blockData
                const fieldData = blockData[fieldName] as { isValid: boolean } | undefined
                if (fieldData) {
                  fieldData.isValid = false
                }
              })
            }
          })
      }
    },
    setTutorialTitleValid: (state, action: PayloadAction<boolean>) => {
      state.tutorialTop.title.isValid = action.payload
    },
    setTutorialDescriptionValid: (state, action: PayloadAction<boolean>) => {
      state.tutorialTop.description.isValid = action.payload
    },
    setValidatedTutorialTopElements: (
      state,
      action: PayloadAction<[] | TutorialTopElementsObject[]>,
    ) => {
      state.tutorialTop.elements = action.payload
    },
    setValidatedChapters: (state, action: PayloadAction<ChapterInterface[] | []>) => {
      state.chapters = action.payload
    },
    setExternalVideoTitle: (
      state,
      action: PayloadAction<{
        value: string
        index: number
        chapterIndex: number | undefined
        block: string
      }>,
    ) => {
      if (action.payload.chapterIndex !== undefined) {
        const chapterIndex = action.payload.chapterIndex
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[action.payload.index] : undefined
        if (element?.externalVideo) {
          element.externalVideo.title.text = action.payload.value
          element.externalVideo.title.isValid = action.payload.value.trim().length > 0
        }
      } else {
        let elements = state.tutorialTop.elements
        if (action.payload.block === 'tutorialBottomElements') {
          elements = state.tutorialBottomContent
        }
        const element = elements ? elements[action.payload.index] : undefined
        if (element?.externalVideo) {
          element.externalVideo.title.text = action.payload.value
          element.externalVideo.title.isValid = action.payload.value.trim().length > 0
        }
      }
    },
    setExternalVideoUrl: (
      state,
      action: PayloadAction<{
        value: string
        index: number
        chapterIndex: number | undefined
        block: string
      }>,
    ) => {
      if (action.payload.chapterIndex !== undefined) {
        const chapterIndex = action.payload.chapterIndex
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[action.payload.index] : undefined
        if (element?.externalVideo) {
          element.externalVideo.url.text = action.payload.value
          // element.externalVideo.url.isValid = action.payload.value.trim().length > 0
          element.externalVideo.url.isValid = urlPattern.test(action.payload.value)
        }
      } else {
        let elements = state.tutorialTop.elements
        if (action.payload.block === 'tutorialBottomElements') {
          elements = state.tutorialBottomContent
        }
        const element = elements ? elements[action.payload.index] : undefined
        if (element?.externalVideo) {
          element.externalVideo.url.text = action.payload.value
          // element.externalVideo.url.isValid = action.payload.value.trim().length > 0
          element.externalVideo.url.isValid = urlPattern.test(action.payload.value)
        }
      }
    },
  },
})

export const {
  setEditorLoaded,
  setTutorialTitle,
  setTutorialDescription,
  setPageType,
  addTutorialElements,
  setElementText,
  addBlankChapter,
  setChapterText,
  setChapterTitle,
  setSubchapterTitle,
  setSubchapterText,
  addChapterElement,
  setElementQuiz,
  addSubchapterElement,
  addBlankSubchapter,
  setTutorialBottomTitle,
  setTutorialBottomText,
  moveChapter,
  duplicateChapter,
  deleteChapter,
  changeMetaField,
  addKeywordsToList,
  addKeywordsToProposed,
  setKeywordsProposedList,
  deleteKeyword,
  setElementImage,
  setElementVideo,
  deleteElement,
  setElementH5P,
  setFileElement,
  setNewState,
  removeKeywordFromProposed,
  changeMetaListIdValue,
  changeSubjectsIdListField,
  addTeacherToList,
  removeTeacherFromProposed,
  deleteTeacher,
  addTeacherToProposed,
  changeCourseIdListField,
  changeSoftwareIdListField,
  addBlankSubchapterToEls,
  changeSubchapterText,
  changeSubchapterTitle,
  setSubchapterMedia,
  setFeaturedImage,
  changeTutorialCard,
  addTutorialCard,
  appendMediaToArray,
  deleteMediaFromArray,
  moveElement,
  setVideoThumbnail,
  setChapterVideoThumbnail,
  setChapterVideoSubtitles,
  setMetafieldsValidationErrors,
  setTutorialTitleValid,
  setTutorialDescriptionValid,
  setValidatedTutorialTopElements,
  setValidatedChapters,
  setVideoSubtitles,
  setExternalVideoTitle,
  setExternalVideoUrl,
  addTutorialBottomElements,
  setInfoboxTitle,
  setInfoboxText,
  setImageTitle,
  setVideoTitle,
  setTutorialCardsTitle,
  setFileSubchapterTitle,
  setH5PElementTitle,
  setExternalVideoElementTitle,
  setQuizElementTitle,
} = editorSlice.actions

export default editorSlice.reducer
