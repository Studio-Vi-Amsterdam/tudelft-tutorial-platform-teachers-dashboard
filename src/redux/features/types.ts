export interface TutorialTopElementsObject {
    text?: string;
    infobox?: string;
    image?: string;
    video?: string;
    file?: {
        file: string;
        title: string;
        description: string;
    };
}

export interface ChapterElementsObject {
    text?: string;
    infobox?: string;
    image?: string;
    video?: string;
    tutorialCard?: string;
    file?: {
        file: string;
        title: string;
        description: string;
    };
    quiz?: string;
    h5pElement?: string;
}

export interface SubchapterInterface {
    title: string;
    titleType: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    elements: [] | Array<ChapterElementsObject>;
}

export interface ChapterInterface {
    layout:
        | '1 column'
        | 'image left'
        | 'image right'
        | 'video left'
        | 'video right';
    title: string;
    text: string;
    elements: [] | Array<ChapterElementsObject>;
    subchapters?: Array<SubchapterInterface> | [];
}

export type PageTypeType = string | undefined;

export interface EditorState {
    pageType: PageTypeType;
    tutorialTop: {
        title: string;
        titleType: 'h1';
        description: string;
        elements: [] | Array<TutorialTopElementsObject>;
    };
    chapters: Array<ChapterInterface> | [];
    tutorialBottom?:
        | {
              title: string;
              titleType: string;
              text: string;
          }
        | undefined;
    belongs: {
        primary: string; //here must be hardcoded values for select
        version: string; //here must be hardcoded values for select
        primarySubject: string; //here must be hardcoded values for select
        secondarySubject?: string; //here must be hardcoded values for select
        level: string; //here must be hardcoded values for select
        keywords: [] | Array<string>;
        image: string; //here must be hardcoded values for select
    };
    responsible: {
        teacher: string;
        faculty: string; //here must be hardcoded values for select
    };
}
