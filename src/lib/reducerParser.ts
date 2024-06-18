import {
  ArtictesType,
  BoolString,
  ChapterInterface,
  EditorState,
  LayoutChapterType,
  ResponseArticleChapterInterface,
  ResponseArticleInterface,
  ResponseChapterInterface,
  ResponseContentBlock,
  ResponseKeyword,
  TutorialTopElementsObject,
} from 'src/types/types'
import { articlesAPI, chaptersAPI, taxonomiesAPI } from './api'

export const getSoftwares = async () => {
  const softwares = await articlesAPI
    .getArticles('softwares')
    .then((res) => res.data && res.data.map(({ id, title }: any) => ({ id, title })))
  return softwares
}

export const getInfo = async (type: ArtictesType) => {
  const info = await articlesAPI.getInfo(type).then((res) => res.data)
  return info
}

export const getSubjects = async () => {
  const subjects = await articlesAPI
    .getArticles('subjects' as ArtictesType)
    .then((res) => res.data && res.data.map(({ id, title }: any) => ({ id, title })))
  return subjects
}

export const getKeywords = async () => {
  return await taxonomiesAPI
    .getKeywords()
    .then((res) => res.data && res.data.map((item: ResponseKeyword) => item.name))
}

export const getSoftwareVersions = async () => {
  return await taxonomiesAPI
    .getSoftwareVersions()
    .then(
      (res) => res.data && res.data.map(({ term_id, name }: any) => ({ id: term_id, title: name })),
    )
}

export const getTeachers = async () => {
  const teachers = await taxonomiesAPI
    .getTeachers()
    .then((res) => res.data && res.data.map(({ name }: any) => name))
  return teachers
}

const getExtendedChapters = async (
  chaptersData: ResponseArticleChapterInterface[] | { error: string },
) => {
  if (!Array.isArray(chaptersData)) {
    console.error('Error response:', chaptersData.error)
    return []
  } else {
    const chapterPromises = chaptersData.map((chapter) =>
      chaptersAPI.getSingleChapter(chapter.id).then((res) => res.data.data),
    )
    try {
      const chapters = await Promise.all(chapterPromises)
      return chapters
    } catch (error) {
      console.error('Error fetching chapters:', error)
      return []
    }
  }
}

const getFirstChapterElement = (chapter: ChapterInterface) => {
  if (chapter.layout === 'image left') {
    return {
      block_name: 'tu-delft-image-text',
      block_data: {
        image: 294 /* Hardcoded. Must be changed after Media resolve */,
        content: chapter.text,
      },
    }
  } else if (chapter.layout === 'image right') {
    return {
      block_name: 'tu-delft-text-image',
      block_data: {
        image: 294 /* Hardcoded. Must be changed after Media resolve */,
        content: chapter.text,
      },
    }
  } else if (chapter.layout === 'video left') {
    return {
      block_name: 'tu-delft-video-text',
      block_data: {
        video: 104 /* Hardcoded. Must be changed after Media resolve */,
        content: chapter.text,
      },
    }
  } else if (chapter.layout === 'video right') {
    return {
      block_name: 'tu-delft-text-video',
      block_data: {
        video: 104 /* Hardcoded. Must be changed after Media resolve */,
        content: chapter.text,
      },
    }
  } else {
    return {
      block_name: 'tu-delft-text',
      block_data: {
        content: chapter.text,
      },
    }
  }
}

