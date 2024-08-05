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
  TransformedDataTutorialCards,
  TutorialCardInterface,
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
        hasZoom: chapter.image?.hasZoom ?? false,
        content: chapter.text,
        alt: chapter.title,
      },
    }
  } else if (chapter.layout === 'image right') {
    return {
      block_name: 'tu-delft-text-image',
      block_data: {
        image_url: chapter.image?.url,
        image: chapter.image?.id,
        hasZoom: chapter.image?.hasZoom ?? false,
        content: chapter.text,
        alt: chapter.title,
      },
    }
  } else if (chapter.layout === 'video left') {
    return {
      block_name: 'tu-delft-video-text',
      block_data: {
        video: chapter.video?.id,
        video_url: chapter.video?.url,
        thumbnail: chapter.video?.thumbnail?.id,
        content: chapter.text,
        alt: chapter.title,
      },
    }
  } else if (chapter.layout === 'video right') {
    return {
      block_name: 'tu-delft-text-video',
      block_data: {
        video: chapter.video?.id,
        video_url: chapter.video?.url,
        thumbnail: chapter.video?.thumbnail?.id,
        content: chapter.text,
        alt: chapter.title,
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
    let shortTutorials: any[] = []
    try {
      const tutorialsResponse = await articlesAPI.getAllArticles('tutorials')

      const tutorials = tutorialsResponse.data.map((item: any) => ({
        id: item.id,
        title: item.title,
      }))
      shortTutorials = tutorials
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        shortTutorials = []
      } else {
        console.error(error)
      }
    }
    const parsedElements = (elements: ResponseContentBlock[]): TutorialTopElementsObject[] => {
      return elements
        .map((block) => {
          switch (block.block_name) {
            case 'tu-delft-text':
              if (!block.block_data.title === undefined) {
                return {
                  text: block.block_data.content,
                }
              } else {
                return {
                  textLayout: {
                    text: block.block_data.content,
                    title: block.block_data.title,
                  },
                }
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
                  hasZoom: block.block_data.image_has_image_zoom ?? false,
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
                  thumbnail: {
                    id: block.block_data.thumbnail,
                    url: block.block_data.thumbnail_url ?? '',
                    description: '',
                    format: '',
                    type: 'image',
                    link: block.block_data.thumbnail_url ?? '',
                    publishDate: '',
                    title: '',
                  },
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
                    hasZoom: block.block_data.image_has_image_zoom ?? false,
                  },
                  title: block.block_data.title ? block.block_data.title : '',
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
                    hasZoom: block.block_data.image_has_image_zoom ?? false,
                  },
                  title: block.block_data.title ? block.block_data.title : '',
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
                    thumbnail: {
                      id: block.block_data.thumbnail,
                      url: block.block_data.thumbnail_url ?? '',
                      description: '',
                      format: '',
                      type: 'image',
                      link: block.block_data.thumbnail_url ?? '',
                      publishDate: '',
                      title: '',
                    },
                  },
                  title: block.block_data.title ? block.block_data.title : '',
                },
              }
            case 'tu-delft-content-card':
              // eslint-disable-next-line no-case-declarations
              const tutorialCards = []
              // eslint-disable-next-line no-case-declarations
              const blockData = block.block_data
              if (blockData.content_card_row !== undefined) {
                for (let i = 0; i < blockData.content_card_row; i++) {
                  const card: TutorialCardInterface = {
                    value: {
                      id: blockData[`content_card_row_${i}_card_link`],
                      title: blockData[`content_card_row_${i}_card_title`],
                    },
                    proposedList: shortTutorials,
                  }

                  const cardLinkUrl = blockData[`content_card_row_${i}_card_custom_link`]
                  if (cardLinkUrl) {
                    card.value.url = cardLinkUrl
                  }

                  tutorialCards.push(card)
                }
              }

              return {
                tutorialCards,
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
                    thumbnail: {
                      id: block.block_data.thumbnail,
                      url: block.block_data.thumbnail_url ?? '',
                      description: '',
                      format: '',
                      type: 'image',
                      link: block.block_data.thumbnail_url ?? '',
                      publishDate: '',
                      title: '',
                    },
                  },
                  title: block.block_data.title ? block.block_data.title : '',
                },
              }
            case 'tu-delft-download':
              return {
                file: {
                  title: block.block_data.title ? block.block_data.title : '',
                  file: {
                    id: block.block_data.file,
                    url: block.block_data.file_url,
                  },
                  description: block.block_data.description ? block.block_data.description : '',
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
                  description: chapter.content[0].block_data.description ?? '',
                  thumbnail: chapter.content[0].block_data.thumbnail ?? undefined,
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
                  description: chapter.content[0].block_data.description ?? '',
                  thumbnail: chapter.content[0].block_data.thumbnail ?? undefined,
                  hasZoom: chapter.content[0].block_data.hasZoom ?? false,
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
          title: response.useful_links_title ? response.useful_links_title : 'Useful links',
          titleType: 'h2',
          text: response.useful_links ? response.useful_links : '',
        },
        meta: {
          tutorialBelongs: {
            course: {
              fieldTitle: 'Course',
              required: true,
              list: info.data.courses.length > 0 ? info.data.courses : [],
              value: response.course
                ? info.data.courses.find((item: any) => item.id === response.course) ?? {
                    id: undefined,
                    title: '',
                  }
                : { id: undefined, title: '' },
            },
            primary: {
              fieldTitle: 'Primary software used',
              required: true,
              list: info.data.softwares.length > 0 ? info.data.softwares : [],
              value: response.primary_software
                ? info.data.softwares.find(
                    (item: any) => item.id === response.primary_software,
                  ) ?? { id: undefined, title: '' }
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
              list: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
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
        mediaIds: response.mediaIds ?? [],
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
          title: response.useful_links_title ? response.useful_links_title : 'Useful links',
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
              value: response.study
                ? info.study.filter(
                    (el: { id: string; title: string }) => el.id === response.study,
                  )[0]
                : '',
            },
            secondaryStudy: {
              fieldTitle: 'Secondary Study',
              list: info.study ? info.study : [{ id: undefined, title: '' }],
              required: false,
              value: response.study
                ? info.study.filter(
                    (el: { id: string; title: string }) => el.id === response.secondary_study,
                  )[0]
                : '',
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
        mediaIds: response.mediaIds ?? [],
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
          title: response.useful_links_title ? response.useful_links_title : 'Useful links',
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
        mediaIds: response.mediaIds ?? [],
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
          title: response.useful_links_title ? response.useful_links_title : 'Useful links',
          titleType: 'h2',
          text: response.useful_links ? response.useful_links : '',
        },
        meta: {
          subjectsInvolve: {
            primaryCategory: {
              fieldTitle: 'Primary category',
              list: info.categories ?? [],
              required: true,
              value: response.category
                ? info.categories.find(
                    (item: any) => item.id === parseInt(response.category as string),
                  ) ?? { id: undefined, title: '' }
                : { id: undefined, title: '' },
            },
            secondaryCategory: {
              fieldTitle: 'Secondary category',
              required: false,
              list: info.categories ?? [],
              value: response.secondary_category
                ? info.categories.find(
                    (item: any) => item.id === parseInt(response.secondary_category as string),
                  ) ?? { id: undefined, title: '' }
                : { id: undefined, title: '' },
            },
          },
        },
        mediaIds: response.mediaIds ?? [],
      }
    }

    return reducerObject as EditorState
  },
  async parseFromReducer(
    editorState: EditorState,
    status: 'publish' | 'draft',
    id?: string,
    articleType?: ArtictesType,
  ) {
    const parseElementsToContent = async (elements: ChapterElementsObject[]) => {
      const content = await Promise.all(
        elements
          .map(async (item) => {
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
            if (item.tutorialCards) {
              const transformedData: TransformedDataTutorialCards = item.tutorialCards.reduce(
                (acc: TransformedDataTutorialCards, card, index) => {
                  const isCustomLink = card.value.url !== undefined ? '_custom' : ''
                  acc[`content_card_row_${index}_card_title`] = card.value.title
                  acc[`content_card_row_${index}_card${isCustomLink}_link`] =
                    card.value.url !== undefined
                      ? card.value.url
                      : card.value.id !== undefined
                        ? card.value.id
                        : ''
                  acc[`content_card_row_${index}_card_is_custom_link`] =
                    card.value.url !== undefined
                  return acc
                },
                { content_card_row: item.tutorialCards.length },
              )
              return {
                block_name: 'tu-delft-content-card',
                block_data: transformedData,
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
                  image_has_image_zoom: item.image.hasZoom ?? false,
                },
              }
            }
            if (item.video) {
              return {
                block_name: 'tu-delft-video',
                block_data: {
                  video: item.video.id,
                  video_url: item.video.url,
                  thumbnail: item.video.thumbnail?.id ?? null,
                },
              }
            }
            if (item.textLayout) {
              return {
                block_name: 'tu-delft-text',
                block_data: {
                  content: item.textLayout.text,
                  title: item.textLayout.title ?? undefined,
                },
              }
            }
            if (item.imageText) {
              return {
                block_name: 'tu-delft-image-text',
                block_data: {
                  image: item.imageText.image.id,
                  image_url: item.imageText.image.url,
                  image_has_image_zoom: item.imageText.image.hasZoom ?? false,
                  content: item.imageText.text,
                  title: item.imageText.title,
                },
              }
            }
            if (item.textImage) {
              return {
                block_name: 'tu-delft-text-image',
                block_data: {
                  image: item.textImage.image.id,
                  image_url: item.textImage.image.url,
                  image_has_image_zoom: item.textImage.image.hasZoom ?? false,
                  content: item.textImage.text,
                  title: item.textImage.title,
                },
              }
            }
            if (item.textVideo) {
              return {
                block_name: 'tu-delft-text-video',
                block_data: {
                  video: item.textVideo.video.id,
                  video_url: item.textVideo.video.url,
                  thumbnail: item.textVideo.video.thumbnail?.id,
                  content: item.textVideo.text,
                  title: item.textVideo.title,
                },
              }
            }
            if (item.videoText) {
              return {
                block_name: 'tu-delft-video-text',
                block_data: {
                  video: item.videoText.video.id,
                  video_url: item.videoText.video.url,
                  thumbnail: item.videoText.video.thumbnail?.id,
                  content: item.videoText.text,
                  title: item.videoText.title,
                },
              }
            }
            if (item.file) {
              return {
                block_name: 'tu-delft-download',
                block_data: {
                  file: item.file.file?.id,
                  file_url: item.file.file?.url,
                  title: item.file.title,
                  description: item.file.description,
                },
              }
            }
            return null
          })
          .filter(Boolean),
      )

      return content
    }

    const parseChaptersToRequest = async (chapters: ChapterInterface[]) => {
      const content = await Promise.all(
        chapters.map(async (chapter) => {
          const els = await parseElementsToContent(chapter.elements)
          const firstEl = getFirstChapterElement(chapter)
          return {
            id: chapter.id ? chapter.id : undefined,
            title: chapter.title,
            content: [firstEl, ...els],
          }
        }),
      )
      return content
    }
    let parsedObject = {}
    if (articleType === 'tutorials') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        status,
        mediaIds: editorState.mediaIds,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? await parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        useful_links_title:
          editorState.tutorialBottom.title.trim().length !== 0
            ? editorState.tutorialBottom.title
            : 'Useful links',
        course: editorState.meta?.tutorialBelongs?.course.value.id ?? undefined,
        primary_software: editorState.meta?.tutorialBelongs?.primary.value.id ?? null,
        software_version: [editorState.meta?.tutorialBelongs?.version.value.id],
        primary_subject: editorState.meta?.tutorialBelongs?.primarySubject.value?.id ?? null,
        secondary_subject: editorState.meta?.tutorialBelongs?.secondarySubject.value?.id ?? null,
        level: editorState.meta?.tutorialBelongs?.level.value ?? null,
        faculty: editorState.meta?.tutorialResponsible?.faculty.value,
        keywords: editorState.meta?.tutorialBelongs?.keywords.list,
        teachers: editorState.meta?.tutorialResponsible?.teachers.list,
        chapters: editorState.chapters && (await parseChaptersToRequest(editorState.chapters)),
        featured_image: editorState.meta?.tutorialBelongs?.image.value.id ?? null,
      }
    } else if (articleType === 'courses') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        status,
        mediaIds: editorState.mediaIds,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? await parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        useful_links_title:
          editorState.tutorialBottom.title.trim().length !== 0
            ? editorState.tutorialBottom.title
            : 'Useful links',
        chapters: editorState.chapters && (await parseChaptersToRequest(editorState.chapters)),
        course_code: editorState.meta.courseBelongs?.courseCode.value ?? '',
        study: editorState.meta.courseBelongs?.primaryStudy.value.id ?? '',
        secondary_study: editorState.meta.courseBelongs?.secondaryStudy.value.id ?? '',
        keywords: editorState.meta.courseBelongs?.keywords.list ?? [],
        featured_image: editorState.meta.courseBelongs?.image.value.id ?? null,
        faculty: editorState.meta.courseResponsible?.faculty.value ?? null,
        teachers: editorState.meta.courseResponsible?.teachers.list ?? [],
      }
    } else if (articleType === 'subjects') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        status,
        mediaIds: editorState.mediaIds,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? await parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        useful_links_title:
          editorState.tutorialBottom.title.trim().length !== 0
            ? editorState.tutorialBottom.title
            : 'Useful links',
        chapters: editorState.chapters && (await parseChaptersToRequest(editorState.chapters)),
        category: editorState.meta.subjectsInvolve?.primaryCategory.value.id ?? null,
        secondary_category: editorState.meta.subjectsInvolve?.secondaryCategory.value.id ?? null,
      }
    } else if (articleType === 'softwares') {
      parsedObject = {
        id: id !== undefined ? parseInt(id) : undefined,
        mediaIds: editorState.mediaIds,
        status,
        title: editorState.tutorialTop.title,
        description: editorState.tutorialTop.description,
        content:
          editorState.tutorialTop.elements.length !== 0
            ? await parseElementsToContent(editorState.tutorialTop.elements)
            : [],
        useful_links: editorState.tutorialBottom.text,
        useful_links_title:
          editorState.tutorialBottom.title.trim().length !== 0
            ? editorState.tutorialBottom.title
            : 'Useful links',
        chapters: editorState.chapters && (await parseChaptersToRequest(editorState.chapters)),
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
