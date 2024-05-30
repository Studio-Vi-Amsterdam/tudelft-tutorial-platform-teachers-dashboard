import React from 'react';
import EditorLabel from '../ui/EditorLabel';
import { AddElementsType, SubchapterInterface } from 'src/types/types';
import TextInput from '../ui/TextInput';
import BundledEditor from './BundledEditor';
import { Button } from '../ui/Button';
import ElementsBlock from './ElementsBlock';
import AddElementBlock from './AddElementBlock';
import ChapterMenu from './ChapterMenu';
import {
    deleteChapter,
    duplicateChapter,
    moveChapter,
} from 'src/redux/features/editorSlice';
import AddMediaElement from './AddMediaElement';

interface SubchapterContentProps {
    subchapters: SubchapterInterface[];
    chapterTitle: string;
    chapterIndex: number;
    handleChangeSubchapterTitle: (
        val: string,
        index?: number,
        subchapterIndex?: number
    ) => void;
    handleSubchapterTextInputChange: (
        val: string,
        index: number,
        subchapterIndex: number
    ) => void;
    elements: AddElementsType[];
    addSubchapterElementsActive: boolean;
    setAddSubchapterElementsActive: React.Dispatch<
        React.SetStateAction<boolean>
    >;
    handleAddSubchapterElement: (
        val: string,
        index?: number,
        subchapterIndex?: number
    ) => void;
}

const SubchapterContent = (props: SubchapterContentProps) => {
    const {
        subchapters,
        chapterTitle,
        chapterIndex,
        handleChangeSubchapterTitle,
        handleSubchapterTextInputChange,
        elements,
        addSubchapterElementsActive,
        setAddSubchapterElementsActive,
        handleAddSubchapterElement,
    } = props;
    return (
        <section>
            {subchapters?.map((subchapter, subchapterIndex) => (
                <section
                    key={subchapterIndex}
                    className="relative flex w-full flex-col gap-y-6 "
                >
                    <EditorLabel>
                        This section is a subchapter to chapter{' '}
                        {`${chapterTitle && `"${chapterTitle}"`}`}.
                    </EditorLabel>
                    <ChapterMenu
                        index={subchapterIndex}
                        moveChapter={moveChapter}
                        deleteChapter={deleteChapter}
                        duplicateChapter={duplicateChapter}
                        parentIndex={chapterIndex}
                    />
                    <TextInput
                        placeholder="Subchapter title"
                        headingType="h3"
                        value={subchapter.title}
                        index={chapterIndex}
                        subchapterIndex={subchapterIndex}
                        handleChange={handleChangeSubchapterTitle}
                    />
                    <div
                        className={`${
                            subchapter.layout === '1 column'
                                ? 'flex-col'
                                : subchapter.layout.split(' ')[1] === 'left'
                                ? 'flex-row-reverse'
                                : 'flex-row'
                        } flex gap-x-6`}
                    >
                        <div
                            className={`${
                                subchapter.layout === '1 column'
                                    ? ' w-full'
                                    : ' w-1/2 '
                            }`}
                        >
                            <BundledEditor
                                value={subchapter.text}
                                index={chapterIndex}
                                subchapterIndex={subchapterIndex}
                                handleChange={handleSubchapterTextInputChange}
                                subchapter={true}
                                init={{
                                    menubar: false,
                                    plugins: [
                                        'table',
                                        'lists',
                                        'link',
                                        'code',
                                        'autoresize',
                                        'command',
                                    ],

                                    toolbar:
                                        'bullist numlist link code table command',
                                }}
                            />
                        </div>
                        {subchapter.layout !== '1 column' && (
                            <div className="w-1/2">
                                <div className="flex w-full flex-col gap-y-2">
                                    {subchapter.layout.split(' ')[0] ===
                                        'video' && (
                                        <AddMediaElement
                                            block="subchapterMedia"
                                            chapterIndex={chapterIndex}
                                            mediaType={'video'}
                                            listIndex={undefined}
                                            subchapterIndex={subchapterIndex}
                                        />
                                    )}
                                    {subchapter.layout.split(' ')[0] ===
                                        'image' && (
                                        <AddMediaElement
                                            block="subchapterMedia"
                                            chapterIndex={chapterIndex}
                                            mediaType={'image'}
                                            listIndex={undefined}
                                            subchapterIndex={subchapterIndex}
                                        />
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                    {subchapter.layout === '1 column' && (
                        <ElementsBlock
                            elements={subchapter.elements}
                            block="subchapterElements"
                            chapterIndex={chapterIndex}
                            subchapterIndex={subchapterIndex}
                        />
                    )}
                    {subchapter.layout === '1 column' && (
                        <AddElementBlock
                            addElementsActive={addSubchapterElementsActive}
                            setAddElementsActive={
                                setAddSubchapterElementsActive
                            }
                            handleAddElement={handleAddSubchapterElement}
                            elements={elements}
                            index={chapterIndex}
                            subchapterIndex={subchapterIndex}
                        />
                    )}
                </section>
            ))}
        </section>
    );
};

export default SubchapterContent;