export const reducerParser = {
  async parseToReducer(response: ResponseArticleInterface, articleType: ArtictesType) {
    const parsedElements = (elements: ResponseContentBlock[]): TutorialTopElementsObject[] => {
      return elements
        .map((block) => {
          switch (block.block_name) {
            case 'tu-delft-text':
              return {
                text: block.block_data.content,
              }
            case 'tu-delft-info-box':
              return {
                infobox: block.block_data.content,
              }
            case 'tu-delft-quiz':
              return {
                quiz: {
                  question: block.block_data.question,
                  answers: [
                    {
                      answer: block.block_data.answers_0_answer,
                      isCorrect: block.block_data.answers_0_is_correct as BoolString,
                    },
                    {
                      answer: block.block_data.answers_1_answer,
                      isCorrect: block.block_data.answers_1_is_correct as BoolString,
                    },
                    {
                      answer: block.block_data.answers_2_answer,
                      isCorrect: block.block_data.answers_2_is_correct as BoolString,
                    },
                    {
                      answer: block.block_data.answers_3_answer,
                      isCorrect: block.block_data.answers_3_is_correct as BoolString,
                    },
                  ],
                  answersCount: block.block_data.answers,
                },
              }
            case 'tu-delft-h5p':
              return {
                h5pElement: {
                  value: block.block_data.source,
                },
              }
            case 'tu-delft-image':
              return {
                image: {
                  link: block.block_data.image_url,
                  type: 'image',
                  format: 'test',
                  title: block.block_data.content ? block.block_data.content : '',
                  publishDate: 'hardcode',
                },
              }
            case 'tu-delft-video':
              return {
                image: {
                  link: block.block_data.video_url,
                  type: 'video',
                  format: 'test',
                  title: block.block_data.content ? block.block_data.content : '',
                  publishDate: 'hardcode',
                },
              }
            default:
              return null
          }
        })
        .filter(Boolean) as TutorialTopElementsObject[]
    }

    const tutorialTopElements = response.content ? parsedElements(response.content) : []

    const parseChapters = async (responseChapters: ResponseArticleChapterInterface[]) => {
      const extendedChapters = await getExtendedChapters(responseChapters)

      const newChapters = extendedChapters.map((chapter: ResponseChapterInterface) => {
        const chapterLayout = (): LayoutChapterType => {
          switch (chapter.content[0].block_name) {
            case 'tu-delft-image-text':
              return 'image left'
            case 'tu-delft-text-image':
              return 'image right'
            case 'tu-delft-video-text':
              return 'video left'
            case 'tu-delft-text-video':
              return 'video right'
            default:
              return '1 column'
          }
        }
        const newChapter: ChapterInterface = {
          id: chapter.id,
          layout: chapterLayout(),
          title: chapter.title,
          text: chapter.content[0].block_data.content || '',
          elements: parsedElements(chapter.content),
          subchapters: [],
          video:
            chapterLayout() === 'video left' || chapterLayout() === 'video right'
              ? {
                  link: chapter.content[0].block_data.video_url || '',
                  type: 'video',
                  format: 'test',
                  title: '',
                  publishDate: '',
                }
              : undefined,
          image:
            chapterLayout() === 'image left' || chapterLayout() === 'image right'
              ? {
                  link: chapter.content[0].block_data.image_url || '',
                  type: 'image',
                  format: 'test',
                  title: '',
                  publishDate: '',
                }
              : undefined,
        }
        return newChapter
      })

      return newChapters
    }
    let reducerObject: EditorState | {} = {}

    if (articleType === 'tutorials') {
      const softwares = await getSoftwares()
      const subjects = await getSubjects()
      const keywords = await getKeywords()
      const teachers = await getTeachers()
      reducerObject = {
        tutorialTop: {
          title: response.title ? response.title : '',
          titleType: 'h1',
          description: response.description ? response.description : '',
          elements: tutorialTopElements,
        },
        chapters: response.chapters ? await parseChapters(response.chapters) : [],
        tutorialBottom: {
          title: 'Useful Links',
          titleType: 'h2',
          text: response.useful_links ? response.useful_links : '',
        },
        meta: {
          tutorialBelongs: {
            primary: {
              fieldTitle: 'Primary software used',
              required: true,
              list: softwares.length > 0 ? softwares : [],
              value: response.primary_software
                ? softwares.find((item: any) => item.id === response.primary_software)
                : { id: undefined, title: '' },
            },
            version: {
              fieldTitle: 'Software Version',
              list: [],
              value: response.software_version && response.software_version[0],
              required: false,
            },
            primarySubject: {
              fieldTitle: 'Primary Subject',
              list: subjects,
              required: true,
              value:
                response.primary_subject &&
                subjects.find((subject: any) => subject.id === response.primary_subject),
            },
            secondarySubject: {
              fieldTitle: 'Secondary Subject',
              list: subjects,
              required: false,
              value:
                response.secondary_subject &&
                subjects.find(
                  (subject: any) => subject.id === parseInt(response.secondary_subject as string),
                ),
            },
            keywords: {
              required: true,
              list: response.keywords ? response.keywords : [],
              value: '',
              proposedList: keywords,
              fieldTitle: 'Keywords',
            },
            image: {
              fieldTitle: 'Featured Image',
              required: false,
              value: response.featured_image ? response.featured_image : '',
            },
            level: {
              fieldTitle: 'Level',
              required: false,
              list: [],
              value: response.level ? response.level : '',
            },
          },
          tutorialResponsible: {
            faculty: {
              fieldTitle: 'Faculty',
              required: true,
              value: response.faculty ? response.faculty : '',
              list: ['BK'] /* Hardcoded now, as in design file */,
            },
            teachers: {
              required: true,
              list: response.teachers ? response.teachers : [],
              value: '',
              proposedList: teachers,
              fieldTitle: 'Teachers',
            },
          },
        },
      }
    } else if (articleType === 'courses') {
      const keywords = await getKeywords()
      const info = await getInfo(articleType)
      const teachers = await getTeachers()

      reducerObject = {
        tutorialTop: {
          title: response.title ? response.title : '',
          titleType: 'h1',
          description: response.description ? response.description : '',
          elements: tutorialTopElements,
        },
        chapters: response.chapters ? await parseChapters(response.chapters) : [],
        tutorialBottom: {
          title: 'Useful Links',
          titleType: 'h2',
          text: response.useful_links ? response.useful_links : '',
        },
        meta: {
          courseBelongs: {
            course: {
              fieldTitle: 'Course',
              required: true,
              value: response.title ? response.title : '',
            },
            courseCode: {
              fieldTitle: 'Course Code',
              required: true,
              value: response.course_code ? response.course_code : '',
            },
            image: {
              fieldTitle: 'Featured image',
              required: false,
              value: response.featured_image ? response.featured_image : '',
            },
            keywords: {
              fieldTitle: 'Keywords',
              list: response.keywords ? response.keywords : [],
              proposedList: keywords ?? [],
              required: false,
              value: '',
            },
            primaryStudy: {
              fieldTitle: 'Primary Study',
              list: info.study ? info.study : [{ id: undefined, title: '' }],
              required: true,
              value: response.study ? response.study : '',
            },
            secondaryStudy: {
              fieldTitle: 'Secondary Study',
              list: info.study ? info.study : [{ id: undefined, title: '' }],
              required: false,
              value: response.study ? response.study : '' /* To change */,
            },
          },
          courseResponsible: {
            faculty: {
              fieldTitle: 'Faculty',
              required: true,
              value: response.faculty ? response.faculty : '',
              list: ['BK'] /* Hardcoded now, as in design file */,
            },
            teachers: {
              required: true,
              list: response.teachers ? response.teachers : [],
              value: '',
              proposedList: teachers,
              fieldTitle: 'Teachers',
            },
          },
        },
      }
    } else if (articleType === 'softwares') {
      const keywords = await getKeywords()
      const info = await getInfo(articleType)

      reducerObject = {
        tutorialTop: {
          title: response.title ? response.title : '',
          titleType: 'h1',
          description: response.description ? response.description : '',
          elements: tutorialTopElements,
        },
        chapters: response.chapters ? await parseChapters(response.chapters) : [],
        tutorialBottom: {
          title: 'Useful Links',
          titleType: 'h2',
          text: response.useful_links ? response.useful_links : '',
        },
        meta: {
          softwareBelongs: {
            image: {
              fieldTitle: 'Featured image',
              required: false,
              value: response.featured_image ? response.featured_image : '',
            },
            keywords: {
              fieldTitle: 'Keywords',
              list: response.keywords ? response.keywords : [],
              proposedList: keywords ?? [],
              required: false,
              value: '',
            },
            softwareVersion: {
              fieldTitle: 'Software version',
              required: true,
              list: info.software_versions
                ? info.software_versions
                : [{ id: undefined, title: '' }],
              value: response.software_version ?? '',
            },
          },
        },
      }
    } else if (articleType === 'subjects') {
      reducerObject = {
        tutorialTop: {
          title: response.title ? response.title : '',
          titleType: 'h1',
          description: response.description ? response.description : '',
          elements: tutorialTopElements,
        },
        chapters: response.chapters ? await parseChapters(response.chapters) : [],
        tutorialBottom: {
          title: 'Useful Links',
          titleType: 'h2',
          text: response.useful_links ? response.useful_links : '',
        },
        meta: {
          subjectsInvolve: {
            primaryCategory: {
              fieldTitle: 'Primary category',
              required: true,
              value: response.category ?? '',
            },
            secondaryCategory: {
              fieldTitle: 'Secondary category',
              required: false,
              value: '' /* TO DO */,
            },
          },
        },
      }
    }

    return reducerObject as EditorState
  },
  parseFromReducer(
    editorState: EditorState,
    status: 'publish' | 'draft',
    id?: string,
    articleType?: ArtictesType,
  ) {
    const parseElementsToContent = (elements: TutorialTopElementsObject[]) => {
      const content = elements
        .map((item) => {
          if (item.text) {
            return {
              block_name: 'tu-delft-text',
              block_data: {
                content: item.text,
              },
            }
          }
          if (item.infobox) {
            return {
              block_name: 'tu-delft-info-box',
              block_data: {
                content: item.infobox,
              },
            }
          }
          if (item.quiz) {
            return {
              block_name: 'tu-delft-quiz',
              block_data: {
                question: item.quiz.question,
                answers_0_answer: item.quiz.answers[0].answer,
                answers_0_is_correct: item.quiz.answers[0].isCorrect,
                answers_1_answer: item.quiz.answers[1].answer,
                answers_1_is_correct: item.quiz.answers[1].isCorrect,
                answers_2_answer: item.quiz.answers[2].answer,
                answers_2_is_correct: item.quiz.answers[2].isCorrect,
                answers_3_answer: item.quiz.answers[3].answer,
                answers_3_is_correct: item.quiz.answers[3].isCorrect,
                answers: item.quiz.answersCount,
              },
            }
          }
          if (item.h5pElement) {
            return {
              block_name: 'tu-delft-h5p',
              block_data: {
                source: item.h5pElement.value,
              },
            }
          }
          if (item.image) {
            return {
              block_name: 'tu-delft-image',
              block_data: {
                image: 294 /* Hardcoded. Must be changed after Media resolve */,
              },
            }
          }
          if (item.video) {
            return {
              block_name: 'tu-delft-video',
              block_data: {
                video: 104 /* Hardcoded. Must be changed after Media resolve */,
              },
            }
          }
          if (item.file) {
            return {
              block_name: 'tu-delft-download',
              block_data: {
                file: 212 /* Hardcoded. Must be changed after Media resolve */,
                title: item.file.title,
                description: item.file.description,
              },
            }
          }
          return null
        })
        .filter(Boolean)
      return content
    }
    const parseChaptersToRequest = (chapters: ChapterInterface[]) => {
      const content = chapters.map((chapter) => {
        const els = parseElementsToContent(chapter.elements)
        const firstEl = getFirstChapterElement(chapter)
        return {
          id: chapter.id ? chapter.id : undefined,
          title: chapter.title,
          content: [firstEl, ...els],
        }
      })
      return content
    }
    let parsedObject = {}
    if (articleType === 'tutorials') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        status,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        primary_software: editorState.meta?.tutorialBelongs?.primary.value.id ?? null,
        software_version: [editorState.meta?.tutorialBelongs?.version.value.id] ?? null,
        primary_subject: editorState.meta?.tutorialBelongs?.primarySubject.value?.id ?? null,
        secondary_subject: editorState.meta?.tutorialBelongs?.secondarySubject.value?.id ?? null,
        level: editorState.meta?.tutorialBelongs?.level.value ?? null,
        faculty: editorState.meta?.tutorialResponsible?.faculty.value,
        keywords: editorState.meta?.tutorialBelongs?.keywords.list,
        teachers: editorState.meta?.tutorialResponsible?.teachers.list,
        chapters: editorState.chapters && parseChaptersToRequest(editorState.chapters),
        featured_image: editorState.meta?.tutorialBelongs?.image.value,
      }
    } else if (articleType === 'courses') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        status,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        chapters: editorState.chapters && parseChaptersToRequest(editorState.chapters),
        course_code: editorState.meta.courseBelongs?.courseCode.value ?? '',
        study: editorState.meta.courseBelongs?.primaryStudy.value.id ?? '',
        keywords: editorState.meta.courseBelongs?.keywords.list ?? [],
        featured_image: editorState.meta.courseBelongs?.image.value ?? null,
        faculty: editorState.meta.courseResponsible?.faculty.value ?? null,
        teachers: editorState.meta.courseResponsible?.teachers.list ?? [],
      }
    } else if (articleType === 'subjects') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        status,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        chapters: editorState.chapters && parseChaptersToRequest(editorState.chapters),
        category: editorState.meta.subjectsInvolve?.primaryCategory.value ?? null,
      }
    } else if (articleType === 'softwares') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        chapters: editorState.chapters && parseChaptersToRequest(editorState.chapters),
        software_version: editorState.meta.softwareBelongs?.softwareVersion.value.id ?? [],
        keywords: editorState.meta.softwareBelongs?.keywords.list ?? [],
        featured_image: editorState.meta?.softwareBelongs?.image.value ?? null,
      }
    }
    return parsedObject
  },
}
