export interface TutorialCard {
    type: 'course' | 'subject' | 'software' | 'tutorial';
    name: string;
    published: Date;
    lastEdit: Date;
}

export type AddElementsType = 'text' | 'infobox' | 'image' | 'video' | 'file';

export interface DashboardSectionProps {
    items: Array<TutorialCard>;
    heading: string;
}

interface ElementActionBase {
    block: string;
    index: number;
    nestedIndex?: number;
    subchapterIndex?: number;
}

export interface ElementTextActionInterface extends ElementActionBase {
    text: string;
}

export interface ElementInfoboxActionInterface extends ElementActionBase {
    infobox: string;
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

interface ElementsFileInterface {
    file: string;
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
    image?: string;
    video?: string;
    file?: ElementsFileInterface;
}

export interface ChapterElementsObject {
    text?: string;
    infobox?: string;
    image?: string;
    video?: string;
    tutorialCard?: string;
    file?: ElementsFileInterface;
    quiz?: string;
    h5pElement?: string;
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
    video?: string;
    image?: string;
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
