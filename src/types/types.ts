export interface TutorialCard {
  type: 'course' | 'subject' | 'software' | 'tutorial'
  name: string
  published: Date
  lastEdit: Date
}

export type AddElementsType =
  | 'text'
  | 'infobox'
  | 'image'
  | 'video'
  | 'file'
  | 'quiz'
  | 'h5p element'
  | 'tutorial cards'

export type ArtictesType = 'softwares' | 'courses' | 'tutorials' | 'subjects'
export interface DashboardPublishedInterface {
  id: number
  featured_image: null | boolean | string
  publish_date: string
  title: string
  type: ArtictesType
  previewLink: string | null
  status: 'draft' | 'published' | 'new'
}

export interface DashboardSectionProps {
  items: DashboardPublishedInterface[]
  heading: string
  fetched: boolean
}

interface ElementActionBase {
  block: string
  index: number | undefined
  nestedIndex?: number
  subchapterIndex?: number
}
export type MediaVariantType = 'image' | 'video'

export interface MediaObjectInterface {
  id?: number
  link: string
  url?: string
  type: MediaVariantType
  format: string
  title: string
  publishDate: string
}

export interface ElementTextActionInterface extends ElementActionBase {
  text: string
}

export interface ElementInfoboxActionInterface extends ElementActionBase {
  infobox: string
}

export interface ElementImageActionInterface extends ElementActionBase {
  image: MediaObjectInterface
}

export interface ElementVideoActionInterface extends ElementActionBase {
  video: MediaObjectInterface
}
export interface QuizAnswer {
  answer: string
  isCorrect: '0' | '1'
}
export interface QuizElement {
  question: string
  answers: QuizAnswer[]
  answersCount: number
}

export interface ElementQuizActionInterface extends ElementActionBase {
  quiz: QuizElement
}
export interface h5pElementInterface {
  value: string
  error: string
}
export interface ElementH5PActionInterface extends ElementActionBase {
  h5pElement: h5pElementInterface
}
export interface CustomFileInterface {
  path: string
  name: string
  lastModified: number
  size: number
  type: string
}
interface ElementsFileInterface {
  file: CustomFileInterface | null
  title: string
  description: string
}
export interface ElementFileActionInterface extends ElementActionBase {
  file: ElementsFileInterface
}

export interface ChapterTextFieldActionInterface {
  chapterIndex: number
  text: string
}

export interface SubchapterTextFieldActionInterface extends ChapterTextFieldActionInterface {
  subchapterIndex: number
}

export interface MoveChapterInterface {
  index: number
  moveTo: 'up' | 'down'
  parentIndex?: number
}
export interface TutorialTopElementsObject {
  text?: string
  infobox?: string
  image?: MediaObjectInterface
  video?: MediaObjectInterface
  file?: ElementsFileInterface
  quiz?: QuizElement
  h5pElement?: h5pElementInterface
  tutorialCard?: TutorialCardInterface
}
export interface AddChapterElementInterface {
  val: TutorialTopElementsObject
  chapterIndex: number
}

export interface AddSubchapterElementInterface extends AddChapterElementInterface {
  subchapterIndex: number
}

interface OnboardingInterface {
  name: string
  text: string
  link: string
  imgSrc: string
}
interface TutorialBottomInterface {
  title: string
  titleType: string
  text: string
}

export interface HardcodeTestDataInterface {
  username: string
  onboarding?: OnboardingInterface[]
  published?: TutorialCard[]
  drafts?: TutorialCard[]
}

export interface CommandDialogInterface {
  isOpen: boolean
  editor: any
  fields: string[]
  separator: '' | 'arrow' | 'plus'
}

export interface TermDialogInterface {
  isOpen: boolean
  editor: any
  term: string
  select: string[] | null
  explanation: string
}
interface MediaTextImageInterface {
  text: string
  image: MediaObjectInterface
  title: string
}

interface MediaTextVideoInterface {
  text: string
  title: string
  video: MediaObjectInterface
}

export interface TutorialCardInterface {
  value: { id: number | undefined; title: string }
  proposedList: { id: number; title: string }[] | []
}

