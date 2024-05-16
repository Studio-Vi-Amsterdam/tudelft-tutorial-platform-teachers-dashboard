export interface TutorialCard {
    type: 'course' | 'subject' | 'software' | 'tutorial';
    name: string;
    published: Date;
    lastEdit: Date;
}

export interface DashboardSectionProps {
    items: Array<TutorialCard>;
    heading: string;
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

export interface SubchapterInterface {
    title: string;
    titleType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    elements: [] | ChapterElementsObject[];
}

type LayoutChapterType =
    | '1 column'
    | 'image left'
    | 'image right'
    | 'video left'
    | 'video right';

export interface ChapterInterface {
    layout: LayoutChapterType;
    title: string;
    text: string;
    elements: [] | ChapterElementsObject[];
    subchapters?: SubchapterInterface[] | [];
}

export type PageTypeType = string | undefined;

interface TutorialTopInterface {
    title: string;
    titleType: 'h1';
    description: string;
    elements: [] | TutorialTopElementsObject[];
}

interface EditorBelongsInterface {
    primary: string; //here must be hardcoded values for select
    version: string; //here must be hardcoded values for select
    primarySubject: string; //here must be hardcoded values for select
    secondarySubject?: string; //here must be hardcoded values for select
    level: string; //here must be hardcoded values for select
    keywords: [] | string[];
    image: string; //here must be hardcoded values for select
}

interface TutorialResponsibleInterface {
    teacher: string;
    faculty: string; //here must be hardcoded values for select
}

export interface EditorState {
    pageType: PageTypeType;
    tutorialTop: TutorialTopInterface;
    chapters: ChapterInterface[] | [];
    tutorialBottom?: TutorialBottomInterface | undefined;
    belongs: EditorBelongsInterface;
    responsible: TutorialResponsibleInterface;
}
