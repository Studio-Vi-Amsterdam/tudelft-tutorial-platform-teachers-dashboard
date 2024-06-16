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
import { chaptersAPI, taxonomiesAPI } from './api'

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
    const getKeywords = async () => {
      return await taxonomiesAPI
        .getKeywords()
        .then((res) => res.data && res.data.map((item: ResponseKeyword) => item.name))
    }

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

    const parsedObject: EditorState = {
      pageType: articleType,
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
        belongs: {
          primary: {
            required: true,
            list: ['Windows 10', 'Office 365', 'VS Code', 'Figma'],
            value: '' /* There we should to get "primary_software" */,
            fieldTitle: 'Primary software used',
          },
          version: {
            required: true,
            value: response.software_version ? response.software_version.toString() : '',
            fieldTitle: 'Software version',
          },
          primarySubject: {
            required: true,
            list: ['Mathematics', 'Web-programing', 'Web-design', 'Physics'],
            value: '' /* There we need to get primary_subject */,
            fieldTitle: 'Primary Subject',
          },
          secondarySubject: {
            required: false,
            list: ['Mathematics', 'Web-programing', 'Web-design', 'Physics'],
            value: '' /* There we need to get secondary_subject */,
            fieldTitle: 'Secondary Subject',
          },
          level: {
            required: true,
            list: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
            value: response.level ? response.level : '',
            fieldTitle: 'Level',
          },
          keywords: {
            required: true,
            list: response.keywords ? response.keywords : [],
            value: '',
            proposedList: await getKeywords(),
            fieldTitle: 'Keywords',
          },
          image: {
            required: false,
            value: response.featured_image ? response.featured_image : '',
            fieldTitle: 'Featured image',
          },
        },
        responsible: {
          teacher: {
            required: true,
            value: response.teachers ? response.teachers.toString() : '',
            fieldTitle: 'Teacher',
          },
          faculty: {
            required: true,
            list: ['Computer Engeneering', 'Computer Science', 'Automation'],
            value: response.faculty ? response.faculty.toString() : '',
            fieldTitle: 'Faculty',
          },
        },
      },
    }
    return parsedObject
  },
  parseFromReducer(editorState: EditorState, status: 'publish' | 'draft', id?: string) {
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
    const newObject = {
      id: id !== undefined ? parseInt(id) : undefined,
      status,
      title: editorState.tutorialTop.title,
      description: editorState.tutorialTop.description,
      content:
        editorState.tutorialTop.elements.length !== 0
          ? parseElementsToContent(editorState.tutorialTop.elements)
          : [],
      useful_links: editorState.tutorialBottom.text,
      primary_software: 270,
      software_version: [3, 4],
      primary_subject: 386,
      secondary_subject: '',
      level: 2,
      faculty: editorState.meta.responsible.faculty.value,
      keywords: editorState.meta.belongs.keywords.list,
      teachers: editorState.meta.responsible.teacher.value.split(','),
      chapters: editorState.chapters && parseChaptersToRequest(editorState.chapters),
    }
    return newObject
  },
}
