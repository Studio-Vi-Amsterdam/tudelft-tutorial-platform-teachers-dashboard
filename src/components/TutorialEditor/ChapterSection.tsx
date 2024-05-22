import React, { useState } from 'react';
import EditorLabel from '../ui/EditorLabel';
import { AddElementsType, ChapterInterface } from 'src/types/types';
import { useAppDispatch } from 'src/redux/hooks';
import {
    addChapterElement,
    addSubchapterElement,
    setChapterText,
    setChapterTitle,
    setSubchapterText,
    setSubchapterTitle,
} from 'src/redux/features/editorSlice';
import AddChapterSection from './AddChapterSection';
import ChapterContent from './ChapterContent';
import SubchapterContent from './SubchapterContent';
import ChapterMenu from './ChapterMenu';

interface ChapterSectionProps {
    chapter: ChapterInterface;
    index: number;
}

const ChapterSection = (props: ChapterSectionProps) => {
    const { chapter, index } = props;
    const [addElementsActive, setAddElementsActive] = useState<boolean>(false);
    const [addSubchapterElementsActive, setAddSubchapterElementsActive] =
        useState<boolean>(false);

    const dispatch = useAppDispatch();

    const handleChapterTextInputChange = (val: string, index: number): void => {
        dispatch(setChapterText({ chapterIndex: index, text: val }));
    };

    const handleSubchapterTextInputChange = (
        val: string,
        index: number,
        subchapterIndex: number
    ): void => {
        index !== undefined &&
            subchapterIndex !== undefined &&
            dispatch(
                setSubchapterText({
                    chapterIndex: index,
                    subchapterIndex: subchapterIndex,
                    text: val,
                })
            );
    };

    const handleChangeChapterTitle = (val: string, index?: number) => {
        index !== undefined &&
            dispatch(setChapterTitle({ chapterIndex: index, text: val }));
    };

    const handleChangeSubchapterTitle = (
        val: string,
        index?: number,
        subchapterIndex?: number
    ) => {
        index !== undefined &&
            subchapterIndex !== undefined &&
            dispatch(
                setSubchapterTitle({
                    chapterIndex: index,
                    text: val,
                    subchapterIndex: subchapterIndex,
                })
            );
    };

    const handleAddElement = (val: string, index?: number) => {
        const payload: any = {};

        payload[val] = '';

        index !== undefined &&
            dispatch(addChapterElement({ val: payload, chapterIndex: index }));
        setAddElementsActive(false);
    };

    const handleAddSubchapterElement = (
        val: string,
        index?: number,
        subchapterIndex?: number
    ) => {
        const payload: any = {};
        payload[val] = '';
        index !== undefined &&
            subchapterIndex !== undefined &&
            dispatch(
                addSubchapterElement({
                    val: payload,
                    chapterIndex: index,
                    subchapterIndex: subchapterIndex,
                })
            );
        setAddSubchapterElementsActive(false);
    };

    const elements: AddElementsType[] = [
        'text',
        'infobox',
        'image',
        'video',
        'file',
    ];

    return (
        <section className="relative flex w-full flex-col gap-y-6 py-20 before:absolute before:left-0 before:top-0 before:h-[2px] before:w-full before:bg-tertiary-grey-silver">
            <EditorLabel>
                This section is a chapter of your tutorial.
            </EditorLabel>
            <ChapterMenu index={index} />
            <ChapterContent
                addElementsActive={addElementsActive}
                chapter={chapter}
                elements={elements}
                handleAddElement={handleAddElement}
                handleChangeChapterTitle={handleChangeChapterTitle}
                handleChapterTextInputChange={handleChapterTextInputChange}
                setAddElementsActive={setAddElementsActive}
                chapterIndex={index}
            />
            <SubchapterContent
                addSubchapterElementsActive={addSubchapterElementsActive}
                setAddSubchapterElementsActive={setAddSubchapterElementsActive}
                chapterIndex={index}
                chapterTitle={chapter.title}
                elements={elements}
                handleAddSubchapterElement={handleAddSubchapterElement}
                handleChangeSubchapterTitle={handleChangeSubchapterTitle}
                handleSubchapterTextInputChange={
                    handleSubchapterTextInputChange
                }
                subchapters={chapter.subchapters}
            />
            <AddChapterSection isSubchapter={true} chapterIndex={index} />
        </section>
    );
};

export default ChapterSection;
