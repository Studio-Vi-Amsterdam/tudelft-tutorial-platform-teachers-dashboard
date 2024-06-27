import {
  ArtictesType,
  BoolString,
  ChapterElementsObject,
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
  try {
    const response = await articlesAPI.getArticles('softwares')
    const data = response.data

    if (data && Array.isArray(data)) {
      const softwares = data.map(({ id, title }: any) => ({ id, title }))
      return softwares
    } else {
      return []
    }
  } catch (error) {
    console.error('Error fetching softwares:', error)
    return []
  }
}

export const getInfo = async (type: ArtictesType) => {
  const info = await articlesAPI.getInfo(type).then((res) => res.data)
  return info
}

export const getSubjects = async () => {
  try {
    const response = await articlesAPI.getArticles('subjects' as ArtictesType)
    const data = response.data

    if (data && Array.isArray(data)) {
      const subjects = data.map(({ id, title }: any) => ({ id, title }))
      return subjects
    } else {
      return []
    }
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return []
  }
}

export const getKeywords = async () => {
  return await taxonomiesAPI
    .getKeywords()
    .then((res) => res.data && res.data.map((item: ResponseKeyword) => item.name))
}

export const getSoftwareVersions = async () => {
  try {
    const response = await taxonomiesAPI.getSoftwareVersions()
    const data = response.data

    if (data && Array.isArray(data)) {
      // eslint-disable-next-line camelcase
      const softwareVersions = data.map(({ term_id, name }: any) => ({
        // eslint-disable-next-line camelcase
        id: term_id,
        title: name,
      }))
      return softwareVersions
    } else {
      return []
    }
  } catch (error) {
    console.error('Error fetching software versions:', error)
    return []
  }
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
        image_url: chapter.image?.url,
        image: chapter.image?.id,
        content: chapter.text,
      },
    }
  } else if (chapter.layout === 'image right') {
    return {
      block_name: 'tu-delft-text-image',
      block_data: {
        image_url: chapter.image?.url,
        image: chapter.image?.id,
        content: chapter.text,
      },
    }
  } else if (chapter.layout === 'video left') {
    return {
      block_name: 'tu-delft-video-text',
      block_data: {
        video: chapter.video?.id,
        video_url: chapter.video?.url,
        content: chapter.text,
      },
    }
  } else if (chapter.layout === 'video right') {
    return {
      block_name: 'tu-delft-text-video',
      block_data: {
        video: chapter.video?.id,
        video_url: chapter.video?.url,
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
                  id: block.block_data.image,
                  url: block.block_data.image_url,
                  type: 'image',
                  format: block.block_data.image_url
                    ? block.block_data.image_url.split('.')[
                        block.block_data.image_url.split('.').length - 1
                      ]
                    : 'unknown',
                  title: block.block_data.content ? block.block_data.content : '',
                  publishDate: 'hardcode',
                },
              }
            case 'tu-delft-video':
              return {
                video: {
                  id: block.block_data.video,
                  url: block.block_data.video_url,
                  type: 'video',
                  format: block.block_data.video_url
                    ? block.block_data.video_url.split('.')[
                        block.block_data.video_url.split('.').length - 1
                      ]
                    : 'unknown',
                  title: block.block_data.content ? block.block_data.content : '',
                  publishDate: 'hardcode',
                },
              }
            case 'tu-delft-text-image':
              return {
                textImage: {
                  text: block.block_data.content ? block.block_data.content : '',
                  image: {
                    id: block.block_data.image,
                    url: block.block_data.image_url,
                    type: 'image',
                    format: block.block_data.image_url
                      ? block.block_data.image_url.split('.')[
                          block.block_data.image_url.split('.').length - 1
                        ]
                      : 'unknown',
                    title: block.block_data.content ? block.block_data.content : '',
                    publishDate: 'hardcode',
                  },
                },
              }
            case 'tu-delft-image-text':
              return {
                imageText: {
                  text: block.block_data.content ? block.block_data.content : '',
                  image: {
                    id: block.block_data.image,
                    url: block.block_data.image_url,
                    type: 'image',
                    format: block.block_data.image_url
                      ? block.block_data.image_url.split('.')[
                          block.block_data.image_url.split('.').length - 1
                        ]
                      : 'unknown',
                    title: block.block_data.content ? block.block_data.content : '',
                    publishDate: 'hardcode',
                  },
                },
              }
            case 'tu-delft-video-text':
              return {
                videoText: {
                  text: block.block_data.content ? block.block_data.content : '',
                  video: {
                    id: block.block_data.video,
                    url: block.block_data.video_url,
                    type: 'video',
                    format: block.block_data.video_url
                      ? block.block_data.video_url.split('.')[
                          block.block_data.video_url.split('.').length - 1
                        ]
                      : 'unknown',
                    title: block.block_data.content ? block.block_data.content : '',
                    publishDate: 'hardcode',
                  },
                },
              }
            case 'tu-delft-text-video':
              return {
                textVideo: {
                  text: block.block_data.content ? block.block_data.content : '',
                  video: {
                    id: block.block_data.video,
                    url: block.block_data.video_url,
                    type: 'video',
                    format: block.block_data.video_url
                      ? block.block_data.video_url.split('.')[
                          block.block_data.video_url.split('.').length - 1
                        ]
                      : 'unknown',
                    title: block.block_data.content ? block.block_data.content : '',
                    publishDate: 'hardcode',
                  },
                },
              }
            default:
              return null
          }
        })
        .filter(Boolean) as TutorialTopElementsObject[]
    }

    const tutorialTopElements = response.content ? parsedElements(response.content) : []

    if (typeof response.featured_image !== 'string' && response.featured_image) {
      response.featured_image = response.featured_image.url
    }

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
          elements: chapter.content.length > 0 ? parsedElements(chapter.content.slice(1)) : [],
          subchapters: [],
          video:
            chapterLayout() === 'video left' || chapterLayout() === 'video right'
              ? {
                  id: chapter.content[0].block_data.video,
                  link: chapter.content[0].block_data.video_url || '',
                  url: chapter.content[0].block_data.video_url || '',
                  type: 'video',
                  format: 'test',
                  title: '',
                  publishDate: '',
                }
              : undefined,
          image:
            chapterLayout() === 'image left' || chapterLayout() === 'image right'
              ? {
                  id: chapter.content[0].block_data.image,
                  url: chapter.content[0].block_data.image_url || '',
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
    let reducerObject: EditorState | object = {}

    if (articleType === 'tutorials') {
      const info = await getInfo(articleType as ArtictesType)
      const softwareVersions = await getSoftwareVersions()

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
              list: info.data.softwares.length > 0 ? info.data.softwares : [],
              value: response.primary_software
                ? info.data.softwares.find((item: any) => item.id === response.primary_software)
                : { id: undefined, title: '' },
            },
            version: {
              fieldTitle: 'Software Version',
              list:
                info.data.softwares.find((item: any) => item.id === response.primary_software)
                  ?.version ?? [],
              value:
                response.software_version &&
                softwareVersions &&
                softwareVersions.find((item) => item.id === response.software_version?.[0]),
              required: false,
            },
            primarySubject: {
              fieldTitle: 'Primary Subject',
              list: info.data.subjects.length > 0 ? info.data.subjects : [],
              required: true,
              value:
                response.primary_subject &&
                info.data.subjects.find((subject: any) => subject.id === response.primary_subject),
            },
            secondarySubject: {
              fieldTitle: 'Secondary Subject',
              list: info.data.subjects.length > 0 ? info.data.subjects : [],
              required: false,
              value:
                response.secondary_subject &&
                info.data.subjects.find(
                  (subject: any) => subject.id === parseInt(response.secondary_subject as string),
                ),
            },
            keywords: {
              required: true,
              list: response.keywords ? response.keywords : [],
              value: '',
              proposedList: info.data.keywords.length > 0 ? info.data.length : [],
              fieldTitle: 'Keywords',
            },
            image: {
              fieldTitle: 'Featured Image',
              required: false,
              value: response.featured_image
                ? {
                    format: response.featured_image.split('.').pop,
                    link: response.featured_image,
                    url: response.featured_image,
                    publishDate: '',
                    title: '',
                    type: 'image',
                  }
                : '',
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
              list: info.data.faculties.length > 0 ? info.data.faculties : [],
            },
            teachers: {
              required: true,
              list: response.teachers ? response.teachers : [],
              value: '',
              proposedList:
                info.data.teachers.length > 0
                  ? info.data.teachers.map(({ title }: any) => title)
                  : [],
              fieldTitle: 'Teachers',
            },
          },
        },
      }
    } else if (articleType === 'courses') {
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
              value: response.featured_image
                ? {
                    format: response.featured_image.split('.').pop,
                    link: response.featured_image,
                    url: response.featured_image,
                    publishDate: '',
                    title: '',
                    type: 'image',
                  }
                : '',
            },
            keywords: {
              fieldTitle: 'Keywords',
              list: response.keywords ? response.keywords : [],
              proposedList:
                info.keywords.length > 0 ? info.keywords.map(({ title }: any) => title) : [],
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
              list: info.faculty.length > 0 ? info.faculty : [],
            },
            teachers: {
              required: true,
              list: response.teachers ? response.teachers : [],
              value: '',
              proposedList:
                info.teachers.length > 0 ? info.teachers.map(({ title }: any) => title) : [],
              fieldTitle: 'Teachers',
            },
          },
        },
      }
    } else if (articleType === 'softwares') {
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
              value: response.featured_image
                ? {
                    format: response.featured_image.split('.').pop,
                    link: response.featured_image,
                    url: response.featured_image,
                    publishDate: '',
                    title: '',
                    type: 'image',
                  }
                : '',
            },
            keywords: {
              fieldTitle: 'Keywords',
              list: response.keywords ? response.keywords : [],
              proposedList:
                info.keywords.length > 0 ? info.keywords.map(({ title }: any) => title) : [],
              required: false,
              value: '',
            },
            softwareVersion: {
              fieldTitle: 'Software version',
              required: true,
              list: info.software_versions
                ? info.software_versions
                : [{ id: undefined, title: '' }],
              value: response['software-version'] ? { title: response['software-version'] } : '',
            },
          },
        },
      }
    } else if (articleType === 'subjects') {
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
          subjectsInvolve: {
            primaryCategory: {
              fieldTitle: 'Primary category',
              list: info.categories ?? [],
              required: true,
              value: response.category ?? { id: undefined, title: '' },
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
    const parseElementsToContent = (elements: ChapterElementsObject[]) => {
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
                image: item.image.id,
                image_url: item.image.url,
              },
            }
          }
          if (item.video) {
            return {
              block_name: 'tu-delft-video',
              block_data: {
                video: item.video.id,
                video_url: item.video.url,
              },
            }
          }
          if (item.imageText) {
            return {
              block_name: 'tu-delft-image-text',
              block_data: {
                image: item.imageText.image.id,
                image_url: item.imageText.image.url,
                content: item.imageText.text,
              },
            }
          }
          if (item.textImage) {
            return {
              block_name: 'tu-delft-text-image',
              block_data: {
                image: item.textImage.image.id,
                image_url: item.textImage.image.url,
                content: item.textImage.text,
              },
            }
          }
          if (item.textVideo) {
            return {
              block_name: 'tu-delft-text-video',
              block_data: {
                video: item.textVideo.video.id,
                video_url: item.textVideo.video.url,
                content: item.textVideo.text,
              },
            }
          }
          if (item.videoText) {
            return {
              block_name: 'tu-delft-video-text',
              block_data: {
                video: item.videoText.video.id,
                video_url: item.videoText.video.url,
                content: item.videoText.text,
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
        featured_image: editorState.meta?.tutorialBelongs?.image.value.id ?? null,
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
        featured_image: editorState.meta.courseBelongs?.image.value.id ?? null,
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
        software_version:
          editorState.meta.softwareBelongs?.softwareVersion.value.title &&
          editorState.meta.softwareBelongs?.softwareVersion.value.title.length > 0
            ? typeof editorState.meta.softwareBelongs?.softwareVersion.value.title === 'string'
              ? [editorState.meta.softwareBelongs?.softwareVersion.value.title]
              : editorState.meta.softwareBelongs?.softwareVersion.value.title
            : [],
        keywords: editorState.meta.softwareBelongs?.keywords.list ?? [],
        featured_image: editorState.meta?.softwareBelongs?.image.value.id ?? null,
      }
    }
    return parsedObject
  },
}
