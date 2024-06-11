export interface TutorialCard {
    type: 'course' | 'subject' | 'software' | 'tutorial';
    name: string;
    published: Date;
    lastEdit: Date;
}

export type AddElementsType =
    | 'text'
    | 'infobox'
    | 'image'
    | 'video'
    | 'file'
    | 'quiz'
    | 'h5p element'
    | 'tutorial cards';

export interface DashboardSectionProps {
    items: Array<TutorialCard>;
    heading: string;
}

interface ElementActionBase {
    block: string;
    index: number | undefined;
    nestedIndex?: number;
    subchapterIndex?: number;
}

export interface MediaObjectInterface {
    link: string;
    type: MediaVariantType;
    format: string;
    title: string;
    publishDate: string;
}

export interface ElementTextActionInterface extends ElementActionBase {
    text: string;
}

export interface ElementInfoboxActionInterface extends ElementActionBase {
    infobox: string;
}

export interface ElementImageActionInterface extends ElementActionBase {
    image: MediaObjectInterface;
}

export interface ElementVideoActionInterface extends ElementActionBase {
    video: MediaObjectInterface;
}

export interface ElementQuizActionInterface extends ElementActionBase {
    quiz: QuizElement;
}

export interface ElementH5PActionInterface extends ElementActionBase {
    h5pElement: h5pElementInterface;
}

export interface ElementFileActionInterface extends ElementActionBase {
    file: ElementsFileInterface;
}

export interface ChapterTextFieldActionInterface {
    chapterIndex: number;
    text: string;
}

export interface SubchapterTextFieldActionInterface
    extends ChapterTextFieldActionInterface {
    subchapterIndex: number;
}

export interface MoveChapterInterface {
    index: number;
    moveTo: 'up' | 'down';
    parentIndex?: number;
}

export interface AddChapterElementInterface {
    val: TutorialTopElementsObject;
    chapterIndex: number;
}

export interface AddSubchapterElementInterface
    extends AddChapterElementInterface {
    subchapterIndex: number;
}

interface OnboardingInterface {
    name: string;
    text: string;
    link: string;
    imgSrc: string;
}

export interface CustomFileInterface {
    path: string;
    name: string;
    lastModified: number;
    size: number;
    type: string;
}

interface ElementsFileInterface {
    file: CustomFileInterface | null;
    title: string;
    description: string;
}

interface TutorialBottomInterface {
    title: string;
    titleType: string;
    text: string;
}

export interface HardcodeTestDataInterface {
    username: string;
    onboarding?: OnboardingInterface[];
    published?: TutorialCard[];
    drafts?: TutorialCard[];
}

export interface CommandDialogInterface {
    isOpen: boolean;
    editor: any;
    fields: string[];
    separator: '' | 'arrow' | 'plus';
}

export interface TermDialogInterface {
    isOpen: boolean;
    editor: any;
    term: string;
    select: string[] | null;
    explanation: string;
}

export interface TutorialTopElementsObject {
    text?: string;
    infobox?: string;
    image?: MediaObjectInterface;
    video?: MediaObjectInterface;
    file?: ElementsFileInterface;
    quiz?: QuizElement;
    h5pElement?: h5pElementInterface;
}

export interface QuizAnswer {
    answer: string;
    isCorrect: '0' | '1';
}

export interface QuizElement {
    question: string;
    answers: QuizAnswer[];
    answersCount: number;
}

export interface h5pElementInterface {
    value: string;
    error: string;
}

export interface ChapterElementsObject {
    text?: string;
    infobox?: string;
    image?: MediaObjectInterface;
    video?: MediaObjectInterface;
    tutorialCard?: string;
    file?: ElementsFileInterface;
    quiz?: QuizElement;
    h5pElement?: h5pElementInterface;
}

export interface Element {
    text?: string;
    infobox?: string;
    image?: MediaObjectInterface;
    video?: MediaObjectInterface;
    quiz?: QuizElement;
    h5pElement?: h5pElementInterface;
    file?: ElementsFileInterface;
}

export type LayoutChapterType =
    | '1 column'
    | 'image left'
    | 'image right'
    | 'video left'
    | 'video right';

export type BlankSubchapterActionInterface = {
    chapterType: LayoutChapterType;
    chapterIndex: number;
};

interface ChapterBase {
    layout: LayoutChapterType;
    title: string;
    text: string;
    video?: MediaObjectInterface;
    image?: MediaObjectInterface;
    elements: [] | ChapterElementsObject[];
}

export interface SubchapterInterface extends ChapterBase {}

export interface ChapterInterface extends ChapterBase {
    subchapters: SubchapterInterface[] | [];
}

export type PageTypeType = string | undefined;

interface TutorialTopInterface {
    title: string;
    titleType: 'h1';
    description: string;
    elements: [] | TutorialTopElementsObject[];
}

interface MetaFieldParentInterface {
    required: boolean;
    value: string;
    fieldTitle: string;
    list?: string[] | [];
}

interface MetaFieldListInterface extends MetaFieldParentInterface {
    list: string[] | [];
}

export type ObjectNameType = 'belongs' | 'responsible';
export type MediaVariantType = 'image' | 'video';

export interface EditorBelongsInterface {
    primary: MetaFieldListInterface;
    version: MetaFieldParentInterface;
    primarySubject: MetaFieldListInterface;
    secondarySubject: MetaFieldListInterface;
    level: MetaFieldListInterface;
    keywords: MetaFieldListInterface;
    image: MetaFieldParentInterface;
}

export interface TutorialResponsibleInterface {
    teacher: MetaFieldParentInterface;
    faculty: MetaFieldListInterface;
}

export interface TutorialMetaObject {
    belongs: EditorBelongsInterface;
    responsible: TutorialResponsibleInterface;
}

export interface EditorState {
    pageType: PageTypeType;
    tutorialTop: TutorialTopInterface;
    chapters: ChapterInterface[] | [];
    tutorialBottom: TutorialBottomInterface;
    meta: TutorialMetaObject;
}

export interface MediaState {
    media: MediaObjectInterface[] | [];
}

export interface GalleryViewProps {
    currentItems: MediaObjectInterface[];
    selectedMedia: MediaObjectInterface | undefined;
    handleSelectMedia: (arg0: MediaObjectInterface) => void;
}

export interface ElementProps {
    block: string;
    chapterIndex: number | undefined;
    subchapterIndex: number | undefined;
}

export interface AddMediaElementProps extends ElementProps {
    mediaType: MediaVariantType;
    listIndex: number | undefined;
}

export interface QuizElementProps extends ElementProps {
    listIndex: number;
}