export interface ChapterElementsObject {
  text?: string
  infobox?: string
  image?: MediaObjectInterface
  video?: MediaObjectInterface
  tutorialCard?: TutorialCardInterface
  file?: ElementsFileInterface
  quiz?: QuizElement
  h5pElement?: h5pElementInterface
  textImage?: MediaTextImageInterface
  imageText?: MediaTextImageInterface
  textVideo?: MediaTextVideoInterface
  videoText?: MediaTextVideoInterface
  column?: string
}

// interface ColumnTextInterface {
//   title: string
//   text: string
// }

export interface Element extends ChapterElementsObject {}

export type LayoutChapterType =
  | '1 column'
  | 'image left'
  | 'image right'
  | 'video left'
  | 'video right'

export type BlankSubchapterActionInterface = {
  chapterType: LayoutChapterType
  chapterIndex: number
}

interface ChapterBase {
  layout: LayoutChapterType
  title: string
  text: string
  video?: MediaObjectInterface
  image?: MediaObjectInterface
  elements: [] | ChapterElementsObject[]
}

export interface SubchapterInterface extends ChapterBase {}

export interface ChapterInterface extends ChapterBase {
  id: number | undefined
  subchapters: SubchapterInterface[] | []
}

export type PageTypeType = string | undefined

interface TutorialTopInterface {
  title: string
  titleType: 'h1'
  description: string
  elements: [] | TutorialTopElementsObject[]
}
export interface IdTitleObject {
  title: string
  id: number | undefined
}
interface MetaFieldParentInterface {
  required: boolean
  fieldTitle: string
  list?: string[] | IdTitleObject[] | []
}

interface MetaFieldListInterface extends MetaFieldParentInterface {
  list: string[] | []
  value: string
}

interface OnlyValueInterface extends MetaFieldParentInterface {
  value: string
}

interface OnlyValueImageInterface extends MetaFieldParentInterface {
  value: MediaObjectInterface
}

export interface MetaFieldIdListInterface extends MetaFieldParentInterface {
  list: IdTitleObject[] | []
  value: IdTitleObject
}
export interface PrimarySoftInterface extends MetaFieldParentInterface {
  list: { id: number; title: string; version: IdTitleObject[] }[] | []
  value: { id: number | undefined; title: string; version: IdTitleObject[] }
}

interface KeywordsInterface extends MetaFieldListInterface {
  proposedList: string[] | []
}

export interface ResponseKeyword {
  term_id: number
  name: string
  slug: string
  term_group: number
  term_taxonomy_id: number
  taxonomy: string
  description: string
  parent: number
  count: number
  filter: string
}

export type ObjectNameType =
  | 'tutorialBelongs'
  | 'tutorialResponsible'
  | 'courseBelongs'
  | 'courseResponsible'
  | 'softwareBelongs'
  | 'subjectsInvolve'

export interface EditorBelongsInterface {
  primary: PrimarySoftInterface
  version: MetaFieldIdListInterface
  primarySubject: MetaFieldIdListInterface
  secondarySubject: MetaFieldIdListInterface
  level: MetaFieldListInterface
  keywords: KeywordsInterface
  image: OnlyValueImageInterface
}

export interface TutorialResponsibleInterface {
  teachers: KeywordsInterface
  faculty: MetaFieldListInterface
}

export interface TutorialMetaObject {
  tutorialBelongs?: EditorBelongsInterface
  tutorialResponsible?: TutorialResponsibleInterface
  courseBelongs?: {
    course: OnlyValueInterface
    courseCode: OnlyValueInterface
    primaryStudy: MetaFieldIdListInterface
    secondaryStudy: MetaFieldIdListInterface
    keywords: KeywordsInterface
    image: OnlyValueImageInterface
  }
  courseResponsible?: TutorialResponsibleInterface
  softwareBelongs?: {
    softwareVersion: MetaFieldIdListInterface
    keywords: KeywordsInterface
    image: OnlyValueImageInterface
  }
  subjectsInvolve?: {
    primaryCategory: MetaFieldIdListInterface
    secondaryCategory: MetaFieldIdListInterface
  }
}

