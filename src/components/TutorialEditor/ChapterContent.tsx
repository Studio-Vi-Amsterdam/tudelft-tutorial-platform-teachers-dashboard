import React from 'react';
import TextInput from '../ui/TextInput';
import { AddElementsType, ChapterInterface } from 'src/types/types';
import BundledEditor from './BundledEditor';
import { Button } from '../ui/Button';
import ElementsBlock from './ElementsBlock';
import AddElementBlock from './AddElementBlock';
import AddMediaElement from './AddMediaElement';
import ExtendedBundledEditor from './ExtendedBundledEditor';

interface ChapterContentProps {
    chapter: ChapterInterface;
    chapterIndex: number;
    handleChangeChapterTitle: (val: string, index?: number) => void;
    handleChapterTextInputChange: (val: string, index: number) => void;
    addElementsActive: boolean;
    setAddElementsActive: React.Dispatch<React.SetStateAction<boolean>>;
    handleAddElement: (val: string, index?: number) => void;
    elements: AddElementsType[];
}

const ChapterContent = (props: ChapterContentProps) => {
    const {
        chapter,
        chapterIndex,
        handleChangeChapterTitle,
        handleChapterTextInputChange,
        addElementsActive,
        setAddElementsActive,
        handleAddElement,
        elements,
    } = props;
    return (
        <>
            <TextInput
                placeholder="Chapter title"
                headingType="h2"
                value={chapter.title}
                index={chapterIndex}
                handleChange={handleChangeChapterTitle}
            />
            <div
                className={`${
                    chapter.layout === '1 column'
                        ? 'flex-col'
                        : chapter.layout.split(' ')[1] === 'left'
                        ? 'flex-row-reverse'
                        : 'flex-row'
                } flex gap-x-6`}
            >
                <div
                    className={`${
                        chapter.layout === '1 column' ? ' w-full' : ' w-1/2 '
                    }`}
                >
                    <ExtendedBundledEditor
                        handleInputChange={handleChapterTextInputChange}
                        chapterIndex={chapterIndex}
                        value={chapter.text}
                        subchapter={false}
                        subchapterIndex={undefined}
                    />
                </div>
                {chapter.layout !== '1 column' && (
                    <div className="w-1/2">
                        {chapter.layout.split(' ')[0] === 'video' && (
                            <AddMediaElement
                                block="chapterMedia"
                                chapterIndex={chapterIndex}
                                mediaType={'video'}
                                listIndex={undefined}
                                subchapterIndex={undefined}
                            />
                        )}
                        {chapter.layout.split(' ')[0] === 'image' && (
                            <AddMediaElement
                                block="chapterMedia"
                                chapterIndex={chapterIndex}
                                mediaType={'image'}
                                listIndex={undefined}
                                subchapterIndex={undefined}
                            />
                        )}
                    </div>
                )}
            </div>

            <ElementsBlock
                elements={chapter.elements}
                block="chapterElements"
                chapterIndex={chapterIndex}
            />

            <AddElementBlock
                addElementsActive={addElementsActive}
                setAddElementsActive={setAddElementsActive}
                handleAddElement={handleAddElement}
                elements={elements}
                index={chapterIndex}
            />
        </>
    );
};

export default ChapterContent;
