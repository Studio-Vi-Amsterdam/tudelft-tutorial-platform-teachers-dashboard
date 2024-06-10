import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
    AddChapterElementInterface,
    AddSubchapterElementInterface,
    BlankSubchapterActionInterface,
    ChapterTextFieldActionInterface,
    EditorBelongsInterface,
    EditorState,
    ElementImageActionInterface,
    ElementInfoboxActionInterface,
    ElementQuizActionInterface,
    ElementTextActionInterface,
    ElementVideoActionInterface,
    LayoutChapterType,
    MoveChapterInterface,
    QuizElement,
    SubchapterTextFieldActionInterface,
    TutorialMetaObject,
    TutorialResponsibleInterface,
    TutorialTopElementsObject,
} from 'src/types/types';

const initialState: EditorState = {
    pageType: undefined,
    tutorialTop: {
        title: '',
        titleType: 'h1',
        description: '',
        elements: [],
    },
    chapters: [],
    tutorialBottom: {
        title: '',
        titleType: 'h2',
        text: '',
    },
    meta: {
        belongs: {
            primary: {
                required: true,
                list: ['Windows 10', 'Office 365', 'VS Code', 'Figma'],
                value: '',
                fieldTitle: 'Primary software used',
            },
            version: {
                required: true,
                value: '',
                fieldTitle: 'Software version',
            },
            primarySubject: {
                required: true,
                list: [
                    'Mathematics',
                    'Web-programing',
                    'Web-design',
                    'Physics',
                ],
                value: '',
                fieldTitle: 'Primary Subject',
            },
            secondarySubject: {
                required: false,
                list: [
                    'Mathematics',
                    'Web-programing',
                    'Web-design',
                    'Physics',
                ],
                value: '',
                fieldTitle: 'Secondary Subject',
            },
            level: {
                required: true,
                list: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                value: '',
                fieldTitle: 'Level',
            },
            keywords: {
                required: true,
                list: [],
                value: '',
                fieldTitle: 'Keywords',
            },
            image: {
                required: false,
                value: '',
                fieldTitle: 'Featured image',
            },
        },
        responsible: {
            teacher: {
                required: true,
                value: '',
                fieldTitle: 'Teacher',
            },
            faculty: {
                required: true,
                list: [
                    'Computer Engeneering',
                    'Computer Science',
                    'Automation',
                ],
                value: '',
                fieldTitle: 'Faculty',
            },
        },
    },
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setTutorialTitle: (state, action: PayloadAction<string>) => {
            state.tutorialTop.title = action.payload;
        },
        setTutorialDescription: (state, action: PayloadAction<string>) => {
            state.tutorialTop.description = action.payload;
        },
        setPageType: (state, action: PayloadAction<string | undefined>) => {
            state.pageType = action.payload;
        },
        addTutorialElements: (
            state,
            action: PayloadAction<TutorialTopElementsObject>
        ) => {
            state.tutorialTop.elements = [
                ...state.tutorialTop.elements,
                action.payload,
            ];
        },
        deleteElement: (
            state,
            action: PayloadAction<{
                block: string;
                elementIndex: number;
                chapterIndex: number | undefined;
                subchapterIndex: number | undefined;
            }>
        ) => {
            const { block, elementIndex, chapterIndex, subchapterIndex } =
                action.payload;
            if (block === 'tutorialElements') {
                state.tutorialTop.elements = state.tutorialTop.elements.filter(
                    (_, i) => i !== elementIndex
                );
            } else if (
                block === 'chapterElements' &&
                chapterIndex !== undefined
            ) {
                state.chapters[chapterIndex].elements = state.chapters[
                    chapterIndex
                ].elements.filter((_, i) => i !== elementIndex);
            } else if (
                block === 'subchapterElements' &&
                chapterIndex !== undefined &&
                subchapterIndex !== undefined
            ) {
                state.chapters[chapterIndex].subchapters[
                    subchapterIndex
                ].elements = state.chapters[chapterIndex].subchapters[
                    subchapterIndex
                ].elements.filter((_, i) => i !== elementIndex);
            }
        },
        setElementText: (
            state,
            action: PayloadAction<ElementTextActionInterface>
        ) => {
            if (
                action.payload.block === 'tutorialElements' &&
                action.payload.index !== undefined
            ) {
                state.tutorialTop.elements[action.payload.index].text =
                    action.payload.text;
            } else if (
                action.payload.block === 'chapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].elements[
                    action.payload.index
                ].text = action.payload.text;
            } else if (
                action.payload.block === 'subchapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined &&
                action.payload.subchapterIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].subchapters[
                    action.payload.subchapterIndex
                ].elements[action.payload.index].text = action.payload.text;
            }
        },
        setElementInfobox: (
            state,
            action: PayloadAction<ElementInfoboxActionInterface>
        ) => {
            if (
                action.payload.block === 'tutorialElements' &&
                action.payload.index !== undefined
            ) {
                state.tutorialTop.elements[action.payload.index].infobox =
                    action.payload.infobox;
            } else if (
                action.payload.block === 'chapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].elements[
                    action.payload.index
                ].infobox = action.payload.infobox;
            } else if (
                action.payload.block === 'subchapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined &&
                action.payload.subchapterIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].subchapters[
                    action.payload.subchapterIndex
                ].elements[action.payload.index].infobox =
                    action.payload.infobox;
            }
        },
        setElementImage: (
            state,
            action: PayloadAction<ElementImageActionInterface>
        ) => {
            if (
                action.payload.block === 'tutorialElements' &&
                action.payload.index !== undefined
            ) {
                state.tutorialTop.elements[action.payload.index].image =
                    action.payload.image;
            } else if (
                action.payload.block === 'chapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].elements[
                    action.payload.index
                ].image = action.payload.image;
            } else if (
                action.payload.block === 'subchapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined &&
                action.payload.subchapterIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].subchapters[
                    action.payload.subchapterIndex
                ].elements[action.payload.index].image = action.payload.image;
            } else if (
                action.payload.block === 'chapterMedia' &&
                action.payload.nestedIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].image =
                    action.payload.image;
            } else if (
                action.payload.block === 'subchapterMedia' &&
                action.payload.nestedIndex !== undefined &&
                action.payload.subchapterIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].subchapters[
                    action.payload.subchapterIndex
                ].image = action.payload.image;
            }
        },
        setElementVideo: (
            state,
            action: PayloadAction<ElementVideoActionInterface>
        ) => {
            if (
                action.payload.block === 'tutorialElements' &&
                action.payload.index !== undefined
            ) {
                state.tutorialTop.elements[action.payload.index].video =
                    action.payload.video;
            } else if (
                action.payload.block === 'chapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].elements[
                    action.payload.index
                ].video = action.payload.video;
            } else if (
                action.payload.block === 'subchapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined &&
                action.payload.subchapterIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].subchapters[
                    action.payload.subchapterIndex
                ].elements[action.payload.index].video = action.payload.video;
            } else if (
                action.payload.block === 'chapterMedia' &&
                action.payload.nestedIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].video =
                    action.payload.video;
            } else if (
                action.payload.block === 'subchapterMedia' &&
                action.payload.nestedIndex !== undefined &&
                action.payload.subchapterIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].subchapters[
                    action.payload.subchapterIndex
                ].video = action.payload.video;
            }
        },
        setElementQuiz: (
            state,
            action: PayloadAction<ElementQuizActionInterface>
        ) => {
            if (
                action.payload.block === 'tutorialElements' &&
                action.payload.index !== undefined
            ) {
                state.tutorialTop.elements[action.payload.index].quiz =
                    action.payload.quiz;
            } else if (
                action.payload.block === 'chapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].elements[
                    action.payload.index
                ].quiz = action.payload.quiz;
            } else if (
                action.payload.block === 'subchapterElements' &&
                action.payload.index !== undefined &&
                action.payload.nestedIndex !== undefined &&
                action.payload.subchapterIndex !== undefined
            ) {
                state.chapters[action.payload.nestedIndex].subchapters[
                    action.payload.subchapterIndex
                ].elements[action.payload.index].quiz = action.payload.quiz;
            }
        },
        addBlankChapter: (state, action: PayloadAction<LayoutChapterType>) => {
            if (action.payload === '1 column') {
                state.chapters = [
                    ...state.chapters,
                    {
                        layout: action.payload,
                        title: '',
                        text: '',
                        elements: [],
                        subchapters: [],
                    },
                ];
            } else {
                if (action.payload.split(' ')[0] === 'video') {
                    state.chapters = [
                        ...state.chapters,
                        {
                            layout: action.payload,
                            title: '',
                            text: '',
                            video: {
                                format: '',
                                link: '',
                                publishDate: '',
                                title: '',
                                type: 'video',
                            },
                            elements: [],
                            subchapters: [],
                        },
                    ];
                } else if (action.payload.split(' ')[0] === 'image') {
                    state.chapters = [
                        ...state.chapters,
                        {
                            layout: action.payload,
                            title: '',
                            text: '',
                            image: {
                                format: '',
                                link: '',
                                publishDate: '',
                                title: '',
                                type: 'image',
                            },
                            elements: [],
                            subchapters: [],
                        },
                    ];
                }
            }
        },
        addBlankSubchapter: (
            state,
            action: PayloadAction<BlankSubchapterActionInterface>
        ) => {
            if (action.payload.chapterType === '1 column') {
                state.chapters[action.payload.chapterIndex].subchapters = [
                    ...(state.chapters[action.payload.chapterIndex]
                        .subchapters || []),
                    {
                        layout: action.payload.chapterType,
                        title: '',
                        text: '',
                        elements: [],
                    },
                ];
            } else {
                if (action.payload.chapterType.split(' ')[0] === 'video') {
                    state.chapters[action.payload.chapterIndex].subchapters = [
                        ...(state.chapters[action.payload.chapterIndex]
                            .subchapters || []),
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
                            },
                            elements: [],
                        },
                    ];
                } else if (
                    action.payload.chapterType.split(' ')[0] === 'image'
                ) {
                    state.chapters[action.payload.chapterIndex].subchapters = [
                        ...(state.chapters[action.payload.chapterIndex]
                            .subchapters || []),
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
                            },
                            elements: [],
                        },
                    ];
                }
            }
        },
        setChapterText: (
            state,
            action: PayloadAction<ChapterTextFieldActionInterface>
        ) => {
            state.chapters[action.payload.chapterIndex].text =
                action.payload.text;
        },
        setChapterTitle: (
            state,
            action: PayloadAction<ChapterTextFieldActionInterface>
        ) => {
            state.chapters[action.payload.chapterIndex].title =
                action.payload.text;
        },
        setSubchapterTitle: (
            state,
            action: PayloadAction<SubchapterTextFieldActionInterface>
        ) => {
            state.chapters[action.payload.chapterIndex].subchapters[
                action.payload.subchapterIndex
            ].title = action.payload.text;
        },
        setSubchapterText: (
            state,
            action: PayloadAction<SubchapterTextFieldActionInterface>
        ) => {
            state.chapters[action.payload.chapterIndex].subchapters[
                action.payload.subchapterIndex
            ].text = action.payload.text;
        },
        addChapterElement: (
            state,
            action: PayloadAction<AddChapterElementInterface>
        ) => {
            state.chapters[action.payload.chapterIndex].elements = [
                ...state.chapters[action.payload.chapterIndex].elements,
                action.payload.val,
            ];
        },
        addSubchapterElement: (
            state,
            action: PayloadAction<AddSubchapterElementInterface>
        ) => {
            state.chapters[action.payload.chapterIndex].subchapters[
                action.payload.subchapterIndex
            ].elements = [
                ...state.chapters[action.payload.chapterIndex].subchapters[
                    action.payload.subchapterIndex
                ].elements,
                action.payload.val,
            ];
        },
        setTutorialBottomTitle: (state, action: PayloadAction<string>) => {
            state.tutorialBottom.title = action.payload;
        },
        setTutorialBottomText: (state, action: PayloadAction<string>) => {
            state.tutorialBottom.text = action.payload;
        },
        moveChapter: (state, action: PayloadAction<MoveChapterInterface>) => {
            const newPos = action.payload.moveTo;
            const index = action.payload.index;
            const parentIndex = action.payload.parentIndex;
            const newIndex = newPos === 'up' ? index - 1 : index + 1;
            if (!parentIndex) {
                if (newPos === 'up' && index > 0) {
                    [state.chapters[newIndex], state.chapters[index]] = [
                        state.chapters[index],
                        state.chapters[newIndex],
                    ];
                } else if (
                    newPos === 'down' &&
                    index < state.chapters.length - 1
                ) {
                    [state.chapters[index], state.chapters[newIndex]] = [
                        state.chapters[newIndex],
                        state.chapters[index],
                    ];
                }
            } else {
                if (newPos === 'up' && index > 0) {
                    [
                        state.chapters[parentIndex].subchapters[newIndex],
                        state.chapters[parentIndex].subchapters[index],
                    ] = [
                        state.chapters[parentIndex].subchapters[index],
                        state.chapters[parentIndex].subchapters[newIndex],
                    ];
                } else if (
                    newPos === 'down' &&
                    index < state.chapters[parentIndex].subchapters.length - 1
                ) {
                    [
                        state.chapters[parentIndex].subchapters[index],
                        state.chapters[parentIndex].subchapters[newIndex],
                    ] = [
                        state.chapters[parentIndex].subchapters[newIndex],
                        state.chapters[parentIndex].subchapters[index],
                    ];
                }
            }
        },
        duplicateChapter: (
            state,
            action: PayloadAction<{ index: number; parentIndex?: number }>
        ) => {
            const index = action.payload.index;
            const parentIndex = action.payload.parentIndex;
            if (!parentIndex) {
                if (index >= 0 && index < state.chapters.length) {
                    const newChapter = { ...state.chapters[index] };
                    state.chapters.splice(index + 1, 0, newChapter);
                }
            } else {
                if (
                    index >= 0 &&
                    index < state.chapters[parentIndex].subchapters.length
                ) {
                    const newChapter = {
                        ...state.chapters[parentIndex].subchapters[index],
                    };
                    state.chapters[parentIndex].subchapters.splice(
                        index + 1,
                        0,
                        newChapter
                    );
                }
            }
        },
        deleteChapter: (
            state,
            action: PayloadAction<{ index: number; parentIndex?: number }>
        ) => {
            const index = action.payload.index;
            const parentIndex = action.payload.parentIndex;
            if (!parentIndex) {
                if (index >= 0 && index < state.chapters.length) {
                    state.chapters.splice(index, 1);
                }
            } else {
                if (
                    index >= 0 &&
                    index < state.chapters[parentIndex].subchapters.length
                ) {
                    state.chapters[parentIndex].subchapters.splice(index, 1);
                }
            }
        },
        changeMetaField: (
            state,
            action: PayloadAction<{
                value: string;
                objectName: keyof TutorialMetaObject;
                belongsKeyName?: keyof EditorBelongsInterface;
                responsibleKeyName?: keyof TutorialResponsibleInterface;
            }>
        ) => {
            if (
                action.payload.objectName === 'belongs' &&
                action.payload.belongsKeyName
            ) {
                state.meta.belongs[action.payload.belongsKeyName].value =
                    action.payload.value;
            } else if (
                action.payload.objectName === 'responsible' &&
                action.payload.responsibleKeyName
            ) {
                state.meta.responsible[
                    action.payload.responsibleKeyName
                ].value = action.payload.value;
            }
        },
        addKeywordsToList: (state, action: PayloadAction<string>) => {
            state.meta.belongs.keywords.list = [
                ...state.meta.belongs.keywords.list,
                action.payload,
            ];
        },
        deleteKeyword: (state, action: PayloadAction<string>) => {
            state.meta.belongs.keywords.list =
                state.meta.belongs.keywords.list.filter(
                    (item) => item !== action.payload
                );
        },
    },
});

export const {
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
    deleteKeyword,
    setElementImage,
    setElementVideo,
    deleteElement,
} = editorSlice.actions;

export default editorSlice.reducer;