export interface EditorState {
  isEditorLoaded: boolean
  pageType: PageTypeType
  tutorialTop: TutorialTopInterface
  chapters: ChapterInterface[] | []
  tutorialBottom: TutorialBottomInterface
  meta: TutorialMetaObject
}

export interface MediaState {
  media: MediaObjectInterface[] | []
}

export interface GalleryViewProps {
  handleMultipleSelect: (item: MediaObjectInterface) => void
  mediaToDelete: MediaObjectInterface[] | undefined
  selectMode?: boolean
  currentItems: MediaObjectInterface[]
  selectedMedia: MediaObjectInterface | undefined
  handleSelectMedia: (arg0: MediaObjectInterface) => void
  column?: string
  hideVideo?: boolean
}

export interface ElementProps {
  block: string
  chapterIndex: number | undefined
  subchapterIndex: number | undefined
}

export interface AddMediaElementProps extends ElementProps {
  mediaType: MediaVariantType
  listIndex: number | undefined
  layout?: 'textImage' | 'imageText' | 'textVideo' | 'videoText'
}

export interface SubchapterImageAction {
  chapterIndex: number
  listIndex: number
  layout: 'textImage' | 'imageText' | 'textVideo' | 'videoText'
  media: MediaObjectInterface
}

export interface QuizElementProps extends ElementProps {
  listIndex: number
}

export interface DashboardDraftsInterface {
  name: string
  text: string
  link: string
  imgSrc: string
}

export interface DashboardInterface {
  isDraftsLoaded: boolean
  isPublishedLoaded: boolean
  username: string
  drafts: DashboardPublishedInterface[] | []
  published: DashboardPublishedInterface[] | []
}

export interface ResponseArticleChapterInterface {
  id: number
  title: string
  permalink: string
}

export interface ResponseArticleInterface {
  chapters?: ResponseArticleChapterInterface[]
  content?: []
  description?: string
  faculty?: []
  featured_image?: string | any
  id?: number
  keywords?: string[]
  level?: string
  primary_software?: number
  primary_subject?: number | string
  publish_date?: string
  secondary_subject?: boolean | string | number
  software_version?: number[]
  'software-version'?: string[]
  teachers?: [] | string[]
  title?: string
  useful_links?: string
  course_code?: string
  study?: string
  secondary_study?: string
  category?: string
}
export type ResponseBlockName =
  | 'tu-delft-text'
  | 'tu-delft-image'
  | 'tu-delft-video'
  | 'tu-delft-download'
  | 'tu-delft-info-box'
  | 'tu-delft-content-card'
  | 'tu-delft-image-text'
  | 'tu-delft-text-image'
  | 'tu-delft-video-text'
  | 'tu-delft-text-video'
  | 'tu-delft-quiz'
  | 'tu-delft-h5p'
export type BoolString = '0' | '1'
export interface ResponseContentBlock {
  block_name: ResponseBlockName
  block_data: {
    content?: string
    image?: number
    image_url?: string
    video?: number
    video_url?: string
    file?: number
    file_url?: string
    title?: string
    alt?: string
    description?: string
    content_card_row_0_card_title?: string
    content_card_row_0_card_link?: number
    content_card_row_0_card_link_url?: string
    content_card_row_1_card_title?: string
    content_card_row_1_card_link?: number
    content_card_row_1_card_link_url?: string
    content_card_row_2_card_title?: string
    content_card_row_2_card_link_url?: string
    content_card_row_2_card_link?: number
    content_card_row?: number
    question?: string
    answers_0_answer?: string
    answers_0_is_correct?: BoolString
    answers_1_answer?: string
    answers_1_is_correct?: BoolString
    answers_2_answer?: string
    answers_2_is_correct?: BoolString
    answers_3_answer?: string
    answers_3_is_correct?: BoolString
    answers?: 4
    source?: string
  }
}
export interface ResponseChapterInterface {
  id: number
  title: string
  content: ResponseContentBlock[]
  belongs_to: boolean | number
}
