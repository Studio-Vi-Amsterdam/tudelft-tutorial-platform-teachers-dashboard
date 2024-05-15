import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { EditorState, TutorialTopElementsObject } from './types';

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
        titleType: '',
        text: '',
    },
    belongs: {
        primary: '',
        version: '',
        primarySubject: '',
        secondarySubject: '',
        level: '',
        keywords: [],
        image: '',
    },
    responsible: {
        teacher: '',
        faculty: '',
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
        setElementText: (
            state,
            action: PayloadAction<{
                block: string;
                index: number;
                text: string;
            }>
        ) => {
            if (action.payload.block === 'tutorialElements') {
                state.tutorialTop.elements[action.payload.index].text =
                    action.payload.text;
            }
        },
        setElementInfobox: (
            state,
            action: PayloadAction<{
                block: string;
                index: number;
                infobox: string;
            }>
        ) => {
            if (action.payload.block === 'tutorialElements') {
                state.tutorialTop.elements[action.payload.index].infobox =
                    action.payload.infobox;
            }
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
} = editorSlice.actions;

export default editorSlice.reducer;
