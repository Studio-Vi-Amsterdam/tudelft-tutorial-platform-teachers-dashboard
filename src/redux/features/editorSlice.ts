import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {
  AddChapterElementInterface,
  AddSubchapterElementInterface,
  ArtictesType,
  BlankSubchapterActionInterface,
  ChapterTextFieldActionInterface,
  EditorState,
  Element,
  ElementFileActionInterface,
  ElementH5PActionInterface,
  ElementImageActionInterface,
  ElementInfoboxActionInterface,
  ElementQuizActionInterface,
  ElementTextActionInterface,
  ElementVideoActionInterface,
  LayoutChapterType,
  MediaObjectInterface,
  MoveChapterInterface,
  SubchapterImageAction,
  SubchapterTextFieldActionInterface,
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
    title: '',
    titleType: 'h1',
    description: '',
    elements: [],
  },
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
  const { block, index, nestedIndex, subchapterIndex, value } = action.payload

  if (block === 'tutorialElements' && index !== undefined) {
    state.tutorialTop.elements[index][property] = value
  } else if (block === 'chapterElements' && index !== undefined && nestedIndex !== undefined) {
    state.chapters[nestedIndex].elements[index][property] = value
  } else if (
    block === 'subchapterElements' &&
    index !== undefined &&
    nestedIndex !== undefined &&
    subchapterIndex !== undefined
  ) {
    state.chapters[nestedIndex].subchapters[subchapterIndex].elements[index][property] = value
  } else if (block === 'chapterMedia' && nestedIndex !== undefined) {
    state.chapters[nestedIndex][property] = value
  } else if (
    block === 'subchapterMedia' &&
    nestedIndex !== undefined &&
    subchapterIndex !== undefined
  ) {
    state.chapters[nestedIndex].subchapters[subchapterIndex][property] = value
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
                  required: true,
                  list: info.courses,
                  value: { id: undefined, title: '' },
                },
                primary: {
                  fieldTitle: 'Primary software used',
                  required: true,
                  list: info.software,
                  value: { id: undefined, title: '', version: [] },
                },
                version: {
                  fieldTitle: 'Software Version',
                  list: [],
                  value: { id: undefined, title: '' },
                  required: false,
                },
                primarySubject: {
                  fieldTitle: 'Primary Subject',
                  list: info.subjects,
                  required: true,
                  value: {
                    id: undefined,
                    title: '',
                  },
                },
                secondarySubject: {
                  fieldTitle: 'Secondary Subject',
                  list: info.secondarySubjects,
                  required: false,
                  value: {
                    id: undefined,
                    title: '',
                  },
                },
                keywords: {
                  required: true,
                  list: [],
                  value: '',
                  proposedList: info.keywords,
                  fieldTitle: 'Keywords',
                },
                image: {
                  fieldTitle: 'Featured Image',
                  required: false,
                  value: {
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
                  required: false,
                  list: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
                  value: '',
                },
              },
              tutorialResponsible: {
                faculty: {
                  fieldTitle: 'Faculty',
                  required: true,
                  value: '',
                  list: ['Bouwkunde'] /* Hardcoded now, as in design file */,
                },
                teachers: {
                  required: true,
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
                  required: true,
                  value: '',
                },
                courseCode: {
                  fieldTitle: 'Course Code',
                  required: true,
                  value: '',
                },
                image: {
                  fieldTitle: 'Featured image',
                  required: false,
                  value: {
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
                keywords: {
                  fieldTitle: 'Keywords',
                  list: [],
                  proposedList: info.keywords,
                  required: false,
                  value: '',
                },
                primaryStudy: {
                  fieldTitle: 'Primary Study',
                  list: info.primaryStudy,
                  required: true,
                  value: {
                    id: undefined,
                    title: '',
                  },
                },
                secondaryStudy: {
                  fieldTitle: 'Secondary Study',
                  list: info.secondaryStudy,
                  required: false,
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
                  value: '',
                  list: ['Bouwkunde'] /* Hardcoded now, as in design file */,
                },
                teachers: {
                  required: true,
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
                  value: {
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
                keywords: {
                  fieldTitle: 'Keywords',
                  list: [],
                  proposedList: info.keywords,
                  required: false,
                  value: '',
                },
                softwareVersion: {
                  fieldTitle: 'Software version',
                  required: true,
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
                  list: info.categories ?? [],
                  value: { id: undefined, title: '' },
                },
                secondaryCategory: {
                  fieldTitle: 'Secondary category',
                  required: false,
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
      state.tutorialTop.title = action.payload
    },
    setTutorialDescription: (state, action: PayloadAction<string>) => {
      state.tutorialTop.description = action.payload
    },
    setPageType: (state, action: PayloadAction<string | undefined>) => {
      state.pageType = action.payload
    },
    addTutorialElements: (state, action: PayloadAction<TutorialTopElementsObject>) => {
      state.tutorialTop.elements = [...state.tutorialTop.elements, action.payload]
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
    setElementInfobox: (state, action: PayloadAction<ElementInfoboxActionInterface>) => {
      setElementProperty(
        state,
        {
          ...action,
          payload: {
            ...action.payload,
            value: action.payload.infobox,
          },
        },
        'infobox',
      )
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
      const { index, layout, thumbnail, chapterIndex } = action.payload
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
        const elements = state.tutorialTop?.elements
        const element = elements ? elements[index] : undefined
        if (element && element.video !== undefined) {
          element.video.thumbnail = thumbnail
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
            title: '',
            text: '',
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
              title: '',
              text: '',
              video: {
                format: '',
                link: '',
                publishDate: '',
                title: '',
                type: 'video',
                description: '',
                thumbnail: {
                  description: '',
                  format: '',
                  type: 'image',
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
              title: '',
              text: '',
              image: {
                format: '',
                link: '',
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
            title: '',
            text: '',
            elements: [],
          },
        ]
      } else {
        if (action.payload.chapterType.split(' ')[0] === 'video') {
          state.chapters[action.payload.chapterIndex].subchapters = [
            ...(state.chapters[action.payload.chapterIndex].subchapters || []),
            {
              layout: action.payload.chapterType,
              title: '',
              text: '',
              video: {
                format: '',
                link: '',
                publishDate: '',
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
              title: '',
              text: '',
              image: {
                format: '',
                link: '',
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
              text: '',
              title: '',
            },
          },
        ]
      } else if (action.payload.chapterType === 'image left') {
        state.chapters[action.payload.chapterIndex].elements = [
          ...(state.chapters[action.payload.chapterIndex].elements || []),
          {
            imageText: {
              image: {
                format: '',
                link: '',
                publishDate: '',
                title: '',
                type: 'image',
                description: '',
              },
              text: '',
              title: '',
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
                title: '',
                type: 'image',
                description: '',
              },
              text: '',
              title: '',
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
                type: 'video',
                description: '',
                thumbnail: {
                  description: '',
                  format: '',
                  type: 'image',
                  link: '',
                  publishDate: '',
                  title: '',
                },
              },
              text: '',
              title: '',
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
                type: 'video',
                description: '',
                thumbnail: {
                  description: '',
                  format: '',
                  type: 'image',
                  link: '',
                  publishDate: '',
                  title: '',
                },
              },
              text: '',
              title: '',
            },
          },
        ]
      }
    },
    setChapterText: (state, action: PayloadAction<ChapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].text = action.payload.text
    },
    setChapterTitle: (state, action: PayloadAction<ChapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].title = action.payload.text
    },
    setSubchapterTitle: (state, action: PayloadAction<SubchapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].subchapters[
        action.payload.subchapterIndex
      ].title = action.payload.text
    },
    setSubchapterText: (state, action: PayloadAction<SubchapterTextFieldActionInterface>) => {
      state.chapters[action.payload.chapterIndex].subchapters[action.payload.subchapterIndex].text =
        action.payload.text
    },
    addChapterElement: (state, action: PayloadAction<AddChapterElementInterface>) => {
      state.chapters[action.payload.chapterIndex].elements = [
        ...state.chapters[action.payload.chapterIndex].elements,
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
        chapterIndex: number
        listIndex: number
        layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText' | 'textLayout'
      }>,
    ) => {
      const { value, chapterIndex, listIndex, layout } = action.payload
      const chapter = state.chapters[chapterIndex]
      const elements = chapter?.elements
      const element = elements ? elements[listIndex] : undefined
      const layoutItem = element ? element[layout] : undefined

      if (layoutItem && layoutItem.text !== undefined) {
        layoutItem.title = value
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
        if (element.tutorialCards !== undefined) {
          const newObject: TutorialCardInterface = {
            value: { id: undefined, title: '' },
            proposedList: element.tutorialCards[0].proposedList,
          }
          element.tutorialCards = [...element.tutorialCards, newObject]
        }
      } else if (block === 'chapterElements' && chapterIndex !== undefined) {
        const elements = state.chapters[chapterIndex].elements
        const element = elements && elements[listIndex]
        if (element.tutorialCards !== undefined) {
          const newObject: TutorialCardInterface = {
            value: { id: undefined, title: '' },
            proposedList: element.tutorialCards[0].proposedList,
          }
          element.tutorialCards = [...element.tutorialCards, newObject]
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
          element.tutorialCards[nestedIndex].value !== undefined
        ) {
          if (isUrl) {
            element.tutorialCards[nestedIndex].value.id = undefined
            element.tutorialCards[nestedIndex].value[`${name as 'title' | 'url'}`] = value
          } else {
            element.tutorialCards[nestedIndex].value = element.tutorialCards[
              nestedIndex
            ].proposedList.find((el) => el.title === value) ?? { id: undefined, title: '' }
          }
        }
      } else if (block === 'chapterElements' && chapterIndex !== undefined) {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements && elements[listIndex]

        if (
          element.tutorialCards !== undefined &&
          element.tutorialCards[nestedIndex].value !== undefined
        ) {
          if (isUrl) {
            element.tutorialCards[nestedIndex].value[`${name as 'title' | 'url'}`] = value
          } else {
            element.tutorialCards[nestedIndex].value = element.tutorialCards[
              nestedIndex
            ].proposedList.find((el) => el.title === value) ?? { id: undefined, title: '' }
          }
        }
      }
    },
    changeSubchapterText: (
      state,
      action: PayloadAction<{
        value: string
        chapterIndex: number
        listIndex: number
        layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText' | 'textLayout'
      }>,
    ) => {
      const { chapterIndex, listIndex, layout, value } = action.payload

      if (layout !== undefined && chapterIndex !== undefined && listIndex !== undefined) {
        const chapter = state.chapters[chapterIndex]
        const elements = chapter?.elements
        const element = elements ? elements[listIndex] : undefined
        const layoutItem = element ? element[layout] : undefined

        if (layoutItem && layoutItem.text !== undefined) {
          layoutItem.text = value
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
        state.meta.tutorialBelongs[action.payload.belongsKeyName].value = action.payload.value
      } else if (
        action.payload.objectName === 'tutorialResponsible' &&
        action.payload.responsibleKeyName &&
        state.meta.tutorialResponsible
      ) {
        state.meta.tutorialResponsible[action.payload.responsibleKeyName].value =
          action.payload.value
      } else if (
        action.payload.objectName === 'courseResponsible' &&
        action.payload.responsibleKeyName &&
        state.meta.courseResponsible
      ) {
        state.meta.courseResponsible[action.payload.responsibleKeyName].value = action.payload.value
      } else if (
        action.payload.objectName === 'courseBelongs' &&
        action.payload.courseBelongsKeyName &&
        state.meta.courseBelongs
      ) {
        state.meta.courseBelongs[action.payload.courseBelongsKeyName].value = action.payload.value
      } else if (
        action.payload.objectName === 'softwareBelongs' &&
        action.payload.softwareBelongsKeyName &&
        state.meta.softwareBelongs
      ) {
        state.meta.softwareBelongs[action.payload.softwareBelongsKeyName].value =
          action.payload.value
      } else if (
        action.payload.objectName === 'subjectsInvolve' &&
        action.payload.subjectInvolveKey &&
        state.meta.subjectsInvolve
      ) {
        state.meta.subjectsInvolve[action.payload.subjectInvolveKey].value.title =
          action.payload.value
      }
    },
    addKeywordsToList: (
      state,
      action: PayloadAction<{ value: string; objectName: keyof TutorialMetaObject }>,
    ) => {
      if (action.payload.objectName === 'tutorialBelongs' && state.meta.tutorialBelongs) {
        state.meta.tutorialBelongs.keywords.list = [
          ...state.meta.tutorialBelongs.keywords.list,
          action.payload.value,
        ]
      } else if (action.payload.objectName === 'courseBelongs' && state.meta.courseBelongs) {
        state.meta.courseBelongs.keywords.list = [
          ...state.meta.courseBelongs.keywords.list,
          action.payload.value,
        ]
      } else if (action.payload.objectName === 'softwareBelongs' && state.meta.softwareBelongs) {
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
        state.meta.tutorialResponsible.teachers.list = [
          ...state.meta.tutorialResponsible.teachers.list,
          action.payload.value,
        ]
      } else if (
        state.meta.courseResponsible &&
        action.payload.objectName === 'courseResponsible'
      ) {
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
  },
})

export const {
  setEditorLoaded,
  setTutorialTitle,
  setTutorialDescription,
  setPageType,
  addTutorialElements,
  setElementText,
  setElementInfobox,
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
} = editorSlice.actions

export default editorSlice.reducer
