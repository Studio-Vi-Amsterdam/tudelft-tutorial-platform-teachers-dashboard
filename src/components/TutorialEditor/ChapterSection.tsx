import React, { useState } from 'react';
import EditorLabel from '../ui/EditorLabel';
import TextInput from '../ui/TextInput';
import { AddElementsType, ChapterInterface } from 'src/types/types';
import { useAppDispatch } from 'src/redux/hooks';
import {
    addChapterElement,
    setChapterText,
    setChapterTitle,
} from 'src/redux/features/editorSlice';
import BundledEditor from './BundledEditor';
import { Button } from '../ui/Button';
import ElementsBlock from './ElementsBlock';
import AddElementBlock from './AddElementBlock';

interface ChapterSectionProps {
    chapter: ChapterInterface;
    index: number;
}

const ChapterSection = (props: ChapterSectionProps) => {
    const { chapter, index } = props;

    const [addElementsActive, setAddElementsActive] = useState<boolean>(false);

    const dispatch = useAppDispatch();

    const handleChapterTextInputChange = (val: string, index: number): void => {
        dispatch(setChapterText({ chapterIndex: index, text: val }));
    };

    const handleChangeChapterTitle = (val: string, index?: number) => {
        index !== undefined &&
            dispatch(setChapterTitle({ chapterIndex: index, text: val }));
    };

    const handleAddElement = (val: string, index?: number) => {
        const payload: any = {};

        payload[val] = '';

        index !== undefined &&
            dispatch(addChapterElement({ val: payload, chapterIndex: index }));
        setAddElementsActive(false);
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
            <TextInput
                placeholder="Chapter title"
                headingType="h2"
                value={chapter.title}
                index={index}
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
                        index={index}
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
                    chapterIndex={index}
                />
            )}
            {chapter.layout === '1 column' && (
                <AddElementBlock
                    addElementsActive={addElementsActive}
                    setAddElementsActive={setAddElementsActive}
                    handleAddElement={handleAddElement}
                    elements={elements}
                    index={index}
                />
            )}
        </section>
    );
};

export default ChapterSection;
