import React from 'react';
import TextInput from '../ui/TextInput';
import { AddElementsType, ChapterInterface } from 'src/types/types';
import BundledEditor from './BundledEditor';
import { Button } from '../ui/Button';
import ElementsBlock from './ElementsBlock';
import AddElementBlock from './AddElementBlock';

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
                    <BundledEditor
                        value={chapter.text}
                        index={chapterIndex}
                        handleChange={handleChapterTextInputChange}
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

                            toolbar: 'bullist numlist link code table command',
                        }}
                    />
                </div>
                {chapter.layout !== '1 column' && (
                    <div className="w-1/2">
                        <div className="flex w-full flex-col gap-y-2">
                            <div className="flex w-full items-center justify-center bg-tertiary-grey-silver py-16">
                                <Button variant={'outline'}>
                                    <div>+</div>
                                    <p>
                                        Select {chapter.layout.split(' ')[0]}{' '}
                                        from media library
                                    </p>
                                </Button>
                            </div>
                            <div className="flex flex-row">
                                <input type="checkbox" />
                                <p>Show subtitles</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {chapter.layout === '1 column' && (
                <ElementsBlock
                    elements={chapter.elements}
                    block="chapterElements"
                    chapterIndex={chapterIndex}
                />
            )}
            {chapter.layout === '1 column' && (
                <AddElementBlock
                    addElementsActive={addElementsActive}
                    setAddElementsActive={setAddElementsActive}
                    handleAddElement={handleAddElement}
                    elements={elements}
                    index={chapterIndex}
                />
            )}
        </>
    );
};

export default ChapterContent;
